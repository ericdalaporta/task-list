# Lista de Tarefas Coletiva

Uma aplicação web moderna e intuitiva para gerenciamento de tarefas pessoais, construída com Angular. Organize suas atividades por categorias, defina prazos com dias e horários específicos, e acompanhe seu progresso através de um sistema de pontuação com reset semanal automático.

## 🎯 Características

- **Gerenciamento de Tarefas**: Crie, edite, delete e marque tarefas como concluídas
- **Categorização Inteligente**: 6 categorias pré-configuradas (Casa, Estudo, Trabalho, Pessoal, Saúde, Outras) com opção de criar categorias personalizadas
- **Agendamento Flexível**: Defina o dia da semana e horário para cada tarefa
- **Sistema de Pontuação Semanal**: Acompanhe seu progresso diário com visualização de pontos ganhos e variações
- **Reset Automático**: Todas as tarefas são limpas todo domingo às 23h59 para começar uma nova semana
- **Personalização**: Modal de boas-vindas que captura seu nome na primeira visita
- **Drag & Drop**: Reordene suas tarefas facilmente com arrastar e soltar
- **Persistência de Dados**: Todos os dados são armazenados localmente em IndexedDB
- **Interface Responsiva**: Design moderno com tema lilás, tons prata e animações suaves

## 🚀 Tecnologias Utilizadas

- **Angular 19.2** - Framework frontend
- **TypeScript** - Linguagem de programação
- **IndexedDB** - Armazenamento local de dados
- **Bootstrap 5.3** - Componentes UI
- **Bootstrap Icons** - Ícones
- **Angular CDK** - Funcionalidades avançadas (Drag & Drop)
- **RxJS** - Programação reativa

## 📦 Instalação

### Pré-requisitos
- Node.js (v20+)
- npm (v10+)

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/ericdalaporta/task-list.git
cd task-list-main
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra seu navegador e acesse `http://localhost:4200`

## 🎨 Funcionalidades Principais

### Adicionar Tarefa
1. Preencha o título da tarefa
2. Selecione uma categoria
3. Escolha o dia da semana
4. Defina o horário
5. Clique em "Adicionar" ou pressione Enter

### Gerenciar Categorias
- **Ver Categorias**: As 6 categorias padrão aparecem automaticamente
- **Criar Nova**: Use o botão "+ Categoria" para adicionar categorias personalizadas
- **Editar**: Clique em uma tarefa para gerenciar suas categorias

### Acompanhar Pontuação
- Clique no botão "Pontuação" no topo para visualizar seu desempenho
- **Número**: Quantidade de tarefas completas por dia
- **Variação**: Aumento ou redução em relação ao dia anterior
  - Primeiro dia da semana: mostra o número total de tarefas (sempre positivo)
  - Demais dias: diferença em relação ao dia anterior

### Tarefas Concluídas
- Marque o checkbox para completar uma tarefa
- Tarefas concluídas aparecem com estilo atenuado
- Os pontos são calculados automaticamente

### Reset Semanal Automático
- Toda segunda-feira (domingo às 23h59), todas as tarefas são automaticamente removidas
- Permite focar em uma nova semana de objetivos
- Sistema avisa o usuário quando a limpeza é realizada
- Aviso na primeira visita alertando sobre o reset automático

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── main/                 # Componente principal
│   │   ├── task-item/            # Item individual da tarefa
│   │   ├── category-modal/       # Modal de edição de categorias
│   │   ├── add-category-modal/   # Modal para adicionar categoria
│   │   ├── deadline-modal/       # Modal de prazos
│   │   └── sidebar/              # Barra lateral
│   ├── services/
│   │   ├── db.service.ts         # Gerenciamento de IndexedDB
│   │   ├── category.service.ts   # Lógica de categorias
│   │   └── usuario.service.ts    # Gerenciamento de usuários
│   └── shared/
│       ├── types.ts              # Tipos TypeScript
│       ├── constants.ts          # Constantes da aplicação
│       └── formatters.ts         # Funções de formatação
├── index.html                     # Arquivo HTML principal
└── styles.css                     # Estilos globais
```

## 💾 Persistência de Dados

A aplicação usa **IndexedDB** com as seguintes stores:

- **tarefas**: Armazena todas as tarefas criadas
- **categorias**: Armazena categorias personalizadas
- **usuarios**: Armazena informações do usuário (nome)

Os dados persistem mesmo após fechar o navegador. No entanto, todas as tarefas são limpas automaticamente todo domingo às 23h59.

## 🎨 Paleta de Cores

- **Lilás Forte**: `#8b5cf6` - Cor primária
- **Lilás Fraco**: `rgba(168, 85, 247, 0.6)` - Cor secundária
- **Prata**: `#d1d5db` a `#a1a5ad` - Badges de prazo
- **Cinza**: `#9ca3af` - Elementos secundários
- **Fundo**: Branco com sombras sutis
- **Texto**: Cinza escuro para melhor legibilidade

## 🔄 Sistema de Pontuação

A pontuação funciona da seguinte forma:

1. Cada tarefa completada no dia da semana designado vale 1 ponto
2. O primeiro dia com tarefas mostra a variação como positiva (número total de tarefas)
3. Dias subsequentes mostram a diferença em relação ao dia anterior
4. A modal de "Pontuação" exibe o histórico de pontos ganhos da semana
5. Todo domingo às 23h59, o histórico é resetado junto com as tarefas

### Exemplo:
- **Segunda**: 3 tarefas completadas = +3
- **Terça**: 5 tarefas completadas = +2 (5 - 3)
- **Quarta**: 4 tarefas completadas = -1 (4 - 5)

## 🚀 Recursos Futuros

- [ ] Sincronização em nuvem
- [ ] Notificações de tarefas
- [ ] Modo escuro
- [ ] Exportação de dados
- [ ] Integração com calendário
- [ ] Subtarefas
- [ ] Metas semanais personalizadas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou fazer um pull request.

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👤 Autor

**Eric de Souza**

## 🙏 Agradecimentos

- Angular Team pela excelente documentação
- Community do RxJS
- Bootstrap por seus componentes

---

Desenvolvido com ❤️ para ajudar você a organizar sua vida de forma semanal e eficiente!




