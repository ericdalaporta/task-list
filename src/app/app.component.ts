import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponenteBarra } from './components/sidebar/sidebar.component';
import { ComponentePrincipal } from './components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ComponenteBarra, ComponentePrincipal],
  templateUrl: './app.component.html',
})
export class ComponenteRaiz {
  // faz a comunicação entre side e a parte principal das tarefas e tals
  categoriaSelecionada: string | null = null;

  aoCategoriaSelecionada(categoria: string | null) {
    this.categoriaSelecionada = categoria;
  }
}