interface HabitsMilLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showBadge?: boolean;
  subBadge?: string;
  className?: string;
}

export const NeuralMindIcon = ({ className = "w-5 h-5 text-cyan-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.93.92 3.65 2.34 4.75-.24.58-.34 1.22-.34 1.88 0 1.25.46 2.4 1.22 3.28L8 20h8l-1.22-2.09c.76-.88 1.22-2.03 1.22-3.28 0-.66-.1-1.3-.34-1.88C17.08 11.65 18 9.93 18 8c0-3.31-2.69-6-6-6zM11 6h2v3h-2V6zm-3 2h1.5v3H8V8zm6.5 0H16v3h-1.5V8z"/>
  </svg>
);

export function HabitsMilLogo({
  size = 'md',
  showBadge = true,
  subBadge = 'MIL',
  className = ''
}: HabitsMilLogoProps) {
  const iconBoxSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    hero: 'w-24 h-24 rounded-3xl'
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    hero: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl',
    hero: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Isotype Container */}
      <div className={`${iconBoxSizes[size]} bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 flex-shrink-0`}>
        <div className="w-full h-full bg-[#0f1422] rounded-[10px] flex items-center justify-center">
          <NeuralMindIcon className={`${svgSizes[size]} text-cyan-400`} />
        </div>
      </div>

      {showBadge && (
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-bold tracking-tight ${textSizes[size]} text-white`}>
            HÁBITS
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {subBadge}
          </span>
        </div>
      )}
    </div>
  );
}
