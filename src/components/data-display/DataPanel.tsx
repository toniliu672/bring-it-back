import { DataPanelProps } from '@/interfaces/componentsInterface';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';

function DataPanel<T>({
  data,
  renderItem,
  className,
  orientation = 'vertical',
}: DataPanelProps<T>) {
  const { theme } = useTheme();

  const containerClass = twMerge(
    orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row',
    // Tambahkan kelas berdasarkan tema
    theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    className
  );

  return (
    <div className={containerClass}>
      {data.map((item, index) => (
        <div
          key={index}
          className={
            orientation === 'vertical'
              ? 'mb-2 p-4 rounded-md shadow-md dark:bg-gray-700 bg-gray-100'
              : 'mr-2 p-4 rounded-md shadow-md dark:bg-gray-700 bg-gray-100'
          }
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export default DataPanel;
