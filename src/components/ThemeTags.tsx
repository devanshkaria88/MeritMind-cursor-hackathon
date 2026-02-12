interface ThemeTagsProps {
  themes: string[];
}

const tagColors = [
  'bg-teal-50 text-teal-700 border-teal-200/60',
  'bg-amber-50 text-amber-700 border-amber-200/60',
  'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  'bg-rose-50 text-rose-700 border-rose-200/60',
  'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'bg-violet-50 text-violet-700 border-violet-200/60',
  'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  'bg-orange-50 text-orange-700 border-orange-200/60',
];

export default function ThemeTags({ themes }: ThemeTagsProps) {
  if (!themes || themes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Themes">
      {themes.map((theme, i) => (
        <span
          key={theme}
          role="listitem"
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium border transition-all duration-200 hover:scale-105 hover:shadow-sm ${tagColors[i % tagColors.length]}`}
        >
          {theme}
        </span>
      ))}
    </div>
  );
}
