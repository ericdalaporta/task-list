import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent implements OnInit {
  @Input() tarefa: any;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onEditCategories = new EventEmitter<any>(); // Novo: para abrir modal

  isEditing = false;
  editingTitle = '';

  ngOnInit() {
    this.editingTitle = this.tarefa.titulo;
  }

  toggleCompleto() {
    this.tarefa.completa = !this.tarefa.completa;
    this.onUpdate.emit(this.tarefa);
  }

  remover() {
    this.onRemove.emit(this.tarefa);
  }

  startEdit() {
    this.isEditing = true;
    this.editingTitle = this.tarefa.titulo;
  }

  saveEdit() {
    if (this.editingTitle.trim()) {
      this.tarefa.titulo = this.editingTitle.trim();
      this.isEditing = false;
      this.onUpdate.emit(this.tarefa);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingTitle = this.tarefa.titulo;
  }

  getBadgeClass(categoria: string): string {
    const classes: { [key: string]: string } = {
      'Casa': 'bg-success',
      'Estudo': 'bg-warning text-dark',
      'Trabalho': 'bg-primary',
      'Pessoal': 'bg-danger',
      'Saúde': 'bg-info text-dark'
    };
    return classes[categoria] || 'bg-secondary';
  }

  // Emitir evento para abrir modal no component pai
  abrirModalCategorias() {
    console.log('📋 Abrindo modal para editar categorias da tarefa:', this.tarefa.titulo);
    this.onEditCategories.emit(this.tarefa);
  }
}
