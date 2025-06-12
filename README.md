# Notification Worker Backend (BE)

Aplicação backend para simulação de envio de notificações assíncronas usando NestJS, MongoDB, Redis (Bull) e WebSockets.

## 🚀 Visão Geral

- **Domain Layer**: contém as entidades, interfaces e regras de negócio puras (ex.: `Message` entity, `MessageRepository`).
- **Application Layer**: implementa os Use Cases que orquestram as operações do domínio (ex.: `CreateMessageUseCase`, `UpdateMessageStatusUseCase`).
- **Infraestrutura**: inclui adaptações para banco (MongoDB), fila (Bull/Redis) e WebSocket.
- **Interfaces**: define controladores HTTP (API REST), WebSocket Gateways e dashboard (Bull Board).

## 📁 Estrutura de Pastas

```plaintext
src/
├─ app.module.ts       # Módulo raiz
├─ main.ts             # HTTP + WebSocket bootstrap
├─ main-worker.ts      # Worker Bull bootstrap
├─ domain/             # Entidades e interfaces de repositório
├─ app/                # Casos de uso (Use Cases + DTOs)
├─ modules/            # Módulos de negócio
│   ├─ auth/           # Autenticação JWT
│   ├─ user/           # Usuários
│   └─ message/        # Mensagens (API e Service)
├─ infra/              # Infra (DB, Queue, WebSocket)
│   ├─ db/mongodb/     # Mongoose schemas e conn
│   ├─ queue/          # Bull Config, QueueModule, Processor
│   └─ websocket/      # WebSocket Gateway
├─ interfaces/         # Adaptadores HTTP e Workers
└─ scripts/            # wait-for-*.sh
Dockerfile
docker-compose.yml
.env.example
README.md
```

## ⚙️ Pré-requisitos

Certifique-se de ter o seguinte instalado:

- Node.js v18+
- Docker & Docker Compose

## 📜 Clonagem do repositorio

1. Abra o terminal e navegue para a pasta onde deseja clonar o repositório:
   ```bash
   git clone git@github.com:goodvandro/notification-worker-be.git
   ```
2. Navegue para a pasta clonada:
   ```bash
   cd notification-worker-be
   ```

## 🛠️ Configuração
### Configuração do arquivo `.env`
1. Copie o modelo:
   ```bash
   cp .env.example .env
   ```
2. Abra o `.env` e ajuste as variáveis conforme o exemplo:
   ```dotenv
   # Porta do servidor HTTP
   WEB_SERVER_PORT=3001

   # MongoDB
   DB_HOST=db
   DB_PORT=27017
   DB_USER=root
   DB_PASS=root
   DB_NAME=notifications

   # Redis (Bull)
   REDIS_HOST=redis
   REDIS_PORT=6379

   # JWT
   JWT_SECRET=supersecretjwt
   JWT_EXPIRES_IN=5m
   JWT_REFRESH_EXPIRES_IN=7d

   # URL do Front-end para CORS
   WEB_FRONTEND_URL=http://localhost:5173

   # Token de acesso ao Bull Board
   ADMIN_BULL_BOARD_TOKEN=admin-bull-board-secret-token
   ```
3. Copie `.env.example` para `.env` e ajuste variáveis de conexão e tokens.
4. Certifique-se de ter o script de espera para o Redis em `scripts/`:
   - `wait-for-redis.sh`

### Executando com Docker Compose
```bash
docker compose down --volumes
docker compose up --build -d
```

### Ou Utilizando o Makefile
```bash
make down-v
make up
```

## 🌐 URLs de Acesso a API
- **API HTTP + WebSocket:** [http://localhost:3001](http://localhost:3001)
- **Bull Board:** [http://localhost:3001/admin/queues?token=](http://localhost:3001/admin/queues?token=)\<ADMIN\_BULL\_BOARD\_TOKEN>


## 📦 Scripts Para Rodar os Testes
- `test` - executa os testes unitários dos casos de uso

## 🔗 Endpoints Principais
Os exemplos de testes de endpoints podem ser encontrados na pasta `/api`

- **POST** `/auth/register` – registrar usuário
- **POST** `/auth/login`    – obter JWT
- **POST** `/auth/refresh`    – obter JWT
- **POST** `/messages`      – criar notificação (Authenticated)
- **GET**  `/messages`      – listar notificações do utilizador em sessão, com filtro por status e paginação (Authenticated)
- **REDIS/BULL** + **WebSocket** `/messageStatusUpdated` – evento de atualização de status (Authenticated)

## 📊 Dashboard de Filas (Bull Board)
- Acesse `/admin/queues?token=<ADMIN_BULL_BOARD_TOKEN>` para monitorar jobs.

## 🎓 Camadas da Arquitetura
- **Domain Layer:** entidades e contratos sem dependência de frameworks.
- **Application Layer:** casos de uso que coordenam repositórios e gateways.
- **Infra Layer:** implementação concreta de repositório (MongoDB), fila (Redis/Bull), WebSocket.
- **Interface Layer:** adaptadores para HTTP, WebSocket e dashboards.

## 🎯 Próximos Passos
- Adicionar deploy com docker, utilizando CI/CD
- Implementar testes unitários e E2E
- Incluir monitoramento e métricas

---

## 🧑‍💻 Autor

Desenvolvido por [Evandro Monteiro](https://github.com/goodvandro)

---