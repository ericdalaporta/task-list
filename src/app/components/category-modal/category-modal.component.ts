import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ServicoCategorias } from '../../services/category.service';

/**
 * Interface que representa uma tarefa.
 */
interface Tarefa {
  id?: number;
  titulo: string;
  categorias: string[];
  completa: boolean;
  dataCriacao: string;
  ordem: number;
}

/**
 * COMPONENTE MODAL - Gerenciar Categorias de Tarefa
 * 
 * Responsabilidade: Permitir ao usuário atribuir/remover categorias de uma tarefa
 * 
 * Funcionalidades principais:
 * - Exibe duas listas: categorias disponíveis e categorias atribuídas
 * - Permite drag-and-drop entre as listas
 * - Respeita limite máximo de 3 categorias por tarefa
 * - Atualiza em tempo real enquanto usuário arrasta
 * - Persiste no banco de dados ao clicar em "Salvar"
 * 
 * Fluxo:
 * 1. Usuário abre o modal
 * 2. Componente carrega categorias disponíveis e as já atribuídas
 * 3. Usuário arrasta categorias entre as listas
 * 4. Usuário clica em "Salvar"
 * 5. Componente emite evento para pai atualizar no banco
 */
@Component({
  selector: 'app-modal-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class ComponenteModalCategorias implements OnInit {
  // Input: Tarefa cujas categorias serão editadas
  @Input() tarefa!: Tarefa;
  // Output: Emite tarefa com categorias atualizadas ao salvar
  @Output() aoSalvar = new EventEmitter<Tarefa>();
  // Output: Emite quando modal é fechado sem salvar
  @Output() aoFechar = new EventEmitter<void>();

  // Array de todas as categorias disponíveis no sistema
  categoriasDisponiveis: string[] = [];
  // Array de categorias atualmente atribuídas à tarefa (máx 3)
  categoriasAtribuidasATarefa: string[] = [];
  // Array de categorias que estão disponíveis para adicionar (não atribuídas)
  categoriasParaAdicionar: string[] = [];

  // Limite máximo de categorias que uma tarefa pode ter
  private readonly LIMITE_CATEGORIAS = 3;

  constructor(private servicoCategorias: ServicoCategorias) {}

  /**
   * Inicializa o modal com os dados da tarefa e categorias disponíveis.
   * 
   * Processo:
   * 1. Escuta mudanças em categorias globais do sistema
   * 2. Copia as categorias atuais da tarefa para edição
   * 3. Calcula categorias que podem ser adicionadas
   */
  ngOnInit() {
    // Escuta mudanças nas categorias disponíveis no sistema
    this.servicoCategorias.categorias$.subscribe(categorias => {
      this.categoriasDisponiveis = categorias;
      // Atualiza a lista de categorias que podem ser adicionadas
      this.atualizarCategoriasDisponiveis();
    });

    // Cria uma cópia das categorias atuais para não modificar original antes de salvar
    this.categoriasAtribuidasATarefa = [...this.tarefa.categorias];
    // Calcula quais categorias estão disponíveis para adicionar
    this.atualizarCategoriasDisponiveis();
  }

  /**
   * Manipulador de eventos de drag-and-drop.
   * 
   * Permite:
   * - Mover categorias de disponíveis para atribuídas
   * - Mover categorias de atribuídas para disponíveis
   * - Reordenar dentro do mesmo container
   * 
   * Respeita limite de 3 categorias por tarefa.
   * 
   * @param evento - Evento CDK DragDrop com informações do movimento
   */
  aoSoltarCategoria(evento: CdkDragDrop<string[]>) {
    // Se está reordenando dentro do mesmo container
    if (evento.previousContainer === evento.container) {
      moveItemInArray(evento.container.data, evento.previousIndex, evento.currentIndex);
    } else {
      // Se está movendo para a lista de selecionadas
      if (evento.container.id === 'selecionadas' && this.categoriasAtribuidasATarefa.length < this.LIMITE_CATEGORIAS) {
        // Transfere a categoria
        transferArrayItem(
          evento.previousContainer.data,
          evento.container.data,
          evento.previousIndex,
          evento.currentIndex
        );
        // Recalcula categorias disponíveis
        this.atualizarCategoriasDisponiveis();
      } else if (evento.container.id === 'disponiveis') {
        // Se está movendo de volta para disponíveis
        transferArrayItem(
          evento.previousContainer.data,
          evento.container.data,
          evento.previousIndex,
          evento.currentIndex
        );
        // Recalcula categorias disponíveis
        this.atualizarCategoriasDisponiveis();
      }
    }
  }

  /**
   * Recalcula quais categorias estão disponíveis para serem adicionadas.
   * 
   * Lógica:
   * - Pega todas as categorias do sistema
   * - Remove as que já estão atribuídas à tarefa
   * - Armazena o resultado em categoriasParaAdicionar
   * 
   * Chamado sempre que as listas de categorias mudam.
   */
  atualizarCategoriasDisponiveis() {
    this.categoriasParaAdicionar = this.categoriasDisponiveis.filter(
      categoria => !this.categoriasAtribuidasATarefa.includes(categoria)
    );
  }

  /**
   * Salva as mudanças nas categorias da tarefa.
   * 
   * Validações:
   * - Tarefa deve ter pelo menos uma categoria
   * 
   * Processo:
   * 1. Valida que há categorias selecionadas
   * 2. Atualiza a tarefa com as novas categorias
   * 3. Emite evento para o componente pai
   * 4. Componente pai salva no banco de dados
   */
  salvar() {
    // Valida que a tarefa tem pelo menos uma categoria
    if (this.categoriasAtribuidasATarefa.length === 0) {
      return;
    }

    // Atualiza as categorias da tarefa
    this.tarefa.categorias = [...this.categoriasAtribuidasATarefa];
    // Emite para o componente pai atualizar no banco
    this.aoSalvar.emit(this.tarefa);
  }

  /**
   * Fecha o modal sem salvar as mudanças.
   */
  fechar() {
    this.aoFechar.emit();
  }

  /**
   * Retorna a cor hex para uma categoria específica.
   * Usada para estilizar badges no modal com cores dinâmicas.
   * @param categoria - Nome da categoria
   * @returns string - Código hexadecimal da cor
   */
  obterCorCategoria(categoria: string): string {
    // Mapeamento de categorias para cores hexadecimais
    const mapeamentoCores: { [key: string]: string } = {
      'Casa': '#28a745',
      'Estudo': '#ffc107',
      'Trabalho': '#0d6efd',
      'Pessoal': '#dc3545',
      'Saúde': '#17a2b8'
    };
    // Retorna a cor da categoria ou uma cor padrão (cinza)
    return mapeamentoCores[categoria] || '#6c757d';
  }
}