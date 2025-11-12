import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicoUsuarios } from '../../services/usuario.service';

/**
 * COMPONENTE MODAL - Adicionar Usuário
 * 
 * Responsabilidade: Permitir ao usuário criar um novo membro/usuário
 * 
 * Funcionalidades:
 * - Input para inserir nome do novo usuário
 * - Valida que o nome não está vazio
 * - Atribui automaticamente uma cor randômica ao novo usuário
 * - Salva no banco de dados via ServicoUsuarios
 * - Emite evento de fechamento após sucesso
 */
@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.css'
})
export class ComponenteModalUsuario {
  // Emite quando o modal deve ser fechado
  @Output() aoFechar = new EventEmitter<void>();
  
  // Armazena o nome do novo usuário sendo digitado
  nomeUsuario = '';

  constructor(private servUsuarios: ServicoUsuarios) {}

  /**
   * Adiciona um novo usuário ao sistema.
   * 
   * Processo:
   * 1. Valida que o nome não está vazio
   * 2. Chama o serviço para adicionar o usuário
   * 3. O serviço atribui uma cor aleatória
   * 4. Persiste no banco de dados
   * 5. Limpa o formulário e fecha o modal
   */
  async adicionarUsuario() {
    // Valida entrada
    if (!this.nomeUsuario.trim()) {
      alert('Insira um nome para o usuário!');
      return;
    }

    try {
      console.log('🔄 [MODAL] Iniciando adição de usuário:', this.nomeUsuario);
      // Adiciona usuário (serviço cuida da cor e persistência)
      await this.servUsuarios.adicionarUsuario(this.nomeUsuario.trim());
      console.log('✅ [MODAL] Usuário adicionado com sucesso');
      // Limpa o campo
      this.nomeUsuario = '';
      // Fecha o modal
      this.fechar();
    } catch (erro) {
      console.error('❌ [MODAL] Erro completo:', erro);
      console.error('❌ [MODAL] Stack:', (erro as any)?.stack);
      alert('Erro ao adicionar usuário: ' + (erro instanceof Error ? erro.message : JSON.stringify(erro)));
    }
  }

  /**
   * Fecha o modal sem adicionar.
   */
  fechar() {
    this.aoFechar.emit();
  }
}
