// components/MultiLevelSelector.tsx

import React, { useState, useEffect } from 'react';
import { MultiLevelSelectorProps, SelectionGroupProps } from '@/interfaces/componentsInterface';

const SelectionGroup = <T, U>({
  item,
  renderItem,
  renderSubItem,
  subItems,
  selectedSubItems,
  onSelectionChange,
  itemIdKey,
  subItemIdKey
}: SelectionGroupProps<T, U>) => {
  const handleSubItemChange = (subItemId: string) => {
    const newSelection = selectedSubItems.includes(subItemId)
      ? selectedSubItems.filter(id => id !== subItemId)
      : [...selectedSubItems, subItemId];
    onSelectionChange(item[itemIdKey] as string, newSelection);
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">{renderItem(item)}</h3>
      <div className="pl-4">
        {subItems.map(subItem => (
          <div key={subItem[subItemIdKey] as string} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={subItem[subItemIdKey] as string}
              checked={selectedSubItems.includes(subItem[subItemIdKey] as string)}
              onChange={() => handleSubItemChange(subItem[subItemIdKey] as string)}
              className="mr-2"
            />
            <label htmlFor={subItem[subItemIdKey] as string}>{renderSubItem(subItem)}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const MultiLevelSelector = <T, U>({
  data,
  renderItem,
  renderSubItem,
  getSubItems,
  onSelectionChange,
  excludeItems = [],
  itemIdKey,
  subItemIdKey
}: MultiLevelSelectorProps<T, U>) => {
  const [selection, setSelection] = useState<{[key: string]: string[]}>({});

  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

  const handleSelectionChange = (itemId: string, selectedSubItemIds: string[]) => {
    setSelection(prev => ({
      ...prev,
      [itemId]: selectedSubItemIds
    }));
  };

  const filterExcludedItems = (subItems: U[]) => {
    return subItems.filter(subItem => 
      !excludeItems.some(excludeItem => 
        excludeItem[subItemIdKey] === subItem[subItemIdKey]
      )
    );
  };

  return (
    <div>
      {data.map(item => {
        const subItems = filterExcludedItems(getSubItems(item));
        if (subItems.length === 0) return null;
        return (
          <SelectionGroup
            key={item[itemIdKey] as string}
            item={item}
            renderItem={renderItem}
            renderSubItem={renderSubItem}
            subItems={subItems}
            selectedSubItems={selection[item[itemIdKey] as string] || []}
            onSelectionChange={handleSelectionChange}
            itemIdKey={itemIdKey}
            subItemIdKey={subItemIdKey}
          />
        );
      })}
    </div>
  );
};

export default MultiLevelSelector;