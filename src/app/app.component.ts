import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbService } from './services/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  categorias = ['Casa', 'Estudo', 'Trabalho', 'Pessoal', 'Saúde'];
  tarefas: any[] = [];
  novaTarefa = '';
  categoriaSelecionada = this.categorias[0];

  constructor(private dbService: DbService) {}

  ngOnInit() {
    setTimeout(() => this.carregarTarefas(), 500); // Pequeno delay para garantir que o banco abriu
  }

  carregarTarefas() {
    this.dbService.getTarefas().then(tarefas => this.tarefas = tarefas);
  }

  adicionarTarefa() {
    if (this.novaTarefa.trim()) {
      const tarefa = {
        titulo: this.novaTarefa,
        categoria: this.categoriaSelecionada,
        completa: false
      };
      this.dbService.addTarefa(tarefa).then(() => {
        this.novaTarefa = '';
        this.carregarTarefas();
      });
    }
  }

  removerTarefa(tarefa: any) {
    this.dbService.removeTarefa(tarefa.id).then(() => this.carregarTarefas());
  }
}