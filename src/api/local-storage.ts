import type { Collection } from "@/types/collection";

const keys = {
  collection: "collection",
  bestScore: "bestScore"
};

export const storage = {
  loadCollection(): Collection {
    const value = localStorage.getItem(keys.collection);

    return value === null ? [] : JSON.parse(value);
  },

  saveCollection(collection: Collection) {
    localStorage.setItem(keys.collection, JSON.stringify(collection));
  },

  loadBestScore(): number {
    const value = localStorage.getItem(keys.bestScore);

    return value === null ? 0 : Number(value);
  },

  saveBestScore(score: number) {
    localStorage.setItem(keys.bestScore, JSON.stringify(score));
  },

  reset() {
    localStorage.removeItem(keys.collection);
    localStorage.removeItem(keys.bestScore);
  }
};
