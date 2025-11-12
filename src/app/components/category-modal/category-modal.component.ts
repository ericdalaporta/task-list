import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ServicoCategorias } from '../../services/category.service';

interface Tarefa {
  id?: number;
  titulo: string;
  categorias: string[];
  completa: boolean;
  dataCriacao: string;
  ordem: number;
}

@Component({
  selector: 'app-modal-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class ComponenteModalCategorias implements OnInit {
  @Input() tarefa!: Tarefa;
  @Output() aoSalvar = new EventEmitter<Tarefa>();
  @Output() aoFechar = new EventEmitter<void>();

  categoriasDisponiveis: string[] = [];
  categoriasAtribuidasATarefa: string[] = [];
  categoriasParaAdicionar: string[] = [];

  private readonly LIMITE_CATEGORIAS = 3;

  constructor(private servicoCategorias: ServicoCategorias) {}

 
  ngOnInit() {
    this.servicoCategorias.categorias$.subscribe(categorias => {
      this.categoriasDisponiveis = categorias;
      this.atualizarCategoriasDisponiveis();
    });

    this.categoriasAtribuidasATarefa = [...this.tarefa.categorias];
    this.atualizarCategoriasDisponiveis();
  }

  aoSoltarCategoria(evento: CdkDragDrop<string[]>) {
    if (evento.previousContainer === evento.container) {
      moveItemInArray(evento.container.data, evento.previousIndex, evento.currentIndex);
    } else {
      if (evento.container.id === 'selecionadas' && this.categoriasAtribuidasATarefa.length < this.LIMITE_CATEGORIAS) {
        transferArrayItem(
          evento.previousContainer.data,
          evento.container.data,
          evento.previousIndex,
          evento.currentIndex
        );
        this.atualizarCategoriasDisponiveis();
      } else if (evento.container.id === 'disponiveis') {
        transferArrayItem(
          evento.previousContainer.data,
          evento.container.data,
          evento.previousIndex,
          evento.currentIndex
        );
        this.atualizarCategoriasDisponiveis();
      }
    }
  }

  
  atualizarCategoriasDisponiveis() {
    this.categoriasParaAdicionar = this.categoriasDisponiveis.filter(
      categoria => !this.categoriasAtribuidasATarefa.includes(categoria)
    );
  }

  salvar() {
    if (this.categoriasAtribuidasATarefa.length === 0) {
      return;
    }

    this.tarefa.categorias = [...this.categoriasAtribuidasATarefa];
    this.aoSalvar.emit(this.tarefa);
  }

 
  fechar() {
    this.aoFechar.emit();
  }


  obterCorCategoria(categoria: string): string {
    const mapeamentoCores: { [key: string]: string } = {
      'Casa': '#28a745',
      'Estudo': '#ffc107',
      'Trabalho': '#0d6efd',
      'Pessoal': '#dc3545',
      'Saúde': '#17a2b8'
    };
    return mapeamentoCores[categoria] || '#6c757d';
  }
}