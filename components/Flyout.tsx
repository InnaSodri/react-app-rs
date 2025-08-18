"use client";
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { unselectAll } from '../features/selectedItems/selectedItemsSlice';
import {
  selectSelectedCount,
  selectSelectedItems,
} from '../features/selectedItems/selectedItemsSelectors';

import './styles/Flyout.css';

const Flyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const count = useAppSelector(selectSelectedCount);

  if (count === 0) return null;

  const handleUnselectAll = () => dispatch(unselectAll());

  const handleDownload = async () => {
    const rows = selectedItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      detailsUrl: item.detailsUrl
    }));
  
    const res = await fetch('/api/export-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows)
    });
  
    if (!res.ok) return;
  
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${count}_items.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flyout">
      <span>
        {count} item{count > 1 ? 's' : ''} selected
      </span>
      <div className="flyout-buttons">
        <button onClick={handleUnselectAll}>Unselect all</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default Flyout;
