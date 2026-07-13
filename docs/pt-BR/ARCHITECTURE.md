# Arquitetura do Projeto "Layered Shade"

Este documento descreve a estrutura de arquivos e os padrões de design utilizados no projeto.

[🇺🇸 English](../../ARCHITECTURE.md)

## Padrão de Design

O projeto utiliza uma arquitetura **MVC (Model-View-Controller)** adaptada para JavaScript Vanilla com ES Modules:

- **Model (`js/model/`)**: Define o estado da aplicação (propriedades da sombra) e a lógica de negócio (geração de código CSS e Dart).
- **View (`js/view/`)**: Manipula o DOM, atualiza a interface visual e captura eventos do usuário. Delega tarefas específicas para componentes menores.
- **Controller (`js/main.js`)**: O ponto de entrada. Instancia o Model e a View, e orquestra a comunicação entre eles.

## Estrutura de Arquivos

### HTML (`index.html`)

Estrutura semântica da página. Carrega o `js/main.js` como módulo (`type="module"`).

### CSS (`css/`)

O CSS foi modularizado para facilitar a manutenção e escalabilidade.

- **`styles.css`**: Arquivo principal que importa todos os módulos.
- **`variables.css`**: Define variáveis globais (Cores, Fontes, Espaçamentos) para o Design System.
- **`modules/`**:
  - `base.css`: Reset e estilos globais (body, fontes).
  - `layout.css`: Grid principal, cabeçalho e estrutura responsiva.
  - `glassmorphism.css`: Efeitos de vidro (frosted glass), background e blobs animados.
  - `controls.css`: Estilos gerais para os controles (sliders, containers).
  - `inputs.css`: Estilização específica de inputs (range, color, text).
  - `buttons.css`: Botões (reset, copiar).
  - `tabs.css`: Sistema de abas (CSS vs Dart).
  - `animations.css`: Keyframes para animações de fundo.

### JavaScript (`js/`)

#### 1. Controller

- **`main.js`**: Inicializa a aplicação, ouve eventos da View (via `bindEvents`) e atualiza o Model e a View em resposta.

#### 2. Model

- **`model/ShadowModel.js`**:
  - `state`: Armazena horizontal, vertical, blur, spread, color, opacity, inset, borderRadius, padding.
  - `getCSS()`: Retorna a string do `box-shadow`.
  - `getDart()`: Retorna o código Flutter `BoxShadow` / `BoxDecoration` com suporte a `BorderRadius`.
    O Flutter não tem sombra inset nativa, então `inset` é emitido como um comentário indicando o
    pacote [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow); quando
    há múltiplos gradientes de fundo, apenas a camada do topo é exportada (o `BoxDecoration` aceita
    um único gradiente).
  - `getTailwind()`: Retorna classes utilitárias arbitrárias `shadow-[...] bg-[...]`.

#### 3. View

- **`view/ShadowView.js`**:
  - Seleciona elementos do DOM.
  - `updatePreview()`: Aplica os estilos na caixa de visualização.
  - `updateInputs()`: Sincroniza os inputs com o estado atual.
  - `bindEvents()`: Associa listeners aos inputs e botões.
  - Delega funções para `TabManager` e `NotificationManager`.

#### 4. Componentes (`js/components/`)

- **`TabManager.js`**: Gerencia a lógica de troca de abas (CSS/Dart) e visibilidade de conteúdo.
- **`NotificationManager.js`**: Gerencia o feedback visual do botão de copiar.
- **`LayerManager.js`**: Gerencia a renderização da lista de camadas.
- **`BackgroundManager.js`**: Gerencia os controles de gradiente de fundo.
- **`GradientManager.js`**: Gerencia os controles de color stops.
- **`ControlFactory.js`**: Factory para criar controles de UI.

## Fluxo de Dados

1. O usuário interage com um input (ex: slider de blur).
2. `ShadowView` captura o evento e notifica o `ShadowController`.
3. `ShadowController` chama `ShadowModel.update()` para alterar o estado.
4. `ShadowController` solicita o novo estado e strings geradas ao Model.
5. `ShadowController` chama `ShadowView.updatePreview()` e `updateInputs()` para refletir as mudanças na tela.
