import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicoUsuarios } from '../../services/usuario.service';

/**
 permitir ao usuario criar novo usuario
 */

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.css'
})
export class ComponenteModalUsuario {
   @Output() aoFechar = new EventEmitter<void>();
  
  nomeUsuario = '';

  constructor(private servUsuarios: ServicoUsuarios) {}

  
  async adicionarUsuario() {
     if (!this.nomeUsuario.trim()) {
      alert('Insira um nome para o usuário!');
      return;
    }
  }

   
  fechar() {
    this.aoFechar.emit();
  }
}
