import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponenteBarra } from './components/sidebar/sidebar.component';
import { ComponentePrincipal } from './components/main/main.component';

// isso meio q passa a categoria selecionada do sidebar para o main filtrar tarefas
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ComponenteBarra, ComponentePrincipal],
  templateUrl: './app.component.html',
})
export class ComponenteRaiz {
  // armazena qual categoria foi selecionada no sidebar
  categoriaSelecionada: string | null = null;

  // chamado quando o sidebar emite uma categoria q selecionada
  aoCategoriaSelecionada(categoria: string | null) {
    this.categoriaSelecionada = categoria;
  }
}