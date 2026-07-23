import { Entry } from "@/lib/chronos/types";
import { createSeedEntries } from "@/lib/chronos/fixtures";

const ENTRIES_KEY = "chronos:entries";
const SESSION_KEY = "chronos:session";

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

/** Subscribes to changes from either store, for useSyncExternalStore. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let entriesCache: Entry[] | null = null;

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(ENTRIES_KEY);
  if (raw === null) {
    const seeded = createSeedEntries("u1");
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return JSON.parse(raw) as Entry[];
}

export function getEntriesSnapshot(): Entry[] {
  if (entriesCache === null) entriesCache = loadEntries();
  return entriesCache;
}

const EMPTY_ENTRIES: Entry[] = [];

export function getServerEntriesSnapshot(): Entry[] {
  return EMPTY_ENTRIES;
}

export function writeEntries(entries: Entry[]): void {
  entriesCache = entries;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }
  emitChange();
}

let sessionCache: string | null | undefined;

function loadSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function getSessionSnapshot(): string | null {
  if (sessionCache === undefined) sessionCache = loadSession();
  return sessionCache;
}

export function getServerSessionSnapshot(): string | null {
  return null;
}

export function writeSession(userId: string): void {
  sessionCache = userId;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, userId);
  }
  emitChange();
}

export function clearSession(): void {
  sessionCache = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
  emitChange();
}
