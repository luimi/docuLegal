// chatbotCtrl.ts

/**
 * Interfaz para definir la estructura de un mensaje de chat.
 */
export interface ChatbotMessage {
  id: string; // ID único del mensaje (ej. UUID)
  text: string; // Contenido del mensaje
  role: 'user' | 'model' | 'lawyer'; // Rol del remitente (usuario, bot, sistema)
  dateTime: string; // Fecha y hora del mensaje en formato ISO (ej. new Date().toISOString())
  documentId: string | null; // ID del documento o conversación a la que pertenece el mensaje (opcional)
  order: number; // Actúa como un auto incremental para el orden
}

/**
 * Nombre de la base de datos IndexedDB.
 */
const DB_NAME = 'ChatbotDB';
/**
 * Versión de la base de datos (se incrementa para actualizaciones de esquema).
 */
const DB_VERSION = 1; // Incrementa esta versión si cambias la estructura del Object Store
/**
 * Nombre del almacén de objetos para los mensajes.
 */
const STORE_NAME = 'ChatbotMessages';
/**
 * Clave para almacenar el último valor de 'order' en localStorage.
 * Esto asegura que 'order' siga incrementándose entre sesiones del navegador.
 */
const LAST_ORDER_KEY = 'lastChatOrder';


/**
 * Clase para gestionar las operaciones de mensajes de chat en IndexedDB.
 */
export class ChatbotCtrl {
  private db: IDBDatabase | null = null;
  private currentOrder: number = 0; // Contador interno para 'order'

  constructor() {
    // Recuperar el último orden persistido al iniciar el controlador
    const storedOrder = localStorage.getItem(LAST_ORDER_KEY);
    if (storedOrder) {
      this.currentOrder = parseInt(storedOrder, 10);
    }
    this.openDB(); // Abre la base de datos al instanciar el controlador
  }

  /**
   * Abre la base de datos IndexedDB. Si no existe, la crea.
   * Si la versión es nueva, actualiza el esquema (crea el Object Store y sus índices).
   * @returns {Promise<void>} Una promesa que se resuelve cuando la base de datos está lista.
   */
  private async openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(); // La base de datos ya está abierta, no hacemos nada
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // Crea el Object Store. 'id' es el keyPath principal.
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          // Crea un índice sobre el campo 'order' para ordenar fácilmente los mensajes.
          objectStore.createIndex('order', 'order', { unique: false });
          console.log(`IndexedDB: Object Store '${STORE_NAME}' creado/actualizado.`);
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log(`IndexedDB: Base de datos '${DB_NAME}' abierta con éxito.`);
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB: Error al abrir la base de datos:', (event.target as IDBOpenDBRequest).error);
        reject('Error al abrir la base de datos.');
      };
    });
  }

  /**
   * Obtiene una transacción de IndexedDB para el Object Store de mensajes.
   * @param {IDBTransactionMode} mode El modo de la transacción ('readonly' o 'readwrite').
   * @returns {IDBObjectStore | null} El Object Store o `null` si la DB no está abierta.
   */
  private getObjectStore(mode: IDBTransactionMode): IDBObjectStore | null {
    if (!this.db) {
      console.error('IndexedDB: La base de datos no está abierta.');
      return null;
    }
    const transaction = this.db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  /**
   * Crea (añade) un nuevo mensaje de chat en la base de datos.
   * Asigna automáticamente el valor 'order' y lo incrementa para futuras llamadas.
   * @param {Omit<ChatbotMessage, 'order'>} message El objeto ChatbotMessage (sin 'order') a añadir.
   * @returns {Promise<ChatbotMessage>} Una promesa que se resuelve con el mensaje añadido, incluyendo su 'order'.
   */
  public async createMessage(message: Omit<ChatbotMessage, 'order'>): Promise<ChatbotMessage> {
    await this.openDB(); // Asegura que la DB esté abierta antes de cualquier operación
    const objectStore = this.getObjectStore('readwrite');
    if (!objectStore) throw new Error('IndexedDB: No se pudo acceder al Object Store.');

    // Incrementar el contador de orden y asignarlo al mensaje
    this.currentOrder++;
    const messageWithOrder: ChatbotMessage = { ...message, order: this.currentOrder };

    // Persistir el último orden en localStorage para futuras sesiones
    localStorage.setItem(LAST_ORDER_KEY, this.currentOrder.toString());

    return new Promise((resolve, reject) => {
      const request = objectStore.add(messageWithOrder);
      request.onsuccess = () => {
        console.log('IndexedDB: Mensaje añadido con éxito:', messageWithOrder.id, 'Orden:', messageWithOrder.order);
        resolve(messageWithOrder);
      };
      request.onerror = (event) => {
        console.error('IndexedDB: Error al añadir mensaje:', (event.target as IDBRequest).error);
        reject('Error al añadir mensaje.');
      };
    });
  }

  /**
   * Lee (recupera) todos los mensajes de la base de datos, ordenados por el campo 'order'.
   * @returns {Promise<ChatbotMessage[]>} Una promesa que se resuelve con un array de todos los mensajes.
   */
  public async readAllMessages(): Promise<ChatbotMessage[]> {
    await this.openDB();
    const objectStore = this.getObjectStore('readonly');
    if (!objectStore) throw new Error('IndexedDB: No se pudo acceder al Object Store.');

    return new Promise((resolve, reject) => {
      const messages: ChatbotMessage[] = [];
      const index = objectStore.index('order'); // Accede al índice 'order'

      // Abre un cursor para recorrer todos los elementos del índice en orden ascendente ('next')
      const request = index.openCursor(null, 'next');

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          messages.push(cursor.value as ChatbotMessage);
          cursor.continue(); // Mover al siguiente elemento
        } else {
          // No hay más elementos, el cursor ha terminado
          resolve(messages);
        }
      };

      request.onerror = (event) => {
        console.error('IndexedDB: Error al leer todos los mensajes:', (event.target as IDBRequest).error);
        reject('Error al leer todos los mensajes.');
      };
    });
  }

  /**
   * Elimina todos los mensajes del Object Store.
   * Restablece el contador 'order' a 0.
   * @returns {Promise<void>} Una promesa que se resuelve cuando todos los mensajes han sido eliminados.
   */
  public async deleteAllMessages(): Promise<void> {
    await this.openDB();
    const objectStore = this.getObjectStore('readwrite');
    if (!objectStore) throw new Error('IndexedDB: No se pudo acceder al Object Store.');

    return new Promise((resolve, reject) => {
      const request = objectStore.clear(); // Borra todos los objetos del Object Store
      request.onsuccess = () => {
        this.currentOrder = 0; // Restablece el contador de orden
        localStorage.setItem(LAST_ORDER_KEY, '0'); // Persiste el restablecimiento
        console.log('IndexedDB: Todos los mensajes han sido eliminados.');
        resolve();
      };
      request.onerror = (event) => {
        console.error('IndexedDB: Error al eliminar todos los mensajes:', (event.target as IDBRequest).error);
        reject('Error al eliminar todos los mensajes.');
      };
    });
  }

  /**
   * Cierra la conexión a la base de datos IndexedDB.
   */
  public closeDB(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log(`IndexedDB: Base de datos '${DB_NAME}' cerrada.`);
    }
  }
}