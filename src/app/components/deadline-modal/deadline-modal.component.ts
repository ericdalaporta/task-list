import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa, PrazoTarefa, DiaSemana, PrazoAntigo } from '../../shared/types';
import { DIAS_SEMANA } from '../../shared/constants';
import { ehPrazoIntervalo } from '../../shared/formatters';

@Component({
  selector: 'app-modal-prazo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deadline-modal.component.html',
  styleUrl: './deadline-modal.component.css'
})
export class ComponenteModalPrazo implements OnInit {
  @Input() tarefa!: Tarefa;
  
  // eventos pro componente pai
  @Output() aoSalvar = new EventEmitter<PrazoTarefa>();
  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoLimpar = new EventEmitter<void>();

  diasSemana = DIAS_SEMANA;
  diaSemanaSelecionado: DiaSemana | '' = '';
  inicioDataSelecionada = '';
  inicioHoraSelecionada = '';
  fimDataSelecionada = '';
  fimHoraSelecionada = '';

  ngOnInit() {
    const prazo = this.tarefa.prazo;
    if (prazo && ehPrazoIntervalo(prazo)) {
      this.inicioDataSelecionada = prazo.inicioData;
      this.inicioHoraSelecionada = prazo.inicioHora;
      this.fimDataSelecionada = prazo.fimData;
      this.fimHoraSelecionada = prazo.fimHora;
      this.diaSemanaSelecionado = prazo.diaSemana || this.converterDataParaDiaSemana(prazo.inicioData);
      return;
    }

    if (prazo) {
      this.preencherPrazoAntigo(prazo as PrazoAntigo);
      return;
    }

    this.definirSugestoesPadrao();
  }

  salvar() {
    if (!this.inicioDataSelecionada || !this.inicioHoraSelecionada || !this.fimDataSelecionada || !this.fimHoraSelecionada) {
      alert('Preencha as datas e horários inicial e final.');
      return;
    }

    if (!this.diaSemanaSelecionado) {
      alert('Escolha o dia da semana.');
      return;
    }

    const inicio = new Date(`${this.inicioDataSelecionada}T${this.inicioHoraSelecionada}`);
    const fim = new Date(`${this.fimDataSelecionada}T${this.fimHoraSelecionada}`);

    if (fim <= inicio) {
      alert('O horário final precisa ser depois do horário inicial.');
      return;
    }

    this.aoSalvar.emit({
      inicioData: this.inicioDataSelecionada,
      inicioHora: this.inicioHoraSelecionada,
      fimData: this.fimDataSelecionada,
      fimHora: this.fimHoraSelecionada,
      diaSemana: this.diaSemanaSelecionado
    });
  }

  limpar() {
    this.aoLimpar.emit();
  }

  fechar() {
    this.aoFechar.emit();
  }

  private preencherPrazoAntigo(prazoAntigo: PrazoAntigo) {
    const data = prazoAntigo.data || this.obterDataHoje();
    const hora = prazoAntigo.hora || '09:00';
    this.inicioDataSelecionada = data;
    this.fimDataSelecionada = data;
    this.inicioHoraSelecionada = hora;
    this.fimHoraSelecionada = hora;
    this.diaSemanaSelecionado = this.converterDataParaDiaSemana(data);
  }

  private definirSugestoesPadrao() {
    const hoje = this.obterDataHoje();
    this.inicioDataSelecionada = hoje;
    this.fimDataSelecionada = hoje;
    this.inicioHoraSelecionada = '09:00';
    this.fimHoraSelecionada = '18:00';
    this.diaSemanaSelecionado = this.converterDataParaDiaSemana(hoje);
  }

  private obterDataHoje(): string {
    return new Date().toISOString().split('T')[0];
  }

  private converterDataParaDiaSemana(dataISO: string): DiaSemana {
    const diaReferencia: DiaSemana[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const data = new Date(`${dataISO}T00:00:00`);
    return diaReferencia[data.getDay()];
  }
}
