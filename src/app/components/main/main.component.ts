import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ServicoBaseDados } from '../../services/db.service';
import { ServicoCategorias } from '../../services/category.service';
import { ServicoUsuarios } from '../../services/usuario.service';
import { ComponenteItemTarefa } from '../task-item/task-item.component';
import { ComponenteModalCategorias } from '../category-modal/category-modal.component';
import { ComponenteModalUsuario } from '../usuario-modal/usuario-modal.component';
import { ComponenteModalAdicionarCategoria } from '../add-category-modal/add-category-modal.component';
import { Tarefa } from '../../shared/types';

/**
 * COMPONENTE PRINCIPAL - Lista de Tarefas Coletiva
 * 
 * Responsabilidades:
 * - Exibe e gerencia lista de tarefas
 * - Permite adicionar, remover e editar tarefas
 * - Filtra tarefas por usuário e categoria
 * - Suporta drag-and-drop para reordenar tarefas
 * - Gerencia estados de múltiplos modais
 */
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    DragDropModule, 
    ComponenteItemTarefa, 
    ComponenteModalCategorias, 
    ComponenteModalUsuario, 
    ComponenteModalAdicionarCategoria
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class ComponentePrincipal implements OnInit {
  @Input() categoriaSelecionada: string | null = null;
  
  // Dados carregados do banco
  categorias: string[] = [];
  usuarios: any[] = [];
  tarefas: Tarefa[] = [];
  
  // Estados do formulário de adição
  novaTarefaTexto = '';
  categoriaSelecionadaAdicionarTarefa: string | null = null;
  usuarioSelecionadoAdicionarTarefa: number | null = null;
  
  // Estados do filtro
  usuarioSelecionadoFiltro: number | null = null;
  
  // Estados dos modais
  tarefaSelecionadaParaEditarCategorias: any = null;
  mostrarModalEditarCategorias = false;
  mostrarModalAdicionarUsuario = false;
  mostrarModalAdicionarCategoria = false;

  // Categorias padrão do sistema (para filtro especial "Categorias")
  private readonly CATEGORIAS_PADRAO = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];

  constructor(
    private bd: ServicoBaseDados,
    private servCateg: ServicoCategorias,
    private servUsuarios: ServicoUsuarios
  ) {
    // Inicializa dados dos serviços
    this.categorias = this.servCateg.obterCategorias();
    this.usuarios = this.servUsuarios.obterUsuarios();
  }

  ngOnInit() {
    // Escuta mudanças em categorias
    this.servCateg.categorias$.subscribe(cat => {
      this.categorias = cat;
    });

    // Escuta mudanças em usuários
    this.servUsuarios.usuarios$.subscribe(usr => {
      this.usuarios = usr;
    });

    // Carrega tarefas do banco de dados
    this.carregarTarefas();
  }

  // ============== CARREGAMENTO DE DADOS ==============
  
  async carregarTarefas() {
    try {
      this.tarefas = await this.bd.obterTarefas() || [];
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
      this.tarefas = [];
    }
  }

  // ============== FILTRO DE TAREFAS ==============
  
  /** Retorna apenas tarefas que correspondem aos filtros selecionados */
  get tarefasFiltradas(): Tarefa[] {
    let filtradas = this.tarefas;

    // Filtra por usuário se algum foi selecionado
    if (this.usuarioSelecionadoFiltro !== null && this.usuarioSelecionadoFiltro !== undefined) {
      filtradas = filtradas.filter(t => Number(t.familiarId) === this.usuarioSelecionadoFiltro);
    }

    // Filtra por categoria da sidebar
    if (this.categoriaSelecionada) {
      if (this.categoriaSelecionada === 'Outras') {
        // Mostra tarefas com categorias customizadas (não padrão)
        filtradas = filtradas.filter(t => 
          t.categorias && t.categorias.some(c => !this.CATEGORIAS_PADRAO.includes(c))
        );
      } else {
        // Mostra tarefas da categoria específica
        filtradas = filtradas.filter(t => 
          t.categorias && t.categorias.includes(this.categoriaSelecionada!)
        );
      }
    }

    return filtradas;
  }

  // ============== GERENCIAMENTO DE TAREFAS ==============
  
  async adicionarTarefa() {
    // Valida entrada
    if (!this.novaTarefaTexto?.trim()) return;
    if (!this.usuarioSelecionadoAdicionarTarefa) {
      alert('Selecione um usuário para a tarefa!');
      return;
    }
    if (!this.categoriaSelecionadaAdicionarTarefa) {
      alert('Selecione uma categoria para a tarefa!');
      return;
    }

    // Cria nova tarefa
    const novaTarefa: Tarefa = {
      titulo: this.novaTarefaTexto.trim(),
      categorias: [this.categoriaSelecionadaAdicionarTarefa],
      completa: false,
      dataCriacao: new Date().toISOString(),
      ordem: this.tarefas.length,
      familiarId: this.usuarioSelecionadoAdicionarTarefa
    };

    try {
      await this.bd.adicionarTarefa(novaTarefa);
      this.novaTarefaTexto = '';
      await this.carregarTarefas();
    } catch (erro) {
      console.error('Erro ao adicionar tarefa:', erro);
    }
  }

  async removerTarefa(tarefa: Tarefa) {
    if (confirm('Remover esta tarefa?')) {
      try {
        await this.bd.removerTarefa(tarefa.id || 0);
        await this.carregarTarefas();
      } catch (erro) {
        console.error('Erro ao remover:', erro);
      }
    }
  }

  async atualizarTarefa(tarefa: Tarefa) {
    try {
      await this.bd.atualizarTarefa(tarefa);
      await this.carregarTarefas();
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
    }
  }

  // ============== DRAG AND DROP ==============
  
  async aoSoltarTarefa(evento: CdkDragDrop<Tarefa[]>) {
    // Se posição mudou, atualiza ordem de todas
    if (evento.previousIndex !== evento.currentIndex) {
      moveItemInArray(this.tarefas, evento.previousIndex, evento.currentIndex);
      this.tarefas.forEach((t, i) => {
        t.ordem = i;
        this.bd.atualizarTarefa(t).catch(e => console.error('Erro ao atualizar ordem:', e));
      });
    }
  }

  // ============== GERENCIAMENTO DE CATEGORIAS ==============
  
  abrirModalAdicionarCategoria() {
    this.mostrarModalAdicionarCategoria = true;
  }

  fecharModalAdicionarCategoria() {
    this.mostrarModalAdicionarCategoria = false;
  }

  async adicionarNovaCategoria(nomeCategoria: string) {
    await this.servCateg.adicionarCategoria(nomeCategoria);
    this.mostrarModalAdicionarCategoria = false;
  }

  abrirModalEditarCategorias(tarefa: Tarefa) {
    this.tarefaSelecionadaParaEditarCategorias = { ...tarefa };
    this.mostrarModalEditarCategorias = true;
  }

  fecharModalEditarCategorias() {
    this.mostrarModalEditarCategorias = false;
    this.tarefaSelecionadaParaEditarCategorias = null;
  }

  async salvarCategoriasDaTarefa(tarefaAtualizada: Tarefa) {
    await this.atualizarTarefa(tarefaAtualizada);
    this.fecharModalEditarCategorias();
  }

  // ============== GERENCIAMENTO DE USUÁRIOS ==============
  
  abrirModalAdicionarUsuario() {
    this.mostrarModalAdicionarUsuario = true;
  }

  fecharModalAdicionarUsuario() {
    this.mostrarModalAdicionarUsuario = false;
  }

  selecionarUsuarioFiltro(evento: any) {
    const valor = evento.target.value;
    this.usuarioSelecionadoFiltro = (valor === '' || !valor) ? null : parseInt(valor, 10);
  }

  /**
   * TrackBy função para otimizar renderização do *ngFor de usuários.
   * Permite ao Angular rastrear usuários por ID em vez de por referência.
   */
  rastrearUsuarioPorId(index: number, usuario: any): number {
    return usuario.id || index;
  }
}


