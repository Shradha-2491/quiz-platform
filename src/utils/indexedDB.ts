// Open (or create) the IndexedDB database
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FlashQuizDB", 1);

    // This event triggers if the database version changes 
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create "quizHistory" object store if it does not already exist
      if (!db.objectStoreNames.contains("quizHistory")) {
        db.createObjectStore("quizHistory", { keyPath: "id", autoIncrement: true });
      }
    };

    // Successfully opened the database
    request.onsuccess = () => resolve(request.result);

    // Handle errors if the database fails to open
    request.onerror = () => reject(request.error);
  });
};

// Save a quiz attempt to IndexedDB
export const saveQuizAttempt = async (score: number, totalQuestions: number) => {
  const db = await openDB();
  
  // Start a transaction with "readwrite" access to modify data
  const transaction = db.transaction("quizHistory", "readwrite");
  const store = transaction.objectStore("quizHistory");

  // Store the attempt with score, total questions, and timestamp
  const timestamp = new Date().toLocaleString();
  store.add({ score, totalQuestions, timestamp });
};

// Fetch all quiz attempts from IndexedDB
export const getQuizHistory = async (): Promise<{ score: number; totalQuestions: number; timestamp: string }[]> => {
  const db = await openDB();

  return new Promise((resolve) => {
    // Start a transaction in "readonly" mode to fetch data
    const transaction = db.transaction("quizHistory", "readonly");
    const store = transaction.objectStore("quizHistory");

    // Get all stored quiz attempts
    const request = store.getAll();

    // Resolve with retrieved data or return an empty array if an error occurs
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]);
  });
};
