import Dexie, { type EntityTable } from 'dexie';
import { type DiaryEntry } from './types';

class DiaryDatabase extends Dexie {
    entries!: EntityTable<
        DiaryEntry,
        'date' // The primary key is now a string ('date')
    >;

    constructor() {
        super('myDiaryAppTS');
        // Update the schema: 'date' is now the primary key.
        // No '++' means it is not auto-incrementing.
        this.version(2).stores({ // Increment version to apply schema change
            entries: 'date, content, image',
        });
    }
}

export const db = new DiaryDatabase();