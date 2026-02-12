'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { DashboardData } from '@/lib/types';
import MoodChart from '@/components/MoodChart';
import StreakDisplay from '@/components/StreakDisplay';
import JournalCard from '@/components/JournalCard';

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-fade-in">
          <div className="animated-gradient h-44 lg:h-52" />
          <div className="max-w-6xl mx-auto px-6 -mt-8 space-y-4">
            <div className="h-20 rounded-2xl skeleton-shimmer" />
            <div className="h-60 rounded-2xl skeleton-shimmer" />
            <div className="h-32 rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      const stored = localStorage.getItem('meritmind_userId');
      if (stored) {
        router.replace(`/dashboard?userId=${stored}`);
      }
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/dashboard/${userId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen animate-fade-in">
        <div className="animated-gradient h-44 lg:h-52" />
        <div className="max-w-6xl mx-auto px-6 -mt-8 space-y-4">
          <div className="h-20 rounded-2xl skeleton-shimmer" />
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
            <div className="h-60 rounded-2xl skeleton-shimmer" />
            <div className="h-60 rounded-2xl skeleton-shimmer" />
          </div>
          <div className="h-32 rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-stone-500 text-lg">Could not load dashboard.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-teal-600 font-medium hover:underline focus-visible:outline-2 focus-visible:outline-teal-500 rounded"
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in relative overflow-hidden">
      {/* Header */}
      <header
        className="relative animated-gradient text-white px-6 pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden noise-overlay"
        role="banner"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-60 h-60 blob bg-white/8" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 blob-slow bg-teal-300/10" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="text-white/60 hover:text-white transition-colors p-2 -ml-2 rounded-xl focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Back to home"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-white/50 text-xs uppercase tracking-[0.2em] font-medium">Dashboard</span>
            <div className="w-9" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {data.user.name}&apos;s Journey
          </h1>
          <p className="text-white/60 text-sm md:text-base lg:text-lg mt-1">
            {data.totalEntries} journal {data.totalEntries === 1 ? 'entry' : 'entries'} &middot; Keep it going
          </p>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 -mt-10 pb-12 space-y-6" role="main">
        {/* Streak */}
        <section aria-label="Statistics" className="animate-fade-in-up">
          <StreakDisplay
            streak={data.user.currentStreak}
            totalJournals={data.user.totalJournals}
          />
        </section>

        {/* Chart + sidebar */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-5 lg:space-y-0">
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <MoodChart data={data.moodTrend} />
          </div>

          <div className="space-y-5">
            {/* Top Themes */}
            {data.topThemes.length > 0 && (
              <section className="glass-strong rounded-2xl p-5 shadow-md animate-fade-in-up" style={{ animationDelay: '0.15s' }} aria-label="Common themes">
                <h3 className="text-sm lg:text-base font-bold text-stone-700 mb-3">
                  What comes up most
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.topThemes.map((t, i) => {
                    const colors = [
                      'from-teal-100 to-teal-50 text-teal-700 border-teal-200/60',
                      'from-amber-100 to-amber-50 text-amber-700 border-amber-200/60',
                      'from-indigo-100 to-indigo-50 text-indigo-700 border-indigo-200/60',
                      'from-rose-100 to-rose-50 text-rose-700 border-rose-200/60',
                      'from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200/60',
                    ];
                    return (
                      <span
                        key={t.theme}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r border text-xs lg:text-sm font-medium ${colors[i % colors.length]}`}
                      >
                        <span>{t.theme}</span>
                        <span className="text-[10px] font-bold opacity-60 bg-white/50 px-1.5 py-0.5 rounded-full">
                          {t.count}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Recent Wins */}
            {data.recentWins.length > 0 && (
              <section
                className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/60 rounded-2xl p-5 shadow-sm animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
                aria-label="Recent wins"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-bl-full" aria-hidden="true" />
                <h3 className="text-sm lg:text-base font-bold text-emerald-700 flex items-center gap-2 mb-3">
                  <span className="text-lg animate-bounce-gentle" aria-hidden="true">🏆</span>
                  Recent wins
                </h3>
                <ul className="space-y-2" role="list">
                  {data.recentWins.slice(0, 5).map((w, i) => (
                    <li
                      key={i}
                      className="text-sm text-emerald-800 flex items-start gap-2.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 text-[9px] text-emerald-600 font-bold" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Chores + Admin Traits row */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
          {/* Chores */}
          {data.user.chores && data.user.chores.length > 0 && (
            <section
              className="glass-strong rounded-2xl p-5 shadow-sm animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
              aria-label="Assigned house tasks"
            >
              <h3 className="text-sm lg:text-base font-bold text-stone-700 flex items-center gap-2 mb-3">
                <span className="text-lg" aria-hidden="true">🧹</span>
                House tasks
              </h3>
              <ul className="space-y-2.5">
                {data.user.chores.map((chore, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 rounded-lg bg-teal-100 border border-teal-200/60 flex items-center justify-center shrink-0" aria-hidden="true">
                      <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-stone-600 leading-snug">{chore}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Admin Traits */}
          {data.user.traits && data.user.traits.length > 0 && (
            <section
              className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border border-violet-200/60 rounded-2xl p-5 shadow-sm animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
              aria-label="Support team notes"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-bl-full" aria-hidden="true" />
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm lg:text-base font-bold text-violet-700 flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">🛡️</span>
                  Support team flags
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-200/60 text-violet-600 px-2 py-0.5 rounded-full">
                  Admin view only
                </span>
              </div>
              <p className="text-[11px] text-violet-500 mb-3 leading-relaxed">
                Concerns shared with the voice agent for gentle monitoring
              </p>
              <ul className="space-y-3">
                {data.user.traits.map((trait, i) => (
                  <li key={i} className="bg-white/60 rounded-xl p-3 border border-violet-100">
                    <p className="text-sm font-semibold text-violet-800">{trait.name}</p>
                    <p className="text-xs text-violet-600/80 mt-1 leading-relaxed">{trait.notes}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Journal History */}
        <section aria-label="Journal history">
          <h3 className="text-sm md:text-base lg:text-lg font-bold text-stone-700 mb-4">
            Journal history
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentEntries.map((j, i) => (
              <div
                key={j._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <JournalCard journal={j} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-md mx-auto lg:max-w-lg">
          <button
            onClick={() => router.push(`/journal?userId=${userId}`)}
            className="w-full animated-gradient text-white font-bold py-4 lg:py-5 px-6 rounded-2xl cta-glow transition-all active:scale-[0.97] text-base lg:text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            aria-label="Start tonight's journal"
          >
            Start Tonight&apos;s Journal
          </button>
        </div>
      </main>
    </div>
  );
}
