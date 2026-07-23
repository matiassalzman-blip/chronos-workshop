"use client";

import { useCallback, useSyncExternalStore } from "react";

import { Entry } from "@/lib/chronos/types";
import {
  getEntriesSnapshot,
  getServerEntriesSnapshot,
  subscribe,
  writeEntries
} from "@/lib/chronos/storage";

export type EntryInput = Omit<Entry, "id" | "userId">;

export function useEntries(userId: string | null) {
  const entries = useSyncExternalStore(
    subscribe,
    getEntriesSnapshot,
    getServerEntriesSnapshot
  );

  const addEntry = useCallback(
    (input: EntryInput) => {
      if (!userId) return;
      const entry: Entry = { ...input, id: crypto.randomUUID(), userId };
      writeEntries([...getEntriesSnapshot(), entry]);
    },
    [userId]
  );

  const updateEntry = useCallback((id: string, input: EntryInput) => {
    writeEntries(
      getEntriesSnapshot().map((entry) =>
        entry.id === id ? { ...entry, ...input } : entry
      )
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    writeEntries(getEntriesSnapshot().filter((entry) => entry.id !== id));
  }, []);

  const userEntries = entries
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return { entries: userEntries, addEntry, updateEntry, deleteEntry };
}
