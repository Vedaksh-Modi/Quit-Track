import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for the AI Quit Coach
const SYSTEM_INSTRUCTION = `You are "Coach Jordan", an empathetic, supportive, and non-judgmental AI Quit Coach in the QuitTrack app.

CORE GUIDELINES:
1. Warm, supportive, and compassionate. Always meet the user where they are.
2. NEVER shame, judge, guilt-trip, or scold the user for smoking or having cravings.
3. If the user slipped or relapsed, normalize setbacks warmly: "One cigarette does not erase all your progress. It's a learning moment, not a failure." Help them identify the trigger and gently move forward.
4. Help users identify triggers (stress, meals, social, alcohol, boredom, routine) and suggest actionable, immediate coping strategies (e.g., 5-minute delay, 4-7-8 breathing, drinking cold water, physical movement, sensory grounding, chewing gum, holding something).
5. Celebrate every win, milestone, streak, or resisted craving enthusiastically.
6. AVOID medical diagnoses and never guarantee individual clinical health outcomes.
7. If the user asks medical questions (nicotine replacement therapy, prescription cessation aids, withdrawal severity, chest pains), kindly advise them to consult a doctor, pharmacist, or certified healthcare professional.
8. Keep responses concise, warm, actionable, and formatted with clean paragraphs or bullet points so it is easy to read on mobile during a craving.`;

// App configuration endpoint for mobile installation & QR scanning
app.get('/api/app-config', (_req: Request, res: Response) => {
  res.json({
    appUrl: process.env.APP_URL || '',
  });
});

// API endpoint for AI Quit Coach
app.post('/api/coach/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userProfile, currentStats } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Graceful supportive fallback when API key is not present
      const fallbackReply = generateFallbackReply(message, currentStats);
      return res.json({ reply: fallbackReply });
    }

    // Build context
    let contextPrompt = '';
    if (userProfile) {
      contextPrompt += `User Name: ${userProfile.name || 'Friend'}\n`;
      contextPrompt += `Goal: ${userProfile.goal || 'Quit smoking'}\n`;
      contextPrompt += `Baseline: ${userProfile.baselinePerDay || 15} cigs/day\n`;
      contextPrompt += `Triggers: ${(userProfile.triggers || []).join(', ')}\n`;
    }
    if (currentStats) {
      contextPrompt += `Smoke-Free Streak: ${currentStats.streakDays || 0} days, ${currentStats.streakHours || 0} hours\n`;
      contextPrompt += `Cigarettes Avoided: ${currentStats.cigsAvoided || 0}\n`;
      contextPrompt += `Cravings Resisted: ${currentStats.cravingsResisted || 0}\n`;
      contextPrompt += `Today's count: ${currentStats.todaySmoked || 0}\n`;
    }

    const conversationContents: any[] = [];

    // Include recent history (last 6 turns)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const item of recentHistory) {
      conversationContents.push({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content }],
      });
    }

    // Append current prompt with profile context
    const currentInputText = contextPrompt
      ? `[User Context]\n${contextPrompt}\n[User Message]\n${message}`
      : message;

    conversationContents.push({
      role: 'user',
      parts: [{ text: currentInputText }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm right here with you. Take a slow, deep breath. What are you feeling in this moment?";
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    // Provide a supportive fallback message instead of a crash
    const fallbackReply = generateFallbackReply(req.body.message || '', req.body.currentStats);
    return res.json({ reply: fallbackReply });
  }
});

// Fallback response engine for offline or API issues
function generateFallbackReply(message: string, stats?: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('smoked') || lower.includes('relapse') || lower.includes('slipped') || lower.includes('failed') || lower.includes('broke')) {
    return "Take a deep breath—it is completely okay. A slip is not a failure; it is just a bump on the road. What matters most is that you're here right now. Let's look at what triggered this moment without judgment. What were you doing or feeling just before? Every day you reduce or resist is still real progress in your body!";
  }

  if (lower.includes('craving') || lower.includes('want to smoke') || lower.includes('need a cigarette') || lower.includes('urge') || lower.includes('hard')) {
    return "Cravings peak within 3 to 5 minutes and then naturally subside. You don't have to quit forever right now—just delay this one decision for 5 minutes. Try taking 3 slow, deep belly breaths, take a long sip of ice-cold water, or step into a different room. You have resisted cravings before, and you can get through this one!";
  }

  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelmed') || lower.includes('work')) {
    return "Stress is one of the most common smoking triggers. Remember: nicotine actually spikes your heart rate and mimics physical anxiety—it only relieves the withdrawal it created. Let's reset your nervous system: drop your shoulders, exhale fully, and let's try a quick 60-second box breathing exercise. Can you step away for a quick glass of water?";
  }

  if (lower.includes('meal') || lower.includes('eat') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner')) {
    return "Post-meal cravings are deeply conditioned habit loops. Break the pattern right after swallowing your last bite: immediately brush your teeth, chew a fresh peppermint gum, or clear the table and step outdoors for a brisk 3-minute stroll. Changing your sensory environment halts the automatic reach!";
  }

  if (lower.includes('why') || lower.includes('health') || lower.includes('benefit') || lower.includes('timeline')) {
    return "Within just 20 minutes of stopping, your heart rate and blood pressure stabilize. By 8 to 24 hours, carbon monoxide leaves your bloodstream, and oxygen levels surge. Within 48 hours, nerve endings begin regrowing and taste buds revive. Your body wants to heal, and every cigarette you skip gives your lungs an immediate break!";
  }

  return "I hear you, and I'm right here with you. Remember that quitting or reducing isn't about perfection; it's about momentum. Focus on just this hour. What small healthy step can we take together right now?";
}

// Set up Vite dev server middleware or static production serve
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuitTrack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
