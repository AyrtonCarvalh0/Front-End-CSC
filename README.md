# CSC — Sistema de Gestão Escolar

> Sistema desenvolvido para o **Colégio Silva Carvalho (CSC)**, com o objetivo de digitalizar e modernizar a gestão escolar, eliminando o uso de planilhas manuais e processos repetitivos que geravam gargalos e inconsistências nas informações.

---

## 📖 Contexto

O Colégio Silva Carvalho enfrentava desafios comuns em escolas de pequeno e médio porte: controle de alunos em planilhas, acompanhamento de mensalidades feito manualmente, dificuldade em identificar inadimplentes e falta de uma visão clara do financeiro mensal.

Este sistema foi desenvolvido para resolver esses problemas, centralizando todas as informações em um único lugar, com uma interface moderna, intuitiva e segura.

---

## ✨ Funcionalidades

### 👨‍🎓 Gestão de Alunos
- Cadastro completo com turma e responsável vinculados
- Busca por nome ou CPF
- Ficha do aluno com histórico completo de pagamentos
- Visualização do total em aberto por aluno

### 👨‍🏫 Gestão de Professores e Turmas
- Cadastro de professores e vinculação às turmas
- 5 turmas padrão da escola já pré-configuradas
- Valor de mensalidade definido por turma

### 👨‍👩‍👧 Responsáveis
- Cadastro de responsáveis vinculados aos alunos
- Busca por nome e CPF

### 💳 Sistema Financeiro
- Geração automática de mensalidades para todos os alunos do mês
- Valor calculado automaticamente pela turma de cada aluno
- Acréscimo automático por atraso:
  - Após dia 05: +R$ 10,00
  - Após dia 10: +R$ 20,00
- Confirmação de pagamento com data registrada
- Visualização de devedores por mês e por turma
- Resumo do caixa mensal (recebido vs pendente)
- Exportação de relatórios em PDF e Excel

### 📊 Dashboard
- Visão geral em tempo real
- Gráfico de arrecadação dos últimos 6 meses
- Distribuição de alunos por turma
- Lista de inadimplentes
- Indicador de crescimento mês a mês

### 🔒 Segurança
- Autenticação com JWT
- Dois níveis de acesso: **Admin** e **Secretaria**
- Gestão de usuários pelo próprio sistema
- Troca de senha pelo perfil do usuário

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Descrição |
|---|---|
| Java 21 | Linguagem principal |
| Spring Boot 3.2 | Framework web |
| Spring Security + JWT | Autenticação e autorização |
| Spring Data JPA + Hibernate | Persistência de dados |
| PostgreSQL | Banco de dados |
| Flyway | Versionamento do banco |
| Docker | Containerização do banco |

### Frontend
| Tecnologia | Descrição |
|---|---|
| React + Vite | Framework frontend |
| Tailwind CSS | Estilização |
| Axios | Comunicação com a API |
| Recharts | Gráficos do dashboard |
| React Router DOM | Navegação |
| jsPDF + XLSX | Exportação de relatórios |

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Java 21
- Node.js 18+
- Docker Desktop

### Backend

```bash
# 1. Clone o repositório
git clone https://github.com/AyrtonCarvalh0/CSC-Sistema-Escolar.git

# 2. Entre na pasta do backend
cd CSC-Sistema-Escolar

# 3. Crie o arquivo de configuração local
cp .env.example .env.local
# Edite o .env.local com suas credenciais

# 4. Suba o banco de dados
docker compose up -d
# ou use o reset.bat no Windows

# 5. Rode o projeto
./mvnw spring-boot:run
```

### Frontend

```bash
# Entre na pasta do frontend
cd csc-frontend

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Acesse: **http://localhost:3000**

### Credenciais padrão
```
Login: admin
Senha: admin123
```

> ⚠️ Troque a senha no primeiro acesso em **Meu Perfil**.

---

## 📁 Estrutura do projeto

```
CSC-Sistema-Escolar/
├── src/
│   ├── main/
│   │   ├── java/com/eiba/System_Finances/
│   │   │   ├── controller/     # Endpoints REST
│   │   │   ├── service/        # Regras de negócio
│   │   │   ├── entity/         # Entidades JPA
│   │   │   ├── repository/     # Repositórios Spring Data
│   │   │   ├── DTO/            # Objetos de transferência
│   │   │   ├── config/         # Configurações (Security, CORS, Flyway)
│   │   │   └── Enums/          # Enumerações
│   │   └── resources/
│   │       ├── db/migration/   # Migrations do Flyway (V1 → V5)
│   │       └── application.yml # Configurações da aplicação
├── csc-frontend/               # Projeto React
├── docker-compose.yml          # Configuração do PostgreSQL
├── reset.bat                   # Script para resetar o banco (Windows)
└── reset.sh                    # Script para resetar o banco (Linux/Mac)
```

---

## 🎯 Regras de negócio

### Turmas e mensalidades
| Turma | Faixa etária | Mensalidade |
|---|---|---|
| Maternal Baby | 1 – 2 anos | R$ 240,00 |
| Maternal | 2 – 3 anos | R$ 240,00 |
| Jardim | 3 – 4 anos | R$ 240,00 |
| Pré | 5 – 6 anos | R$ 240,00 |
| Primeiro Ano | 6 – 7 anos | R$ 260,00 |

### Acréscimo por atraso
- Pagamento até dia 05 → valor normal
- Pagamento entre dia 06 e 10 → +R$ 10,00
- Pagamento após dia 10 → +R$ 20,00

---

## 👤 Autor

**Ayrton Carvalho**

Desenvolvido com ❤️ para o Colégio Silva Carvalho.

---

## 📄 Licença

Este projeto é de uso privado do Colégio Silva Carvalho.
