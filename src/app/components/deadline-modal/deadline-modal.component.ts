import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '../../shared/types';

@Component({
  selector: 'app-modal-prazo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deadline-modal.component.html',
  styleUrl: './deadline-modal.component.css'
})
export class ComponenteModalPrazo implements OnInit {
  @Input() tarefa!: Tarefa;
  @Output() aoSalvar = new EventEmitter<{ data: string; hora: string }>();
  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoLimpar = new EventEmitter<void>();

  dataSelecionada = '';
  horaSelecionada = '';

  ngOnInit() {
    if (this.tarefa.prazo) {
      this.dataSelecionada = this.tarefa.prazo.data;
      this.horaSelecionada = this.tarefa.prazo.hora;
    } else {
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];
      this.dataSelecionada = dataFormatada;
      this.horaSelecionada = '09:00';
    }
  }

  salvar() {
    // validaaaaaaa
    if (!this.dataSelecionada || !this.horaSelecionada) {
      alert('Por favor, selecione a data e hora!');
      return;
    }

    // mostra o prazo
    this.aoSalvar.emit({
      data: this.dataSelecionada,
      hora: this.horaSelecionada
    });
  }

  limpar() {
    this.aoLimpar.emit();
  }

  fechar() {
    this.aoFechar.emit();
  }
}
