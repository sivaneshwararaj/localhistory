// Describes the shape of an entry stored in the IndexedDB
export interface DiaryEntry {
    id?: number; // The 'id' is optional because Dexie creates it for us on insertion
    date: string; // Stored as YYYY-MM-DD string
    content: string;
    image?: Blob; // The image is stored as a Blob
}

// Describes the shape of an entry when exported/imported as JSON
export interface SerializableDiaryEntry {
    id?: number; // Include for completeness during export
    date: string;
    content: string;
    image?: string; // Image as a base64 data URL
  }