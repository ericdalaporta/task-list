import { Injectable } from '@angular/core';
import { CONFIG_BANCO_DADOS, CONFIG_ARMAZEM } from '../shared/constants';

@Injectable({ providedIn: 'root' })
export class ServicoBaseDados {
  private bancoDados: IDBDatabase | null = null;
  
  // evita inicializar mt vezes
  private promessaBancoDadosPronto: Promise<void> | null = null;

  constructor() {}

  private inicializarBancoDados(): Promise<void> {
    if (this.promessaBancoDadosPronto) return this.promessaBancoDadosPronto; // retorna se ja inicializou

    this.promessaBancoDadosPronto = new Promise((resolve) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve();
        return;
      }

      const req = indexedDB.open(CONFIG_BANCO_DADOS.nome, CONFIG_BANCO_DADOS.versao);
      req.onupgradeneeded = (evt: any) => this.criarArmazens(evt.target.result);
      req.onsuccess = (evt: any) => {
        this.bancoDados = evt.target.result;
        resolve();
      };
      req.onerror = () => resolve();
    });

    return this.promessaBancoDadosPronto;
  }

  // aqui cria os armazéns que sao tabelas dentro do db
  private criarArmazens(bd: IDBDatabase): void {
    const config = [
      { nome: CONFIG_ARMAZEM.tarefas, opts: { keyPath: 'id', autoIncrement: true } },
      { nome: CONFIG_ARMAZEM.categorias, opts: { keyPath: 'id' } },
      { nome: CONFIG_ARMAZEM.usuarios, opts: { keyPath: 'id', autoIncrement: true } }
    ];
    config.forEach(({ nome, opts }) => {
      if (!bd.objectStoreNames.contains(nome)) bd.createObjectStore(nome, opts);
    });
  }

  
  private async garantirBancoDados(): Promise<IDBDatabase | null> {
    if (!this.promessaBancoDadosPronto) await this.inicializarBancoDados();
    await this.promessaBancoDadosPronto;
    return this.bancoDados;
  }

  private async executar<T>(armazem: string, modo: 'readwrite' | 'readonly', 
    op: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const bd = await this.garantirBancoDados();
    if (!bd) throw new Error('BD não disponível');
    return new Promise((resolve, reject) => {
      const tx = bd.transaction([armazem], modo);
      const store = tx.objectStore(armazem);
      const req = op(store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(tx.error);
    });
  }


  // add nova tarefa
  async adicionarTarefa(tarefa: any): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.tarefas, 'readwrite', store => store.add(tarefa));
  }

  // busca tarefas e ordem
  async obterTarefas(): Promise<any[]> {
    const tarefas = await this.executar(CONFIG_ARMAZEM.tarefas, 'readonly', store => store.getAll());
    // Ordena pela propriedade 'ordem'
    return tarefas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  }

  // remove usando o id
  async removerTarefa(id: number): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.tarefas, 'readwrite', store => store.delete(id));
  }

  // atualiza
  async atualizarTarefa(tarefa: any): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.tarefas, 'readwrite', store => store.put(tarefa));
  }

  // salva as categorias
  async salvarCategorias(categorias: string[]): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.categorias, 'readwrite', store =>
      store.put({ id: 1, categorias })
    );
  }

  // busca as cat salvas
  async obterCategorias(): Promise<string[]> {
    const resultado = await this.executar(CONFIG_ARMAZEM.categorias, 'readonly', store => store.get(1));
    return resultado?.categorias || [];
  }

  // Usuarios
  async adicionarUsuario(usuario: any): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.usuarios, 'readwrite', store => store.add(usuario));
  }

  async obterUsuarios(): Promise<any[]> {
    return await this.executar(CONFIG_ARMAZEM.usuarios, 'readonly', store => store.getAll());
  }

  async removerUsuario(id: number): Promise<void> {
    await this.executar(CONFIG_ARMAZEM.usuarios, 'readwrite', store => store.delete(id));
  }

}