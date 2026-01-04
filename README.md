# Buscador de Vagas Moderno

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

Um aplicativo moderno e responsivo para busca de empregos, focado em UX limpa e alta performance.

## 🚀 Sobre o Projeto

Este projeto é um buscador de vagas desenvolvido com foco em design responsivo (Mobile-First) e usabilidade. Ele utiliza componentes modernos para oferecer uma experiência fluida na filtragem e visualização de oportunidades de emprego.

**Principais Funcionalidades:**

- Busca por cargos e localização.
- Filtros avançados (Tipo de vaga, Faixa Salarial, Experiência).
- Seletor de Temas (Claro/Escuro).
- Interface moderna inspirada nas grandes plataformas de RH.

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **Vite:** Build tool ultra-rápida.
- **TypeScript:** Superset JavaScript tipado para maior segurança.
- **React:** Biblioteca para construção de interfaces.
- **shadcn-ui:** Componentes de interface reutilizáveis e acessíveis.
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida.

## 🛠️ Como executar o projeto localmente

Para rodar este projeto na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) instalado. Siga os passos abaixo:

```bash
# Passo 1: Clone o repositório
git clone <URL_DO_SEU_REPOSITORIO_AQUI>

# Passo 2: Entre na pasta do projeto
cd <NOME_DA_PASTA_DO_PROJETO>

# Passo 3: Instale as dependências
npm install

# Passo 4: Inicie o servidor de desenvolvimento
npm run dev
```

## 📋 Tabela de Conteúdos

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Autor](#autor)

## ✅ Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado:

- **Node.js** (versão 16.0 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js) ou **yarn**
- **Conhecimentos básicos** de JavaScript/TypeScript e React

## 📦 Instalação

Siga os passos acima em "Como executar o projeto localmente" para configurar o ambiente.

### Verificar a Instalação

Após completar a instalação, você pode verificar se tudo foi instalado corretamente:

```bash
node --version
npm --version
```

## 🚀 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`
Inicia o servidor de desenvolvimento. A aplicação será aberta em [http://localhost:5173](http://localhost:5173)

### `npm run build`
Cria uma build otimizada para produção. Os arquivos compilados estarão em `dist/`

### `npm run preview`
Preview local da build de produção

### `npm run lint`
Executa o ESLint para verificar qualidade do código

## 📁 Estrutura do Projeto

```
BuscaVagas/
├── public/                 # Arquivos estáticos
│   ├── vite.svg
│   └── ...
├── src/                    # Código-fonte principal
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entrada da aplicação
│   └── ...
├── supabase/               # Configurações Supabase (Banco de dados)
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências do projeto
├── tsconfig.json           # Configuração TypeScript
├── vite.config.ts          # Configuração do Vite
├── tailwind.config.ts      # Configuração Tailwind CSS
└── README.md               # Este arquivo
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://sua-url-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Obtendo as Credenciais Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá para "Configurações" → "API"
4. Copie a URL do projeto e a chave anônima
5. Cole no arquivo `.env`

## ⭐ Funcionalidades Detalhadas

### 🔍 Busca Avançada
- Busca por **cargo/posição**
- Filtro por **localização geográfica**
- Filtro por **tipo de vaga** (CLT, PJ, Remoto, etc.)
- Filtro por **faixa salarial**
- Filtro por **nível de experiência** (Junior, Pleno, Sênior)

### 🎨 Tema Dinâmico
- Seletor de tema **Claro/Escuro** integrado
- Persistência do tema nas preferências do usuário
- Interface moderna e responsiva

### 📱 Responsividade
- Design **Mobile-First**
- Compatível com todos os tamanhos de tela
- Performance otimizada para dispositivos móveis

### 🏢 Integração de Portais
A aplicação agrega vagas de múltiplos portais de emprego em um único lugar.

## 🗺️ Roadmap

### Próximas Funcionalidades (Planejadas)
- [ ] Integração com mais portais de emprego
- [ ] Sistema de salvar vagas favoritas
- [ ] Notificações de novas vagas
- [ ] Filtros adicionais por tecnologias/skills
- [ ] Perfil de usuário com histórico de buscas
- [ ] API própria para consultas
- [ ] Dashboard de estatísticas de vagas
- [ ] Multi-idioma (EN, ES, etc.)

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com este projeto, siga os passos:

1. **Faça um Fork** do repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/BuscaVagas.git`
3. **Crie uma branch** para sua feature: `git checkout -b feature/sua-feature`
4. **Faça commit** das suas alterações: `git commit -m 'Adiciona nova feature'`
5. **Push** para a branch: `git push origin feature/sua-feature`
6. **Abra um Pull Request**

### Padrões de Código
- Use **TypeScript** em novos arquivos
- Siga os padrões do **ESLint** configurado
- Use componentes do **shadcn/ui** quando possível
- Mantenha a responsividade com **Tailwind CSS**

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Bernardo Moraes** (bersou)
- GitHub: [@bersou](https://github.com/bersou)
- Email: [Entre em contato](https://github.com/bersou)

---

<div align="center">

### Feito com ❤️ por Bernardo Moraes 

Se você gostou do projeto, considere deixar uma ⭐ no repositório!

</div>
