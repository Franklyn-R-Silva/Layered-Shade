# Guia de Contribuição

Obrigado por considerar contribuir com o **Layered Shade**! 🎉 Todo mundo é bem-vindo: quem vai contribuir pela primeira vez, designers, tradutores e quem só quer reportar um bug.

## 🌱 Sua primeira contribuição

- **Sem código:** reporte um bug, sugira um recurso, melhore uma frase da documentação ou corrija uma tradução. [Abra uma issue](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new/choose).
- **Mudança pequena de código:** escolha uma issue marcada como [good first issue](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue). Cada uma diz quais arquivos mexer e quando está pronta.
- **Não sabe por onde começar?** Comente em qualquer issue e pergunte; você vai ter resposta.

Todo pull request começa de uma issue, para combinar a mudança antes do trabalho. Comente na issue que vai pegá-la e ponha `Closes #<issue>` no pull request.

[🇺🇸 English](../../CONTRIBUTING.md)

## 📋 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o projeto no GitHub, depois:
git clone https://github.com/SEU-USUARIO/Layered-Shade.git
cd Layered-Shade
```

### 2. Instale as Dependências

```bash
npm ci   # instala exatamente o que o package-lock.json fixa (Node 20.19+)
```

### 3. Crie uma Branch

```bash
git checkout -b feature/minha-nova-funcionalidade
```

### 4. Faça suas Alterações

- Siga o padrão de código e a arquitetura existentes (lógica pura em `src/lib/shadow.ts`, UI em `src/lib/components/`)
- **Toda mudança de comportamento vem com testes**: mudanças de lógica ganham testes de unidade em `src/lib/shadow.test.ts`; comportamento da UI ganha um caso em `src/App.test.ts`. Correções de bug incluem um teste que falha sem a correção.
- Antes de abrir o PR, tudo isto precisa passar (o CI roda o mesmo em todo pull request e bloqueia o merge se falhar):

  ```bash
  npm run lint    # ESLint, nenhum aviso permitido
  npm run check   # type-check do svelte-check, nenhum aviso permitido
  npm test        # Vitest
  npm run build   # build de produção
  ```

### 5. Commit e Push

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
git push origin feature/minha-nova-funcionalidade
```

### 6. Abra um Pull Request

Vá até o repositório original e abra um PR descrevendo suas alterações.

---

## 📏 Padrões de Código

### TypeScript e Svelte

- TypeScript em tudo; componentes Svelte 5 com runes (`$state`, `$derived`, `$props`)
- Mantenha `src/lib/shadow.ts` sem Svelte e sem DOM, para seguir testável em unidade
- Variáveis em `camelCase`, componentes em `PascalCase`
- Um comentário curto de documentação em toda função exportada
- Textos da UI em português (pt-BR); docs em inglês com espelho pt-BR em `docs/pt-BR/`

### CSS

- Use os tokens de `src/styles/variables.css`; o sistema visual está descrito no [DESIGN.md](../../DESIGN.md)
- CSS global por nome de classe, um módulo por região em `src/styles/modules/`
- Todo controle mantém rótulo visível, acesso por teclado e estado de foco visível

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo        | Descrição                      |
| ----------- | ------------------------------ |
| `feat:`     | Nova funcionalidade            |
| `fix:`      | Correção de bug                |
| `docs:`     | Documentação                   |
| `style:`    | Formatação (não altera lógica) |
| `refactor:` | Refatoração de código          |
| `test:`     | Adição/correção de testes      |
| `chore:`    | Tarefas de manutenção          |

---

## 🧪 Rodando os Testes

```bash
# Rodar testes
npm test

# Rodar com watch mode
npm run test:watch

# Rodar com cobertura
npm run test:coverage
```

---

## 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/Franklyn-R-Silva/Layered-Shade/issues)
2. Se não, abra uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)

---

## 💡 Sugerindo Funcionalidades

Abra uma [Issue](https://github.com/Franklyn-R-Silva/Layered-Shade/issues) com a tag `enhancement` descrevendo:

- O problema que a funcionalidade resolve
- Como você imagina que funcionaria
- Alternativas consideradas

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](../../LICENSE).
