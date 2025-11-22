import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ServicoBaseDados } from '../../services/db.service';
import { ServicoCategorias } from '../../services/category.service';
import { ComponenteItemTarefa } from '../task-item/task-item.component';
import { ComponenteModalCategorias } from '../category-modal/category-modal.component';
import { ComponenteModalAdicionarCategoria } from '../add-category-modal/add-category-modal.component';
import { Tarefa, DiaSemana } from '../../shared/types';
import { CATEGORIAS_PADRAO, DIAS_SEMANA } from '../../shared/constants';
import { ehPrazoIntervalo } from '../../shared/formatters';

const CATEGORIAS_REFERENCIA_OUTRAS = CATEGORIAS_PADRAO.filter(cat => cat !== 'Outras');

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    FormsModule, CommonModule, DragDropModule, ComponenteItemTarefa,
    ComponenteModalCategorias, ComponenteModalAdicionarCategoria
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class ComponentePrincipal implements OnInit {
  @Input() categoriaSelecionada: string | null = null;

  categorias: string[] = [];
  tarefas: Tarefa[] = [];
  diasSemana = DIAS_SEMANA;

  novaTarefaTexto = '';
  categoriaSelecionadaAdicionarTarefa: string | null = null;
  diaSemanaSelecionadoAdicionarTarefa: DiaSemana | '' = '';
  horariosAdicionarTarefa = '12:00';

  pontosUsuario = 0;
  nomeUsuario = '';
  mostrarModalBoasVindas = false;
  nomeUsuarioTemporario = '';
  placeholderTexto = '';
  placeholderCompleto = 'Digite seu nome dentro desse campo';
  inputClicado = false;
  private intervaloDigi: any;
  mostrarAvisoLimpezaSemanal = false;

  tarefaSelecionadaParaEditarCategorias: any = null;
  mostrarModalEditarCategorias = false;
  mostrarModalAdicionarCategoria = false;
  mostrarModalPontuacao = false;
  pontuacaoPorDia: { data: string; pontos: number; aumento: number }[] = [];

  constructor(
    private bd: ServicoBaseDados,
    private servCateg: ServicoCategorias
  ) {}

  ngOnInit(): void {
    // Verifica se tem nome de usuário salvo
    const nomeSalvo = localStorage.getItem('nomeUsuario');
    if (nomeSalvo) {
      this.nomeUsuario = nomeSalvo;
    } else {
      this.mostrarModalBoasVindas = true;
      this.iniciarAnimacaoPlaceholder();
    }

    // Inicia com as categorias padrão
    this.categorias = [...CATEGORIAS_PADRAO];
    // Se categorias mudam = atualiza a lista local
    this.servCateg.categorias$.subscribe(cat => this.categorias = cat);
    this.carregarTarefas();
    this.carregarPontos();
    
    // Verificar se precisa limpar tarefas (lógica semanal)
    this.verificarLimpezaSemanal();
    
    // Configurar verificação a cada minuto para detectar domingo às 23:59
    setInterval(() => this.verificarLimpezaSemanal(), 60000);
  }

  private verificarLimpezaSemanal(): void {
    const agora = new Date();
    const proximoLimpeza = localStorage.getItem('proximaLimpezaSemanal');
    
    // Se não há registro de próxima limpeza, criar
    if (!proximoLimpeza) {
      const proximoDomingo = this.calcularProximoDomingo();
      proximoDomingo.setHours(23, 59, 0, 0);
      localStorage.setItem('proximaLimpezaSemanal', proximoDomingo.getTime().toString());
      return;
    }
    
    const dataProximaLimpeza = new Date(parseInt(proximoLimpeza));
    
    // Se já passou da hora de limpeza
    if (agora >= dataProximaLimpeza) {
      this.limparTarefasSemanais();
      
      // Definir próximo domingo
      const proximoDomingo = this.calcularProximoDomingo();
      proximoDomingo.setHours(23, 59, 0, 0);
      localStorage.setItem('proximaLimpezaSemanal', proximoDomingo.getTime().toString());
    }
  }

  private calcularProximoDomingo(): Date {
    const agora = new Date();
    const proximoDomingo = new Date(agora);
    const diasAteProximoDomingo = (7 - agora.getDay()) % 7 || 7; // Se for domingo, vai pro próximo domingo
    proximoDomingo.setDate(proximoDomingo.getDate() + diasAteProximoDomingo);
    return proximoDomingo;
  }

  private async limparTarefasSemanais(): Promise<void> {
    try {
      // Remover todas as tarefas
      for (const tarefa of this.tarefas) {
        await this.bd.removerTarefa(tarefa.id || 0);
      }
      
      // Recarregar tarefas (agora vazio)
      await this.carregarTarefas();
      this.carregarPontos();
      
      // Mostrar aviso
      this.mostrarAvisoLimpezaSemanal = true;
      setTimeout(() => {
        this.mostrarAvisoLimpezaSemanal = false;
      }, 5000);
    } catch (erro) {
      console.error('Erro ao limpar tarefas semanais:', erro);
    }
  }

  private iniciarAnimacaoPlaceholder(): void {
    let indice = 0;
    this.placeholderTexto = '';
    
    this.intervaloDigi = setInterval(() => {
      if (this.inputClicado) {
        clearInterval(this.intervaloDigi);
        this.placeholderTexto = '';
        return;
      }
      
      if (indice < this.placeholderCompleto.length) {
        this.placeholderTexto += this.placeholderCompleto[indice];
        indice++;
      } else {
        clearInterval(this.intervaloDigi);
        setTimeout(() => {
          if (!this.inputClicado) {
            this.apagarPlaceholder();
          }
        }, 2000);
      }
    }, 100);
  }

  private apagarPlaceholder(): void {
    let indice = this.placeholderTexto.length;
    
    const intervaloApagar = setInterval(() => {
      if (this.inputClicado) {
        clearInterval(intervaloApagar);
        this.placeholderTexto = '';
        return;
      }
      
      if (indice > 0) {
        indice--;
        this.placeholderTexto = this.placeholderCompleto.substring(0, indice);
      } else {
        clearInterval(intervaloApagar);
        setTimeout(() => {
          if (!this.inputClicado) {
            this.iniciarAnimacaoPlaceholder();
          }
        }, 500);
      }
    }, 30);
  }

  aoClicarInput(): void {
    this.inputClicado = true;
    if (this.intervaloDigi) {
      clearInterval(this.intervaloDigi);
    }
    this.placeholderTexto = '';
  }

  aoSairInput(): void {
    if (!this.nomeUsuarioTemporario.trim()) {
      this.inputClicado = false;
      this.iniciarAnimacaoPlaceholder();
    }
  }

  carregarPontos(): void {
    const tarefasCompletas = this.tarefas.filter(t => t.completa).length;
    this.pontosUsuario = tarefasCompletas;
    this.calcularPontuacaoPorDia();
  }

  private calcularPontuacaoPorDia(): void {
    const pontosPorDia: { [key: string]: number } = {};
    
    this.tarefas.forEach(tarefa => {
      if (tarefa.completa && tarefa.prazo && 'diaSemana' in tarefa.prazo && !('data' in tarefa.prazo)) {
        const dia = (tarefa.prazo as any).diaSemana;
        pontosPorDia[dia] = (pontosPorDia[dia] || 0) + 1;
      }
    });

    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const diasComPontos = dias.filter(dia => pontosPorDia[dia]);

    this.pontuacaoPorDia = diasComPontos.map((dia, indice) => {
      const pontos = pontosPorDia[dia];
      // No primeiro dia, a variação é sempre positiva (Math.abs para garantir positivo)
      const variacao = indice === 0 ? pontos : pontos - pontosPorDia[diasComPontos[indice - 1]];

      return {
        data: dia,
        pontos,
        aumento: variacao
      };
    });
  }

  abrirModalPontuacao(): void {
    this.mostrarModalPontuacao = true;
  }

  fecharModalPontuacao(): void {
    this.mostrarModalPontuacao = false;
  }

  formatarData(diaSemana: string): string {
    const nomesDias: { [key: string]: string } = {
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    };
    return nomesDias[diaSemana] || diaSemana;
  }

  // tarefas aqui pra baixo

  async carregarTarefas(): Promise<void> {
    try {
      this.tarefas = await this.bd.obterTarefas() || [];
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
      this.tarefas = [];
    }
  }

  get tarefasFiltradas(): Tarefa[] {
    // se uma categoria foi selecionada, filtra por ela
    if (this.categoriaSelecionada) {
      if (this.categoriaSelecionada === 'Outras') {
        return this.tarefas.filter(t =>
          t.categorias && (
            t.categorias.includes('Outras') ||
            t.categorias.some(c => !CATEGORIAS_REFERENCIA_OUTRAS.includes(c))
          )
        );
      } else {
        return this.tarefas.filter(t =>
          t.categorias && t.categorias.includes(this.categoriaSelecionada!)
        );
      }
    }

    return this.tarefas;
  }

  // add nova tarefa
  async adicionarTarefa(): Promise<void> {
    // validacao com todos os campos obrigatorios
    if (!this.novaTarefaTexto?.trim() || !this.categoriaSelecionadaAdicionarTarefa || !this.diaSemanaSelecionadoAdicionarTarefa || !this.horariosAdicionarTarefa) {
      alert('Preencha todos os campos: tarefa, categoria, dia da semana e horário!');
      return;
    }

    const novaTarefa: Tarefa = {
      titulo: this.novaTarefaTexto.trim(),
      categorias: [this.categoriaSelecionadaAdicionarTarefa],
      completa: false,
      dataCriacao: new Date().toISOString(),
      ordem: this.tarefas.length,
      prazo: {
        diaSemana: this.diaSemanaSelecionadoAdicionarTarefa as DiaSemana,
        hora: this.horariosAdicionarTarefa
      }
    };

    try {
      // add ao db
      await this.bd.adicionarTarefa(novaTarefa);
      this.novaTarefaTexto = '';
      this.categoriaSelecionadaAdicionarTarefa = null;
      this.diaSemanaSelecionadoAdicionarTarefa = '';
      this.horariosAdicionarTarefa = '12:00';
      await this.carregarTarefas();
    } catch (erro) {
      console.error('Erro ao adicionar tarefa:', erro);
    }
  }

  // remova tarefa apos a confirmacao 
  async removerTarefa(tarefa: Tarefa): Promise<void> {
    if (confirm('Remover esta tarefa?')) {
      try {
        await this.bd.removerTarefa(tarefa.id || 0);
        await this.carregarTarefas();
      } catch (erro) {
        console.error('Erro ao remover:', erro);
      }
    }
  }

  async atualizarTarefa(tarefa: Tarefa): Promise<void> {
    try {
      await this.bd.atualizarTarefa(tarefa);
      await this.carregarTarefas();
      this.carregarPontos();
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
    }
  }

  // aqui � drag and drop

  // reordena quando o usuario move
  async aoSoltarTarefa(evento: CdkDragDrop<Tarefa[]>): Promise<void> {
    // se mudou de posi��o, reordena
    if (evento.previousIndex !== evento.currentIndex) {
      moveItemInArray(this.tarefas, evento.previousIndex, evento.currentIndex);
      this.tarefas.forEach((t, i) => {
        t.ordem = i;
        this.bd.atualizarTarefa(t).catch(e => console.error('Erro ao atualizar ordem:', e));
      });
    }
  }

  // categorias

  // add nova categoria (modal)
  abrirModalAdicionarCategoria(): void {
    this.mostrarModalAdicionarCategoria = true;
  }

  fecharModalAdicionarCategoria(): void {
    this.mostrarModalAdicionarCategoria = false;
  }

  //add nova categoria chamada pelo modal
  async adicionarNovaCategoria(nomeCategoria: string): Promise<void> {
    await this.servCateg.adicionarCategoria(nomeCategoria);
    this.mostrarModalAdicionarCategoria = false;
  }

  // abre o modal de editar cat
  abrirModalEditarCategorias(tarefa: Tarefa): void {
    this.tarefaSelecionadaParaEditarCategorias = { ...tarefa };
    this.mostrarModalEditarCategorias = true;
  }

  fecharModalEditarCategorias(): void {
    this.mostrarModalEditarCategorias = false;
    this.tarefaSelecionadaParaEditarCategorias = null;
  }

  async salvarCategoriasDaTarefa(tarefaAtualizada: Tarefa): Promise<void> {
    await this.atualizarTarefa(tarefaAtualizada);
    this.fecharModalEditarCategorias();
  }

  salvarNomeUsuario(): void {
    if (!this.nomeUsuarioTemporario.trim()) {
      alert('Por favor, digite seu nome!');
      return;
    }
    this.nomeUsuario = this.nomeUsuarioTemporario.trim();
    localStorage.setItem('nomeUsuario', this.nomeUsuario);
    this.mostrarModalBoasVindas = false;
  }

  fecharModalBoasVindas(): void {
    this.mostrarModalBoasVindas = false;
  }

}
