import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarComponent {
  categorias = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
  categoriaSelecionada = '';

  @Output() categoriaChange = new EventEmitter<string>();

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.categoriaChange.emit(categoria);
  }
}