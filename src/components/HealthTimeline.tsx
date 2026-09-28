import React from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { HEALTH_MILESTONES } from '../data/healthMilestones';
import {
  Heart,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const HealthTimeline: React.FC = () => {
  const { stats } = useQuitTrack();
  const streakMinutes = stats.streakTotalMinutes;

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Health Recovery Timeline
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The human body begins restoring its self-healing systems within minutes of your last cigarette.
        </p>
      </div>

      {/* Medical Transparency Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 text-sky-950 dark:text-sky-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-xs">
          <Info className="w-4 h-4 text-sky-600" />
          <span>Evidence-Based General Timeline</span>
        </div>
        <p className="text-xs text-sky-900/90 dark:text-sky-200/90 leading-relaxed">
          These timelines reflect peer-reviewed epidemiological research from the World Health Organization (WHO), the U.S. Surgeon General, and the Centers for Disease Control and Prevention (CDC). Individual physiology, smoking duration, and overall health vary; these milestones represent general expected trajectories rather than guaranteed medical outcomes.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {HEALTH_MILESTONES.map((m, index) => {
          const isReached = streakMinutes >= m.durationMinutes;
          const isCurrent =
            streakMinutes < m.durationMinutes &&
            (index === 0 || streakMinutes >= HEALTH_MILESTONES[index - 1].durationMinutes);

          return (
            <div key={m.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  isReached
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-sm'
                    : isCurrent
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 dark:ring-sky-950 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isReached ? '✓' : index + 1}
              </div>

              {/* Milestone Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isReached
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-700 shadow-md'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isReached
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : isCurrent
                        ? 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {m.timeLabel}
                  </span>

                  <span className="text-[11px] font-medium text-slate-400">
                    {isReached ? 'Unlocked 🎉' : isCurrent ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {m.description}
                </p>

                {/* Verified Source Citation */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[220px]">Source: {m.source}</span>
                  <a
                    href={m.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Learn more <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reputable Health Organizations Directory */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Reputable Health & Cessation Resources
        </h2>

        <div className="space-y-2">
          <a
            href="https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                World Health Organization (WHO)
              </div>
              <div className="text-[11px] text-slate-400">Health benefits of smoking cessation fact sheet</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/benefits/index.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                CDC: Benefits of Quitting Smoking
              </div>
              <div className="text-[11px] text-slate-400">Centers for Disease Control and Prevention guidance</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                American Cancer Society
              </div>
              <div className="text-[11px] text-slate-400">Long-term cardiovascular & oncology recovery timeline</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
