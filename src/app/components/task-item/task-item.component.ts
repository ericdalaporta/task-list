import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponenteModalPrazo } from '../deadline-modal/deadline-modal.component';
import { Tarefa } from '../../shared/types';

/**
item de tarefa
 */

@Component({
  selector: 'app-item-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule, ComponenteModalPrazo],
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
  
  modalPrazoVisivel = false;

  constructor() {}

  ngOnInit() {
    this.tituloTemporario = this.tarefa.titulo;
  }

  alternarConclusao() {
    this.tarefa.completa = !this.tarefa.completa;
    this.aoAtualizar.emit(this.tarefa);
  }

  remover() {
    this.aoRemover.emit(this.tarefa);
  }

  iniciarEdicaoTitulo() {
    this.estaEmModoEdicao = true;
    this.tituloTemporario = this.tarefa.titulo;
  }


  salvarEdicaoTitulo() {
    if (this.tituloTemporario.trim()) {
      this.tarefa.titulo = this.tituloTemporario.trim();
      this.estaEmModoEdicao = false;
      this.aoAtualizar.emit(this.tarefa);
    }
  }

  cancelarEdicaoTitulo() {
    this.estaEmModoEdicao = false;
    this.tituloTemporario = this.tarefa.titulo;
  }

 
  obterClasseBadgeCategoria(categoria: string): string {
    const tabelaDeCores: { [key: string]: string } = {
      'Casa': 'bg-success',
      'Estudo': 'bg-warning text-dark',
      'Trabalho': 'bg-primary',
      'Pessoal': 'bg-danger',
      'Saúde': 'bg-info text-dark'
    };
    return tabelaDeCores[categoria] || 'bg-secondary';
  }

 
  abrirModalEditarCategorias() {
    console.log('📋 Abrindo editor de categorias para:', this.tarefa.titulo);
    this.aoEditarCategorias.emit(this.tarefa);
  }

  abrirModalPrazo() {
    this.modalPrazoVisivel = true;
  }

  fecharModalPrazo() {
    this.modalPrazoVisivel = false;
  }

  salvarPrazo(prazo: { data: string; hora: string }) {
    this.tarefa.prazo = prazo;
    this.aoAtualizar.emit(this.tarefa);
    this.fecharModalPrazo();
  }


  removerPrazo() {
    this.tarefa.prazo = undefined;
    this.aoAtualizar.emit(this.tarefa);
    this.fecharModalPrazo();
  }

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
