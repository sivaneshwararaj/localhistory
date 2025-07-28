'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useLiveQuery } from 'dexie-react-hooks';
import 'react-calendar/dist/Calendar.css';

import { db } from '@/app/lib/db';
import EntryForm from '@/app/components/EntryForm';
import DiaryEntryComponent from '@/app/components/DiaryEntry';
import DataControls from '@/app/components/DataControls';
import { type DiaryEntry } from '@/app/lib/types';

// Type alias for Calendar's onChange value
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateString = selectedDate.toISOString().split('T')[0];

  // useLiveQuery is now typed with DiaryEntry | undefined
  const entry = useLiveQuery<DiaryEntry | undefined>(
    () => db.entries.where('date').equals(dateString).first(),
    [dateString] // Dependencies array
  );

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleDataChange = () => {
    window.location.reload();
  };

  return (
    <main>
      <h1>My Local-First Diary (TS)</h1>
      <p>All your data is stored securely in your browser.</p>
      <div className="container">
        <div className="sidebar">
          <h2>Select a Date</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <DataControls onImport={handleDataChange} />
        </div>
        <div className="content">
          <h2>Entry for {selectedDate.toLocaleDateString()}</h2>
          {entry ? (
            <DiaryEntryComponent entry={entry} />
          ) : (
            <p>No entry for this day. Why not write one?</p>
          )}
          <EntryForm selectedDate={selectedDate} onSave={handleDataChange} />
        </div>
      </div>
    </main>
  );
}