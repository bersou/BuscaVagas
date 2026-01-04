# Buscador de Vagas Moderno (BuscaVagas)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Um aplicativo moderno e robusto para busca de empregos em tempo real, utilizando agregação inteligente de dados e uma interface de alta performance.

## 🚀 Sobre o Projeto

O **BuscaVagas** evoluiu de um protótipo para uma aplicação full-stack real. Agora, ele utiliza um backend em **Python** para agregar vagas de múltiplos portais (LinkedIn, Indeed, Gupy, etc.) via **SerpApi**, oferecendo resultados concretos e filtrados diretamente na interface.

**Principais Funcionalidades:**

- 🔍 **Busca Real**: Integração com Google Jobs via SerpApi para vagas em tempo real.
- 🐍 **Backend Robusto**: Servidor FastAPI para processamento e agregação de dados.
- ❤️ **Favoritos**: Sistema de persistência de vagas favoritas localmente.
- 🌓 **Tema Dinâmico**: Suporte a modo claro e escuro.
- 📱 **Responsivo**: Design otimizado para qualquer dispositivo.

## 💻 Tecnologias Utilizadas

### Frontend
- **React + Vite**: Performance e rapidez no desenvolvimento.
- **TypeScript**: Tipagem estática para robustez.
- **Tailwind CSS + Shadcn/UI**: Design moderno e consistente.
- **Framer Motion**: Animações fluidas.

### Backend
- **Python 3.11+**: Base sólida para processamento de dados.
- **FastAPI**: Framework web de alta performance.
- **Uvicorn**: Servidor ASGI de produção.
- **Requests**: Gestão de chamadas para APIs externas.

## 🛠️ Como executar o projeto localmente

Você precisará rodar o **Backend** e o **Frontend** simultaneamente.

### 1. Backend (Python)
```bash
# Entre na pasta raiz
pip install -r backend/requirements.txt
python backend/main.py
```
*O servidor rodará em http://localhost:8000*

### 2. Frontend (React)
```bash
# Em outro terminal, na pasta raiz
npm install
npm run dev
```
*A aplicação abrirá em http://localhost:8080*

## 📁 Estrutura do Projeto

```
BuscaVagas/
├── backend/                # Servidor FastAPI (Python)
│   ├── main.py             # Lógica de busca e agregação
│   └── requirements.txt    # Dependências Python
├── src/                    # Frontend React
│   ├── components/         # Componentes (JobCard, JobList, etc.)
│   ├── hooks/              # Custom hooks (useJobs, useLocalStorage)
│   └── pages/              # Páginas (Index, NotFound)
├── .env                    # Variáveis sensíveis (API Keys)
├── .env.example            # Template de exemplo para ambiente
└── ...
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
SERPAPI_KEY=sua_chave_aqui_do_serpapi
```

> **Nota:** Obtenha sua chave gratuita em [serpapi.com](https://serpapi.com/).

## 🗺️ Roadmap Atualizado

- [x] Integração com dados reais via SerpApi
- [x] Migração para Backend Python (FastAPI)
- [x] Sistema de salvar vagas favoritas
- [x] Correção de parsing de datas dinâmicas
- [ ] Filtros avançados por tecnologias/skills
- [ ] Perfil de usuário com histórico
- [ ] Exportação de vagas em PDF/CSV

## 👨‍💻 Autor

**Bernardo Moraes** (bersou)
- GitHub: [@bersou](https://github.com/bersou)
- Atuando em Desenvolvimento Full Stack.

---

<div align="center">

### Feito com ❤️ por Bernardo Moraes 

Se este projeto te ajudou, deixe uma ⭐ no repositório!

</div>
