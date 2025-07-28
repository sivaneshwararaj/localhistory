'use client';

import React, { useState } from 'react';
import { db } from '../lib/db';

// Define the type for the component's props
interface EntryFormProps {
    selectedDate: Date;
    onSave: () => void; // A function that takes no arguments and returns nothing
}

const EntryForm: React.FC<EntryFormProps> = ({ selectedDate, onSave }) => {
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('Entry content cannot be empty.');
            return;
        }

        try {
            const dateString = selectedDate.toISOString().split('T')[0];
            await db.entries.put({
                date: dateString,
                content,
                image: image || undefined, // Ensure image is not null
            });

            setContent('');
            setImage(null);
            if (e.target instanceof HTMLFormElement) {
                e.target.reset(); // Reset the form fields
            }
            onSave();
            alert('Entry saved!');
        } catch (error) {
            console.error('Failed to save entry:', error);
            alert('Error: Could not save the entry.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <h3>New Entry for {selectedDate.toLocaleDateString()}</h3>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today?"
                rows={8}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
            />
            <div style={{ margin: '1rem 0' }}>
                <label>Add an image: </label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <button type="submit" style={{ padding: '10px 15px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white' }}>
                Save Entry
            </button>
        </form>
    );
};

export default EntryForm;