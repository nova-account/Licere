# Licere — Plataforma de Gestao Corporativa e Conformidade Operacional

> **Frontend corporativo centralizado para acompanhamento de unidades, documentos, tarefas e indicadores de conformidade ambiental e regulatoria.**

---

## 1. Contexto do Projeto

A **Licere** e uma plataforma corporativa desenvolvida para simular a operacao real de uma empresa com multiplas unidades (Centros de Distribuicao e Filiais). O sistema permite aos gestores e times de conformidade monitorar obrigacoes, documentos, licencas e tarefas de cada unidade em um painel unico e centralizado.

O projeto foi construido seguindo rigorosos padroes de arquitetura de frontend, organizacao de codigo, tipagem estrita com TypeScript, responsividade para todos os formatos de tela e separacao clara entre dados e estado de UI.

---

## 2. Stack Tecnologica

### Obrigatoria
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server/Client Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (tipagem estrita em todas as entidades, sem uso de `any`)

### Bibliotecas e Ferramentas
- **Formularios e Schemas:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validacao robusta e mensagens de erro especificas por campo
- **Design System e Acessibilidade:** Radix UI Primitives, Lucide React Icons
- **Estilizacao:** CSS Modular com Design Tokens (paleta sobria, micro-animacoes, layout responsivo para Desktop, Tablet e Mobile)
- **Gerenciamento de Estado:** Context API reativa com persistencia local e sincronizacao em tempo real entre telas
- **Testes Automatizados:** Suite de testes unitarios nativa para validacao das regras de negocio

---

## 3. Regras de Negocio Implementadas

1. **Autenticacao Obrigatoria:**
   - Rotas internas protegidas pelo `AuthenticatedLayout`. Usuarios nao autenticados sao redirecionados automaticamente para `/login`.
   - Formulario de login validado via Zod com feedback visual imediato para campos invalidos.

2. **Status de Unidade (Ativa ou Inativa):**
   - Unidades cadastradas possuem status `'Ativa'` ou `'Inativa'`.
   - **Bloqueio em Unidades Inativas:** Os formularios de criacao de novas tarefas e documentos bloqueiam a selecao de unidades inativas.
   - **Modo Somente Leitura:** No painel de detalhamento da unidade inativa, documentos e tarefas sao exibidos exclusivamente para leitura, com banner explicativo.

3. **Status de Documento Calculado Dinamicamente:**
   - O status nao e inserido manualmente pelo usuario. A funcao `getDocumentStatus(validade)` calcula no frontend:
     - **Expirado:** Validade anterior a data atual (`expDate < today`).
     - **Proximo do vencimento:** Validade entre hoje e 15 dias (`diffDays <= 15`).
     - **Valido:** Validade superior a 15 dias ou indeterminada.

4. **Confirmacao Obrigatoria para Conclusao de Tarefas:**
   - Ao clicar no checkbox de conclusao de uma tarefa, um modal de confirmacao (`ConfirmModal`) e acionado para evitar conclusoes acidentais.

5. **Painel de Indicadores em Tempo Real:**
   - O Dashboard exibe o total de unidades cadastradas, documentos, tarefas pendentes e o indicador integrado de pendencias.
   - Qualquer alteracao feita nas telas de listagem (concluir uma tarefa, cadastrar um documento) e refletida instantaneamente no Dashboard sem necessidade de recarregar a pagina (`F5`).

6. **Regra de Negocio Avancada — Bloqueio de Exclusao:**
   - Ao tentar excluir uma unidade, o sistema verifica se existem documentos a vencer/expirados ou tarefas pendentes/em andamento vinculadas. Se houver, a exclusao e bloqueada com mensagem explicativa informando o total exato de pendencias.

---

## 4. Testes Automatizados

A aplicacao inclui testes unitarios que cobrem integralmente as regras de negocio:
- Calculo do status de documento (Expirado, Proximo do vencimento, Valido, Indeterminado);
- Bloqueio de novos registros em unidades inativas;
- Bloqueio de exclusao de unidades com pendencias ativas.

Para executar os testes:
```bash
npm test
# ou: node scripts-teste/test-rules.mjs
```

---

## 5. Como Executar o Projeto Localmente

1. **Instalar as dependencias:**
   ```bash
   pnpm install
   # ou: npm install
   ```

2. **Executar a aplicacao em desenvolvimento:**
   ```bash
   pnpm run dev
   # ou: npm run dev
   ```

3. **Acessar no navegador:**
   - Acesse [http://localhost:5173](http://localhost:5173)
