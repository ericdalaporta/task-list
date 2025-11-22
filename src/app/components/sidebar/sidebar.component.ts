import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoCategorias } from '../../services/category.service';

@Component({
  selector: 'app-barra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class ComponenteBarra implements OnInit {
  @Output() aoCategoriaSelecionada = new EventEmitter<string | null>();
  
  categorias: string[] = [];

  constructor(private servicoCategorias: ServicoCategorias) {}

  ngOnInit() {
    this.servicoCategorias.categorias$.subscribe(cats => {
      this.categorias = cats;
    });
  }
  
  obterClasseBadgeCategoria(categoria: string): string {
    const cores: { [key: string]: string } = {
      'Casa': 'bg-success',                 
      'Estudo': 'bg-warning text-dark',    
      'Trabalho': 'bg-primary',             
      'Pessoal': 'bg-danger',              
      'Saúde': 'bg-info text-dark'          
    };
    return cores[categoria] || 'bg-secondary';
  }
  
  selecionarCategoria(categoria: string | null) {
    this.aoCategoriaSelecionada.emit(categoria);
  }
}
