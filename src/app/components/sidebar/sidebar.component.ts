import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-barra',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class ComponenteBarra {
  @Output() aoCategoriaSelecionada = new EventEmitter<string | null>();
  
  selecionarCategoria(categoria: string | null) {
    this.aoCategoriaSelecionada.emit(categoria);
  }
}
