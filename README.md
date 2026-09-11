# 📚 Sistema de Biblioteca

Aplicação full stack de gerenciamento de biblioteca com **controle de usuários, bibliotecas, livros e empréstimos**.

- **Frontend:** React 18 + Vite + React Router + Axios
- **Backend:** Node.js + Express (API REST) + MySQL
- **Autenticação:** JWT (JSON Web Token) com senhas criptografadas (bcrypt)

---

## 🧱 Estrutura do Projeto

```
atividade2-pfs2/
├── biblioteca/            # Backend (API REST)
│   ├── src/
│   │   ├── controller/    # Lógica das rotas
│   │   ├── middleware/    # Autenticação JWT
│   │   ├── repository/    # Acesso ao banco de dados (SQL)
│   │   ├── routes/        # Definição das rotas
│   │   ├── sql/           # Script de criação das tabelas
│   │   ├── config.js      # Conexão com o MySQL
│   │   └── server.js      # Inicialização do servidor
│   ├── .env               # Variáveis de ambiente (JWT)
│   └── package.json
├── frontend/              # Frontend (SPA React)
│   └── src/
│       ├── components/    # Componentes reutilizáveis (layout, UI)
│       ├── context/       # AuthContext e ToastContext
│       ├── hooks/         # Hooks de dados (useBooks, useLibraries)
│       ├── pages/         # Telas (auth, bibliotecas, livros)
│       ├── services/      # Chamadas HTTP (axios)
│       ├── utils/         # Helpers (JWT, erros)
│       ├── App.jsx        # Rotas da aplicação
│       └── main.jsx       # Ponto de entrada
└── README.md
```

---

## ✨ Funcionalidades

### Autenticação
- Cadastro de usuários com senha criptografada (bcrypt)
- Login com geração de token JWT (expiração de 8h)
- Rotas protegidas por middleware de autenticação
- Tratamento de sessão expirada no frontend

### Bibliotecas (CRUD)
- Listar, criar, editar e excluir bibliotecas
- A exclusão remove em cascata os livros vinculados

### Livros (CRUD)
- Listar, criar, editar e excluir livros
- Filtro da lista por biblioteca
- Vinculação de livro a uma biblioteca (relação 1:N)
- Busca de biblioteca por nome no formulário

### Empréstimos (API)
- Criar, listar, editar (registrar devolução) e excluir empréstimos
- Dados retornados com nome do usuário e título do livro

> ⚠️ Os empréstimos estão implementados apenas na **API backend** — ainda não há interface no frontend.

---

## 🚀 Como executar

### Pré-requisitos
- Node.js (v18+)
- MySQL (local, por exemplo XAMPP/MySQL Workbench)
- npm

### 1. Configurar o banco de dados

Crie o banco e as tabelas executando o script `biblioteca/src/sql/create_tables.sql`:

```sql
-- Exemplo: `db_library`
CREATE DATABASE IF NOT EXISTS db_library;
USE db_library;
-- ... execute o conteúdo de create_tables.sql
```

> ⚙️ As credenciais do banco ficam em `biblioteca/src/config.js` (padrão: `root` / senha `1234`). Ajuste de acordo com seu MySQL.

### 2. Configurar o backend

```bash
cd biblioteca
npm install
```

Crie o arquivo `.env` na pasta `biblioteca/` com:

```env
JWT_SECRET=seu_segredo_aleatorio_aqui
JWT_EXPIRES_IN=8h
```

Inicie o servidor:

```bash
npm run dev      # desenvolvimento
# ou
npm start        # produção
```

A API estará disponível em **http://localhost:3000**.

### 3. Configurar o frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/` (há um `.env.example`):

```env
VITE_API_URL=http://localhost:3000
```

Inicie em desenvolvimento:

```bash
npm run dev
```

Aplicação disponível em **http://localhost:5173**.

---

## 🔌 API — Endpoints

> Todas as rotas abaixo de **Bibliotecas, Livros e Empréstimos** exigem o header `Authorization: Bearer <token>`.

### Autenticação

| Método | Endpoint    | Descrição                  |
|--------|-------------|----------------------------|
| POST   | `/auth`     | Login → retorna token JWT  |
| POST   | `/users`    | Cadastro de usuário        |

### Usuários (`/users`)

| Método | Endpoint   | Descrição            |
|--------|------------|----------------------|
| GET    | `/users`   | Lista usuários       |
| GET    | `/users/:id` | Busca usuário      |
| PUT    | `/users/:id` | Atualiza nome/email |
| DELETE | `/users/:id` | Exclui usuário     |

### Bibliotecas (`/libraries`)

| Método | Endpoint       | Descrição            |
|--------|----------------|----------------------|
| GET    | `/libraries`   | Lista bibliotecas    |
| GET    | `/libraries/:id` | Busca biblioteca   |
| POST   | `/libraries`   | Cria biblioteca      |
| PUT    | `/libraries/:id` | Atualiza biblioteca |
| DELETE | `/libraries/:id` | Exclui biblioteca  |

**Body (POST/PUT):** `{ "name": "...", "address": "..." }`

### Livros (`/books`)

| Método | Endpoint              | Descrição                          |
|--------|-----------------------|------------------------------------|
| GET    | `/books`              | Lista livros                       |
| GET    | `/books/:id`          | Busca livro                        |
| GET    | `/books/library/:libraryId` | Lista livros de uma biblioteca |
| POST   | `/books`              | Cria livro                         |
| PUT    | `/books/:id`          | Atualiza livro                     |
| DELETE | `/books/:id`          | Exclui livro                       |

**Body (POST/PUT):** `{ "title": "...", "author": "...", "publication_year": 2001, "library_id": 1 }`

### Empréstimos (`/loans`)

| Método | Endpoint    | Descrição                          |
|--------|-------------|------------------------------------|
| GET    | `/loans`    | Lista empréstimos                  |
| GET    | `/loans/:id`| Busca empréstimo                   |
| POST   | `/loans`    | Cria empréstimo                    |
| PUT    | `/loans/:id`| Registra devolução (`returnDate`)  |
| DELETE | `/loans/:id`| Exclui empréstimo                  |

**Body:** criação `{ "userId": 1, "bookId": 1, "loanDate": "2026-01-01" }` • devolução `{ "returnDate": "2026-02-01" }`

---

## 🗄️ Modelo de Dados

```
libraries (id, name, address)
    └── books (id, title, author, publication_year, library_id)   ← 1:N
users (id, name, email UNIQUE, password)
loans (id, user_id, book_id, loan_date, return_date)              ← N:N users ↔ books
```

- **1 biblioteca → N livros** (FK com `ON DELETE CASCADE`)
- **N usuários ↔ N livros** via tabela `loans`

---

## 🗺️ Rotas do Frontend

| Rota          | Descrição                                    |
|---------------|----------------------------------------------|
| `/register`   | Criação de conta                             |
| `/login`      | Login (redireciona após autenticação)        |
| `/libraries`  | Gerenciamento de bibliotecas (painel inicial)|
| `/books`      | Gerenciamento de livros                      |
| `/profile`    | Edição do perfil do usuário logado           |

Rotas protegidas redirecionam para `/login` quando o usuário não está autenticado.

---

## 🔒 Aspectos de Segurança

- Senhas armazenadas com **bcrypt (salt rounds = 10)**
- Autenticação via **JWT** com tempo de expiração configurável
- Tokens armazenados no `localStorage` e enviados no header `Authorization`
- CORS restrito ao domínio do frontend (`http://localhost:5173`)
- Erros de login tratados sem vazar qual campo está incorreto

---

## 🛣️ Roadmap (sugestões)

- [ ] Interface frontend para **empréstimos**
- [ ] Validação e sanitização de dados no backend (ex.: express-validator)
- [ ] Migração das credenciais do banco para variáveis de ambiente
- [ ] Tratamento centralizado de erros (error handler global)
- [ ] Testes automatizados

---

## 📄 Licença

Projeto acadêmico — uso educacional.