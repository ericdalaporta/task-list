import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServicoBaseDados } from './db.service';
import { Usuario } from '../shared/types';

/**
 * Gerencia usuários do sistema com CRUD, persistência em IndexedDB e sincronização reativa.
 */
@Injectable({ providedIn: 'root' })
export class ServicoUsuarios {
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  constructor(private bd: ServicoBaseDados) {
    // Carrega usuários assim que o serviço é criado
    this.carregarUsuarios();
  }

  /**
   * Carrega todos os usuários do banco de dados e atualiza o observable.
   */
  private async carregarUsuarios() {
    try {
      const usuarios = await this.bd.obterUsuarios() || [];
      console.log('📦 Usuários carregados:', usuarios);
      this.usuariosSubject.next(usuarios);
    } catch (erro) {
      console.error('Erro ao carregar usuários:', erro);
      this.usuariosSubject.next([]);
    }
  }

  /**
   * Retorna a lista atual de usuários sem precisar do observable.
   */
  obterUsuarios(): Usuario[] {
    return this.usuariosSubject.value;
  }

  /**
   * Adiciona um novo usuário ao sistema.
   * 
   * Processo:
   * 1. Cria objeto Usuario
   * 2. Salva no banco de dados (IndexedDB)
   * 3. Recarrega a lista de usuários
   * 4. Observable é atualizado automaticamente
   */
  async adicionarUsuario(nome: string): Promise<void> {
    try {
      // Cria novo usuário
      const novoUsuario: Usuario = { nome: nome.trim() };
      
      console.log('➕ [SERVIÇO] Adicionando usuário:', novoUsuario);
      
      // Salva no banco
      try {
        await this.bd.adicionarUsuario(novoUsuario);
        console.log('✅ [SERVIÇO] Salvo no BD');
      } catch (erroBD) {
        console.error('❌ [SERVIÇO] Erro ao salvar no BD:', erroBD);
        throw erroBD;
      }
      
      // Recarrega para pegar o ID gerado
      console.log('🔄 [SERVIÇO] Recarregando usuários...');
      await this.carregarUsuarios();
      
      console.log('✅ [SERVIÇO] Usuário adicionado com sucesso. Lista atual:', this.usuariosSubject.value);
    } catch (erro) {
      console.error('❌ [SERVIÇO] Erro ao adicionar usuário:', erro);
      throw erro;
    }
  }

  /**
   * Remove um usuário do sistema.
   */
  async removerUsuario(usuarioId: number): Promise<void> {
    try {
      await this.bd.removerUsuario(usuarioId);
      await this.carregarUsuarios();
    } catch (erro) {
      console.error('Erro ao remover usuário:', erro);
    }
  }

  /**
   * Busca um usuário específico pelo ID.
   */
  obterUsuarioPorId(usuarioId: number): Usuario | undefined {
    return this.obterUsuarios().find(u => u.id === usuarioId);
  }
}
