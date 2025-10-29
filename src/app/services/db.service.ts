import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbName = 'TarefasDB';
  private tarefasStore = 'tarefas';
  private categoriasStore = 'categorias';
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void> | null = null;

  constructor() {}

  private initDB(): Promise<void> {
    if (this.dbReady) {
      return this.dbReady;
    }

    this.dbReady = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, 2); 

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.tarefasStore)) {
          db.createObjectStore(this.tarefasStore, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(this.categoriasStore)) {
          db.createObjectStore(this.categoriasStore, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = () => {
        resolve();
      };
    });

    return this.dbReady;
  }

  private async ensureDB(): Promise<IDBDatabase | null> {
    if (!this.dbReady) {
      await this.initDB();
    }
    await this.dbReady;
    return this.db;
  }

  async addTarefa(tarefa: any): Promise<void> {
    const db = await this.ensureDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.tarefasStore], 'readwrite');
      const store = transaction.objectStore(this.tarefasStore);
      store.add(tarefa);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTarefas(): Promise<any[]> {
    const db = await this.ensureDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.tarefasStore], 'readonly');
      const store = transaction.objectStore(this.tarefasStore);
      const request = store.getAll();
      request.onsuccess = () => {
        const tarefas = request.result;
        tarefas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        resolve(tarefas);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeTarefa(id: number): Promise<void> {
    const db = await this.ensureDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.tarefasStore], 'readwrite');
      const store = transaction.objectStore(this.tarefasStore);
      store.delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async updateTarefa(tarefa: any): Promise<void> {
    const db = await this.ensureDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.tarefasStore], 'readwrite');
      const store = transaction.objectStore(this.tarefasStore);
      store.put(tarefa);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async setCategorias(categorias: string[]): Promise<void> {
    const db = await this.ensureDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([this.categoriasStore], 'readwrite');
      const store = tx.objectStore(this.categoriasStore);
      store.put({ id: 1, categorias });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // busca o array de categorias (sempre id = 1)

  async getCategorias(): Promise<string[]> {
    const db = await this.ensureDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction([this.categoriasStore], 'readonly');
      const store = tx.objectStore(this.categoriasStore);
      const req = store.get(1);
      req.onsuccess = () => {
        resolve(req.result?.categorias || []);
      };
      req.onerror = () => reject(req.error);
    });
  }
}