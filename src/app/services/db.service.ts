import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbName = 'TarefasDB';
  private tarefasStore = 'tarefas';
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void> | null = null;

  constructor() {}

  private initDB(): Promise<void> {
    // Se já foi inicializado, retorna a promise anterior
    if (this.dbReady) {
      return this.dbReady;
    }

    this.dbReady = new Promise((resolve, reject) => {
      // Verifica se estamos em ambiente de browser
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve(); // Resolve mesmo sem IndexedDB para não quebrar a app
        return;
      }

      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.tarefasStore)) {
          db.createObjectStore(this.tarefasStore, { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };
      
      request.onerror = () => {
        resolve(); // Resolve mesmo com erro para não quebrar a app
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
    try {
      const db = await this.ensureDB();
      if (!db) {
        return;
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tarefasStore], 'readwrite');
        const store = transaction.objectStore(this.tarefasStore);
        const addRequest = store.add(tarefa);
        
        transaction.oncomplete = () => {
          resolve();
        };
        transaction.onerror = () => {
          console.error('Erro na transação:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  }

  async getTarefas(): Promise<any[]> {
    try {
      const db = await this.ensureDB();
      if (!db) {
        return [];
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tarefasStore], 'readonly');
        const store = transaction.objectStore(this.tarefasStore);
        const request = store.getAll();
        request.onsuccess = () => {
          const tarefas = request.result;
          // Ordenar por campo 'ordem' se existir
          tarefas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
          resolve(tarefas);
        };
        request.onerror = () => {
          console.error('Erro ao recuperar tarefas:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  }

  async removeTarefa(id: number): Promise<void> {
    try {
      const db = await this.ensureDB();
      if (!db) {
        return;
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tarefasStore], 'readwrite');
        const store = transaction.objectStore(this.tarefasStore);
        const deleteRequest = store.delete(id);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Erro ao deletar tarefa:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      throw error;
    }
  }

  async updateTarefa(tarefa: any): Promise<void> {
    try {
      const db = await this.ensureDB();
      if (!db) {
        return;
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tarefasStore], 'readwrite');
        const store = transaction.objectStore(this.tarefasStore);
        const updateRequest = store.put(tarefa);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Erro ao atualizar tarefa:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }
}