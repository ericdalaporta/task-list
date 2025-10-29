import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DbService } from '../../services/db.service';
import { CategoryService } from '../../services/category.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CategoryModalComponent } from '../category-modal/category-modal.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FormsModule, CommonModule, DragDropModule, TaskItemComponent, CategoryModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {
  @Input() selectedCategory: string | null = null;
  
  categorias: string[] = [];
  tarefas: any[] = [];
  novaTarefa = '';
  categoriaSelecionada = '';
  tarefaSelecionadaParaEditar: any = null;
  mostrarModalCategorias = false;

  constructor(
    private dbService: DbService,
    private categoryService: CategoryService
  ) {
    this.categorias = this.categoryService.getCategorias();
    this.categoriaSelecionada = this.categorias[0] || 'Pessoal';
  }

  ngOnInit() {
    this.categoryService.categorias$.subscribe(categorias => {
      this.categorias = categorias;
      if (!this.categoriaSelecionada) {
        this.categoriaSelecionada = categorias[0];
      }
    });

    this.carregarTarefasInicial();
  }

  carregarTarefasInicial() {
    this.dbService.getTarefas()
      .then(tarefas => {
        this.tarefas = tarefas || [];
      })
      .catch(error => {
        console.error('Erro ao carregar tarefas:', error);
        this.tarefas = [];
      });
  }

  get filteredTarefas() {
    if (!this.selectedCategory) {
      return this.tarefas;
    }
    
    if (this.selectedCategory === 'Outras') {
      const categoriasBuiltIn = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
      return this.tarefas.filter(tarefa => {
        return tarefa.categorias.some((cat: string) => !categoriasBuiltIn.includes(cat));
      });
    }
    
    return this.tarefas.filter(tarefa => tarefa.categorias.includes(this.selectedCategory));
  }

  carregarTarefas() {
    this.dbService.getTarefas()
      .then(tarefas => {
        this.tarefas = tarefas || [];
      })
      .catch(error => {
        console.error('Erro ao carregar tarefas:', error);
        this.tarefas = [];
      });
  }

  adicionarTarefa() {
    if (!this.novaTarefa || !this.novaTarefa.trim()) {
      return;
    }

    const tarefa = {
      titulo: this.novaTarefa.trim(),
      categorias: [this.categoriaSelecionada],
      completa: false,
      dataCriacao: new Date().toISOString(),
      ordem: this.tarefas.length
    };

    this.dbService.addTarefa(tarefa)
      .then(() => {
        this.novaTarefa = '';
        this.carregarTarefas();
      })
      .catch((error: any) => {
        console.error('Erro ao adicionar tarefa:', error);
      });
  }

  removerTarefa(tarefa: any) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      this.dbService.removeTarefa(tarefa.id)
        .then(() => {
          this.carregarTarefas();
        })
        .catch(error => {
          console.error('Erro ao remover tarefa:', error);
        });
    }
  }

  atualizarTarefa(tarefa: any) {
    this.dbService.updateTarefa(tarefa)
      .then(() => {
        this.carregarTarefas();
      })
      .catch((error: any) => {
        console.error('Erro ao atualizar tarefa:', error);
      });
  }

  openAddCategoryModal() {
    const novaCategoria = prompt('Digite o nome da nova categoria:');
    if (novaCategoria && novaCategoria.trim()) {
      this.categoryService.addCategoria(novaCategoria.trim());
    }
  }

  abrirModalEdicaoCategoria(tarefa: any) {
    this.tarefaSelecionadaParaEditar = { ...tarefa };
    this.mostrarModalCategorias = true;
  }

  salvarCategorias(tarefaAtualizada: any) {
    this.atualizarTarefa(tarefaAtualizada);
    this.fecharModalCategorias();
  }

  fecharModalCategorias() {
    this.mostrarModalCategorias = false;
    this.tarefaSelecionadaParaEditar = null;
  }

  selecionarFiltroCategoria(categoria: string | null) {
    this.selectedCategory = categoria;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.tarefas, event.previousIndex, event.currentIndex);
      
      this.tarefas.forEach((tarefa, index) => {
        tarefa.ordem = index;
        this.dbService.updateTarefa(tarefa).catch(error => {
          console.error('Erro ao atualizar ordem:', error);
        });
      });
    }
  }
}


