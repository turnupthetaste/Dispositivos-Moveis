# 🎓 App Scholar

Sistema mobile de gerenciamento acadêmico para instituições de ensino, desenvolvido com React Native + Expo e Node.js + PostgreSQL.

## 📱 Sobre o Projeto

Aplicativo completo para gerenciamento escolar com:
- ✅ Autenticação de usuários (3 níveis de acesso)
- ✅ Cadastro de alunos, professores, cursos e disciplinas
- ✅ Boletim de notas com cálculo automático de médias
- ✅ Interface moderna e responsiva
- ✅ Sistema de validações robusto
- ✅ Feedback visual (toasts)

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Expo Go no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### ⚡ Início Rápido (5 minutos)

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/app-scholar.git
cd app-scholar
```

#### 2. Backend (Terminal 1)

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o banco de dados
# Crie um arquivo .env com:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/app_scholar"
JWT_SECRET="seu-segredo-aqui-mude-isso"
PORT=3333

# Execute as migrations
npx prisma migrate deploy
npx prisma generate

# Inicie o servidor
npm run dev
```

**Servidor rodando em:** `http://localhost:3333`

#### 3. Frontend (Terminal 2)

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure a API
# Crie um arquivo .env com:
EXPO_PUBLIC_API_URL=http://SEU-IP-LOCAL:3333

# Inicie o Expo
npm start
```

#### 4. Abra no celular

1. Abra o **Expo Go** no celular
2. Escaneie o **QR Code** que apareceu no terminal
3. Pronto! 🎉

---

## 🔐 Usuários de Teste

O sistema possui 3 níveis de acesso baseados no domínio do email:

| Perfil | Email | Acesso |
|--------|-------|--------|
| **Administrador** | `admin@admin.com` | Total (cadastros + boletim) |
| **Gestor** | `gestor@gestor.com` | Total (cadastros + boletim) |
| **Usuário** | `user@gmail.com` | Apenas visualização do boletim |

**Senha padrão para todos:** `1234`

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React Native 0.79
- Expo SDK 53
- React Navigation 7
- TypeScript
- AsyncStorage

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT (autenticação)
- bcryptjs (criptografia)

---

## 📁 Estrutura do Projeto

```
app-scholar/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Schema do banco
│   ├── index.ts               # Servidor principal
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── screens/           # Telas do app
│   │   ├── contexts/          # Context API
│   │   ├── services/          # APIs
│   │   ├── theme/             # Cores e estilos
│   │   └── types/             # TypeScript types
│   ├── App.tsx
│   └── package.json
│
└── README.md
```

---

## 🎨 Funcionalidades

### 🔑 Autenticação
- Login com email e senha
- Registro de novos usuários
- Sistema de perfis automático (baseado no domínio do email)
- JWT com expiração de 7 dias

### 👥 Cadastros (Admin/Gestor)
- **Alunos:** nome, email, matrícula, curso
- **Professores:** nome, titulação, tempo de docência
- **Cursos:** nome, turno (matutino/vespertino/noturno)
- **Disciplinas:** nome, carga horária, professor, curso

### 📊 Boletim
- Visualização de notas (N1, N2)
- Cálculo automático de média
- Status: Aprovado (≥6.0), Exame (4.0-5.9), Reprovado (<4.0)
- Estatísticas gerais
- Usuários veem apenas suas próprias notas

### ✨ Extras
- Toast de feedback em todas as ações
- Validações de formulário (email, senha, notas)
- Tela de erro moderna (acesso negado)
- Confirmação de logout
- Modo offline (AsyncStorage)

---

## 🔧 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev

# Verificar migrations
npx prisma migrate status

# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (visualizador de dados)
npx prisma studio

# Resetar banco (⚠️ apaga tudo)
npx prisma migrate reset
```

### Frontend

```bash
# Iniciar com cache limpo
npm start -- --clear

# Apenas iOS
npm run ios

# Apenas Android
npm run android

# Build de produção
expo build:android
expo build:ios
```

---

## 🐛 Troubleshooting

### Backend não conecta ao banco
```bash
# Verifique se o PostgreSQL está rodando
# Windows: Services → PostgreSQL
# Mac: brew services list
# Linux: systemctl status postgresql

# Teste a conexão
psql -U seu_usuario -d app_scholar
```

### Erro "Cannot find module @prisma/client"
```bash
cd backend
npx prisma generate
```

### Frontend não conecta ao backend
```bash
# Descubra seu IP local
# Windows: ipconfig
# Mac/Linux: ifconfig

# Atualize o .env do frontend
EXPO_PUBLIC_API_URL=http://SEU-IP:3333
```

### Erro de cache no Expo
```bash
npm start -- --clear --reset-cache
```

---

## 📝 Endpoints da API

### Autenticação
```
POST /auth/register     - Criar conta
POST /auth/login        - Fazer login
GET  /auth/me           - Dados do usuário logado
```

### Cadastros (requer autenticação)
```
GET    /alunos          - Listar alunos
POST   /alunos          - Criar aluno
DELETE /alunos/:id      - Deletar aluno

GET    /professores     - Listar professores
POST   /professores     - Criar professor
DELETE /professores/:id - Deletar professor

GET    /cursos          - Listar cursos
POST   /cursos          - Criar curso
DELETE /cursos/:id      - Deletar curso

GET    /disciplinas     - Listar disciplinas
POST   /disciplinas     - Criar disciplina
DELETE /disciplinas/:id - Deletar disciplina
```

### Boletim
```
GET  /boletim           - Ver boletim completo
GET  /notas             - Listar notas
POST /notas/batch       - Salvar múltiplas notas
```

---


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico para a disciplina de **Programação para Dispositivos Móveis I**.

**Instituição:** FATEC Jacareí  
**Curso:** Desenvolvimento de Software Multiplataforma  
**Professor:** André Olímpio

---


