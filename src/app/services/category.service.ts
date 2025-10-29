import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriasSubject: BehaviorSubject<string[]>;
  public categorias$: Observable<string[]>;

  constructor(private dbService: DbService) {
    this.categoriasSubject = new BehaviorSubject<string[]>([]);
    this.categorias$ = this.categoriasSubject.asObservable();
    this.carregarCategorias();
  }

  // aqui eh pra carregar categorias do Indexeddb
  private async carregarCategorias() {
    let categorias = await this.dbService.getCategorias?.();
    if (!categorias || categorias.length === 0) {
      categorias = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
      await this.dbService.setCategorias?.(categorias);
    }
    this.categoriasSubject.next(categorias);
  }

  getCategorias(): string[] {
    return this.categoriasSubject.value;
  }

  async addCategoria(categoria: string) {
    const categorias = this.categoriasSubject.value;
    if (!categorias.includes(categoria)) {
      const novasCategorias = [...categorias, categoria];
      await this.dbService.setCategorias?.(novasCategorias);
      this.categoriasSubject.next(novasCategorias);
    }
  }

  async removeCategoria(categoria: string) {
    const categorias = this.categoriasSubject.value.filter(c => c !== categoria);
    await this.dbService.setCategorias?.(categorias);
    this.categoriasSubject.next(categorias);
  }

  async reordenarCategorias(categorias: string[]) {
    await this.dbService.setCategorias?.(categorias);
    this.categoriasSubject.next(categorias);
  }
}