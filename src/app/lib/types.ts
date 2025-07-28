// Describes the shape of an entry stored in the IndexedDB
export interface DiaryEntry {
    id?: number; // Optional because it's auto-incremented by the DB
    date: string; // Stored as YYYY-MM-DD string
    content: string;
    image?: Blob; // The image is stored as a Blob
}

// Describes the shape of an entry when exported/imported as JSON
// The Blob is converted to a base64 string for serialization
export interface SerializableDiaryEntry {
    id?: number;
    date: string;
    content: string;
    image?: string; // Image as a base64 data URL
  }