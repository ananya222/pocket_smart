// config.js
// Centralised Firebase exports — single import point for the rest of the app.
// The backend (Flask/MySQL) has been fully replaced by Firebase.

export { auth, firestore } from './firebase';

// ---------------------------------------------------------------------------
// DEPRECATED STUBS — kept temporarily so screens not yet migrated to Firebase
// do not crash at import time. Remove each stub once its screen is migrated.
// ---------------------------------------------------------------------------

/** @deprecated Backend removed. Migrate screen to Firestore. */
export const API_BASE_URL = null;

/** @deprecated Token management is now handled by Firebase Auth automatically. */
export async function saveToken() {}

/** @deprecated Token management is now handled by Firebase Auth automatically. */
export async function getToken() { return null; }

/** @deprecated Token management is now handled by Firebase Auth automatically. */
export async function removeToken() {}

/** @deprecated Backend removed. Migrate this screen's data fetching to Firestore. */
export async function apiFetch(endpoint) {
  console.warn(
    `[config.js] apiFetch("${endpoint}") was called but the Flask backend has been removed. ` +
    'Migrate this screen to Firestore.'
  );
  throw new Error('Backend removed. Please migrate to Firebase/Firestore.');
}
