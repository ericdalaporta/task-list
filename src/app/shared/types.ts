export interface Usuario {
  id?: number;
  nome: string;
}

export type Familiar = Usuario;

export interface Tarefa {
  id?: number;
  titulo: string;
  categorias: string[];
  completa: boolean;
  dataCriacao: string;
  ordem: number;
  familiarId?: number; 
  prazo?: {
    data: string; 
    hora: string; 
  };
}
