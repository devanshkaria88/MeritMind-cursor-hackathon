interface WinsCardProps {
  wins: string[];
}

export default function WinsCard({ wins }: WinsCardProps) {
  if (!wins || wins.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/60 rounded-2xl p-5 shadow-sm">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-bl-full" aria-hidden="true" />

      <h3 className="text-sm md:text-base font-semibold text-emerald-700 flex items-center gap-2 mb-3">
        <span className="text-lg animate-bounce-gentle" aria-hidden="true">🏆</span>
        Wins
      </h3>
      <ul className="space-y-2.5" role="list">
        {wins.map((win, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm md:text-base text-emerald-800 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-emerald-600 font-bold" aria-hidden="true">
              {i + 1}
            </span>
            <span>{win}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
