interface StreakDisplayProps {
  streak: number;
  totalJournals: number;
}

export default function StreakDisplay({ streak, totalJournals }: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Journal statistics">
      {/* Streak card */}
      <div className="relative overflow-hidden glass-strong rounded-2xl px-5 py-5 flex items-center gap-4 shadow-md card-hover group">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-2xl group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
        <span className="text-3xl lg:text-4xl animate-bounce-gentle" aria-hidden="true">🔥</span>
        <div>
          <p className="text-2xl lg:text-3xl font-extrabold gradient-text-warm leading-none">{streak}</p>
          <p className="text-xs lg:text-sm text-stone-500 mt-0.5 font-medium">day streak</p>
        </div>
      </div>

      {/* Total entries card */}
      <div className="relative overflow-hidden glass-strong rounded-2xl px-5 py-5 flex items-center gap-4 shadow-md card-hover group">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-teal-300/30 to-cyan-300/20 blur-2xl group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
        <span className="text-3xl lg:text-4xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }} aria-hidden="true">📓</span>
        <div>
          <p className="text-2xl lg:text-3xl font-extrabold gradient-text leading-none">{totalJournals}</p>
          <p className="text-xs lg:text-sm text-stone-500 mt-0.5 font-medium">total entries</p>
        </div>
      </div>
    </div>
  );
}
