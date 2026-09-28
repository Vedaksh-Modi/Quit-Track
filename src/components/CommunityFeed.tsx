import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { CommunityPost } from '../types';
import {
  Users,
  Heart,
  Flag,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const CATEGORIES: Array<{ key: CommunityPost['category']; label: string; icon: string }> = [
  { key: 'milestone', label: 'Milestones', icon: '🎉' },
  { key: 'craving', label: 'Craving SOS', icon: '⚡' },
  { key: 'strategy', label: 'Tips & Hacks', icon: '💡' },
  { key: 'question', label: 'Questions', icon: '❓' },
];

export const CommunityFeed: React.FC = () => {
  const { communityPosts, toggleCheerPost, reportPost, addCommunityPost } = useQuitTrack();
  const [selectedFilter, setSelectedFilter] = useState<'all' | CommunityPost['category']>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [composeCategory, setComposeCategory] = useState<CommunityPost['category']>('milestone');
  const [composeText, setComposeText] = useState('');

  const filteredPosts = communityPosts.filter(p => {
    if (p.reported) return false;
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim()) return;

    // Safety filter for prohibited content (tobacco promotion / sales)
    const lower = composeText.toLowerCase();
    if (
      lower.includes('buy cigarette') ||
      lower.includes('cheap smokes') ||
      lower.includes('discount tobacco') ||
      lower.includes('vape shop')
    ) {
      alert('Community guidelines prohibit tobacco advertising or sales promotion.');
      return;
    }

    addCommunityPost({
      category: composeCategory,
      content: composeText.trim(),
    });

    setComposeText('');
    setShowCompose(false);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Anonymous Community
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cheer on fellow quitters. Completely anonymous and private.
          </p>
        </div>

        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showCompose ? 'Close' : 'Share Post'}</span>
        </button>
      </div>

      {/* Safety & Moderation Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          A safe, spam-free space. Tobacco advertising or harmful promotion is strictly forbidden and auto-filtered.
        </span>
      </div>

      {/* Compose Drawer */}
      {showCompose && (
        <form
          onSubmit={handleCreatePost}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 animate-in fade-in"
        >
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Share Anonymously With the Community
          </span>

          {/* Category Picker */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => setComposeCategory(c.key)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  composeCategory === c.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={composeText}
            onChange={e => setComposeText(e.target.value)}
            placeholder="Share a milestone, ask a practical question, or offer encouragement..."
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!composeText.trim()}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
          >
            Post to Community (+40 XP)
          </button>
        </form>
      )}

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Topics
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedFilter(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFilter === cat.key
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{post.authorName}</span>
                    <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      {post.authorStreak}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Report this post for inappropriate content?')) {
                    reportPost(post.id);
                  }
                }}
                className="text-slate-300 hover:text-slate-500 p-1"
                aria-label="Report post"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => toggleCheerPost(post.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl transition-all ${
                  post.userCheered
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userCheered ? 'fill-current' : ''}`} />
                <span>Cheer ({post.cheers})</span>
              </button>

              <span className="text-[10px] uppercase font-semibold text-slate-400">
                {post.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
