# Layered Shade

**Monte sombras em camadas para caixas e textos visualmente e copie a mesma sombra em CSS, Tailwind, Flutter, Jetpack Compose, SwiftUI ou React Native.**

[🇺🇸 English](../../README.md) · [Abrir o app](https://layeredshade.netlify.app/) · [Reportar um bug](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new?template=bug_report.md) · [Sugerir um recurso](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new?template=feature_request.md)

[![CI](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml/badge.svg)](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/17195/badge)](https://www.bestpractices.dev/projects/17195)
[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)](../../LICENSE)
[![PRs bem-vindos](https://img.shields.io/badge/PRs-bem--vindos-2747c9.svg)](CONTRIBUTING.md)
[![Good first issues](https://img.shields.io/github/issues/Franklyn-R-Silva/Layered-Shade/good%20first%20issue?label=good%20first%20issues&color=2747c9)](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue)

![Layered Shade: controles das camadas à esquerda, a prancha de preview 1:1 com cotas no centro e o código gerado à direita](../../public/github/tela.png)

## Por que o Layered Shade

- **Uma sombra, todas as plataformas.** As mesmas camadas saem para doze formatos, e cada exportação diz com clareza o que a plataforma não suporta, em vez de descartar em silêncio.
- **Medido, não chutado.** O preview é desenhado em escala 1:1 sobre uma grade, com cotas do deslocamento, do spread, do alcance do blur e da direção da luz da camada selecionada.
- **Grátis, instantâneo e privado.** Sem conta, sem backend, sem analytics. Nada é pedido a terceiros, a não ser que você clique para carregar uma fonte do Google. As fontes que você envia não saem do seu navegador.

## Recursos

**Montar**
- Empilhe quantas camadas quiser: deslocamento, blur, spread, cor, opacidade e inset em cada uma; duplique, reordene, oculte ou remova.
- Arraste no preview para mover a sombra selecionada; desfaça e refaça com Ctrl+Z / Ctrl+Shift+Z.
- Comece de um preset (Soft, Neumorph, Glass), gere uma **sombra suave em várias camadas** ou **importe** um `box-shadow`, uma regra CSS ou uma classe `shadow-[…]` do Tailwind.
- Fundos em gradiente (linear e radial, com quantas cores quiser) e border radius.

**Ver**
- Numa caixa, num card, num botão ou no **seu próprio texto, com várias linhas**, numa fonte do seu computador (no Chromium dá para listar todas), em qualquer uma das ~1.960 **Google Fonts** com busca ou num arquivo de fonte que você enviar.
- Em português ou inglês (botão PT/EN ou `?lang=en`).
- Em fundo claro, escuro ou de qualquer cor; as cotas mantêm contraste de pelo menos 3:1 sobre ele.

**Compartilhar**
- Copie um link que reabre exatamente esta sombra; sua última sessão volta quando você reabre o site.

## O que cada exportação suporta

| Formato | Várias camadas | Spread | Inset | Fundo em gradiente |
| --- | :---: | :---: | :---: | :---: |
| CSS (propriedades ou variável) | ✅ | ✅ | ✅ | ✅ |
| Tailwind (classes ou token `@theme` da v4) | ✅ | ✅ | ✅ | ✅ |
| React / Next.js (objeto `style` inline ou CSS Modules) | ✅ | ✅ | ✅ | ✅ |
| Vue 3 (componente de arquivo único, `<style scoped>`) | ✅ | ✅ | ✅ | ✅ |
| Svelte 5 (componente com `<style>`) | ✅ | ✅ | ✅ | ✅ |
| Angular (componente standalone) | ✅ | ✅ | ✅ | ✅ |
| Flutter (`BoxDecoration`) | ✅ | ✅ | com [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) | só a camada do topo |
| Jetpack Compose 1.9+ (`dropShadow` / `innerShadow`) | ✅ | ✅ | ✅ | API indicada num comentário |
| SwiftUI | ✅ | — | ✅ (iOS 16+) | API indicada num comentário |
| React Native 0.76+ (`boxShadow`) | ✅ | ✅ | ✅ | API indicada num comentário |
| Flet (`Container.shadow`) | ✅ | ✅ | — (fica de fora, avisado num comentário) | API indicada num comentário |
| PySide6 / PyQt6 (`QGraphicsDropShadowEffect`) | só a primeira camada externa | — | — | API indicada num comentário |

O Vite não precisa de exportação própria: o CSS (ou o componente React, Vue ou Svelte) funciona em qualquer projeto Vite. O Next.js usa a exportação React.

O **modo texto** exporta `text-shadow` (CSS, Tailwind, React, Vue, Svelte, Angular), `TextStyle.shadows` (Flutter), `TextStyle.shadow` (Flet) e `.shadow` (SwiftUI); Compose, React Native e Qt aceitam **uma** sombra por texto, então exportam a primeira camada e avisam. Sombra de texto não tem spread nem inset.

O radius de sombra do SwiftUI é cerca de metade do blur do CSS; a exportação converte e avisa num comentário.

## Como começar

Use online em **[layeredshade.netlify.app](https://layeredshade.netlify.app/)** ou rode localmente (Node 20.19+):

```bash
git clone https://github.com/Franklyn-R-Silva/Layered-Shade.git
cd Layered-Shade
npm ci
npm run dev          # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes de unidade e integração (Vitest) |
| `npm run lint` | ESLint, nenhum aviso permitido |
| `npm run check` | Checagem de tipos com svelte-check, nenhum aviso permitido |
| `npm run build` | Build de produção em `dist/` |

## Contribuindo: qualquer pessoa pode ajudar

Você não precisa conhecer o código, Svelte ou sombras a fundo para contribuir. As issues marcadas como **[good first issue](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue)** são pequenas, dizem exatamente quais arquivos mexer e quando estão prontas.

1. Escolha uma issue (ou [abra uma](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new/choose)) e comente que vai pegar.
2. Faça um fork, crie uma branch e rode `npm ci`.
3. Faça a mudança com um teste; rode `npm test`, `npm run lint` e `npm run check`.
4. Abra um pull request com `Closes #<issue>`. O CI roda as mesmas checagens e você recebe uma revisão.

Relatos de bug, traduções, correções na documentação e ideias são tão bem-vindos quanto código. Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para os detalhes e o [Código de Conduta](CODE_OF_CONDUCT.md) para como nos tratamos.

## Segurança e qualidade

- Autoavaliado pelos critérios do [OpenSSF Best Practices](https://www.bestpractices.dev/projects/17195); o selo acima mostra a situação atual.
- O CodeQL analisa todo pull request. Alertas e atualizações de segurança agrupadas do Dependabot, varredura de segredos com proteção no push, instalação só pelo lockfile e actions fixadas por SHA protegem a cadeia de dependências.
- O site usa uma Content Security Policy rígida; o único terceiro que ele pode contatar é o Google Fonts, e só quando você clica para carregar uma fonte.
- Achou uma vulnerabilidade? Reporte de forma privada como explica o [SECURITY.md](SECURITY.md).

## Arquitetura

Um núcleo de lógica puro, sem framework (`src/lib/shadow.ts` e os módulos ao lado), com uma UI fina em Svelte 5 por cima, para que todo gerador seja testado sem navegador. Veja o [ARCHITECTURE.md](ARCHITECTURE.md), o sistema visual no [DESIGN.md](../../DESIGN.md) e o contexto do produto no [PRODUCT.md](../../PRODUCT.md).

## Autor

Feito por **Franklyn R. Silva** · [GitHub](https://github.com/Franklyn-R-Silva) · [LinkedIn](https://www.linkedin.com/in/franklyn-roberto-dev/)

## Licença

[MIT](../../LICENSE)
