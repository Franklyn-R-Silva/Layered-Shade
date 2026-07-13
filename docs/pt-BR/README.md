# 🎨 Layered Shade - Gerador de Box Shadow

Uma ferramenta web moderna e interativa para gerar sombras CSS (`box-shadow`) e código Dart/Flutter (`BoxShadow`) visualmente.

[🇺🇸 English](../../README.md)

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://layeredshade.netlify.app/)
[![CI](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml/badge.svg)](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-71%20passing-success)](https://github.com/Franklyn-R-Silva/Layered-Shade/actions)
[![Coverage](https://img.shields.io/badge/Coverage-core%20logic%20~99%25-brightgreen)](https://github.com/Franklyn-R-Silva/Layered-Shade)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

## 🛠️ Tecnologias

![Skills](https://go-skill-icons.vercel.app/api/icons?i=svelte,typescript,vite,css&theme=dark&perline=4)

## 🚀 Demo

[👉 Acesse a ferramenta online](https://layeredshade.netlify.app/)

### Preview

![Preview](../../public/github/tela.png)

### Demo Animado

![Demo](../../public/github/demo.webp)

## ✨ Funcionalidades

### Sombras

- **Visualização em Tempo Real**: Preview instantâneo das alterações
- **Múltiplas Camadas**: Crie sombras complexas com várias camadas
- **Controle Completo**: Ajuste X, Y, blur, spread, cor e opacidade
- **Suporte a Inset**: Sombras internas com sugestão automática de pacote Flutter

### Fundo & Forma

- **Gradientes**: Linear e radial com múltiplos color stops
- **Forma Personalizada**: Ajuste border-radius e padding
- **Presets**: Templates prontos (Soft, Neumorphism, Glass)

### Exportação

- **CSS**: Código pronto com prefixos (-webkit, -moz)
- **Dart/Flutter**: BoxShadow e BoxDecoration formatados
- **Tailwind**: Classes utilitárias arbitrárias
- **Cópia Inteligente**: Botão sensível ao contexto (CSS/Dart/Tailwind)

## 📊 Stack Técnica

| Tecnologia     | Uso                                                 |
| -------------- | --------------------------------------------------- |
| **Svelte 5**   | UI reativa com runes (`$state`, `$derived`)         |
| **TypeScript** | Estado, lógica e componentes tipados                |
| **Vite**       | Servidor de dev e build de produção                 |
| **CSS3**       | Variables, Grid, Flexbox, Animations, Glassmorphism |
| **Vitest**     | Testes de unidade do núcleo de lógica puro          |

## ♿ Acessibilidade (A11y)

Este projeto foi desenvolvido com foco em acessibilidade:

- **Skip Link**: Navegação rápida para usuários de teclado
- **Landmarks Semânticos**: `main`, `header`, `footer`, `nav`, `aside`
- **ARIA Roles**: Tabs com `role="tablist"` e `role="tabpanel"`
- **Labels Descritivos**: Todos os botões e links com `aria-label`
- **Focus Visible**: Indicadores de foco aprimorados
- **Decorativos Ocultos**: `aria-hidden="true"` em elementos visuais

## 🚀 Como Usar

### Online

Acesse [layeredshade.netlify.app](https://layeredshade.netlify.app/)

### Localmente

```bash
git clone https://github.com/Franklyn-R-Silva/Layered-Shade.git
cd Layered-Shade
npm install
npm run dev      # http://localhost:5173
```

Gere o build de produção com `npm run build` (saída em `dist/`) e visualize com `npm run preview`.

## 🧪 Testes

```bash
npm install            # Instalar dependências
npm test               # Rodar testes
npm run test:coverage  # Rodar com cobertura
npm run check          # Type-check (svelte-check)
npm run lint           # Verificar estilo do código
```

Os testes automatizados focam no **núcleo de lógica puro** (`src/lib/shadow.ts`) — mutações de
estado e os geradores CSS/Dart/Tailwind — que não dependem de DOM e têm cobertura de ~99%. Os
componentes Svelte são verificados via `svelte-check` e testes manuais.

## ⚠️ Limitações Conhecidas

- **`inset` no Flutter**: o `BoxShadow` nativo do Flutter não tem inset. Quando "inset"
  está ativado, o código Dart gerado indica que o pacote
  [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) é necessário.
- **Múltiplos gradientes de fundo no Flutter**: o `BoxDecoration` aceita apenas um gradiente,
  então a exportação Dart usa a camada de gradiente do topo. CSS/Tailwind exportam todas.

## 📝 Como Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guia detalhado.

## 👤 Autor

Franklyn R. Silva

- GitHub: [@Franklyn-R-Silva](https://github.com/Franklyn-R-Silva)
- LinkedIn: [franklyn-roberto-dev](https://www.linkedin.com/in/franklyn-roberto-dev/)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](../../LICENSE).

---

⭐ Se este projeto foi útil, considere dar uma estrela!
