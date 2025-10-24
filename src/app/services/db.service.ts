import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbName = 'TarefasDB';
  private storeName = 'tarefas';
  private db!: IDBDatabase;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.openDB();
    }
  }

  private openDB() {
    const request = indexedDB.open(this.dbName, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event: any) => {
      this.db = event.target.result;
    };
  }

  addTarefa(tarefa: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.add(tarefa);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  getTarefas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  removeTarefa(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}