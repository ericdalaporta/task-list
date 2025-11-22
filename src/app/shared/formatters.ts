import { CORES_CATEGORIAS, MAPEAMENTO_CORES, ROTULO_DIA_SEMANA } from './constants';
import { PrazoBruto, PrazoTarefa, PrazoAntigo } from './types';

// retorna a classe pra colorir uma categoria e se nao existe a categoria vem o bg secondary
export function obterClasseBadge(categoria: string): string {
  return CORES_CATEGORIAS[categoria] || 'bg-secondary';
}

export function obterCorCategoria(categoria: string): string {
  return MAPEAMENTO_CORES[categoria as keyof typeof MAPEAMENTO_CORES] || '#6c757d';
}

const OPCOES_DATA_HORA: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

const formato = new Intl.DateTimeFormat('pt-BR', OPCOES_DATA_HORA);

function criarData(data: string, hora: string): Date | null {
  const valor = new Date(`${data}T${hora}`);
  return isNaN(valor.getTime()) ? null : valor;
}

export function ehPrazoIntervalo(prazo: PrazoBruto): prazo is PrazoTarefa {
  return (prazo as PrazoTarefa)?.inicioData !== undefined;
}

export function formatarDataHoraCurta(data: Date | null | undefined): string {
  return data ? formato.format(data) : '';
}

export function interpretarPrazo(prazo?: PrazoBruto | null): {
  inicio?: Date;
  fim?: Date;
  descricao?: string;
} | null {
  if (!prazo) {
    return null;
  }

  if (ehPrazoIntervalo(prazo)) {
    const inicio = criarData(prazo.inicioData, prazo.inicioHora);
    const fim = criarData(prazo.fimData, prazo.fimHora);

    if (!inicio && !fim) {
      return null;
    }

    const inicioDescricao = formatarDataHoraCurta(inicio);
    const fimDescricao = formatarDataHoraCurta(fim);
    const prefixoDia = prazo.diaSemana ? `${ROTULO_DIA_SEMANA[prazo.diaSemana]} · ` : '';

    return {
      inicio: inicio || fim || undefined,
      fim: fim || inicio || undefined,
      descricao: `${prefixoDia}${inicioDescricao} — ${fimDescricao}`.trim()
    };
  }

  const unico = criarData((prazo as PrazoAntigo).data, (prazo as PrazoAntigo).hora);
  if (!unico) {
    return null;
  }

  return {
    inicio: unico,
    fim: unico,
    descricao: formatarDataHoraCurta(unico)
  };
}

export function formatarIntervaloPrazo(prazo: PrazoBruto): string {
  const info = interpretarPrazo(prazo);
  return info?.descricao || 'Prazo inválido';
}
