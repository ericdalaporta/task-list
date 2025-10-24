import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriasSubject: BehaviorSubject<string[]>;
  public categorias$: Observable<string[]>;
  private storageKey = 'tarefas_categorias';

  constructor() {
    const categoriasSalvas = this.carregarDoStorage();
    this.categoriasSubject = new BehaviorSubject<string[]>(categoriasSalvas);
    this.categorias$ = this.categoriasSubject.asObservable();
  }

  private carregarDoStorage(): string[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
      }
      
      const salvas = localStorage.getItem(this.storageKey);
      if (salvas) {
        return JSON.parse(salvas);
      }
    } catch (error) {
      // Silenciar erros
    }
    return ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
  }

  private salvarNoStorage(categorias: string[]) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(categorias));
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  }

  getCategorias(): string[] {
    return this.categoriasSubject.value;
  }

  addCategoria(categoria: string) {
    const categorias = this.categoriasSubject.value;
    if (!categorias.includes(categoria)) {
      const novasCategorias = [...categorias, categoria];
      this.categoriasSubject.next(novasCategorias);
      this.salvarNoStorage(novasCategorias);
    }
  }

  removeCategoria(categoria: string) {
    const categorias = this.categoriasSubject.value.filter(c => c !== categoria);
    this.categoriasSubject.next(categorias);
    this.salvarNoStorage(categorias);
  }

  reordenarCategorias(categorias: string[]) {
    this.categoriasSubject.next(categorias);
    this.salvarNoStorage(categorias);
  }
}

