'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useLiveQuery } from 'dexie-react-hooks';
import 'react-calendar/dist/Calendar.css';

import { db } from './lib/db';
import EntryForm from './components/EntryForm';
import DiaryEntryComponent from './components/DiaryEntry';
import DataControls from './components/DataControls';
import InstallButton from './components/InstallButton';
import { type DiaryEntry } from './lib/types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const dateString = selectedDate?.toISOString().split('T')[0];

  // Fetch an ARRAY of entries for the selected date.
  const entries = useLiveQuery(
    () => {
      if (!dateString) return []; // Return empty array if date is not set
      // Use .where() and .equals() to query by the 'date' index.
      return db.entries.where('date').equals(dateString).toArray();
    },
    [dateString]
  );

  if (!selectedDate) {
    return <div>Loading diary...</div>;
  }

  // The delete handler now receives the unique 'id' of the entry to delete.
  const handleDelete = async (idToDelete: number) => {
    try {
      await db.entries.delete(idToDelete);
      //alert('Entry deleted successfully.');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      //alert('Error: Could not delete the entry.');
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
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
          <div style={{ marginTop: '1.5rem' }}>
            <InstallButton />
          </div>
        </div>
        <div className="content">
          <h2>Entries for {selectedDate.toLocaleDateString()}</h2>

          {/* Render logic now maps over the 'entries' array. */}
          {entries && entries.length > 0 ? (
            entries.map(entry => (
              <DiaryEntryComponent
                key={entry.id} // The key MUST be the unique ID
                entry={entry}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No entries for this day. Why not write one?</p>
          )}

          {/* The form is always visible to allow adding more entries. */}
          <EntryForm selectedDate={selectedDate} />
        </div>
      </div>
    </main>
  );
}