/**
 * Client session: only the authenticated user's id is persisted.
 * Every user attribute (name, role, phone...) is always read from the database.
 */
const SESSION_KEY = 'licere_session';

// Keys used by older versions that cached a copy of the user profile.
const LEGACY_KEYS = ['licere_auth_user', 'licere-profile'];

function clearLegacyKeys() {
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function getSessionUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function startSession(userId: string) {
  clearLegacyKeys();
  localStorage.setItem(SESSION_KEY, userId);
}

export function endSession() {
  clearLegacyKeys();
  localStorage.removeItem(SESSION_KEY);
}

export const SESSION_STORAGE_KEY = SESSION_KEY;
