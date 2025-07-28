'use client';

import React from 'react';
import { db } from '../lib/db';
import { saveAs } from 'file-saver';
import { type SerializableDiaryEntry } from '../lib/types';

interface DataControlsProps {
    onImport: () => void;
}

// Helper: Convert a Blob to a Base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// Helper: Convert a Base64 string back to a Blob
const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
};

const DataControls: React.FC<DataControlsProps> = ({ onImport }) => {

    const handleExport = async () => {
        try {
            const allEntries = await db.entries.toArray();
            const serializableEntries: SerializableDiaryEntry[] = await Promise.all(
                allEntries.map(async (entry) => {
                    if (entry.image instanceof Blob) {
                        const imageAsBase64 = await blobToBase64(entry.image);
                        return { ...entry, image: imageAsBase64 };
                    }
                    return { ...entry, image: undefined };
                })
            );

            const blob = new Blob([JSON.stringify(serializableEntries, null, 2)], { type: 'application/json' });
            saveAs(blob, `diary-export-${new Date().toISOString().split('T')[0]}.json`);
        } catch (error) {
            console.error('Failed to export data:', error);
            //alert('Error exporting data.');
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData: SerializableDiaryEntry[] = JSON.parse(event.target?.result as string);

                const entriesWithBlobs = importedData.map(entry => {
                    if (entry.image && typeof entry.image === 'string') {
                        return { ...entry, image: base64ToBlob(entry.image) };
                    }
                    return { ...entry, image: undefined };
                });

                await db.transaction('rw', db.entries, async () => {
                    await db.entries.clear();
                    await db.entries.bulkAdd(entriesWithBlobs);
                });

                //alert('Diary imported successfully! The page will now reload.');
                onImport();
            } catch (error) {
                console.error('Failed to import data:', error);
                //alert('Failed to import diary. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Manage Data</h3>
            <button onClick={handleExport} style={{ marginRight: '10px' }}>Export All</button>
            <input type="file" id="import-file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <button onClick={() => document.getElementById('import-file')?.click()}>Import from File</button>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Note: Importing will replace all current entries.</p>
        </div>
    );
};

export default DataControls;