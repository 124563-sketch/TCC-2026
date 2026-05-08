# ML Ascent

Plataforma educacional interativa para o ensino de fundamentos de aprendizado de máquina, desenvolvida como Trabalho de Conclusão de Curso (TCC). Cobre três módulos pedagógicos progressivos — Regressão Linear Simples, Regressão Logística e Análise de Componentes Principais (PCA) — com simuladores paramétricos, quizzes de avaliação e painel de supervisão de progresso.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação e Desenvolvimento](#instalação-e-desenvolvimento)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Banco de Dados](#banco-de-dados)
6. [Build de Produção](#build-de-produção)
7. [Deploy](#deploy)
   - [Vercel (recomendado)](#vercel-recomendado)
   - [Railway](#railway)
   - [VPS / Servidor Próprio](#vps--servidor-próprio)
8. [Estrutura do Projeto](#estrutura-do-projeto)
9. [Funcionalidades](#funcionalidades)
10. [Tecnologias](#tecnologias)

---

## Visão Geral

ML Ascent é uma aplicação web full-stack construída com **Next.js 15** (App Router). Todo o processamento matemático — estimador de mínimos quadrados, gradiente descendente para MLE e decomposição espectral de covariância — é executado inteiramente no navegador em TypeScript, sem dependência de bibliotecas externas de álgebra linear.

O sistema possui dois perfis de usuário:

- **Estudante** — acessa os módulos, interage com os simuladores, realiza os quizzes e acompanha seu progresso.
- **Supervisor** — visualiza o painel com o progresso e as notas de todos os estudantes cadastrados.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|---|---|---|
| Node.js | 20 LTS | Recomendado: 22 LTS |
| npm | 10+ | Incluso no Node.js |
| Git | qualquer | Para clonar o repositório |

Verifique as versões instaladas:

```bash
node -v
npm -v
```

---

## Instalação e Desenvolvimento

```bash
# 1. Clone o repositório
git clone <url-do-repositório>
cd TCC

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com seus valores (veja a seção abaixo)

# 4. Aplique o schema ao banco de dados
npx prisma db push

# 5. Crie o usuário supervisor padrão
npm run prisma:seed
# ou: npx tsx prisma/seed.ts

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:9002`.

> **Nota:** O arquivo `.env.example` deve ser criado a partir da seção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo. O arquivo `.env` nunca é comitado no repositório.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL de conexão com o banco de dados SQLite (desenvolvimento)
DATABASE_URL="file:./dev.db"

# URL pública da aplicação (sem barra no final)
NEXTAUTH_URL="http://localhost:9002"

# Chave secreta para assinatura dos tokens JWT do NextAuth
# Gere uma chave segura com: openssl rand -base64 32
NEXTAUTH_SECRET="substitua-por-uma-chave-longa-e-aleatoria"
```

### Geração da chave secreta

```bash
openssl rand -base64 32
```

Cole o valor gerado em `NEXTAUTH_SECRET`. Em produção, **nunca reutilize** a chave de desenvolvimento.

### Em produção com banco externo (Turso / LibSQL)

Substitua a variável do banco pela URL do banco remoto:

```env
DATABASE_URL="libsql://seu-banco.turso.io?authToken=seu-token"
```

---

## Banco de Dados

O projeto usa **Prisma ORM** com **SQLite** em desenvolvimento e é compatível com **LibSQL/Turso** em produção.

### Comandos essenciais

```bash
# Aplicar o schema ao banco (desenvolvimento)
npx prisma db push

# Visualizar o banco de dados no navegador
npx prisma studio

# Popular o banco com o usuário supervisor padrão
npx tsx prisma/seed.ts

# Regenerar o Prisma Client após alterar o schema
npx prisma generate
```

### Credenciais padrão do supervisor (após seed)

| Campo | Valor |
|---|---|
| E-mail | `supervisor@mlascent.com` |
| Senha | `supervisor123` |

> **Importante:** Altere a senha do supervisor antes de colocar em produção. Edite `prisma/seed.ts` ou faça a alteração diretamente via painel de administração do banco.

---

## Build de Produção

```bash
# Gerar o build otimizado
npm run build

# Iniciar o servidor de produção (após o build)
npm start
```

O servidor de produção também sobe na porta `9002`. Para alterar a porta, modifique os scripts `build` e `start` em `package.json`.

### Verificações antes do build

```bash
# Verificar erros de tipagem
npm run typecheck

# Verificar erros de linting
npm run lint
```

---

## Deploy

### Vercel (recomendado)

A Vercel é a plataforma oficial do Next.js e oferece deploy automático a partir de repositórios Git, com suporte nativo a Server Components, API Routes e Edge Functions.

**Limitação:** a Vercel não persiste arquivos locais entre execuções (SQLite `file:./dev.db` não funciona). Use **Turso** como banco de dados remoto.

#### Passo a passo

**1. Crie um banco Turso**

```bash
# Instale a CLI do Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Faça login
turso auth login

# Crie o banco
turso db create ml-ascent

# Obtenha a URL e o token
turso db show ml-ascent --url
turso db tokens create ml-ascent
```

**2. Aplique o schema ao banco Turso**

```bash
# No .env local, substitua DATABASE_URL pela URL do Turso
DATABASE_URL="libsql://ml-ascent-<usuario>.turso.io?authToken=<seu-token>"

npx prisma db push
npx tsx prisma/seed.ts
```

**3. Deploy na Vercel**

```bash
# Instale a CLI da Vercel (opcional — pode usar o painel web)
npm i -g vercel

# Deploy
vercel
```

No painel da Vercel (`vercel.com`), vá em **Settings → Environment Variables** e adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `libsql://ml-ascent-<usuario>.turso.io?authToken=<token>` |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` |
| `NEXTAUTH_SECRET` | chave gerada com `openssl rand -base64 32` |

Depois conecte o repositório Git e a Vercel fará re-deploy automático a cada push.

---

### Railway

O Railway suporta deploy de aplicações Node.js com volume persistente, permitindo usar SQLite diretamente.

**1. Crie um projeto**

Acesse [railway.app](https://railway.app), clique em **New Project → Deploy from GitHub repo** e selecione o repositório.

**2. Configure as variáveis de ambiente**

No painel do Railway → **Variables**, adicione:

```
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://<seu-dominio>.railway.app
NEXTAUTH_SECRET=<chave-gerada>
```

**3. Configure o start command**

Em **Settings → Deploy → Start Command**:

```bash
npx prisma db push && npx tsx prisma/seed.ts && npm start
```

> O `seed.ts` usa `if (existing) return` — é seguro executá-lo em todo deploy; ele não duplica o supervisor.

**4. Volume persistente (SQLite)**

Em Railway, vá em **Add Volume**, monte em `/app` e certifique-se que `DATABASE_URL` aponta para `file:/app/dev.db`. Sem volume, o banco é perdido a cada redeploy.

---

### VPS / Servidor Próprio

Instruções para qualquer servidor Linux (Ubuntu 22.04+, Debian 12+).

**1. Prepare o servidor**

```bash
# Instale Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instale o PM2 (gerenciador de processos)
npm install -g pm2
```

**2. Clone e configure a aplicação**

```bash
git clone <url-do-repositório> /var/www/ml-ascent
cd /var/www/ml-ascent

npm install

# Configure o .env
nano .env
# Preencha DATABASE_URL, NEXTAUTH_URL e NEXTAUTH_SECRET

# Aplique o banco e popule
npx prisma db push
npx tsx prisma/seed.ts

# Build de produção
npm run build
```

**3. Inicie com PM2**

```bash
pm2 start npm --name "ml-ascent" -- start
pm2 save
pm2 startup   # configura inicialização automática no boot
```

**4. Configure o Nginx como proxy reverso**

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/ml-ascent
```

Cole a configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass         http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ml-ascent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**5. HTTPS com Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Atualize `NEXTAUTH_URL` no `.env` para `https://seu-dominio.com` e reinicie:

```bash
pm2 restart ml-ascent
```

---

## Estrutura do Projeto

```
TCC/
├── prisma/
│   ├── schema.prisma        # Modelos: User, ModuleProgress, QuizAttempt
│   └── seed.ts              # Cria o usuário supervisor padrão
├── public/
│   └── assets/              # Imagens dos módulos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth handler
│   │   │   ├── progress/    # Atualização de progresso por módulo
│   │   │   ├── quiz/
│   │   │   │   ├── submit/  # POST: gravar tentativa de quiz
│   │   │   │   └── results/ # GET: histórico de tentativas
│   │   │   ├── register/    # Cadastro de estudante
│   │   │   └── supervisor/  # GET: dados de todos os estudantes
│   │   └── nexus/
│   │       ├── journeys/
│   │       │   ├── _components/
│   │       │   │   └── quiz-section.tsx  # Componente de quiz (10 questões)
│   │       │   ├── linear-regression/    # Módulo 1
│   │       │   ├── logistic-regression/  # Módulo 2
│   │       │   └── pca/                  # Módulo 3
│   │       ├── supervisor/               # Painel do supervisor
│   │       └── ...                       # Glossário, Laboratório, etc.
│   ├── hooks/
│   │   └── use-progress.ts  # Hook de progresso por módulo
│   ├── lib/
│   │   ├── auth.ts          # Configuração NextAuth
│   │   ├── prisma.ts        # Singleton do Prisma Client
│   │   ├── pca.ts           # Algoritmos: mulberry32, PCA, reconstrução
│   │   ├── quiz-data.ts     # 30 questões (10 por módulo) com explicações
│   │   └── t-distribution.ts # Valores críticos t para IC/IP
│   └── middleware.ts        # Proteção de rotas autenticadas
├── .env                     # Variáveis de ambiente (não comitado)
├── next.config.ts
├── prisma.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Funcionalidades

### Módulos pedagógicos
- **Módulo 1 — Regressão Linear Simples:** simulador de projeção com slider de inclinação/intercepto, visualização de SSE/R², intervalos de confiança e predição, gráfico de resíduos.
- **Módulo 2 — Regressão Logística:** construção passo a passo de p → odds → log-odds → sigmóide, simulador de limiar de decisão, curva logística interativa, comparação de modelos.
- **Módulo 3 — PCA:** geometria de projeção com slider de ângulo, compressão dimensional com scree plot, sensibilidade a escala com toggle de padronização, limitações do PCA (não-linearidade, não-ortogonalidade, clusters obscurecidos).

### Quiz
- 10 questões por módulo com feedback imediato e explicação por questão.
- Histórico de tentativas e melhor nota registrados por estudante.
- Retry ilimitado.

### Painel do supervisor
- Lista todos os estudantes com progresso por módulo (não iniciado / em andamento / concluído).
- Exibe a melhor nota do quiz por módulo, número de tentativas e data da última tentativa.
- Tempo total de prática acumulado por estudante.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15.5 (App Router, React 19) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Gráficos | Recharts 2 |
| ORM | Prisma 7 |
| Banco (dev) | SQLite via LibSQL |
| Banco (prod) | LibSQL / Turso |
| Autenticação | NextAuth.js 4 (JWT) |
| Hash de senha | bcrypt |
| Deploy recomendado | Vercel + Turso |
