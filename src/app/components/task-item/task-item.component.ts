import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponenteModalPrazo } from '../deadline-modal/deadline-modal.component';
import { Tarefa } from '../../shared/types';

/**
 * COMPONENTE: Item de Tarefa
 * 
 * Responsabilidade: Exibir um card individual de tarefa com todas as informações
 * e permitir que o usuário interaja com ela (marcar como completa, editar, deletar, etc.)
 * 
 * Funcionalidades principais:
 * - Exibir título, categoria, prazo da tarefa
 * - Permitir marcar tarefa como completa/incompleta (checkbox)
 * - Editar título inline
 * - Remover tarefa
 * - Gerenciar categorias
 * - Definir prazo (data e hora)
 */
@Component({
  selector: 'app-item-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule, ComponenteModalPrazo],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class ComponenteItemTarefa implements OnInit {
  // ════════════════════════════════════════════════════
  // PROPRIEDADES DE ENTRADA (@Input)
  // ════════════════════════════════════════════════════
  
  /** Objeto tarefa que será exibido neste componente */
  @Input() tarefa!: Tarefa;

  // ════════════════════════════════════════════════════
  // PROPRIEDADES DE SAÍDA (@Output)
  // Emitem eventos que o componente pai pode escutar
  // ════════════════════════════════════════════════════
  
  /** Evento disparado quando usuário clica no botão deletar */
  @Output() aoRemover = new EventEmitter<Tarefa>();
  
  /** Evento disparado quando tarefa é modificada (título, conclusão, prazo) */
  @Output() aoAtualizar = new EventEmitter<Tarefa>();
  
  /** Evento disparado quando usuário quer editar as categorias da tarefa */
  @Output() aoEditarCategorias = new EventEmitter<Tarefa>();

  // ════════════════════════════════════════════════════
  // PROPRIEDADES DE ESTADO
  // Controlam o comportamento do componente em tempo real
  // ════════════════════════════════════════════════════
  
  /** Indica se o componente está em modo de edição de título */
  estaEmModoEdicao = false;
  
  /** Armazena o texto do título enquanto está sendo editado */
  tituloTemporario = '';
  
  /** Controla se o modal de prazo está visível ou não */
  modalPrazoVisivel = false;

  constructor() {}

  /**
   * CICLO DE VIDA: ngOnInit
   * 
   * Executado uma única vez após o componente ser inicializado.
   * Neste caso, preparamos o campo temporário com o título atual.
   */
  ngOnInit() {
    // Copia o título atual para o campo temporário (usado na edição)
    this.tituloTemporario = this.tarefa.titulo;
  }

  /**
   * Alterna o status de conclusão da tarefa.
   * Emite um evento para o componente pai atualizar no banco de dados.
   */
  alternarConclusao() {
    // Inverte o status de conclusão
    this.tarefa.completa = !this.tarefa.completa;
    // Emite o evento de atualização
    this.aoAtualizar.emit(this.tarefa);
  }

  /**
   * Emite um evento para remover a tarefa.
   */
  remover() {
    this.aoRemover.emit(this.tarefa);
  }

  /**
   * Inicia o modo de edição do título.
   */
  iniciarEdicaoTitulo() {
    this.estaEmModoEdicao = true;
    this.tituloTemporario = this.tarefa.titulo;
  }

  /**
   * Salva as mudanças no título da tarefa.
   * Valida que o título não está vazio antes de salvar.
   */
  salvarEdicaoTitulo() {
    // Valida que o título não é vazio ou apenas espaços
    if (this.tituloTemporario.trim()) {
      // Atualiza o título da tarefa
      this.tarefa.titulo = this.tituloTemporario.trim();
      // Sai do modo de edição
      this.estaEmModoEdicao = false;
      // Emite o evento de atualização
      this.aoAtualizar.emit(this.tarefa);
    }
  }

  /**
   * Cancela a edição do título sem salvar as mudanças.
   */
  cancelarEdicaoTitulo() {
    this.estaEmModoEdicao = false;
    // Restaura o título original
    this.tituloTemporario = this.tarefa.titulo;
  }

  /**
   * Retorna a classe CSS apropriada para exibir o badge de uma categoria.
   * Cada categoria tem uma cor visual diferente.
   * @param categoria - Nome da categoria
   * @returns string - Classe CSS do Bootstrap com a cor apropriada
   */
  obterClasseBadgeCategoria(categoria: string): string {
    // Mapeamento de categorias para classes CSS do Bootstrap
    const tabelaDeCores: { [key: string]: string } = {
      'Casa': 'bg-success',
      'Estudo': 'bg-warning text-dark',
      'Trabalho': 'bg-primary',
      'Pessoal': 'bg-danger',
      'Saúde': 'bg-info text-dark'
    };
    // Retorna a cor da categoria ou uma cor padrão (cinza)
    return tabelaDeCores[categoria] || 'bg-secondary';
  }

  /**
   * Emite um evento para abrir o modal de edição de categorias.
   * Permite que o usuário gerencie as categorias da tarefa.
   */
  abrirModalEditarCategorias() {
    console.log('📋 Abrindo editor de categorias para:', this.tarefa.titulo);
    this.aoEditarCategorias.emit(this.tarefa);
  }

  /**
   * Abre o modal para definir ou editar o prazo da tarefa.
   */
  abrirModalPrazo() {
    this.modalPrazoVisivel = true;
  }

  /**
   * Fecha o modal de prazo sem salvar.
   */
  fecharModalPrazo() {
    this.modalPrazoVisivel = false;
  }

  /**
   * Salva o prazo da tarefa e emite um evento para atualizar.
   * @param prazo - Objeto contendo data e hora do prazo
   */
  salvarPrazo(prazo: { data: string; hora: string }) {
    this.tarefa.prazo = prazo;
    this.aoAtualizar.emit(this.tarefa);
    this.fecharModalPrazo();
  }

  /**
   * Remove o prazo da tarefa.
   */
  removerPrazo() {
    this.tarefa.prazo = undefined;
    this.aoAtualizar.emit(this.tarefa);
    this.fecharModalPrazo();
  }

  /**
   * Calcula e retorna a descrição do prazo relativo (ex: "em 2 dias", "em 3 horas").
   * @returns string - Descrição do prazo ou string vazia se não houver prazo
   */
  obterTextoProxoPrazo(): string {
    if (!this.tarefa.prazo) return '';

    const dataPrazo = new Date(`${this.tarefa.prazo.data}T${this.tarefa.prazo.hora}`);
    const agora = new Date();
    const diferencaMilissegundos = dataPrazo.getTime() - agora.getTime();
    const diferencaHoras = diferencaMilissegundos / (1000 * 60 * 60);
    const diferencaDias = diferencaHoras / 24;

    if (diferencaMilissegundos < 0) {
      return 'Vencido';
    } else if (diferencaHoras < 1) {
      return `em ${Math.round(diferencaMilissegundos / (1000 * 60))} min`;
    } else if (diferencaHoras < 24) {
      return `em ${Math.round(diferencaHoras)}h`;
    } else if (diferencaDias < 7) {
      return `em ${Math.round(diferencaDias)}d`;
    } else {
      return `em ${Math.round(diferencaDias / 7)}s`;
    }
  }
}
