import React, { useState, useEffect } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  ShieldAlert,
  X,
  Phone,
  Wind,
  Clock,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
} from 'lucide-react';
import { ambientPlayer, playBreathBell, playSuccessChime } from '../utils/audio';

export const EmergencyCravingScreen: React.FC = () => {
  const { profile, stats, setEmergencyActive, logCraving, triggerConfetti } = useQuitTrack();
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min distraction
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [cravingOverResolved, setCravingOverResolved] = useState(false);

  // 4-4-4-4 Box breathing rhythm
  useEffect(() => {
    let step = 0;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setBreathingPhase(phases[step]);
      if (profile.soundEnabled && step === 0) {
        playBreathBell(396);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [profile.soundEnabled]);

  // Distraction timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      setCravingOverResolved(true);
      playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleSound = () => {
    if (soundOn) {
      ambientPlayer.stop();
      setSoundOn(false);
    } else {
      ambientPlayer.start();
      setSoundOn(true);
    }
  };

  const handleClose = () => {
    ambientPlayer.stop();
    setEmergencyActive(false);
  };

  const handleResolved = (passed: 'yes' | 'little' | 'no') => {
    ambientPlayer.stop();
    logCraving({
      intensity: 9,
      activityUsed: 'Emergency SOS Protocol',
      passed,
      durationSeconds: 300 - timerSeconds,
    });
    setEmergencyActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const userHasContact = profile.trustedContacts && profile.trustedContacts.length > 0 && profile.trustedContacts[0].phone;
  const trustedPhone = userHasContact ? profile.trustedContacts[0].phone : 'tel:18007848669'; // 1-800-QUIT-NOW
  const trustedName = userHasContact
    ? profile.trustedContacts[0].name
    : 'National Quitline Support (1-800-QUIT-NOW)';
  const phoneHref = userHasContact ? `tel:${profile.trustedContacts[0].phone}` : 'tel:18007848669';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md text-white flex flex-col items-center justify-start p-4 sm:p-6">
      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-between py-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2 text-rose-400 font-semibold tracking-wide">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>Emergency Craving Shield</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label="Toggle soothing ambient sound"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-white/70" />}
          </button>
          <button
            onClick={handleClose}
            aria-label="Close emergency screen"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Core Calm Box */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Cravings last only 3 to 5 minutes
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Breathe With Me</h2>
          <p className="text-sm text-slate-300 mb-6">
            Relax your shoulders. You do not need to fight this—just let the wave crest and roll away.
          </p>

          {/* Interactive Breathing Sphere */}
          <div className="relative flex items-center justify-center h-48 my-2">
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-lg ${
                breathingPhase === 'Inhale'
                  ? 'scale-125 bg-emerald-500/30 border-2 border-emerald-400 text-emerald-100 shadow-emerald-500/20'
                  : breathingPhase === 'Hold'
                  ? 'scale-125 bg-sky-500/30 border-2 border-sky-400 text-sky-100 shadow-sky-500/20'
                  : breathingPhase === 'Exhale'
                  ? 'scale-90 bg-teal-500/20 border-2 border-teal-400 text-teal-100'
                  : 'scale-90 bg-slate-800 border-2 border-slate-600 text-slate-300'
              }`}
            >
              <Wind className="w-6 h-6 mb-1 opacity-80" />
              <span className="text-lg font-bold tracking-wider">{breathingPhase}</span>
              <span className="text-xs opacity-75">4 seconds</span>
            </div>
          </div>

          {/* 5-Minute Delay Timer */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 5-Min Decision Delay
              </span>
              <div className="text-2xl font-mono font-bold text-white">{formatTime(timerSeconds)}</div>
            </div>
            {!timerRunning ? (
              <button
                onClick={() => setTimerRunning(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                Start 5-Min Timer
              </button>
            ) : (
              <button
                onClick={() => setTimerRunning(false)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all"
              >
                Pause
              </button>
            )}
          </div>
        </div>

        {/* Why I Want To Quit Cards */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            Your Personal Reasons To Stay Strong
          </h3>
          <div className="space-y-2">
            {profile.reasonsToQuit && profile.reasonsToQuit.length > 0 ? (
              profile.reasonsToQuit.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-200"
                >
                  <span className="text-emerald-400 font-bold text-xs mt-0.5">✓</span>
                  <span>{reason}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400 italic p-2">
                "Freedom from addiction, cleaner lungs, and more money in your pocket."
              </div>
            )}
          </div>
        </div>

        {/* Real Progress Anchor */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-center">
            <span className="text-xs text-slate-400">Avoided So Far</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{stats.totalAvoided} cigs</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-center">
            <span className="text-xs text-slate-400">Money Kept</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{profile.currency}{stats.moneySaved}</div>
          </div>
        </div>

        {/* Call Support / Quitline */}
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-sky-300 font-medium">Talk to Someone</div>
              <div className="text-sm font-semibold text-white">{trustedName}</div>
            </div>
          </div>
          <a
            href={phoneHref}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            Call Now
          </a>
        </div>

        {/* Craving Outcome Buttons */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-3">
          <span className="text-sm font-medium text-slate-300">How is the craving now?</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleResolved('yes')}
              className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              It Passed! 🎉
            </button>
            <button
              onClick={() => handleResolved('little')}
              className="py-3 px-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-medium transition-all"
            >
              A Little Better
            </button>
            <button
              onClick={() => handleResolved('no')}
              className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
            >
              Still Tough
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
