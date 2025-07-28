'use client';

import React, { useEffect, useState } from 'react';
import { type DiaryEntry as DiaryEntryType } from '../lib/types';

interface DiaryEntryProps {
    entry: DiaryEntryType;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ entry }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (entry.image instanceof Blob) {
            const url = URL.createObjectURL(entry.image);
            setImageUrl(url);

            // Cleanup function to revoke the object URL
            return () => URL.revokeObjectURL(url);
        }
    }, [entry]);

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: 'white' }}>
            <p>{entry.content}</p>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={`Diary entry for ${entry.date}`}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', marginTop: '1rem' }}
                />
            )}
        </div>
    );
};

export default DiaryEntry;