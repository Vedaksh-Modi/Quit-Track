import React, { useState, useRef, useEffect } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Shield,
  Loader2,
  Heart,
  HelpCircle,
  Flame,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_PROMPTS = [
  "I really want a cigarette right now.",
  "I just slipped and smoked. Feeling disappointed.",
  "How do I beat cravings after meals?",
  "Remind me why my lungs need me to quit.",
  "What can I replace the hand-to-mouth habit with?",
];

export const AICoachModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { profile, stats } = useQuitTrack();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${profile.name || 'friend'}! I'm Coach Jordan. I'm here to support you unconditionally—whether you're riding out a craving, celebrating a milestone, or just need a calm voice. What's on your mind?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map(m => ({ role: m.role, content: m.content })),
          userProfile: {
            name: profile.name,
            goal: profile.goal,
            baselinePerDay: profile.baselinePerDay,
            triggers: profile.triggers,
          },
          currentStats: {
            streakDays: stats.streakDays,
            streakHours: stats.streakHours,
            cigsAvoided: stats.totalAvoided,
            cravingsResisted: stats.cravingsResistedCount,
            todaySmoked: stats.todaySmoked,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach response');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.reply || "I'm right here with you. Take a slow, grounding breath.",
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      // Compassionate fallback
      const fallbackMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: "Let's get through the next five minutes first. Cravings are like waves—they peak and then naturally subside. Want to try a 60-second breathing exercise or drink a tall glass of ice water?",
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg h-[92vh] max-h-[700px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Coach Jordan</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  AI Companion
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Non-judgmental & supportive</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Coach"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medical disclaimer note */}
        <div className="px-4 py-1.5 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/40 dark:border-amber-900/30 text-[10px] text-amber-800 dark:text-amber-300/80 flex items-center justify-between">
          <span>🌿 Supportive wellness guidance. Not medical diagnosis or prescription advice.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  🌿
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/50'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Coach Jordan is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pre-set Prompt Suggestions */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none">
          {PRESET_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask anything, share a craving, or celebrate..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            aria-label="Send message to AI Coach"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
