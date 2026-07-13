# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

[🇺🇸 English](../../CHANGELOG.md)

## [2.0.0] - 2026-07-13

### Modificado

- 🚀 **Migração de framework**: reescrito de vanilla JS (MVC) para **Svelte 5 + Vite + TypeScript**.
  - Lógica pura de geração de código preservada em `src/lib/shadow.ts` (estado + CSS/Dart/Tailwind).
  - Singleton reativo `$state` (`src/lib/state.svelte.ts`) substitui o wiring manual do controller.
  - UI dividida em componentes Svelte; design system CSS global reaproveitado sem mudanças.
  - Modelo de domínio tipado (`src/lib/types.ts`); `svelte-check` no build e na CI.
  - ~99% de cobertura no núcleo puro mantida (71 testes); bundle de produção ≈ 23 KB gzip (JS).
- 🏗️ **Build/deploy**: a Netlify agora roda `npm run build` → `dist/`; assets estáticos em `public/`.

## [1.2.0] - 2026-07-13

### Corrigido

- 🐛 **Mutação dos stops de gradiente**: `getBackgroundCSS()` / `getBackgroundCSSForLayer()`
  não ordenam mais `layer.stops` no lugar, o que corrompia a ordem dos stops a cada render.
- 🐛 **Exportação Tailwind**: removido o escape que se anulava (parênteses escapados e depois
  removidos) e normalizados os valores `rgba()` para que `shadow-[...]`/`bg-[...]` sejam válidos.
- 🐛 **Exibição da opacidade**: o campo de texto da opacidade agora mostra o mesmo valor 0–100
  do slider.
- 🐛 **Consistência do Reset**: `reset()` restaura a opacidade inicial da sombra (0.2) em vez de 0.5.
- 🐛 **Feedback de cópia**: a aba Tailwind agora diz "(Tailwind)" em vez de "(Dart)".
- 🐛 **Controle de cor da sombra**: o seletor de cor agora inicializa explicitamente.

### UI / Design

- 🎨 **Painel de controles sem estilo de vidro**: o CSS mirava um `#controls-container`
  inexistente; o elemento real é `#controls`, então a barra lateral era renderizada sem o card
  de vidro. Agora os painéis de controles e de preview são cards de vidro consistentes.
- 🎨 **Sobreposição do título do preview**: o título "Preview" era posicionado com `absolute` e
  podia sobrepor a caixa em telas pequenas; agora fica no fluxo normal com a caixa centralizada.
- 🎨 **Contraste do rodapé**: links sociais e o divisor usavam cores brancas quase invisíveis no
  tema claro; receberam fundos/bordas visíveis adequados ao fundo claro.
- 🎨 **Caixa de preview** com cor inicial sincronizada ao padrão do model (`#ffdd00`), removendo
  o "flash" de cor.
- ♿ **Movimento reduzido**: suporte a `prefers-reduced-motion` para parar os blobs flutuantes e
  as transições de fade; no mobile o preview deixa de ser sticky e reduz a altura mínima.

### Adicionado

- 🧪 **Testes de regressão**: cobertura para as correções acima (133 testes no total).
- 🔍 **SEO**: link canônico, `og:image`/`twitter:image` absolutos, schema JSON-LD
  `WebApplication`, importação da fonte Fira Code e `sitemap.xml`.
- 📱 **PWA**: `manifest.json` e `apple-touch-icon` para instalação.
- ♿ **Acessibilidade**: indicadores `:focus-visible` para botões de preset e sliders.

### Modificado

- 📊 **Cobertura honesta**: badges/notas agora refletem que os testes cobrem a lógica central
  (~99%), com as camadas de DOM/controller verificadas manualmente.

---

## [1.1.0] - 2025-12-27

### Adicionado

- ✅ **Testes Unitários**: 125 testes com Vitest cobrindo a lógica central (Model, config, componentes)
- 📁 **Estrutura de Testes**: Pasta `tests/` organizada espelhando `js/`
- 🔧 **GitHub Actions**: CI/CD para rodar testes automaticamente
- 📝 **CONTRIBUTING.md**: Guia para contribuidores
- ♿ **Acessibilidade**: Skip link, ARIA roles, landmarks semânticos
- 🔒 **SECURITY.md**: Política de segurança
- 📜 **CODE_OF_CONDUCT.md**: Código de conduta
- 🌐 **i18n**: Documentação em inglês e português

### Modificado

- 📖 **README.md**: Badges de Lighthouse, seção de acessibilidade
- 🎨 **Footer**: Design atualizado com links sociais
- 🐛 **Templates**: Correção dos presets Neumorph e Glass

### Corrigido

- 🔧 Métodos `addLayer`, `removeLayer`, `selectLayer` no ShadowModel
- 🔧 Visibilidade dos tab panels (removido atributo `hidden` conflitante)

---

## [1.0.0] - 2025-12-01

### Lançamento Inicial

- 🎨 **Gerador de Sombras**: Interface visual para criar box-shadows
- 🔄 **Múltiplas Camadas**: Suporte a várias camadas de sombra
- 🌈 **Gradientes**: Linear e radial com múltiplos color stops
- 📋 **Exportação**: CSS, Dart/Flutter e Tailwind
- 📱 **Responsivo**: Layout adaptável para mobile e desktop
- 🎯 **Templates**: Presets Soft, Neumorphism e Glass
- 🏗️ **Arquitetura MVC**: Código organizado e modular

---

## Links

- [Repositório](https://github.com/Franklyn-R-Silva/Layered-Shade)
- [Demo](https://layeredshade.netlify.app/)
