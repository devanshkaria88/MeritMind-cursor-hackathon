import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getMoodEmoji, getMoodColor } from '@/lib/types';
import type { IJournal } from '@/lib/types';
import ThemeTags from './ThemeTags';

interface JournalCardProps {
  journal: IJournal;
}

export default function JournalCard({ journal }: JournalCardProps) {
  const { insights, date, _id } = journal;
  const emoji = getMoodEmoji(insights.mood.score);
  const color = getMoodColor(insights.mood.score);

  let formattedDate: string;
  try {
    formattedDate = format(parseISO(date), 'EEE d MMM');
  } catch {
    formattedDate = date;
  }

  return (
    <Link
      href={`/journal/${_id}`}
      className="block focus-visible:outline-2 focus-visible:outline-teal-500 rounded-2xl group"
    >
      <article className="relative overflow-hidden glass-strong rounded-2xl p-5 shadow-sm card-interactive">
        {/* Decorative gradient accent on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 via-teal-500 to-cyan-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl lg:text-3xl group-hover:animate-wiggle" aria-hidden="true">{emoji}</span>
            <span className={`text-lg lg:text-xl font-extrabold ${color}`} aria-label={`Mood score ${insights.mood.score} out of 10`}>
              {insights.mood.score}/10
            </span>
          </div>
          <time className="text-xs text-stone-400 bg-stone-100/80 px-2.5 py-1 rounded-full font-medium" dateTime={date}>
            {formattedDate}
          </time>
        </div>
        <p className="text-sm lg:text-base text-stone-600 leading-relaxed line-clamp-2 mb-3">
          {insights.summary}
        </p>
        <ThemeTags themes={insights.themes.slice(0, 3)} />
      </article>
    </Link>
  );
}
