# E-Commerce - Loja Virtual

Projeto completo de e-commerce com React, Node.js e PostgreSQL.

## Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Docker**: Docker Compose com containers para API, Frontend e Banco de Dados

## Funcionalidades

- Cadastro e login de usuários (JWT + httpOnly cookies)
- Catálogo de produtos com busca, filtros e ordenação
- Carrinho de compras
- Finalização de compra (simulada)
- Painel administrativo:
  - CRUD de produtos
  - CRUD de categorias
  - Gerenciamento de pedidos
  - Gerenciamento de usuários

## Início Rápido

### Com Docker

```bash
# Copiar o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Subir todos os serviços
docker-compose up --build

# Em outro terminal, rodar as migrações e seed
docker-compose exec backend npx prisma db push
docker-compose exec backend npx tsx prisma/seed.ts
```

### Manualmente

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Credenciais de Teste

### Admin
- Email: admin@ecommerce.com
- Senha: admin123

### Cliente
- Email: customer@ecommerce.com
- Senha: customer123

## Estrutura do Projeto

```
ecommerce/
├── frontend/          # React + Vite + Tailwind + shadcn/ui
├── backend/           # Express + Prisma + PostgreSQL
├── docker-compose.yml # Orquestração dos serviços
└── .env.example       # Variáveis de ambiente de exemplo
```

## Endpoints da API

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PATCH /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Categories
- GET /api/categories
- GET /api/categories/:id
- GET /api/categories/slug/:slug
- POST /api/categories (admin)
- PATCH /api/categories/:id (admin)
- DELETE /api/categories/:id (admin)

### Orders
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PATCH /api/orders/:id/status (admin)
- PATCH /api/orders/:id/cancel

### Users (admin)
- GET /api/users
- GET /api/users/:id
- PATCH /api/users/:id
- PATCH /api/users/:id/password
- DELETE /api/users/:id