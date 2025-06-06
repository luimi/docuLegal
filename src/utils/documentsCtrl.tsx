// db.ts (or any file name you prefer for your IndexedDB utilities)

const DB_NAME = 'DocumentsDB';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

/**
 * Initializes the IndexedDB database and object store.
 * This function should be called once before performing any other DB operations.
 * @returns A Promise that resolves when the database is successfully opened.
 */
export async function initDocumentsDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(); // DB already initialized
      return;
    }

    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event: Event) => {
      console.error("Error opening IndexedDB:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event: Event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      console.log("IndexedDB opened successfully");
      resolve();
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('title', 'title', { unique: false });
        console.log("Object store created:", STORE_NAME);
      }
    };
  });
}

/**
 * Gets the object store for read or write operations.
 * Ensures the database is initialized before returning the store.
 * @param mode The transaction mode ('readonly' or 'readwrite').
 * @returns A Promise that resolves with the IDBObjectStore.
 */
async function getDocumentsObjectStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  if (!dbInstance) {
    await initDocumentsDB(); // Ensure DB is initialized
    if (!dbInstance) {
      throw new Error("IndexedDB is not initialized.");
    }
  }
  const transaction = dbInstance.transaction(STORE_NAME, mode);
  return transaction.objectStore(STORE_NAME);
}

/**
 * Inserts a new document record into the database.
 * @param document The document object to insert (date, title, id, document).
 * @returns A Promise that resolves when the insertion is successful.
 */
export async function insertDocument(document: { date: string; title: string; id: string; document: string }): Promise<void> {
  const objectStore = await getDocumentsObjectStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = objectStore.add(document);
    request.onsuccess = () => {
      console.log("Document inserted successfully:", document.id);
      resolve();
    };
    request.onerror = (event: Event) => {
      console.error("Error inserting document:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
}

/**
 * Retrieves a document record by its ID.
 * @param id The ID of the document to retrieve.
 * @returns A Promise that resolves with the document object, or null if not found.
 */
export async function getDocumentById(id: string): Promise<{ date: string; title: string; id: string; document: string } | null> {
  const objectStore = await getDocumentsObjectStore('readonly');
  return new Promise((resolve, reject) => {
    const request = objectStore.get(id);
    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event: Event) => {
      console.error("Error getting document by ID:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
}

/**
 * Deletes a document record by its ID.
 * @param id The ID of the document to delete.
 * @returns A Promise that resolves when the deletion is successful.
 */
export async function deleteDocument(id: string): Promise<void> {
  const objectStore = await getDocumentsObjectStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = objectStore.delete(id);
    request.onsuccess = () => {
      console.log("Document deleted successfully:", id);
      resolve();
    };
    request.onerror = (event: Event) => {
      console.error("Error deleting document:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
}

/**
 * Retrieves a list of all document records in the database.
 * @returns A Promise that resolves with an array of document objects.
 */
export async function getAllDocuments(): Promise<{ date: string; title: string; id: string; document: string }[]> {
  const objectStore = await getDocumentsObjectStore('readonly');
  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();
    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event: Event) => {
      console.error("Error getting all documents:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
}

export function extractMarkdownContent(str: string): string | null {
  const startDelimiter = '```markdown';
  const endDelimiter = '```';

  const startIndex = str.indexOf(startDelimiter);
  if (startIndex === -1) {
    return null; // '```markdown' not found
  }

  const contentStartIndex = startIndex + startDelimiter.length;
  const endIndex = str.indexOf(endDelimiter, contentStartIndex);

  if (endIndex === -1) {
    return null; // '```' not found after '```markdown'
  }

  return str.substring(contentStartIndex, endIndex).trim();
}

// Example Usage:
// Import these functions where you need them:
// import { initDocumentsDB, insertDocument, getDocumentById, deleteDocument, getAllDocuments } from './db';

// async function usageExample() {
//   await initDocumentsDB(); // Make sure to initialize the DB first

//   const doc1 = {
//     date: new Date().toISOString(),
//     title: "My Exported Document",
//     id: "exp-doc-1",
//     document: "This is content for an exported document."
//   };
//   await insertDocument(doc1);

//   const retrieved = await getDocumentById("exp-doc-1");
//   console.log("Retrieved exported document:", retrieved);

//   const allDocs = await getAllDocuments();
//   console.log("All exported documents:", allDocs);
// }

// usageExample();