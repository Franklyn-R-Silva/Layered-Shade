# Guia de Contribuição

Obrigado por considerar contribuir com o **Layered Shade**! 🎉

## 📋 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o projeto no GitHub, depois:
git clone https://github.com/SEU-USUARIO/Gerador-de-box-shadow-com-JavaScript.git
cd Gerador-de-box-shadow-com-JavaScript
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Crie uma Branch

```bash
git checkout -b feature/minha-nova-funcionalidade
```

### 4. Faça suas Alterações

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Verifique se todos os testes passam: `npm test`

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

### JavaScript

- ES6+ (modules, arrow functions, destructuring)
- Nomes de variáveis em `camelCase`
- Classes em `PascalCase`
- Comentários JSDoc para funções públicas

### CSS

- CSS Variables para cores e espaçamentos
- BEM-like naming (quando aplicável)
- Mobile-first approach

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

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](LICENSE).
