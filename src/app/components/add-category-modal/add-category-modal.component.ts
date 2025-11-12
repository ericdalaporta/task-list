import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * COMPONENTE MODAL - Adicionar Categoria
 * 
 * Responsabilidade: Permitir ao usuário criar uma nova categoria customizada
 * 
 * Funcionalidades:
 * - Input para inserir nome da nova categoria
 * - Valida que o nome não está vazio
 * - Emite evento com o nome da categoria para o componente pai
 * - Permite fechar sem adicionar
 */
@Component({
  selector: 'app-modal-adicionar-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category-modal.component.html',
  styleUrl: './add-category-modal.component.css'
})
export class ComponenteModalAdicionarCategoria {
  // Emite o nome da nova categoria quando é adicionada
  @Output() aoAdicionarCategoria = new EventEmitter<string>();
  // Emite evento quando o modal deve ser fechado
  @Output() aoFechar = new EventEmitter<void>();

  // Armazena o nome da categoria sendo digitada
  nomeCategoria = '';

  /**
   * Valida e adiciona a nova categoria.
   * 
   * Processo:
   * 1. Valida que o nome não está vazio
   * 2. Emite evento com o nome para o componente pai processar
   * 3. Limpa o formulário
   * 4. Fecha o modal
   */
  adicionarCategoria() {
    // Valida entrada
    if (!this.nomeCategoria.trim()) {
      alert('Por favor, digite um nome para a categoria!');
      return;
    }

    // Emite o nome da categoria para o componente pai
    this.aoAdicionarCategoria.emit(this.nomeCategoria.trim());

    // Limpa e fecha
    this.nomeCategoria = '';
    this.aoFechar.emit();
  }

  /**
   * Fecha o modal sem adicionar categoria.
   */
  fechar() {
    this.nomeCategoria = '';
    this.aoFechar.emit();
  }
}
