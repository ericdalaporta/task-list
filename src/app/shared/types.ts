/**
 * Tipos e Interfaces compartilhadas do sistema
 * Central onde todas as interfaces são definidas para evitar duplicação
 */

/**
 * Interface que representa um usuário no sistema.
 * Cada usuário tem um nome e ID únicos.
 */
export interface Usuario {
  id?: number;
  nome: string;
}

// Alias para compatibilidade com código legado
export type Familiar = Usuario;

/**
 * Interface que representa uma tarefa no sistema.
 * Cada tarefa pode estar vinculada a um usuário e a múltiplas categorias.
 */
export interface Tarefa {
  id?: number;
  titulo: string;
  categorias: string[];
  completa: boolean;
  dataCriacao: string;
  ordem: number;
  familiarId?: number; // ID do usuário responsável pela tarefa
  prazo?: {
    data: string; // Data em formato ISO (YYYY-MM-DD)
    hora: string; // Hora em formato HH:mm
  };
}
