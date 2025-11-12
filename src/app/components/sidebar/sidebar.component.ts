import { Component, Output, EventEmitter } from '@angular/core';

/**
 * COMPONENTE SIDEBAR - Barra de Categorias
 * 
 * Responsabilidade: Exibir as categorias disponíveis como filtros
 * 
 * Funcionalidades:
 * - Exibe lista de categorias padrão (Casa, Estudo, Trabalho, Pessoal, Saúde)
 * - Exibe opção especial "Categorias" para filtrar customizadas
 * - Exibe opção "Todas" para remover filtro
 * - Emite evento quando categoria é selecionada
 * - Permite que o componente pai atualize as tarefas exibidas
 */
@Component({
  selector: 'app-barra',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class ComponenteBarra {
  // Emite evento quando usuário seleciona uma categoria para filtrar
  @Output() aoCategoriaSelecionada = new EventEmitter<string | null>();

  /**
   * Emite um evento contendo a categoria selecionada.
   * O componente pai (app-root) intercepta este evento e filtra as tarefas.
   * 
   * @param categoria - Nome da categoria selecionada, ou null para mostrar todas
   */
  selecionarCategoria(categoria: string | null) {
    this.aoCategoriaSelecionada.emit(categoria);
  }
}
