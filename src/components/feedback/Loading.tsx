import { LoadingProps } from '@/interfaces/componentsInterface';
import { twMerge } from 'tailwind-merge';

const Loading: React.FC<LoadingProps> = ({
  size = 60,
  className = '',
}) => {
  return (
    <div className={twMerge(
      'flex items-center justify-center',
      'bg-gradient-to-r from-blue-400 to-purple-500',
      'rounded-full shadow-lg',
      'p-2',
      className
    )}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="animate-spin"
          style={{ width: '100%', height: '100%' }}
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-blue-200 dark:stroke-blue-800"
            cx="25"
            cy="25"
            r="20"
            strokeWidth="5"
            fill="none"
          />
          <circle
            className="stroke-white dark:stroke-gray-300"
            cx="25"
            cy="25"
            r="20"
            strokeWidth="5"
            fill="none"
            strokeDasharray="80"
            strokeDashoffset="60"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="1.5s"
              repeatCount="indefinite"
              from="60"
              to="0"
            />
          </circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-white dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loading;