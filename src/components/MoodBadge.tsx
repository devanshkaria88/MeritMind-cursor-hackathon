import { getMoodEmoji, getMoodColor, getMoodBgColor } from '@/lib/types';

interface MoodBadgeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MoodBadge({ score, label, size = 'md' }: MoodBadgeProps) {
  const emoji = getMoodEmoji(score);
  const color = getMoodColor(score);
  const bg = getMoodBgColor(score);

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg}`}
        role="status"
        aria-label={`Mood: ${score} out of 10, ${label}`}
      >
        <span aria-hidden="true">{emoji}</span>
        <span className={color}>{score}/10</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`relative overflow-hidden inline-flex items-center gap-5 px-7 py-5 rounded-2xl border shadow-md ${bg}`}
        role="status"
        aria-label={`Mood: ${score} out of 10, ${label}`}
      >
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-xl" aria-hidden="true" />
        <span className="text-5xl lg:text-6xl animate-bounce-gentle" aria-hidden="true">{emoji}</span>
        <div>
          <p className={`text-3xl lg:text-4xl font-extrabold ${color}`}>{score}/10</p>
          <p className="text-sm md:text-base text-stone-500 capitalize font-medium mt-0.5">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border ${bg}`}
      role="status"
      aria-label={`Mood: ${score} out of 10, ${label}`}
    >
      <span className="text-xl" aria-hidden="true">{emoji}</span>
      <span className={`font-bold ${color}`}>{score}/10</span>
      <span className="text-stone-500 text-sm capitalize">{label}</span>
    </div>
  );
}
