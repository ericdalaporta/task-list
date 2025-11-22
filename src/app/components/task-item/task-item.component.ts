import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa, PrazoTarefa, Prazo } from '../../shared/types';
import { obterClasseBadge } from '../../shared/formatters';
import { ROTULO_DIA_SEMANA } from '../../shared/constants';


@Component({
  selector: 'app-item-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class ComponenteItemTarefa implements OnInit {
  @Input() tarefa!: Tarefa;
  
  @Output() aoRemover = new EventEmitter<Tarefa>();
  @Output() aoAtualizar = new EventEmitter<Tarefa>();
  @Output() aoEditarCategorias = new EventEmitter<Tarefa>();

  estaEmModoEdicao = false;
  tituloTemporario = '';

  ngOnInit(): void {
    this.tituloTemporario = this.tarefa.titulo;
  }

  // isso eh pra marcar tarefa concluida ou nao
  alternarConclusao(): void {
    this.tarefa.completa = !this.tarefa.completa;
    // emite pro pai pra saber se foi atualizado
    this.aoAtualizar.emit(this.tarefa);
  }

  // dispara evento de remoção
  remover(): void {
    this.aoRemover.emit(this.tarefa);
  }

  // a partir de agr eh as edições de titulos

  // inicia edicao
  iniciarEdicaoTitulo(): void {
    this.estaEmModoEdicao = true;
    this.tituloTemporario = this.tarefa.titulo;
  }

  salvarEdicaoTitulo(): void {
    if (this.tituloTemporario.trim()) {
      this.tarefa.titulo = this.tituloTemporario.trim();
      this.estaEmModoEdicao = false;
      this.aoAtualizar.emit(this.tarefa);
    }
  }

  // cancela pra voltar com o originalk
  cancelarEdicaoTitulo(): void {
    this.estaEmModoEdicao = false;
    this.tituloTemporario = this.tarefa.titulo;
  }

  // aqui sao categorias

  // retorna a classe CSS de cor para cada categoria
  obterClasseBadgeCategoria(categoria: string): string {
    return obterClasseBadge(categoria);
  }

  // abre modal pra editar categorias
  abrirModalEditarCategorias(): void {
    this.aoEditarCategorias.emit(this.tarefa);
  }

  // verifica se eh o novo tipo de prazo simples (dia + hora)
  isPrazo(prazo: any): prazo is Prazo {
    return prazo && 'diaSemana' in prazo && 'hora' in prazo && !('data' in prazo);
  }

  obterDescricaoPrazo(): string {
    if (!this.tarefa.prazo) {
      return '';
    }

    if (this.isPrazo(this.tarefa.prazo)) {
      const rotulo = ROTULO_DIA_SEMANA[this.tarefa.prazo.diaSemana];
      return `${rotulo} às ${this.tarefa.prazo.hora}`;
    }

    return '';
  }
}
