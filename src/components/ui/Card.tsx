import { CardProps } from '@/interfaces/componentsInterface';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Menghindari mismatch antara server dan client rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const baseStyles = `
    rounded-xl shadow-lg border transition-all duration-300 ease-in-out
    p-6
  `;

  const lightStyles = `
    bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg
    border-white border-opacity-30
    hover:shadow-xl hover:bg-opacity-30
    text-gray-900
  `;

  const darkStyles = `
    bg-gray-800 bg-opacity-20 backdrop-filter backdrop-blur-lg
    border-gray-700 border-opacity-30
    hover:shadow-xl hover:bg-opacity-30
    text-gray-100
  `;

  const cardStyles = twMerge(
    baseStyles,
    theme === 'dark' ? darkStyles : lightStyles,
    className
  );

  return (
    <div className={cardStyles} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
