# 🛠️ Architecture / Software Design Document

**Projeto:** UTFgo
**Versão:** 1.0.0
**Última atualização:** 2026-10-01

> O **prd.md** define o que o produto faz. Este documento define onde as
> responsabilidades moram, como os conceitos são nomeados no código e quais
> padrões valem para todo o sistema. Contratos específicos de uma story nascem
> na respectiva **spec.md**.

---

## 🤖 1. Fontes de Contexto para a IA

| Fonte | Onde configurar | Serve para |
| :-- | :-- | :-- |
| Constituição | **.agents/rules/utf-rules.md**, carregada por **AGENTS.md** | fases do SDD, limites, revisão e Git |
| Workflows | **.agents/workflows/** | PRD, backlog, jornadas, design, arquitetura, setup, issues e tarefas |
| Agentes | **.agents/agents/** | implementação, revisões, auditoria e tutoria |
| Ficha | **docs/checklist.md** | regras, indicadores e entregas |
| Requisitos | **docs/prd.md** | fonte da verdade sobre o produto |
| Jornadas | **docs/user-flows.md** | caminhos críticos, espera, abandono e decisões |
| Tokens | **docs/design-tokens.md** | cores, espaçamento, tipografia e estados |
| Protótipo | Pendente em **docs/design-tokens.md** | hierarquia visual das telas |

---

## 📦 2. Stack Tecnológica

### 2.1. Versões principais

| Área | Escolha | Linha principal |
| :-- | :-- | :-- |
| Runtime | Node.js LTS | 24 |
| Linguagem | TypeScript | pin compatível no package.json |
| Backend | NestJS, Express e ESM | 12 |
| ORM | Prisma ORM estável | 7 |
| Banco | PostgreSQL | 18 |
| Frontend | React | 19 |
| Build frontend | Vite | 8 |
| Roteamento | React Router | 8 |
| Estado do servidor | TanStack Query | 5 |
| Estilos | CSS Modules + tokens globais | — |
| Gerenciador | npm | fornecido pelo Node.js 24 |

As versões exatas ficam nos **package.json** e locks de cada app. Atualizar uma
major exige alterar este documento primeiro.

### 2.2. Dependências autorizadas

**API:** pacotes oficiais do NestJS para núcleo, configuração, JWT, Swagger,
agendamento e testes; Prisma 7, Prisma Client 7, adaptador PostgreSQL e driver
**pg**; validação e transformação de DTOs; validação do ambiente; SDKs do
Mercado Pago, Resend e Cloudinary; Vitest, Supertest, cobertura V8 e oxlint.

**Web:** React e React DOM 19; React Router 8; TanStack Query 5; Vite 8 e plugin
oficial do React; React Testing Library, ambiente DOM simulado, Vitest,
cobertura V8; ESLint e plugins oficiais de React e hooks.

Dependência não listada precisa de justificativa e atualização deste documento
antes de entrar no projeto.

---

## 🧱 3. Arquitetura Backend

### 3.1. Camadas

- **Module:** delimita um domínio e exporta somente serviços necessários.
- **Controller:** recebe a requisição, aplica contrato de entrada, chama o
  serviço e devolve o resultado. Não contém regra de negócio ou acesso ao banco.
- **Service:** executa casos de uso, regras de aplicação e transações.
- **Repository:** isola Prisma. Nenhuma outra camada acessa o ORM diretamente.
- **DTO:** declara e valida dados no limite HTTP.
- **Integration adapter:** encapsula Mercado Pago, Resend e Cloudinary.

As dependências seguem Controller → Service → Repository/adapter. Repository e
adapter nunca dependem de Controller.

### 3.2. Entrada, resposta e erros

- ValidationPipe global: **whitelist**, **forbidNonWhitelisted** e **transform**
  habilitados.
- DTOs são classes com validação declarativa.
- Interceptor global envolve sucesso em **{ data, meta? }**.
- Exception Filter global envolve erro em
  **{ statusCode, code, message, details?, timestamp, path }**.
- Stack, credenciais e respostas brutas de fornecedores não chegam ao cliente.
- Logs de erro removem dados pessoais e segredos.

### 3.3. Autenticação e autorização

- O código temporário é enviado pelo Resend, armazenado como hash e invalidado
  por uso, expiração ou emissão de outro código.
- Após validação, a API emite JWT de acesso e de renovação.
- O JWT de acesso fica somente em memória no frontend e segue como bearer token.
- O JWT de renovação fica em cookie **HttpOnly**, **Secure** e com política
  compatível com as origens publicadas.
- Tokens nunca ficam em localStorage ou sessionStorage.
- Rotas são privadas por padrão; exceções públicas são explícitas.
- RolesGuard protege ações administrativas.
- Guards de propriedade impedem acesso a recursos de outro usuário.
- CORS aceita credenciais somente das origens configuradas.

### 3.4. Persistência

- PrismaService central controla o cliente.
- Cada domínio usa repositories próprios.
- Operações de carteira, reserva, pedido e pagamento são atômicas.
- Toda alteração de fichas cria WalletTransaction na mesma transação do saldo.
- IDs de eventos externos e restrições únicas impedem reprocessamento.
- Históricos essenciais não sofrem exclusão física.

### 3.5. Integrações

| Integração | Responsabilidade | Isolamento |
| :-- | :-- | :-- |
| Mercado Pago | Pix/cartão sandbox, consulta, confirmação e estorno | somente Payments conhece o SDK |
| Resend | envio de código | somente EmailAdapter conhece o SDK |
| Cloudinary | CNH e CRLV autenticados | banco guarda identificador e metadados; URL é temporária |
| Neon | PostgreSQL de produção | somente configuração e dados conhecem a conexão |

O pedido nasce no servidor. O retorno do navegador não confirma pagamento. O
webhook de confirmação assíncrona exige assinatura válida, consulta do estado
real quando necessário e processamento idempotente. Repetições não duplicam fichas.
Confirmação após expiração segue o estorno definido no PRD.

### 3.6. Rotinas temporais

Rotinas agendadas cuidam de expirações e finalizações automáticas. Todas são
idempotentes: repetir execução não duplica saldo, penalidade ou transição.

---

## 🌐 4. Contrato Vivo da API

- OpenAPI/Swagger é gerado do código e servido pela API.
- Interface interativa: **/docs**.
- Documento JSON em execução: **/docs-json**.
- JWT, DTOs, respostas e erros aparecem no contrato.
- O frontend deriva tipos e contratos da documentação viva.
- Não há tabela manual de endpoints neste arquivo.
- O arquivo swagger.json não é commitado; a API em execução é a fonte oficial.

---

## 🗂️ 5. Estrutura do Monorepo

~~~text
.
├── .agents/                     # constituição, workflows e agentes
├── .claude/ .cursor/ .opencode/ # cascas das ferramentas
├── .github/                     # CI, template e portão de entendimento
├── AGENTS.md                    # carrega a constituição
├── README.md                    # vitrine e instruções
├── compose.yaml                 # PostgreSQL 18 local
├── docs/                        # documentos da Fase 0 e guias
├── specs/                       # spec, plano e revisões por Issue
└── apps/
    ├── api/
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── migrations/
    │   ├── src/
    │   │   ├── common/
    │   │   ├── config/
    │   │   ├── database/
    │   │   └── modules/
    │   └── test/
    └── web/
        ├── package.json
        ├── package-lock.json
        └── src/
            ├── app/
            ├── assets/
            ├── components/
            ├── features/
            ├── repositories/
            ├── routes/
            ├── styles/
            └── types/
~~~

Cada app tem dependências e lock próprios. Não há npm workspaces, Nx ou
Turborepo enquanto não existir código compartilhado que justifique isso.

---

## ⚛️ 6. Arquitetura Frontend

### 6.1. Padrões React

- componentes de função e hooks, sem classes;
- hooks somente no topo de componentes e hooks próprios;
- TypeScript, Strict Mode e regras oficiais de lint;
- páginas separadas de componentes reutilizáveis;
- lazy loading por rota;
- CSS Modules por componente e tokens como variáveis globais;
- interface em português; código e dados em inglês.

### 6.2. Dados e estado

- componente nunca chama servidor diretamente;
- acesso HTTP passa por **repositories** usando fetch nativo;
- TanStack Query controla cache, carregamento, erro, invalidação e nova consulta;
- Context e hooks nativos atendem apenas estado pequeno da interface e sessão;
- não há biblioteca adicional de estado;
- estados de vazio, carregamento, erro e sucesso são explícitos.

### 6.3. Navegação e sessão

- React Router controla rotas e lazy loading.
- Rotas privadas verificam sessão antes de exibir conteúdo.
- Ao recarregar, o app tenta renovar a sessão pelo cookie seguro.
- Falha de renovação limpa a sessão e direciona para o acesso.
- A SPA configura fallback para **index.html** no deploy.

---

## 🗄️ 7. Arquitetura de Dados

### 7.1. Padrões globais

- IDs UUID.
- Datas em UTC e apresentação em **America/Sao_Paulo**.
- Dinheiro em centavos inteiros; nunca ponto flutuante.
- Fichas e pontos são inteiros.
- E-mail normalizado em minúsculas.
- CPF contém somente dígitos e não é exposto indevidamente.
- Estados são enums em inglês.
- Entidades persistentes possuem createdAt e updatedAt.
- deletedAt representa exclusão lógica onde o histórico deve permanecer.

### 7.2. Glossário técnico

| Termo PRD | Entidade técnica | Atributos principais |
| :-- | :-- | :-- |
| Usuário | User | id, email, name, cpf, photoUrl, role, status |
| Código de acesso | AuthCode | id, userEmail, codeHash, expiresAt, usedAt |
| Condutor | DriverProfile | id, userId, status |
| Documento | DriverDocument | id, driverProfileId, type, assetId, expiresAt, status, reviewedBy |
| Ponto de encontro | MeetingPoint | id, name, location, active |
| Carona | Ride | id, driverId, meetingPointId, direction, scheduledAt, seatCount, status |
| Solicitação/Reserva | Booking | id, rideId, passengerId, status, decidedAt, cancelledAt, attendance |
| Carteira | Wallet | id, userId, balance |
| Movimentação | WalletTransaction | id, walletId, type, amount, referenceType, referenceId |
| Pedido de fichas | PurchaseOrder | id, userId, quantity, totalAmount, status, expiresAt |
| Pagamento | Payment | id, purchaseOrderId, provider, providerPaymentId, method, status, confirmedAt |
| Saque | Withdrawal | id, userId, quantity, amount, pixKey, status |
| Penalidade | Penalty | id, userId, rideId, points, reason |
| Contestação | Dispute | id, bookingId, reason, status, decidedBy |
| Avaliação | Rating | id, rideId, authorId, targetId, score, comment |
| Denúncia | Report | id, rideId, authorId, targetId, reason, status |
| Sanção | UserSanction | id, userId, type, reason, startsAt, endsAt, createdBy |

Solicitação e Reserva são fases de Booking. Doações e repasses são tipos de
WalletTransaction, não novas entidades.

### 7.3. Diagrama ER

~~~mermaid
erDiagram
    USER ||--o| DRIVER_PROFILE : "pode possuir"
    USER ||--|| WALLET : possui
    USER o|--o{ AUTH_CODE : "pode solicitar"
    USER ||--o{ PURCHASE_ORDER : cria
    USER ||--o{ BOOKING : solicita
    USER ||--o{ WITHDRAWAL : solicita
    USER ||--o{ PENALTY : recebe
    USER ||--o{ USER_SANCTION : recebe
    USER ||--o{ RATING : escreve
    USER ||--o{ REPORT : registra

    DRIVER_PROFILE ||--o{ DRIVER_DOCUMENT : apresenta
    DRIVER_PROFILE ||--o{ RIDE : oferece

    MEETING_POINT ||--o{ RIDE : atende
    RIDE ||--o{ BOOKING : recebe
    RIDE ||--o{ PENALTY : origina
    RIDE ||--o{ RATING : recebe
    RIDE ||--o{ REPORT : recebe

    WALLET ||--o{ WALLET_TRANSACTION : registra
    PURCHASE_ORDER ||--o{ PAYMENT : possui
    BOOKING ||--o| DISPUTE : "pode gerar"
~~~

As relações 1:N incluem DriverProfile → Ride, MeetingPoint → Ride,
Ride → Booking e PurchaseOrder → Payment.

### 7.4. Banco por ambiente

| Ambiente | Onde roda | Como conecta |
| :-- | :-- | :-- |
| Local | PostgreSQL 18 no Docker via compose.yaml | DATABASE_URL em arquivo local ignorado |
| CI | PostgreSQL 18 temporário no GitHub Actions | variável apenas no job |
| Produção | Neon com conexão agrupada | secret da plataforma |

Migrações Prisma são versionadas. Credenciais nunca aparecem em código, YAML,
documentação ou histórico Git.

---

## 🧭 8. Visão do Sistema

~~~mermaid
flowchart LR
    P["Pessoa usuária"] --> W["React 19 / Vite 8<br/>Vercel"]
    W -->|"HTTPS + JWT"| A["NestJS 12 / Express<br/>Render"]
    A --> D[("PostgreSQL 18<br/>Neon")]
    A --> MP["Mercado Pago<br/>sandbox"]
    MP -->|"confirmação assinada"| A
    A --> R["Resend<br/>e-mail"]
    A --> C["Cloudinary<br/>documentos privados"]
~~~

---

## 🧪 9. Testes e Qualidade

- API: Vitest, ferramentas do NestJS, Supertest e cobertura V8.
- Web: Vitest, React Testing Library, DOM simulado e cobertura V8.
- Lint: oxlint na API; ESLint e plugins oficiais no web.
- Produção segue TDD: RED → GREEN → REFACTOR.
- Testes cobrem sucesso, erro, vazio e autorização pertinentes.

| App | Comando | Finalidade |
| :-- | :-- | :-- |
| API | **cd apps/api && npm test** | testes unitários uma vez |
| API | **cd apps/api && npm run test:watch** | TDD em observação |
| API | **cd apps/api && npm run test:e2e** | testes completos |
| API | **cd apps/api && npm run test:cov** | cobertura |
| API | **cd apps/api && npm run lint** | análise estática |
| API | **cd apps/api && npm run build** | compilação |
| Web | **cd apps/web && npm test** | componentes uma vez |
| Web | **cd apps/web && npm run test:watch** | TDD em observação |
| Web | **cd apps/web && npm run test:cov** | cobertura |
| Web | **cd apps/web && npm run lint** | análise estática |
| Web | **cd apps/web && npm run build** | build de produção |

---

## 🚀 10. CI/CD, Deploy e Segredos

### 10.1. Integração contínua

GitHub Actions usa Node.js 24 e dois jobs:

1. **api:** instala pelo lock, inicia PostgreSQL 18, aplica migrações, roda lint,
   testes unitários, testes completos e build;
2. **web:** instala pelo lock e roda lint, testes e build.

O merge depende dos jobs e do check **explicacao**. O CI recebe somente
credenciais próprias de teste.

### 10.2. Deploy

| Parte | Destino |
| :-- | :-- |
| React/Vite | Vercel |
| NestJS | Render Web Service |
| PostgreSQL | Neon |
| Documentos | Cloudinary |

Deploys partem da main. O frontend configura fallback de SPA. A API escuta a
porta do ambiente e aceita somente origens configuradas. O Render gratuito pode
hibernar; a aplicação deve ser acessada antes da apresentação.

### 10.3. Segredos

- ConfigModule carrega e valida o ambiente na inicialização.
- Arquivos .env reais são ignorados; somente .env.example sem valores é versionado.
- Banco, JWT, Mercado Pago, Resend e Cloudinary usam secrets das plataformas.
- Nenhum segredo recebe prefixo público do frontend.
- Logs removem tokens, CPF, chaves, documentos e dados financeiros sensíveis.

---

## 🗺️ 11. Mapa de Domínios

Este índice cresce quando cada story for implementada. Rotas e contratos ficam
no Swagger e na spec da story.

| Domínio | Módulo | Guard | Dados | US |
| :-- | :-- | :-- | :-- | :-- |
| — | — | — | — | preenchido durante a implementação |

---

## ✅ 12. Rastreabilidade com a Ficha

| ID | Declaração |
| :-- | :-- |
| ID1 | Documento com diagramas Mermaid ER e de contexto. |
| ID2 | Monorepo explícito em apps/api e apps/web. |
| ID6 | Modules, Controllers e Services separados. |
| ID7 | DTOs e ValidationPipe global com whitelist. |
| ID8 | Prisma e repositories para CRUD relacional e transações. |
| ID9 | JWT, roles, guards e propriedade. |
| ID10 | Interceptor de sucesso e filtro global. |
| ID11, ID12 | Vitest, TDD, erros, comandos exatos e CI. |
| ID14 | Swagger vivo em /docs e /docs-json. |
| ID15, ID16 | React, tokens, repositories e JWT seguro. |
| ID17 | ConfigModule, validação e secrets externos. |
| ID18 | GitHub Actions com jobs api e web. |
| ID19 | Vercel, Render e Neon. |
| ID20 | Mercado Pago sandbox, PurchaseOrder e Payment. |
| ID21 | Confirmação assinada, idempotência e segredo fora do Git. |

---

## 📅 13. Histórico

| Data | Versão | O que mudou |
| :-- | :-- | :-- |
| 2026-10-01 | 1.0.0 | Arquitetura inicial definida pela entrevista /utf-architecture. |

---

## 🛑 O que ainda não está neste documento

DTOs e endpoints específicos, rotas de telas e máquinas de estado detalhadas
nascem na spec de cada story. Este documento contém apenas decisões globais e
limites estruturais.
