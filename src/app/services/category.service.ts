import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageKey = 'tarefas_categorias';
  private categoriasSubject: BehaviorSubject<string[]>;
  public categorias$: Observable<string[]>;

  constructor() {
    // Carregar categorias do localStorage ou usar padrão
    const categoriasSalvas = this.carregarDoStorage();
    this.categoriasSubject = new BehaviorSubject<string[]>(categoriasSalvas);
    this.categorias$ = this.categoriasSubject.asObservable();
  }

  private carregarDoStorage(): string[] {
    try {
      // Verificar se estamos em ambiente de browser
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
    // Retornar categorias padrão
    return ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
  }

  private salvarNoStorage(categorias: string[]) {
    try {
      // Verificar se estamos em ambiente de browser
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

  // Para reordenar categorias (drag & drop)
  reordenarCategorias(categorias: string[]) {
    this.categoriasSubject.next(categorias);
    this.salvarNoStorage(categorias);
  }
}

