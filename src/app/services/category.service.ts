import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServicoBaseDados } from './db.service';
import { CATEGORIAS_PADRAO } from '../shared/constants';

@Injectable({ providedIn: 'root' })
export class ServicoCategorias {
  // behaviorSubject =  armazena e emite um valor atualmente
  // observable = permite componentes se "inscreverem" ou algo do tipo para receber atualizações
  private assuntoCategorias: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public categorias$: Observable<string[]> = this.assuntoCategorias.asObservable();

  constructor(private bd: ServicoBaseDados) {
    this.carregarCategorias();
  }

  // carrega categorias
  private async carregarCategorias(): Promise<void> {
    let categorias = await this.bd.obterCategorias();
    
    // Se não tiver nada no BD, usa as padrão
    if (!categorias || categorias.length === 0) {
      categorias = CATEGORIAS_PADRAO;
    } else {
      // Se tiver categorias no BD, garante que as padrões estejam incluídas
      const categoriasUnicas = new Set([...CATEGORIAS_PADRAO, ...categorias]);
      categorias = Array.from(categoriasUnicas);
    }
    
    await this.bd.salvarCategorias(categorias);
    this.assuntoCategorias.next(categorias);
  }

  obterCategorias(): string[] {
    return this.assuntoCategorias.value;
  }

  async adicionarCategoria(categoria: string): Promise<void> {
    const categorias = this.assuntoCategorias.value;
    if (!categorias.includes(categoria)) {
      const novas = [...categorias, categoria];
      await this.bd.salvarCategorias(novas);
      this.assuntoCategorias.next(novas);
    }
  }

  async removerCategoria(categoria: string): Promise<void> {
    const categorias = this.assuntoCategorias.value.filter(c => c !== categoria);
    await this.bd.salvarCategorias(categorias);
    this.assuntoCategorias.next(categorias);
  }

  // faz um """reordenamento""" as categorias (usado em drag-and-drop)
  async reordenarCategorias(categorias: string[]): Promise<void> {
    await this.bd.salvarCategorias(categorias);
    this.assuntoCategorias.next(categorias);
  }
}