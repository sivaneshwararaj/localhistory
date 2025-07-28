'use client';

import React, { useEffect, useState } from 'react';
import { type DiaryEntry as DiaryEntryType } from '../lib/types';

interface DiaryEntryProps {
    entry: DiaryEntryType;
    onDelete: (id: number) => void; // Prop now expects a number (the ID)
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ entry, onDelete }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (entry.image instanceof Blob) {
            const url = URL.createObjectURL(entry.image);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(null);
        }
    }, [entry]);

    const handleDeleteClick = () => {
        if (typeof entry.id === 'undefined') {
            //alert("Cannot delete an entry without an ID.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this entry?')) {
            onDelete(entry.id);
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: 'white' }}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={`Diary entry for ${entry.date}`}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', marginTop: '1rem' }}
                />
            )}
            <button
                onClick={handleDeleteClick}
                style={{ marginTop: '1rem', background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
                Delete Entry
            </button>
        </div>
    );
};

export default DiaryEntry;