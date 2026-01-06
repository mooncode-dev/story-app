import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const STORE_NAME = 'pending-stories';

const dbPromise = openDB(DATABASE_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const StoryDb = {
  async putStory(story) {
    return (await dbPromise).add(STORE_NAME, story);
  },
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
};