import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ServicoCategorias } from '../../services/category.service';
import { obterCorCategoria } from '../../shared/formatters';
import { LIMITES } from '../../shared/constants';

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
  // Categorias atribuídas na tarefa atual:
  categoriasAtribuidasATarefa: string[] = [];
  categoriasParaAdicionar: string[] = [];

  constructor(private servicoCategorias: ServicoCategorias) { }

  ngOnInit(): void {
    this.servicoCategorias.categorias$.subscribe(categorias => {
      this.categoriasDisponiveis = categorias;
      this.atualizarCategoriasDisponiveis();
    });
    this.categoriasAtribuidasATarefa = [...this.tarefa.categorias];
    this.atualizarCategoriasDisponiveis();
  }

  // manipula o drag-and-drop entre as listas
  aoSoltarCategoria(evento: CdkDragDrop<string[]>): void {
    // se reordena
    if (evento.previousContainer === evento.container) {
      moveItemInArray(evento.container.data, evento.previousIndex, evento.currentIndex);
    } else {
      const podeAdicionar = evento.container.id === 'selecionadas' &&
        this.categoriasAtribuidasATarefa.length < LIMITES.categorias_por_tarefa;

      if (podeAdicionar || evento.container.id === 'disponiveis') {
        transferArrayItem(evento.previousContainer.data, evento.container.data,
          evento.previousIndex, evento.currentIndex);
        this.atualizarCategoriasDisponiveis();
      }
    }
  }

  atualizarCategoriasDisponiveis(): void {
    this.categoriasParaAdicionar = this.categoriasDisponiveis.filter(
      c => !this.categoriasAtribuidasATarefa.includes(c)
    );
  }

  salvar(): void {
    // n da pra salvar sem categoria
    if (this.categoriasAtribuidasATarefa.length === 0) return;
  
    this.tarefa.categorias = [...this.categoriasAtribuidasATarefa];
    // emite pro componente pai
    this.aoSalvar.emit(this.tarefa);
  }


  fechar(): void {
    this.aoFechar.emit();
  }

  obterCorCategoria(categoria: string): string {
    return obterCorCategoria(categoria);
  }
}