import React from 'react';
import { TableProps, Column } from '@/interfaces/componentsInterface';
import { useTheme } from 'next-themes';

const Table = <T,>({ data, columns, className }: TableProps<T>) => {
  const { theme } = useTheme();

  const theadClass = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700';
  const tbodyClass = theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900';
  const trClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';

  const renderCellContent = (value: unknown): React.ReactNode => {
    if (React.isValidElement(value)) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${trClass} ${className}`}>
        <thead className={theadClass}>
          <tr>
            {columns.map((column: Column<T, keyof T>, index: number) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${trClass} ${tbodyClass}`}>
          {data.map((row: T, rowIndex: number) => (
            <tr key={rowIndex}>
              {columns.map((column: Column<T, keyof T>, cellIndex: number) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {renderCellContent(
                    column.cell
                      ? column.cell(row[column.accessor as keyof T] as T[keyof T], row, rowIndex)
                      : row[column.accessor as keyof T]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;