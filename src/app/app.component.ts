import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponenteBarra } from './components/sidebar/sidebar.component';
import { ComponentePrincipal } from './components/main/main.component';

/**
 * COMPONENTE RAIZ - App Component
 * 
 * Responsabilidade: Gerenciar o layout principal da aplicação
 * - Exibe a sidebar (filtros de categorias)
 * - Exibe o componente principal (lista de tarefas)
 * - Coordena a comunicação entre estes dois componentes
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ComponenteBarra, ComponentePrincipal],
  templateUrl: './app.component.html',
})
export class ComponenteRaiz {
  // Armazena a categoria atualmente selecionada na sidebar (null = mostrar todas)
  categoriaSelecionada: string | null = null;

  /**
   * Handler chamado quando usuário clica em uma categoria na sidebar.
   * Atualiza a categoria selecionada, filtrando as tarefas exibidas.
   * 
   * @param categoria - Nome da categoria selecionada ou null para mostrar todas
   */
  aoCategoriaSelecionada(categoria: string | null) {
    this.categoriaSelecionada = categoria;
  }
}

