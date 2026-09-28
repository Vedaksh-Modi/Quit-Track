import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { UserProfile, GoalType } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Flame,
  Clock,
  Target,
  DollarSign,
  Heart,
} from 'lucide-react';

const COMMON_TRIGGERS = [
  'Stress',
  'After meals',
  'Work/study',
  'Social situations',
  'Alcohol',
  'Boredom',
  'Morning routine',
  'Driving / Commute',
  'Coffee break',
];

const TYPICAL_TIMES = [
  'Immediately on waking',
  'Morning commute',
  'Mid-morning break',
  'Right after lunch',
  'Late afternoon slump',
  'Evening unwinding',
  'Late night',
];

const CURRENCIES = [
  { symbol: '$', name: 'USD / CAD / AUD ($)' },
  { symbol: '₹', name: 'INR (₹)' },
  { symbol: '€', name: 'EUR (€)' },
  { symbol: '£', name: 'GBP (£)' },
  { symbol: '¥', name: 'JPY / CNY (¥)' },
];

export const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { profile, updateProfile, triggerConfetti } = useQuitTrack();
  const [step, setStep] = useState(1);

  // Form local state
  const [name, setName] = useState(profile.name || '');
  const [ageConfirmed, setAgeConfirmed] = useState(profile.ageConfirmed || false);
  const [baselinePerDay, setBaselinePerDay] = useState(profile.baselinePerDay || 15);
  const [packPrice, setPackPrice] = useState(profile.packPrice || 12);
  const [cigsPerPack, setCigsPerPack] = useState(profile.cigsPerPack || 20);
  const [currency, setCurrency] = useState(profile.currency || '$');
  const [yearsSmoking, setYearsSmoking] = useState(profile.yearsSmoking || 5);
  const [typicalTimes, setTypicalTimes] = useState<string[]>(profile.typicalTimes || []);
  const [triggers, setTriggers] = useState<string[]>(profile.triggers || ['Stress', 'After meals']);
  const [goal, setGoal] = useState<GoalType>(profile.goal || 'quit');
  const [targetQuitDate, setTargetQuitDate] = useState(profile.targetQuitDate || '');
  const [reasonsToQuit, setReasonsToQuit] = useState<string[]>(
    profile.reasonsToQuit || ['Save money', 'Better stamina & health', 'Family & freedom']
  );
  const [newReason, setNewReason] = useState('');

  const toggleTrigger = (trig: string) => {
    setTriggers(prev =>
      prev.includes(trig) ? prev.filter(t => t !== trig) : [...prev, trig]
    );
  };

  const toggleTypicalTime = (t: string) => {
    setTypicalTimes(prev =>
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const addReason = () => {
    if (newReason.trim()) {
      setReasonsToQuit(prev => [...prev, newReason.trim()]);
      setNewReason('');
    }
  };

  const removeReason = (idx: number) => {
    setReasonsToQuit(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFinish = () => {
    const dailyTarget = goal === 'quit' ? 0 : Math.max(1, Math.floor(baselinePerDay * 0.7));
    const nowIso = new Date().toISOString();

    updateProfile({
      name: name.trim() || 'Friend',
      ageConfirmed: true,
      baselinePerDay,
      packPrice,
      cigsPerPack,
      currency,
      yearsSmoking,
      typicalTimes,
      triggers,
      goal,
      targetQuitDate: targetQuitDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      dailyTarget,
      startDate: nowIso,
      lastSmokeDate: nowIso,
      reasonsToQuit,
      onboardingCompleted: true,
    });

    triggerConfetti();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Step 1: Welcome & Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">
                  🌿
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome to QuitTrack
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your private, supportive space to understand your habits and regain freedom—one breath at a time.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan or Alex"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Currency
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {CURRENCIES.map(c => (
                      <button
                        key={c.symbol}
                        type="button"
                        onClick={() => setCurrency(c.symbol)}
                        className={`p-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          currency === c.symbol
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {c.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ageConfirmed}
                      onChange={e => setAgeConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      I confirm I am 18 years of age or older and agree to track my habits privately on this device.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                disabled={!ageConfirmed}
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Smoking Baseline & Financials */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Your Current Baseline
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Be completely honest. There is zero judgment here—accurate data gives you accurate insights.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cigarettes smoked per day
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {baselinePerDay} cigs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={baselinePerDay}
                    onChange={e => setBaselinePerDay(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 cig</span>
                    <span>20 cigs (1 pack)</span>
                    <span>50+ cigs</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Price per pack ({currency})
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={packPrice}
                      onChange={e => setPackPrice(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cigs per pack
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={cigsPerPack}
                      onChange={e => setCigsPerPack(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Years you've been smoking
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={yearsSmoking}
                    onChange={e => setYearsSmoking(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                {/* Instant Spend Projection */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                  <span>Estimated annual tobacco spend:</span>
                  <span className="font-bold text-sm">
                    {currency}
                    {Math.round((baselinePerDay / cigsPerPack) * packPrice * 365).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Next: Triggers & Habits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Typical Times & Common Triggers */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Triggers & Daily Rhythm
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Understanding what prompts the urge is half the battle. Select all that apply.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Common triggers you experience:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TRIGGERS.map(trig => {
                      const isSelected = triggers.includes(trig);
                      return (
                        <button
                          key={trig}
                          type="button"
                          onClick={() => toggleTrigger(trig)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {trig}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Typical times you usually smoke:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TYPICAL_TIMES.map(timeSlot => {
                      const isSelected = typicalTimes.includes(timeSlot);
                      return (
                        <button
                          key={timeSlot}
                          type="button"
                          onClick={() => toggleTypicalTime(timeSlot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {timeSlot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Next: Choose Your Goal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Your Goal & Personal Why */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Your Path Forward
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  You set the pace. You can change this at any time in your profile.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setGoal('quit')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    goal === 'quit'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Quit Completely
                    </span>
                    {goal === 'quit' && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Set a target quit date, start your smoke-free streak today, and reclaim clean lungs.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGoal('reduce')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    goal === 'reduce'
                      ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-sky-600" />
                      Reduce Gradually
                    </span>
                    {goal === 'reduce' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Step down cigarette count daily with gentle limits before setting a final quit day.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGoal('track')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    goal === 'track'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Track My Smoking First
                    </span>
                    {goal === 'track' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No pressure to quit yet. Observe your patterns, emotional triggers, and costs first.
                  </p>
                </button>

                {/* Target Quit Date */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Quit Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={targetQuitDate}
                    onChange={e => setTargetQuitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Why I Want To Quit reasons */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Why I Want To Quit / Cut Back
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newReason}
                      onChange={e => setNewReason(e.target.value)}
                      placeholder="e.g. For my children, better breathing..."
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addReason();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={addReason}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {reasonsToQuit.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs"
                      >
                        <span>{r}</span>
                        <button
                          type="button"
                          onClick={() => removeReason(i)}
                          className="hover:text-rose-500 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Build My Personalized Dashboard</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
