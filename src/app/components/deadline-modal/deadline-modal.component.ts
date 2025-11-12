import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '../../shared/types';

/**
 * COMPONENTE MODAL - Gerenciar Prazo da Tarefa
 * 
 * Responsabilidade: Permitir ao usuário definir ou editar o prazo de uma tarefa
 * 
 * Funcionalidades:
 * - Se tarefa já tem prazo, carrega os dados
 * - Se não tem, oferece data de hoje como padrão
 * - Input para selecionar data e hora
 * - Valida que ambas foram preenchidas antes de salvar
 * - Emite o prazo para o componente pai salvar no banco
 */
@Component({
  selector: 'app-modal-prazo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deadline-modal.component.html',
  styleUrl: './deadline-modal.component.css'
})
export class ComponenteModalPrazo implements OnInit {
  // Input: Tarefa cujo prazo será definido/editado
  @Input() tarefa!: Tarefa;
  // Output: Emite quando usuário salva o prazo (data + hora)
  @Output() aoSalvar = new EventEmitter<{ data: string; hora: string }>();
  // Output: Emite quando modal deve ser fechado
  @Output() aoFechar = new EventEmitter<void>();
  // Output: Emite quando usuário quer remover o prazo
  @Output() aoLimpar = new EventEmitter<void>();

  // Data selecionada no input (formato YYYY-MM-DD)
  dataSelecionada = '';
  // Hora selecionada no input (formato HH:mm)
  horaSelecionada = '';

  /**
   * Inicializa o modal com o prazo atual da tarefa (se houver) ou valores padrão.
   */
  ngOnInit() {
    if (this.tarefa.prazo) {
      // Se tarefa já tem prazo, usa os valores existentes
      this.dataSelecionada = this.tarefa.prazo.data;
      this.horaSelecionada = this.tarefa.prazo.hora;
    } else {
      // Se não tem prazo, oferece data de hoje e hora 09:00 como padrão
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];
      this.dataSelecionada = dataFormatada;
      this.horaSelecionada = '09:00';
    }
  }

  /**
   * Valida e salva o novo prazo da tarefa.
   * 
   * Processo:
   * 1. Valida que data e hora foram preenchidas
   * 2. Emite evento com os dados para o componente pai
   * 3. Componente pai atualiza no banco de dados
   */
  salvar() {
    // Valida
    if (!this.dataSelecionada || !this.horaSelecionada) {
      alert('Por favor, selecione a data e hora!');
      return;
    }

    // Emite o prazo
    this.aoSalvar.emit({
      data: this.dataSelecionada,
      hora: this.horaSelecionada
    });
  }

  /**
   * Remove o prazo da tarefa.
   */
  limpar() {
    this.aoLimpar.emit();
  }

  /**
   * Fecha o modal sem salvar mudanças.
   */
  fechar() {
    this.aoFechar.emit();
  }
}
