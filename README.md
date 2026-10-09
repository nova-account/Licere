# Licere — Gestão Operacional e Conformidade Ambiental

**Licere** é uma plataforma corporativa centralizada projetada para o acompanhamento e gestão de unidades operacionais, documentos regulatórios, licenças ambientais, tarefas e indicadores de compliance regulatório.

---

## 1. Visão Geral

O sistema permite que equipes de gestão e conformidade monitorem obrigações e pendências de múltiplas filiais e centros de distribuição em um único painel em tempo real. A plataforma foca em:
- **Rastreabilidade total:** Controle unificado de licenças, condicionantes ambientais e documentos comprobatórios.
- **Prevenção de riscos legais:** Alertas autônomos de prazos e vencimentos.
- **Multitenancy e Flexibilidade:** Gestão dinâmica de organização/empresa e perfil de usuário sem valores estáticos fixos no código.
- **Persistência Confiável:** Integração full-stack com banco SQLite via Prisma ORM e Server Actions.

---

## 2. Tecnologias Utilizadas

- **Core**: [Next.js](https://nextjs.org/) (App Router, Server Actions) + [React](https://react.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [Prisma ORM](https://www.prisma.io/) + SQLite (`prisma/licere.db`)
- **Gerenciamento de Estado**: [Zustand](https://zustand-demo.pmnd.rs/) (reatividade e sincronização em tempo real)
- **Formulários e Validação**: [React Hook Form](https://react-hook-form.com/) integrado com schemas [Zod](https://zod.dev/)
- **Testes Automatizados**: [Jest](https://jestjs.io/) + React Testing Library
- **Design & Ícones**: CSS moderno, Radix UI Primitives, Lucide Icons

---

## 3. Principais Funcionalidades e Regras de Negócio

1. **Painel de Indicadores (Dashboard):**
   - Métricas em tempo real de unidades ativas, documentos pendentes e condicionantes.
   - Lista de prioridades com ordenação por urgência de vencimento.
2. **Ciclo de Vida de Documentos & Licenças:**
   - Status calculados dinamicamente com base nas datas de validade (`Válido`, `Próximo do vencimento`, `Expirado`).
3. **Controle Estrito de Exclusão:**
   - Regra de negócio automatizada que bloqueia a exclusão de unidades operacionais caso possuam pendências ativas (documentos vencidos ou condicionantes não concluídas).
4. **Organização e Perfil Dinâmicos:**
   - Suporte a personalização de empresa e perfil do gestor na tela `/perfil`, sincronizando instantaneamente o avatar, iniciais e contexto em toda a aplicação.
5. **Acesso Rápido / Demonstração:**
   - Autenticação com suporte a acesso rápido simulado (Marina Azevedo / Operações Brasil) e autenticação personalizada para qualquer usuário ou organização.

---

## 4. Estrutura do Projeto

```
├── src/
│   ├── actions/             # Server Actions (Prisma ORM / SQLite)
│   ├── app/                 # Rotas e páginas (Next.js App Router)
│   ├── components/          # Componentes visuais (Dashboard, Layout, Modais, UI)
│   ├── lib/                 # AppDataContext (Zustand store), cliente Prisma e utilitários
│   ├── shared/              # Schemas Zod, tipos TypeScript e helpers
│   ├── styles/              # Design system e folhas de estilo CSS
│   ├── types/               # Declarações de ambiente e tipagem global
│   └── __tests__/           # Suíte de testes unitários de regras de negócio (Jest)
├── prisma/
│   ├── schema.prisma        # Definição dos modelos de dados
│   └── licere.db            # Banco de dados local SQLite
├── public/                  # Arquivos estáticos e favicon
├── tsconfig.json            # Configuração do TypeScript
├── package.json             # Dependências e scripts npm
└── jest.config.js           # Configurações do Jest
```

---

## 5. Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Gerenciador de pacotes `npm`

### Passos de Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:5173](http://localhost:5173) no navegador.

3. **Executar a suíte de testes:**
   ```bash
   npm test
   ```

4. **Gerar a build de produção:**
   ```bash
   npm run build
   ```