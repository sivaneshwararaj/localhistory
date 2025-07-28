import Dexie, { type EntityTable } from 'dexie';
import { type DiaryEntry } from './types';

class DiaryDatabase extends Dexie {
    entries!: EntityTable<
        DiaryEntry,
        'id' // The primary key is now a number ('id')
    >;

    constructor() {
        super('myDiaryAppTS');

        // Define all previous versions your app has had in the wild.
        // This allows Dexie to correctly upgrade from any old version.
        this.version(1).stores({ entries: '++id, date' }); // Initial schema
        this.version(2).stores({ entries: 'date, content, image' }); // Single-entry-per-day schema

        // --- THIS IS THE MIGRATION ---
        // Version 3 reverts to the correct schema AND provides an upgrade path.
        this.version(3).stores({
            entries: '++id, date', // Primary key is 'id', 'date' is an index
        }).upgrade(async (tx) => {
            // This function runs only when a user's browser has a db version lower than 3.
            // 'tx' is a transaction object for the upgrade.

            console.log("Upgrading database to version 3...");

            // 1. Get all entries from the old table (which was keyed by 'date').
            const oldEntries = await tx.table('entries').toArray();

            // 2. Prepare the entries for the new schema.
            // The old data doesn't have an 'id' field, which is perfect because
            // we want the new schema to auto-generate it.
            const entriesToReAdd = oldEntries.map(entry => {
                // We just need to make sure the object shape is correct.
                // In this case, the `oldEntries` are already in the correct shape.
                return {
                    date: entry.date,
                    content: entry.content,
                    image: entry.image,
                };
            });

            // 3. Clear the old table completely. This removes the old primary key constraint.
            await tx.table('entries').clear();

            console.log("Old table cleared, now re-adding entries with new schema...");

            // 4. Use bulkAdd() to re-insert all the entries. Dexie will now use the
            // new '++id' primary key to assign a unique, auto-incrementing ID to each entry.
            await tx.table('entries').bulkAdd(entriesToReAdd);

            console.log("Database upgrade to version 3 complete!");
        });
    }
}

export const db = new DiaryDatabase();