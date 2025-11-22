import { DiaSemana } from './types';

export const CATEGORIAS_PADRAO = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde', 'Outras'];

export const CORES_CATEGORIAS: { [key: string]: string } = {
  'Casa': 'bg-success',                 
  'Estudo': 'bg-warning text-dark',    
  'Trabalho': 'bg-primary',             
  'Pessoal': 'bg-danger',              
  'Saúde': 'bg-info text-dark',
  'Outras': 'bg-secondary'          
};
  
export const MAPEAMENTO_CORES = {
  'Casa': '#28a745',       
  'Estudo': '#ffc107',     
  'Trabalho': '#0d6efd',   
  'Pessoal': '#dc3545',    
  'Saúde': '#17a2b8',
  'Outras': '#6c757d'       
};

 export const CONFIG_BANCO_DADOS = {
  nome: 'TarefasDB',   
  versao: 6           
};

export const CONFIG_ARMAZEM = {
  tarefas: 'tarefas',          
  categorias: 'categorias',
  usuarios: 'usuarios'
};

 export const LIMITES = {
  categorias_por_tarefa: 3   
};

export const DIAS_SEMANA: Array<{ valor: DiaSemana; rotulo: string }> = [
  { valor: 'segunda', rotulo: 'Segunda-feira' },
  { valor: 'terca', rotulo: 'Terça-feira' },
  { valor: 'quarta', rotulo: 'Quarta-feira' },
  { valor: 'quinta', rotulo: 'Quinta-feira' },
  { valor: 'sexta', rotulo: 'Sexta-feira' },
  { valor: 'sabado', rotulo: 'Sábado' },
  { valor: 'domingo', rotulo: 'Domingo' }
];

export const ROTULO_DIA_SEMANA: Record<DiaSemana, string> = DIAS_SEMANA.reduce((acc, item) => {
  acc[item.valor] = item.rotulo;
  return acc;
}, {} as Record<DiaSemana, string>);
