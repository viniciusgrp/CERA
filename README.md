# CERA API

API simples para cadastro e gerenciamento de clientes, veículos e estofados.

## Sobre o projeto

Este projeto foi criado para facilitar o controle de clientes, veículos e estofados, permitindo o cadastro, consulta, atualização e remoção dessas informações de forma centralizada. O backend foi desenvolvido com Node.js, TypeScript, Express e MongoDB, focando em simplicidade e clareza.

## Tecnologias utilizadas
- Node.js
- TypeScript
- Express
- MongoDB (Mongoose)

## Como rodar o projeto

1. **Clone o repositório:**

```bash
git clone git@github.com:viniciusgrp/CERA.git
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o ambiente:**

Renomeie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme seu ambiente:


4. **Ajuste a conexão no `.env` para seu banco**:

```
MONGODB_URI=mongodb://localhost:27017/cera-db
```

5. **Execute o projeto em modo desenvolvimento:**

```bash
npm run dev
```

## Endpoints principais

- `POST /clientes` — Cria um novo cliente (e opcionalmente veículos e estofados)
- `GET /clientes` — Lista todos os clientes
- `GET /clientes/{idCliente}` — Busca um cliente específico (com veículos e estofados)
- `PUT /clientes/{idCliente}` — Atualiza dados do cliente e veículos
- `DELETE /clientes/{idCliente}` — Remove cliente e dados associados