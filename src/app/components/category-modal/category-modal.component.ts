import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit {
  @Input() tarefa: any;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  categoriasDisponiveis: string[] = [];
  categoriasDoItem: string[] = [];
  categoriasParaAdicionar: string[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    // puxa todas as categorias disponíveis no indexeddb
    this.categoryService.categorias$.subscribe(categorias => {
      this.categoriasDisponiveis = categorias;
      this.atualizarCategorias();
    });

    // copiar categorias atuais
    this.categoriasDoItem = [...this.tarefa.categorias];
    this.atualizarCategorias();
  }

  // handle drag and drop entre containers
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // reordena dentro do mesmo container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transferência entre containers
      if (event.container.id === 'selecionadas' && this.categoriasDoItem.length < 3) {
        // movendo para selecionadas
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.atualizarCategorias();
      } else if (event.container.id === 'disponiveis') {
        // movendo de volta para disponíveis
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.atualizarCategorias();
      }
    }
  }

  // atualizar lista de categorias disponíveis para adicionar
  atualizarCategorias() {
    this.categoriasParaAdicionar = this.categoriasDisponiveis.filter(
      cat => !this.categoriasDoItem.includes(cat)
    );
  }

  // salvar mudanças
  salvar() {
    if (this.categoriasDoItem.length === 0) {
      return;
    }

    this.tarefa.categorias = this.categoriasDoItem;
    this.onSave.emit(this.tarefa);
    this.fechar();
  }

  // fechar modal sem salvar
  fechar() {
    this.onClose.emit();
  }

  getBadgeClass(categoria: string): string {
    const classes: { [key: string]: string } = {
      'Casa': 'bg-success text-white',
      'Estudo': 'bg-warning text-white',
      'Trabalho': 'bg-primary text-white',
      'Pessoal': 'bg-danger text-white',
      'Saúde': 'bg-info text-white'
    };
    return classes[categoria] || 'bg-secondary text-white';
  }

  getCategoryColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'Casa': '#28a745',
      'Estudo': '#ffc107',
      'Trabalho': '#0d6efd',
      'Pessoal': '#dc3545',
      'Saúde': '#17a2b8'
    };
    return colors[categoria] || '#6c757d';
  }
}