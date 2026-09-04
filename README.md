# VoleiTCC — Estrutura do Projeto (Vue.js + Express)

## Estrutura de pastas

```
voleitcc/
  backend/     -> API em Node.js + Express + PostgreSQL
  frontend/    -> Interface em Vue.js (Vite)
```

## 1. Banco de dados (PostgreSQL)

1. Crie o banco: `CREATE DATABASE voleitcc;`
2. Rode o script de criação das tabelas:
   ```
   psql -U postgres -d voleitcc -f backend/src/config/schema.sql
   ```

## 2. Backend (Express)

```bash
cd backend
cp .env.example .env   # depois edite com os dados do seu PostgreSQL
npm install
npm run dev             # inicia em http://localhost:3000
```

Rotas prontas:
- `POST /api/auth/cadastro` — cria um usuário (nome, email, senha)
- `POST /api/auth/login` — autentica e retorna um token JWT
- `GET /api/status` — verifica se a API está no ar

## 3. Frontend (Vue.js)

```bash
cd frontend
npm install
npm run dev              # inicia em http://localhost:5173
```

A tela de Login já está em `frontend/src/views/Login.vue`, com o mesmo
visual combinado antes (card branco central, campos de e-mail/senha,
botão "Entrar", fundo com formas azul e amarela).

> A logo em `frontend/src/assets/logo.svg` é um placeholder nas cores
> azul/amarelo/branco. Troque pelo arquivo da sua logo real (pode ser
> `.svg`, `.png` etc. — só ajustar o `import`/`src` no `Login.vue`).

## Próximos passos sugeridos

- Criar as rotas e telas de **times** e **jogadores** (models já
  preparados no `schema.sql`: tabelas `times` e `jogadores`).
- Criar a tela/rota de **agendamento de partidas**.
- Proteger rotas privadas no Vue Router usando o token salvo no
  `localStorage` (`voleitcc_token`).
