import { DataPanelProps } from '@/interfaces/componentsInterface'
import { twMerge } from 'tailwind-merge'

function DataPanel<T>({ 
  data, 
  renderItem, 
  className,
  orientation = 'vertical'
}: DataPanelProps<T>) {
  const containerClass = twMerge(
    orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row',
    className
  )

  return (
    <div className={containerClass}>
      {data.map((item, index) => (
        <div key={index} className={orientation === 'vertical' ? 'mb-2' : 'mr-2'}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

export default DataPanel