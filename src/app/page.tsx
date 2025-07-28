'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useLiveQuery } from 'dexie-react-hooks';
import 'react-calendar/dist/Calendar.css';

import { db } from './lib/db';
import EntryForm from './components/EntryForm';
import DiaryEntryComponent from './components/DiaryEntry';
import DataControls from './components/DataControls';
import { type DiaryEntry } from './lib/types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateString = selectedDate.toISOString().split('T')[0];

  // This query now gets an entry by its primary key (`dateString`)
  const entry = useLiveQuery<DiaryEntry | undefined>(
    () => db.entries.get(dateString),
    [dateString]
  );

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleDataChange = () => {
    // No need to reload, useLiveQuery will update the UI automatically
    // This function can be kept for the form's onSave if you still want a visual confirmation
    // Or just to trigger re-renders if needed.
  };

  // The new delete handler function
  const handleDelete = async (dateToDelete: string) => {
    try {
      await db.entries.delete(dateToDelete);
      //alert('Entry deleted successfully.');
      // The useLiveQuery hook will automatically detect the change and re-render the component,
      // making the entry disappear from the screen.
    } catch (error) {
      console.error('Failed to delete entry:', error);
      //alert('Error: Could not delete the entry.');
    }
  };

  return (
    <main>
      <h1>My Local Diary</h1>
      <p>All your data is stored securely in your browser.</p>
      <div className="container">
        <div className="sidebar">
          <h2>Select a Date</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <DataControls onImport={() => window.location.reload()} />
        </div>
        <div className="content">
          <h2>Entry for {selectedDate.toLocaleDateString()}</h2>
          {entry ? (
            // Pass the handleDelete function as a prop
            <DiaryEntryComponent entry={entry} onDelete={handleDelete} />
          ) : (
            <p>No entry for this day. Why not write one?</p>
          )}
          {/* We only show the form if there is NO entry for the selected day for a cleaner UI */}
          {!entry && <EntryForm selectedDate={selectedDate} onSave={handleDataChange} />}
        </div>
      </div>
    </main>
  );
}