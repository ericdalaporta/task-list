import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServicoBaseDados } from './db.service';

/**
 * Serviço responsável por gerenciar categorias de tarefas.
 * Mantém um estado centralizado das categorias e sincroniza com o IndexedDB.
 * Inicializa com categorias padrão se nenhuma for encontrada.
 */
@Injectable({
  providedIn: 'root'
})
export class ServicoCategorias {
  // Subject que mantém o estado reativo das categorias
  private assuntoCategorias: BehaviorSubject<string[]>;
  // Observable público para que componentes se inscrevam nas mudanças de categorias
  public categorias$: Observable<string[]>;

  // Array de categorias padrão do sistema
  private readonly CATEGORIAS_PADRAO = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];

  constructor(private servicoBaseDados: ServicoBaseDados) {
    // Inicializa o Subject com um array vazio
    this.assuntoCategorias = new BehaviorSubject<string[]>([]);
    // Expõe o Observable para consumo dos componentes
    this.categorias$ = this.assuntoCategorias.asObservable();
    // Carrega as categorias do banco de dados
    this.carregarCategorias();
  }

  /**
   * Carrega as categorias do IndexedDB.
   * Se nenhuma categoria for encontrada, carrega as categorias padrão.
   * Método privado chamado automaticamente no construtor.
   */
  private async carregarCategorias() {
    // Obtém as categorias do banco de dados
    let categorias = await this.servicoBaseDados.obterCategorias?.();
    // Se não houver categorias salvas, usa as categorias padrão
    if (!categorias || categorias.length === 0) {
      categorias = this.CATEGORIAS_PADRAO;
      // Salva as categorias padrão no banco de dados
      await this.servicoBaseDados.salvarCategorias?.(categorias);
    }
    // Atualiza o Subject com as categorias carregadas
    this.assuntoCategorias.next(categorias);
  }

  /**
   * Retorna o array atual de categorias.
   * Usa o valor armazenado no Subject.
   * @returns string[] - Array com todas as categorias
   */
  obterCategorias(): string[] {
    return this.assuntoCategorias.value;
  }

  /**
   * Adiciona uma nova categoria ao sistema.
   * Verifica se a categoria já existe antes de adicionar.
   * Atualiza o banco de dados e notifica os observadores.
   * @param categoria - Nome da categoria a adicionar
   */
  async adicionarCategoria(categoria: string) {
    const categorias = this.assuntoCategorias.value;
    // Verifica se a categoria já existe
    if (!categorias.includes(categoria)) {
      // Cria um novo array com a nova categoria
      const novasCategorias = [...categorias, categoria];
      // Salva no banco de dados
      await this.servicoBaseDados.salvarCategorias?.(novasCategorias);
      // Atualiza o Subject para notificar todos os observadores
      this.assuntoCategorias.next(novasCategorias);
    }
  }

  /**
   * Remove uma categoria do sistema.
   * Filtra o array para remover a categoria especificada.
   * Atualiza o banco de dados e notifica os observadores.
   * @param categoria - Nome da categoria a remover
   */
  async removerCategoria(categoria: string) {
    // Cria um novo array sem a categoria especificada
    const categorias = this.assuntoCategorias.value.filter(c => c !== categoria);
    // Salva no banco de dados
    await this.servicoBaseDados.salvarCategorias?.(categorias);
    // Atualiza o Subject para notificar todos os observadores
    this.assuntoCategorias.next(categorias);
  }

  /**
   * Reordena as categorias no sistema.
   * Útil para aplicar mudanças de ordem após drag and drop.
   * Atualiza o banco de dados e notifica os observadores.
   * @param categorias - Array de categorias na nova ordem
   */
  async reordenarCategorias(categorias: string[]) {
    // Salva a nova ordem no banco de dados
    await this.servicoBaseDados.salvarCategorias?.(categorias);
    // Atualiza o Subject para notificar todos os observadores
    this.assuntoCategorias.next(categorias);
  }
}