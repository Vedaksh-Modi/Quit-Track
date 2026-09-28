import React, { useState, useEffect } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Wind,
  Droplets,
  Footprints,
  Music,
  Gamepad2,
  MessageCircle,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ambientPlayer, playBreathBell, playPopSound, playSuccessChime } from '../utils/audio';

type ActiveTool = 'none' | 'breathe' | 'water' | 'walk' | 'game' | 'message';

export const CravingCoach: React.FC = () => {
  const { profile, logCraving, triggerConfetti } = useQuitTrack();
  const [intensity, setIntensity] = useState(7);
  const [timerDuration, setTimerDuration] = useState<300 | 600>(300); // 5 or 10 min
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('breathe');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);

  // Breathing tool state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  // Mini-game state (Bubble Pop)
  const [bubbles, setBubbles] = useState<Array<{ id: number; top: number; left: number; popped: boolean }>>([]);
  const [bubblesPopped, setBubblesPopped] = useState(0);

  // Water tool state
  const [glassesLogged, setGlassesLogged] = useState(1);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowOutcomeDialog(true);
      if (profile.soundEnabled) playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Breathing cycle
  useEffect(() => {
    if (activeTool !== 'breathe') return;
    const cycle: Array<'Inhale' | 'Hold' | 'Exhale' | 'Pause'> = ['Inhale', 'Hold', 'Exhale', 'Pause'];
    let idx = 0;
    const breathTimer = setInterval(() => {
      idx = (idx + 1) % 4;
      setBreathPhase(cycle[idx]);
      if (profile.soundEnabled && idx === 0) {
        playBreathBell(432);
      }
    }, 4000);
    return () => clearInterval(breathTimer);
  }, [activeTool, profile.soundEnabled]);

  // Mini-game bubble generator
  useEffect(() => {
    if (activeTool === 'game') {
      const generated = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        top: Math.floor(Math.random() * 70) + 10,
        left: Math.floor(Math.random() * 80) + 10,
        popped: false,
      }));
      setBubbles(generated);
    }
  }, [activeTool]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => (b.id === id ? { ...b, popped: true } : b)));
    setBubblesPopped(p => p + 1);
    if (profile.soundEnabled) playPopSound();
  };

  const handleStartTimer = (duration: 300 | 600) => {
    setTimerDuration(duration);
    setTimeLeft(duration);
    setIsRunning(true);
    setShowOutcomeDialog(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerDuration);
  };

  const toggleSoundAmbiance = () => {
    if (soundPlaying) {
      ambientPlayer.stop();
      setSoundPlaying(false);
    } else {
      ambientPlayer.start();
      setSoundPlaying(true);
    }
  };

  const handleOutcomeSubmit = (passed: 'yes' | 'little' | 'no') => {
    ambientPlayer.stop();
    setSoundPlaying(false);

    logCraving({
      intensity,
      activityUsed: activeTool === 'breathe' ? 'Breathing exercise' : activeTool === 'water' ? 'Hydration' : activeTool === 'game' ? 'Mini-game distraction' : activeTool === 'walk' ? 'Mindful walk' : 'Craving Timer',
      passed,
      durationSeconds: timerDuration - timeLeft,
    });

    setShowOutcomeDialog(false);
    setIsRunning(false);
    setTimeLeft(timerDuration);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.round(((timerDuration - timeLeft) / timerDuration) * 100);

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Craving Coach
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cravings peak in 3 to 5 minutes. Ride the wave together.
          </p>
        </div>

        <button
          onClick={toggleSoundAmbiance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {soundPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Rain Audio On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Ambient Sound</span>
            </>
          )}
        </button>
      </div>

      {/* Craving Intensity Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            How strong is this craving right now?
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            intensity >= 8
              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
              : intensity >= 5
              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
          }`}>
            Level {intensity} / 10
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={e => setIntensity(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Mild urge (1)</span>
          <span>Moderate craving (5)</span>
          <span>Intense storm (10)</span>
        </div>
      </div>

      {/* Timer Hero Ring Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 text-white text-center shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          5-Minute Rule: Delay the decision
        </div>

        {/* Circular Countdown Display */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-3">
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray="439.8"
              strokeDashoffset={439.8 - (439.8 * progressPercent) / 100}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000"
              fill="transparent"
            />
          </svg>

          <div className="absolute text-center">
            <div className="text-4xl font-mono font-extrabold tracking-tight text-white">
              {formatTimer(timeLeft)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {isRunning ? 'Hold steady...' : 'Ready when you are'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {!isRunning ? (
            <>
              <button
                onClick={() => handleStartTimer(300)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 5 Mins</span>
              </button>
              <button
                onClick={() => handleStartTimer(600)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>10 Mins</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRunning(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setShowOutcomeDialog(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            End & Check In
          </button>
        </div>
      </div>

      {/* Immediate Guided Coping Activities */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Guided Distraction Activities
        </h2>

        {/* Horizontal Tool Selector */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => setActiveTool('breathe')}
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              activeTool === 'breathe'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Breathe</span>
          </button>

          <button
            onClick={() => setActiveTool('water')}
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              activeTool === 'water'
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Water</span>
          </button>

          <button
            onClick={() => setActiveTool('game')}
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              activeTool === 'game'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Mini-Game</span>
          </button>

          <button
            onClick={() => setActiveTool('walk')}
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              activeTool === 'walk'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Walk</span>
          </button>

          <button
            onClick={() => setActiveTool('message')}
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              activeTool === 'message'
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Message</span>
          </button>
        </div>

        {/* Selected Tool Interactive Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[220px] flex flex-col justify-center items-center">
          {/* Tool 1: Breathe */}
          {activeTool === 'breathe' && (
            <div className="w-full text-center space-y-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Box Breathing Rhythm (4-4-4-4)
              </span>

              <div className="relative flex items-center justify-center h-32">
                <div
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'scale-125 bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : breathPhase === 'Hold'
                      ? 'scale-125 bg-sky-100 dark:bg-sky-950/60 border-2 border-sky-500 text-sky-800 dark:text-sky-200'
                      : breathPhase === 'Exhale'
                      ? 'scale-90 bg-teal-100 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-800 dark:text-teal-200'
                      : 'scale-90 bg-slate-100 dark:bg-slate-800 border-2 border-slate-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Wind className="w-5 h-5 mb-0.5" />
                  <span className="font-extrabold text-sm">{breathPhase}</span>
                  <span className="text-[10px] opacity-75">4s</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inhale gently through your nose, hold stillness, exhale slowly through your mouth.
              </p>
            </div>
          )}

          {/* Tool 2: Drink Water */}
          {activeTool === 'water' && (
            <div className="w-full text-center space-y-3">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Hydration Reset
              </span>
              <div className="text-4xl">💧</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Drink a Tall Glass of Ice-Cold Water
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Drinking through a straw or taking slow, chilled sips stimulates the vagus nerve and substitutes the hand-to-mouth tactile motion.
              </p>
              <button
                onClick={() => setGlassesLogged(g => g + 1)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                ✓ Log Glass Drank ({glassesLogged})
              </button>
            </div>
          )}

          {/* Tool 3: Mini-Game (Craving Crusher / Bubble Pop) */}
          {activeTool === 'game' && (
            <div className="w-full text-center space-y-2">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Tactile Bubble Pop
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Popped: {bubblesPopped}
                </span>
              </div>

              <div className="relative w-full h-44 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-2xl overflow-hidden p-2">
                {bubbles.map(b => (
                  <button
                    key={b.id}
                    onClick={() => popBubble(b.id)}
                    disabled={b.popped}
                    style={{ top: `${b.top}%`, left: `${b.left}%` }}
                    className={`absolute w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-sm ${
                      b.popped
                        ? 'scale-0 opacity-0 pointer-events-none'
                        : 'bg-gradient-to-tr from-purple-500 to-indigo-400 hover:scale-110 active:scale-90 text-white'
                    }`}
                  >
                    🫧
                  </button>
                ))}

                {bubbles.every(b => b.popped) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-900/80 backdrop-blur-sm text-white p-4">
                    <span className="text-sm font-bold mb-2">All Bubbles Cleared! 🎉</span>
                    <button
                      onClick={() => {
                        const regenerated = Array.from({ length: 15 }, (_, i) => ({
                          id: i + Date.now(),
                          top: Math.floor(Math.random() * 70) + 10,
                          left: Math.floor(Math.random() * 80) + 10,
                          popped: false,
                        }));
                        setBubbles(regenerated);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-500 text-xs font-bold"
                    >
                      Play Another Round
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Pop all the bubbles to keep your fingers and attention engaged!
              </p>
            </div>
          )}

          {/* Tool 4: Mindful Walk */}
          {activeTool === 'walk' && (
            <div className="w-full text-center space-y-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Physical Movement
              </span>
              <div className="text-4xl">👟</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step Away from the Current Room
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Walk down the hall, step outside for fresh air, or pace for 3 minutes. Changing your physical environment instantly breaks the craving feedback loop.
              </p>
            </div>
          )}

          {/* Tool 5: Support Message */}
          {activeTool === 'message' && (
            <div className="w-full space-y-3">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block text-center">
                Reach Out to a Friend
              </span>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                "Hey! I'm having a sudden craving to smoke right now and trying out my 5-minute delay. Can we chat for 2 minutes to help distract me?"
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("Hey! I'm having a sudden craving to smoke right now and trying out my 5-minute delay. Can we chat for 2 minutes to help distract me?");
                    alert('Message copied to clipboard! You can paste it into WhatsApp or SMS.');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Copy Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post-Timer Evaluation Modal / Banner */}
      {showOutcomeDialog && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 shadow-md animate-in fade-in">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Time Is Up! How Did You Do?</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Did the craving pass? Recording this helps QuitTrack personalize future interventions.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleOutcomeSubmit('yes')}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Yes, Passed! 🎉
            </button>
            <button
              onClick={() => handleOutcomeSubmit('little')}
              className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              A Little Bit
            </button>
            <button
              onClick={() => handleOutcomeSubmit('no')}
              className="py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-all"
            >
              Still Tough
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
