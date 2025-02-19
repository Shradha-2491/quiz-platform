export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FlashQuizDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("quizHistory")) {
        db.createObjectStore("quizHistory", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save quiz attempt
export const saveQuizAttempt = async (score: number, totalQuestions: number) => {
  const db = await openDB();
  const transaction = db.transaction("quizHistory", "readwrite");
  const store = transaction.objectStore("quizHistory");
  const timestamp = new Date().toLocaleString();

  store.add({ score, totalQuestions, timestamp });
};

// Fetch quiz history
export const getQuizHistory = async (): Promise<{ score: number; totalQuestions: number; timestamp: string }[]> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction("quizHistory", "readonly");
    const store = transaction.objectStore("quizHistory");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]);
  });
};
