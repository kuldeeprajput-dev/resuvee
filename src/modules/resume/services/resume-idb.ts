/**
 * IndexedDB Service for Resume Builder
 * Provides non-blocking persistent storage for resume data, active state,
 * and saved resume lists — replacing localStorage throughout the builder.
 *
 * Mirrors the pattern used in cover-letter-idb.ts.
 */

const DB_NAME = "resuvee_resume_db";
const DB_VERSION = 1;
const STORE_NAME = "resume_kv";

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      _db = request.result;
      // Reset cached connection on close (e.g. version upgrade)
      _db.onclose = () => {
        _db = null;
      };
      resolve(_db);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error(`idbGet error for key "${key}":`, e);
    return null;
  }
}

export async function idbSet(key: string, value: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error(`idbSet error for key "${key}":`, e);
  }
}

export async function idbDel(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error(`idbDel error for key "${key}":`, e);
  }
}

export interface LocalResumeRecord {
  id: string;
  title: string;
  target_role: string;
  data: any;
  created_at: string;
  updated_at: string;
}

const LOCAL_RESUMES_KEY = "local-saved-resumes";

export async function getLocalSavedResumes(): Promise<LocalResumeRecord[]> {
  const records = await idbGet<LocalResumeRecord[]>(LOCAL_RESUMES_KEY);
  return records || [];
}

export async function saveLocalResumeBackup(record: LocalResumeRecord): Promise<void> {
  const current = await getLocalSavedResumes();
  const filtered = current.filter((item) => item.id !== record.id);
  await idbSet(LOCAL_RESUMES_KEY, [record, ...filtered]);
}

export async function deleteLocalResumeBackup(id: string): Promise<void> {
  const current = await getLocalSavedResumes();
  await idbSet(
    LOCAL_RESUMES_KEY,
    current.filter((item) => item.id !== id)
  );
}
