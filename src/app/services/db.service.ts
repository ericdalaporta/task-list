import { Injectable } from '@angular/core';

/**
 * Serviço responsável por gerenciar todas as operações de banco de dados IndexedDB.
 * Centraliza a lógica de persistência de tarefas e categorias.
 */
@Injectable({ providedIn: 'root' })
export class ServicoBaseDados {
  // Nome do banco de dados IndexedDB
  private nomeBancoDados = 'TarefasDB';
  // Nome da tabela (object store) de tarefas
  private armazemTarefas = 'tarefas';
  // Nome da tabela (object store) de categorias
  private armazemCategorias = 'categorias';
  // Nome da tabela (object store) de familiares
  private armazemFamiliares = 'familiares';
  // Instância do banco de dados IndexedDB
  private bancoDados: IDBDatabase | null = null;
  // Promise que garante que o banco de dados está pronto
  private promessaBancoDadosPronto: Promise<void> | null = null;

  constructor() {}

  /**
   * Inicializa o banco de dados IndexedDB.
   * Cria os object stores necessários se não existirem.
   * @returns Promise<void> - Promise que resolve quando o banco está pronto
   */
  private inicializarBancoDados(): Promise<void> {
    // Se já existe uma promessa de inicialização, retorna ela
    if (this.promessaBancoDadosPronto) {
      return this.promessaBancoDadosPronto;
    }

    this.promessaBancoDadosPronto = new Promise((resolve, reject) => {
      // Verifica se IndexedDB está disponível no navegador
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve();
        return;
      }

      // Abre o banco de dados (versão 3 - para garantir recriação dos object stores)
      const requisicao = indexedDB.open(this.nomeBancoDados, 3);

      // Evento acionado quando o banco precisa ser atualizado
      requisicao.onupgradeneeded = (evento: any) => {
        const bd = evento.target.result;
        // Cria a tabela de tarefas se não existir
        if (!bd.objectStoreNames.contains(this.armazemTarefas)) {
          bd.createObjectStore(this.armazemTarefas, { keyPath: 'id', autoIncrement: true });
        }
        // Cria a tabela de categorias se não existir
        if (!bd.objectStoreNames.contains(this.armazemCategorias)) {
          bd.createObjectStore(this.armazemCategorias, { keyPath: 'id' });
        }
        // Cria a tabela de familiares se não existir
        if (!bd.objectStoreNames.contains(this.armazemFamiliares)) {
          bd.createObjectStore(this.armazemFamiliares, { keyPath: 'id', autoIncrement: true });
        }
      };

      // Evento acionado quando o banco é aberto com sucesso
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

  /**
   * Garante que o banco de dados está pronto para uso.
   * Aguarda a inicialização se ainda não foi feita.
   * @returns Promise<IDBDatabase | null> - Instância do banco de dados
   */
  private async garantirBancoDados(): Promise<IDBDatabase | null> {
    if (!this.promessaBancoDadosPronto) {
      await this.inicializarBancoDados();
    }
    await this.promessaBancoDadosPronto;
    return this.bancoDados;
  }

  /**
   * Adiciona uma nova tarefa ao banco de dados.
   * @param tarefa - Objeto contendo os dados da tarefa
   * @returns Promise<void> - Promise que resolve quando a tarefa é adicionada
   */
  async adicionarTarefa(tarefa: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      // Adiciona a tarefa
      armazem.add(tarefa);
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }

  /**
   * Recupera todas as tarefas do banco de dados.
   * As tarefas são ordenadas pelo campo 'ordem'.
   * @returns Promise<any[]> - Promise com array de tarefas
   */
  async obterTarefas(): Promise<any[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      // Inicia uma transação de leitura
      const transacao = bd.transaction([this.armazemTarefas], 'readonly');
      const armazem = transacao.objectStore(this.armazemTarefas);
      // Obtém todas as tarefas
      const requisicao = armazem.getAll();
      requisicao.onsuccess = () => {
        const tarefas = requisicao.result;
        // Ordena as tarefas por ordem
        tarefas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        resolve(tarefas);
      };
      // Rejeita em caso de erro
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  /**
   * Remove uma tarefa do banco de dados.
   * @param id - ID da tarefa a remover
   * @returns Promise<void> - Promise que resolve quando a tarefa é removida
   */
  async removerTarefa(id: number): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      // Remove a tarefa pelo ID
      armazem.delete(id);
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }

  /**
   * Atualiza uma tarefa existente no banco de dados.
   * @param tarefa - Objeto tarefa com os dados atualizados
   * @returns Promise<void> - Promise que resolve quando a tarefa é atualizada
   */
  async atualizarTarefa(tarefa: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemTarefas], 'readwrite');
      const armazem = transacao.objectStore(this.armazemTarefas);
      // Atualiza a tarefa (ou cria se não existir)
      armazem.put(tarefa);
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }

  /**
   * Salva o array de categorias no banco de dados.
   * Sempre usa ID 1 para armazenar o array completo.
   * @param categorias - Array de nomes de categorias
   * @returns Promise<void> - Promise que resolve quando as categorias são salvas
   */
  async salvarCategorias(categorias: string[]): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemCategorias], 'readwrite');
      const armazem = transacao.objectStore(this.armazemCategorias);
      // Salva ou atualiza o array de categorias com ID 1
      armazem.put({ id: 1, categorias });
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }

  /**
   * Recupera o array de categorias do banco de dados.
   * Busca sempre o registro com ID 1.
   * @returns Promise<string[]> - Promise com array de categorias
   */
  async obterCategorias(): Promise<string[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      // Inicia uma transação de leitura
      const transacao = bd.transaction([this.armazemCategorias], 'readonly');
      const armazem = transacao.objectStore(this.armazemCategorias);
      // Obtém o registro de categorias com ID 1
      const requisicao = armazem.get(1);
      requisicao.onsuccess = () => {
        // Retorna o array de categorias ou um array vazio se não existir
        resolve(requisicao.result?.categorias || []);
      };
      // Rejeita em caso de erro
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  /**
   * Adiciona um novo familiar ao banco de dados.
   * @param familiar - Objeto contendo os dados do familiar
   * @returns Promise<void> - Promise que resolve quando o familiar é adicionado
   */
  async adicionarFamiliar(familiar: any): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemFamiliares], 'readwrite');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      // Adiciona o familiar
      const requisicao = armazem.add(familiar);
      
      // Handler para sucesso da requisição
      requisicao.onsuccess = () => {
        console.log('✅ Familiar adicionado com ID:', requisicao.result);
      };
      
      // Handler para erro da requisição
      requisicao.onerror = () => {
        console.error('❌ Erro ao adicionar familiar:', requisicao.error);
        reject(requisicao.error);
      };
      
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro na transação
      transacao.onerror = () => reject(transacao.error);
    });
  }

  /**
   * Recupera todos os familiares do banco de dados.
   * @returns Promise<any[]> - Promise com array de familiares
   */
  async obterFamiliares(): Promise<any[]> {
    const bd = await this.garantirBancoDados();
    if (!bd) return [];
    return new Promise((resolve, reject) => {
      // Inicia uma transação de leitura
      const transacao = bd.transaction([this.armazemFamiliares], 'readonly');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      // Obtém todos os familiares
      const requisicao = armazem.getAll();
      requisicao.onsuccess = () => {
        resolve(requisicao.result);
      };
      // Rejeita em caso de erro
      requisicao.onerror = () => reject(requisicao.error);
    });
  }

  /**
   * Remove um familiar do banco de dados.
   * @param id - ID do familiar a remover
   * @returns Promise<void> - Promise que resolve quando o familiar é removido
   */
  async removerFamiliar(id: number): Promise<void> {
    const bd = await this.garantirBancoDados();
    if (!bd) return;
    return new Promise((resolve, reject) => {
      // Inicia uma transação para escrita
      const transacao = bd.transaction([this.armazemFamiliares], 'readwrite');
      const armazem = transacao.objectStore(this.armazemFamiliares);
      // Remove o familiar pelo ID
      armazem.delete(id);
      // Resolve quando a transação completa
      transacao.oncomplete = () => resolve();
      // Rejeita em caso de erro
      transacao.onerror = () => reject(transacao.error);
    });
  }
}