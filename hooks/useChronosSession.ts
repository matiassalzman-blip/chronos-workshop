"use client";

import { useCallback, useSyncExternalStore } from "react";

import { users } from "@/lib/chronos/fixtures";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  subscribe,
  writeSession
} from "@/lib/chronos/storage";

export function useChronosSession() {
  const userId = useSyncExternalStore(
    subscribe,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

  const login = useCallback((id: string) => writeSession(id), []);
  const logout = useCallback(() => clearSession(), []);

  const currentUser = users.find((user) => user.id === userId) ?? null;

  return { currentUser, login, logout };
}
