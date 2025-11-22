export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface Usuario {
  id?: number;
  nome: string;
}

export interface Prazo {
  diaSemana: DiaSemana;
  hora: string;
}

export interface PrazoTarefa {
  inicioData: string;
  inicioHora: string;
  fimData: string;
  fimHora: string;
  diaSemana?: DiaSemana;
}

export interface PrazoAntigo {
  data: string;
  hora: string;
}

export type PrazoBruto = Prazo | PrazoTarefa | PrazoAntigo;

export interface Tarefa {
  id?: number;
  titulo: string;
  categorias: string[];
  completa: boolean;
  dataCriacao: string;
  ordem: number;
  prazo?: PrazoBruto;
}
