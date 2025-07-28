// Describes the shape of an entry stored in the IndexedDB
export interface DiaryEntry {
    date: string; // Stored as YYYY-MM-DD string, now the primary key
    content: string;
    image?: Blob; // The image is stored as a Blob
}

// Describes the shape of an entry when exported/imported as JSON
export interface SerializableDiaryEntry {
    date: string;
    content: string;
    image?: string; // Image as a base64 data URL
  }