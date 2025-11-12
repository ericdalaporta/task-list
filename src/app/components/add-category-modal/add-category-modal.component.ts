import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-adicionar-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category-modal.component.html',
  styleUrl: './add-category-modal.component.css'
})
export class ComponenteModalAdicionarCategoria {
  @Output() aoAdicionarCategoria = new EventEmitter<string>();
  @Output() aoFechar = new EventEmitter<void>();

  nomeCategoria = '';

 
  adicionarCategoria() {
    if (!this.nomeCategoria.trim()) {
      alert('Por favor, digite um nome para a categoria!');
      return;
    }

    this.aoAdicionarCategoria.emit(this.nomeCategoria.trim());

    this.nomeCategoria = '';
    this.aoFechar.emit();
  }

  fechar() {
    this.nomeCategoria = '';
    this.aoFechar.emit();
  }
}
