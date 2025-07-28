import Dexie, { type EntityTable } from 'dexie';
import { type DiaryEntry } from './types';

// Subclass Dexie to provide type safety for our tables
class DiaryDatabase extends Dexie {
    // 'entries' is the name of our table. We declare it with the type of its records.
    entries!: EntityTable<
        DiaryEntry,
        'id' // Primary key type
    >;

    constructor() {
        super('myDiaryAppTS'); // Database name
        this.version(1).stores({
            entries: '++id, date', // '++id' for auto-incrementing primary key, 'date' for indexing
        });
    }
}

export const db = new DiaryDatabase();