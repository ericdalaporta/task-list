import { Injectable } from '@angular/core';

/**
 coisas do indexeddb
 */

@Injectable({ providedIn: 'root' })
export class ServicoBaseDados {
  private nomeBancoDados = 'TarefasDB';
  private armazemTarefas = 'tarefas';
  private armazemCategorias = 'categorias';
  private armazemFamiliares = 'familiares';
  private bancoDados: IDBDatabase | null = null;
  private promessaBancoDadosPronto: Promise<void> | null = null;

  constructor() {} 
   
  private inicializarBancoDados(): Promise<void> {
    // se já tem uma promessa de inicialização,vai  retornar ela
    if (this.promessaBancoDadosPronto) {
      return this.promessaBancoDadosPronto;
    }

    this.promessaBancoDadosPronto = new Promise((resolve, reject) => {
      // ve se IndexedDB está disponível no navegador
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve();
        return;
      }

      const requisicao = indexedDB.open(this.nomeBancoDados, 3);

      // evento adicionado quandoo banco precisa ser atualizado
      requisicao.onupgradeneeded = (evento: any) => {
        const bd = evento.target.result;

        if (!bd.objectStoreNames.contains(this.armazemTarefas)) {
          bd.createObjectStore(this.armazemTarefas, { keyPath: 'id', autoIncrement: true });
        }
        
        if (!bd.objectStoreNames.contains(this.armazemCategorias)) {
          bd.createObjectStore(this.armazemCategorias, { keyPath: 'id' });
        }
        
        if (!bd.objectStoreNames.contains(this.armazemFamiliares)) {
          bd.createObjectStore(this.armazemFamiliares, { keyPath: 'id', autoIncrement: true });
        }
      };

      requisicao.onsuccess = (evento: any) => {
        this.bancoDados = evento.target.result;
        resolve();
      };

      // Evento acionado em caso de erro
      requisicao.onerror = () => {
        resolve();
      };
    });

    return this.promessaBancoDadosPronto;
  }

  
  private async garantirBancoDados(): Promise<IDBDatabase | null> {
    if (!this.promessaBancoDadosPronto) {
      await this.inicializarBancoDados();
    }
    await this.promessaBancoDadosPronto;
    return this.bancoDados;
  }

  async adicionarTarefa(tarefa: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      armazem.add(tarefa);
      transacao.oncomplete = () => resolve();
      // rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }

  async obterTarefas(): Promise<any[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemTarefas], 'readonly');
      const armazem = transacao.objectStore(this.armazemTarefas);
      const requisicao = armazem.getAll();
      requisicao.onsuccess = () => {
        const tarefas = requisicao.result;
        tarefas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        resolve(tarefas);
      };
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  async removerTarefa(id: number): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      armazem.delete(id);
      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
    });
  }

  async atualizarTarefa(tarefa: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      armazem.put(tarefa);
      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
    });
  }

  async salvarCategorias(categorias: string[]): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemCategorias], 'readwrite');
      const armazem = transacao.objectStore(this.armazemCategorias);
      armazem.put({ id: 1, categorias });
      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
    });
  }

  async obterCategorias(): Promise<string[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemCategorias], 'readonly');
      const armazem = transacao.objectStore(this.armazemCategorias);
      const requisicao = armazem.get(1);
      requisicao.onsuccess = () => {
        resolve(requisicao.result?.categorias || []);
      };
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  async adicionarFamiliar(familiar: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemFamiliares], 'readwrite');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      const requisicao = armazem.add(familiar);
      
      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
    });
  }

  async obterFamiliares(): Promise<any[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemFamiliares], 'readonly');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      const requisicao = armazem.getAll();
      requisicao.onsuccess = () => {
        resolve(requisicao.result);
      };
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  async removerFamiliar(id: number): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      const transacao = bd.transaction([this.armazemFamiliares], 'readwrite');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      armazem.delete(id);
      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
    });
  }
}