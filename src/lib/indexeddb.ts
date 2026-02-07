const DB_NAME = "slidish-chats";
const DB_VERSION = 1;
const STORE_NAME = "chats";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: { type: string; content: string }[];
}

export interface Chat {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isSaved: boolean;
  title?: string;
}

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
        store.createIndex("isSaved", "isSaved", { unique: false });
      }
    };
  });
};

export const saveChat = async (chat: Chat): Promise<void> => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put({
      ...chat,
      updatedAt: new Date(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getChats = async (): Promise<Chat[]> => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("updatedAt");

    const request = index.openCursor(null, "prev");
    const chats: Chat[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        chats.push(cursor.value);
        cursor.continue();
      } else {
        resolve(chats);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const getChatById = async (id: string): Promise<Chat | null> => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const deleteChat = async (id: string): Promise<void> => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const toggleSaveChat = async (id: string): Promise<void> => {
  const chat = await getChatById(id);
  if (chat) {
    chat.isSaved = !chat.isSaved;
    await saveChat(chat);
  }
};

export const generateChatId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 30;
  const cleaned = firstMessage.trim().replace(/\s+/g, " ");
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return `${cleaned.substring(0, maxLength)}...`;
};
