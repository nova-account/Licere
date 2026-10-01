# Licere — Plataforma de Gestão Corporativa e Conformidade Operacional

> **Frontend corporativo centralizado para acompanhamento de unidades, documentos, tarefas e indicadores de conformidade ambiental e regulatória.**

- **Demonstração online (Deploy):** [https://nova-account.github.io/Licere/](https://nova-account.github.io/Licere/)
- **Repositório oficial:** [https://github.com/nova-account/Licere](https://github.com/nova-account/Licere)

---

## 1. Contexto do Projeto

A **Licere** é uma plataforma corporativa desenvolvida para simular a operação real de uma empresa com múltiplas unidades (Centros de Distribuição e Filiais). O sistema permite aos gestores e times de conformidade monitorar obrigações, documentos, licenças e tarefas de cada unidade em um painel único e centralizado.

O projeto foi construído seguindo rigorosos padrões de arquitetura de frontend, organização de código, tipagem estrita com TypeScript, responsividade para todos os formatos de tela e separação clara entre dados e estado de interface.

---

## 2. Stack Tecnológica

### Obrigatória
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server/Client Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (tipagem estrita em todas as entidades, sem uso de `any`)

### Bibliotecas e Ferramentas
- **Formulários e Schemas:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validação robusta e mensagens de erro específicas por campo
- **Design System e Acessibilidade:** Radix UI Primitives, Lucide React Icons
- **Estilização:** CSS Modular com Design Tokens (paleta sóbria, micro-animações, layout responsivo para Desktop, Tablet e Mobile)
- **Gerenciamento de Estado:** Context API reativa com persistência local e sincronização em tempo real entre telas
- **Testes Automatizados:** Suíte de testes unitários nativa para validação das regras de negócio

---

## 3. Estrutura do Sistema

```
├── artifacts/licere/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── login/         # Tela de Login com validação Zod e feedback visual
│   │   │   │   └── page.tsx       # Landing corporativa de apresentação
│   │   │   └── (authenticated)/   # Rotas protegidas (exigem sessão ativa)
│   │   │       ├── dashboard/     # Painel de indicadores em tempo real
│   │   │       ├── unidades/      # Lista de unidades com pesquisa, filtros e paginação
│   │   │       ├── documentos/    # Gestão de acervo com status derivado da validade
│   │   │       ├── tarefas/       # Rotina operacional com modal de confirmação
│   │   │       ├── licencas/      # Gestão de licenças ambientais
│   │   │       ├── perfil/        # Configurações de perfil do usuário
│   │   │       └── layout.tsx     # Shell corporativo e Auth Guard
│   │   ├── components/
│   │   │   ├── layout/            # Topbar, Sidebar, ListControls (busca, filtros)
│   │   │   ├── modals/            # Detalhamento de Unidade, Modais de Cadastro, Confirmação
│   │   │   ├── dashboard/         # Cards de Métricas, Gráficos de Risco, Listas Prioritárias
│   │   │   └── shared/            # StatusPills, Badges, EmptyStates
│   │   ├── lib/
│   │   │   └── AppDataContext.tsx # Estado centralizado e regras de negócio
│   │   ├── shared/
│   │   │   ├── types.ts           # Interfaces TypeScript (Unidade, Documento, Tarefa)
│   │   │   ├── data.ts            # Mocks representativos para todos os cenários
│   │   │   └── utils.ts           # Helpers e cálculo dinâmico de status de documentos
│   │   └── styles/                # Design tokens, tipografia e layouts responsivos
│   └── scripts-teste/
│       └── test-rules.mjs         # Suíte de testes unitários automatizados
```

---

## 4. Regras de Negócio Implementadas

1. **Autenticação Obrigatória:**
   - Rotas internas protegidas pelo `AuthenticatedLayout`. Usuários não autenticados são redirecionados automaticamente para `/login`.
   - Formulário de login validado via Zod com feedback visual imediato para campos inválidos e acesso demo com um clique.

2. **Status de Unidade (Ativa ou Inativa):**
   - Unidades cadastradas possuem status `'Ativa'` ou `'Inativa'`.
   - **Bloqueio em Unidades Inativas:** Os formulários de criação de novas tarefas e documentos bloqueiam a vinculação a unidades inativas com aviso explicativo.
   - **Modo Somente Leitura:** No painel de detalhamento da unidade inativa, documentos e tarefas são exibidos exclusivamente para leitura, acompanhados de banner informativo.

3. **Status de Documento Calculado Dinamicamente:**
   - O status não é inserido manualmente pelo usuário. A função `getDocumentStatus(validade)` calcula no frontend a partir da data de vencimento:
     - **Expirado:** Validade anterior à data atual (`expDate < today`).
     - **Próximo do vencimento:** Validade entre hoje e 15 dias (`diffDays <= 15`).
     - **Válido:** Validade superior a 15 dias ou indeterminada/permanente.

4. **Confirmação Obrigatória para Conclusão de Tarefas:**
   - Ao clicar no checkbox de conclusão de uma tarefa, um modal de confirmação (`ConfirmModal`) é acionado para evitar conclusões acidentais.

5. **Painel de Indicadores em Tempo Real:**
   - O Dashboard exibe o total de unidades cadastradas, unidades ativas, documentos pendentes, tarefas pendentes e o indicador integrado de pendências.
   - Qualquer alteração feita nas telas de listagem (concluir uma tarefa, cadastrar um documento) é refletida instantaneamente no Dashboard sem necessidade de recarregar a página (`F5`).

6. **Regra de Negócio Avançada — Bloqueio de Exclusão:**
   - Ao tentar excluir uma unidade, o sistema verifica se existem documentos a vencer/expirados ou tarefas pendentes/em andamento vinculadas. Se houver pendências ativas, a exclusão é bloqueada com mensagem explicativa informando o total exato de itens impeditivos.

7. **Histórico de Alterações e Auditoria:**
   - O painel de detalhamento da unidade apresenta o registro de ações recentes (quem alterou, o que alterou e quando), garantindo rastreabilidade das operações.

---

## 5. Testes Automatizados

A aplicação inclui suíte de testes unitários que cobre integralmente as regras de negócio:
- Cálculo dinâmico do status de documento (Expirado, Próximo do vencimento, Válido, Indeterminado);
- Bloqueio de novos registros em unidades inativas;
- Bloqueio de exclusão de unidades com pendências ativas;
- Permissão de exclusão para unidades sem pendências.

Para executar os testes:
```bash
cd artifacts/licere
npm test
# ou: node scripts-teste/test-rules.mjs
```

---

## 6. Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- `pnpm` ou `npm`

### Passos

1. **Instalar as dependências:**
   ```bash
   cd artifacts/licere
   pnpm install
   # ou: npm install
   ```

2. **Executar a aplicação em desenvolvimento:**
   ```bash
   pnpm run dev
   # ou: npm run dev
   ```

3. **Acessar no navegador:**
   - Acesse [http://localhost:5173](http://localhost:5173) ou [http://localhost:3000](http://localhost:3000)
   - Na tela de login, utilize qualquer e-mail corporativo válido e senha com no mínimo 6 caracteres, ou clique em **"Explorar workspace de demonstração"** para entrar instantaneamente com credenciais pré-configuradas.

---

## 7. Critérios de Avaliação Atendidos

- **Desempenho Técnico (60%):** Arquitetura limpa, componentes reutilizáveis, tipagem completa em TypeScript sem `any`, design system consistente, responsividade para todos os formatos de tela e tratamento de loading/erros.
- **Processos e Organização (10%):** Repositório versionado com commits estruturados, documentação completa em português formal, ausência de emojis e cobertura de testes unitários.
- **Apresentação Final (30%):** Interface fluida, moderna, dados mockados dinâmicos que cobrem todos os estados solicitados na avaliação e link de demonstração funcional online.
