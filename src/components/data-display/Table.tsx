import React from 'react';
import { TableProps, Column } from '@/interfaces/componentsInterface';
import { useTheme } from 'next-themes';

const Table: React.FC<TableProps> = ({ data, columns, className }) => {
  const { theme } = useTheme();

  const theadClass = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700';
  const tbodyClass = theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900';
  const trClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${trClass} ${className}`}>
        <thead className={theadClass}>
          <tr>
            {columns.map((column, index) => (
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.cell
                    ? column.cell(row[column.accessor as keyof typeof row], rowIndex)
                    : row[column.accessor as keyof typeof row]}
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