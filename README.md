# UTFgo

O UTFgo conecta membros da comunidade acadêmica que oferecem
caronas a passageiros que precisam ir ao campus ou retornar dele.

## Autores

- Eduardo Padilha do Nascimento

## Documentação

- [Requisitos do produto (PRD)](docs/prd.md)
- [Jornadas de usuário](docs/user-flows.md)
- [Tokens de design](docs/design-tokens.md)
- [Arquitetura do sistema](docs/architecture.md)
- [Checklist da disciplina](docs/checklist.md)

## Stack

- Backend: NestJS 12, Express e TypeScript.
- Frontend: React 19, Vite 8 e TypeScript.
- Runtime: Node.js 24 e npm.
- Testes: Vitest, Supertest e React Testing Library.

Prisma, PostgreSQL e integrações estão definidos na [arquitetura](docs/architecture.md)
e serão implementados nas próximas histórias.

## Em produção

- **Aplicação:** [URL]
- **API (Swagger):** [URL/docs]

## Quick Start

Use Node.js 24. Com nvm, execute os comandos abaixo na raiz:

```bash
nvm use
npm --prefix apps/api ci
npm --prefix apps/web ci
```

Inicie cada app em um terminal:

```bash
npm run api
```

```bash
npm run web
```

A API atende em `http://localhost:3000` e o frontend em `http://localhost:5173`.
O scaffold ainda não exige banco nem credenciais externas.

Para verificar a fundação técnica:

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

Os testes atuais verificam os exemplos dos geradores; as regras do UTFgo serão
testadas durante a implementação das histórias.
