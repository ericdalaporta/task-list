<div align="center">

# 🧠 Meu Quadro de Tarefas  
### Um app leve e eficiente para organizar sua vida sem perder o estilo 💼✨  

![Demo do Aplicativo](public/gif-task.gif)

</div>

 
## 🚀 Começando

### 🧩 Requisitos
- **Node.js** → v20.16.0  
- **npm** → 10.8.1  

### Instalar e Rodar
```bash
git clone https://github.com/ericdalaporta/task-list.git
cd task-list-main
npm install
npm start
```

Acesse: `http://localhost:4200`

 

## ✨ Principais Recursos

- ✅ Crie, edite e exclua tarefas com facilidade  
- 🏷️ Categorias totalmente personalizáveis  
- 💾 Salvamento automático com **IndexedDB**  
- 🧲 Organize tarefas com **drag & drop**  
- 🔍 Filtro por categoria  
- 📱 Interface 100% responsiva  

 

## 🎮 Como Usar

| Ação | O que fazer |
|------|--------------|
| ➕ **Adicionar tarefa** | Digite o nome, escolha a categoria e clique em “+ Tarefa” |
| 🏷️ **Gerenciar categorias** | Clique em “+ Categoria” ou edite direto nas tarefas |
| 🔄 **Reordenar** | Arraste e solte as tarefas |
| 🔍 **Filtrar** | Clique em uma categoria na barra lateral |

 

## 🧠 Tecnologias

| Stack | Descrição |
|-------|------------|
| **Angular 19.2** | Framework principal |
| **TypeScript** | Linguagem base |
| **Bootstrap 5.3** | Estilização responsiva |
| **Angular CDK** | Função de drag & drop |
| **IndexedDB** | Armazenamento local |


 

## 📁 Estrutura

```
src/
├── app/
│   ├── components/
│   │   ├── main/
│   │   ├── sidebar/
│   │   ├── task-item/
│   │   └── category-modal/
│   ├── services/
│   │   ├── db.service.ts
│   │   └── category.service.ts
│   └── ...
├── styles.css
└── index.html
```

 

## 💾 Armazenamento

- 🗒️ **Tarefas** → IndexedDB  
- 🏷️ **Categorias** → localStorage  

---

## 🧰 Dicas & Soluções

> 💥 **npm install não funciona?**  
> ```bash
> npm install --legacy-peer-deps
> ```

> ⚠️ **Porta 4200 ocupada?**  
> ```bash
> ng serve --port 4201
> ```

> 🧼 **Dados não salvam?**  
> Verifique o IndexedDB (F12 → Application)  
> ou limpe o cache (**Ctrl+Shift+Delete**)

 
<div align="center">

### 👨‍💻 Desenvolvido por  
**[ericdalaporta](https://github.com/ericdalaporta)**  

</div>
