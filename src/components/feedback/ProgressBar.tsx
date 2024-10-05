import { ProgressBarProps } from '@/interfaces/componentsInterface';
import { twMerge } from 'tailwind-merge';

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={twMerge(
      'w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
      'shadow-inner relative',
      className
    )}>
      <div
        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress}%` }}
      >
        <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow">
            {clampedProgress.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-end pr-2">
        <div className="w-1 h-full bg-white dark:bg-gray-300 opacity-50 animate-ping" />
      </div>
    </div>
  );
};

export default ProgressBar;