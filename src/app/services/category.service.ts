import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServicoBaseDados } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ServicoCategorias {
  private assuntoCategorias: BehaviorSubject<string[]>;
  public categorias$: Observable<string[]>;

  private readonly CATEGORIAS_PADRAO = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];

  constructor(private servicoBaseDados: ServicoBaseDados) {
    this.assuntoCategorias = new BehaviorSubject<string[]>([]);
    this.categorias$ = this.assuntoCategorias.asObservable();
    this.carregarCategorias();
  }

  private async carregarCategorias() {
    let categorias = await this.servicoBaseDados.obterCategorias?.();
    if (!categorias || categorias.length === 0) {
      categorias = this.CATEGORIAS_PADRAO;
      await this.servicoBaseDados.salvarCategorias?.(categorias);
    }
    this.assuntoCategorias.next(categorias);
  }

  obterCategorias(): string[] {
    return this.assuntoCategorias.value;
  }

  async adicionarCategoria(categoria: string) {
    const categorias = this.assuntoCategorias.value;
    if (!categorias.includes(categoria)) {
      const novasCategorias = [...categorias, categoria];
      await this.servicoBaseDados.salvarCategorias?.(novasCategorias);
      this.assuntoCategorias.next(novasCategorias);
    }
  }

  
  async removerCategoria(categoria: string) {
    const categorias = this.assuntoCategorias.value.filter(c => c !== categoria);
    await this.servicoBaseDados.salvarCategorias?.(categorias);
    this.assuntoCategorias.next(categorias);
  }

  async reordenarCategorias(categorias: string[]) {
    await this.servicoBaseDados.salvarCategorias?.(categorias);
    this.assuntoCategorias.next(categorias);
  }
}