import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() onCategorySelect = new EventEmitter<string | null>();

  selecionarCategoria(categoria: string | null) {
    this.onCategorySelect.emit(categoria);
  }
}
