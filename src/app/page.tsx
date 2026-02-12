'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { IUser, IJournal } from '@/lib/types';
import UserSelector from '@/components/UserSelector';
import StreakDisplay from '@/components/StreakDisplay';
import JournalCard from '@/components/JournalCard';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

export default function HomePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [recentJournals, setRecentJournals] = useState<IJournal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/journals?userId=${user._id}`);
        const json = await res.json();
        if (json.success) {
          setRecentJournals(json.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch journals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [user]);

  return (
    <div className="min-h-screen animate-fade-in relative overflow-hidden">
      {/* Hero header with animated gradient */}
      <header
        className="relative animated-gradient text-white px-6 pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden noise-overlay"
        role="banner"
      >
        {/* Floating decorative blobs */}
        <div className="absolute top-10 right-10 w-64 h-64 blob bg-white/10" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 blob-slow bg-teal-300/10" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto">
          <div className="space-y-2">
            <p className="text-teal-100/80 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
              MeritMind
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {user ? `${getGreeting()}, ${user.name}` : 'Welcome'}
            </h1>
            <p className="text-teal-100/70 text-sm md:text-base lg:text-lg max-w-md">
              Talk about your day. We&apos;ll remember the good stuff.
            </p>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 -mt-10 pb-12" id="main-content" role="main">
        {/* Desktop: 2-column grid, Mobile: stack */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* User selector card */}
            <section
              className="glass-strong rounded-2xl p-5 shadow-lg animate-fade-in-up"
              aria-label="Select resident"
            >
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">
                Resident
              </p>
              <UserSelector onSelect={setUser} selectedUserId={user?._id} />
            </section>

            {user && (
              <>
                {/* Stats */}
                <section aria-label="Journal statistics" className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <StreakDisplay
                    streak={user.currentStreak}
                    totalJournals={user.totalJournals}
                  />
                </section>

                {/* Chores */}
                {user.chores && user.chores.length > 0 && (
                  <section
                    className="glass-strong rounded-2xl p-5 shadow-sm animate-fade-in-up"
                    style={{ animationDelay: '0.15s' }}
                    aria-label="House tasks"
                  >
                    <h3 className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">
                      Your house bits
                    </h3>
                    <ul className="space-y-2.5">
                      {user.chores.map((chore, i) => (
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

                {/* CTA */}
                <Link href={`/journal?userId=${user._id}`} className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <button
                    className="w-full animated-gradient text-white font-bold py-4 lg:py-5 px-6 rounded-2xl cta-glow transition-all active:scale-[0.97] text-base lg:text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                    aria-label="Start tonight's voice journal"
                  >
                    Start Tonight&apos;s Journal
                  </button>
                </Link>

                {/* Dashboard link */}
                <Link href={`/dashboard?userId=${user._id}`} className="block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <button className="w-full glass-strong text-stone-600 font-medium py-3 lg:py-4 px-6 rounded-2xl hover:bg-white/90 transition-all text-sm lg:text-base shadow-sm card-hover focus-visible:outline-2 focus-visible:outline-teal-500">
                    View Dashboard &amp; Trends
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Right column — recent entries */}
          {user && (
            <div className="lg:col-span-3 mt-6 lg:mt-0">
              <section aria-label="Recent journal entries">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm md:text-base lg:text-lg font-bold text-stone-700">
                    Recent entries
                  </h2>
                  <Link
                    href={`/dashboard?userId=${user._id}`}
                    className="text-xs md:text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-teal-500 rounded"
                  >
                    View all →
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-3" aria-busy="true" aria-label="Loading entries">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 rounded-2xl skeleton-shimmer"
                      />
                    ))}
                  </div>
                ) : recentJournals.length > 0 ? (
                  <div className="space-y-3">
                    {recentJournals.map((j, i) => (
                      <div
                        key={j._id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.08}s` }}
                      >
                        <JournalCard journal={j} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-strong rounded-2xl p-10 text-center shadow-sm">
                    <div className="text-5xl mb-3 animate-bounce-gentle" aria-hidden="true">📓</div>
                    <p className="text-stone-500 text-sm lg:text-base">
                      No journal entries yet. Start your first one!
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
