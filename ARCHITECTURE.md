# "Layered Shade" Project Architecture

This document describes the file structure and design patterns used in the project.

[🇧🇷 Português](docs/pt-BR/ARCHITECTURE.md)

## Design Pattern

The project uses an **MVC (Model-View-Controller)** architecture adapted for Vanilla JavaScript with ES Modules:

- **Model (`js/model/`)**: Defines the application state (shadow properties) and business logic (CSS and Dart code generation).
- **View (`js/view/`)**: Manipulates the DOM, updates the visual interface and captures user events. Delegates specific tasks to smaller components.
- **Controller (`js/main.js`)**: The entry point. Instantiates the Model and View, and orchestrates communication between them.

## File Structure

### HTML (`index.html`)

Semantic page structure. Loads `js/main.js` as a module (`type="module"`).

### CSS (`css/`)

CSS has been modularized for easier maintenance and scalability.

- **`styles.css`**: Main file that imports all modules.
- **`variables.css`**: Defines global variables (Colors, Fonts, Spacing) for the Design System.
- **`modules/`**:
  - `base.css`: Reset and global styles (body, fonts).
  - `layout.css`: Main grid, header and responsive structure.
  - `glassmorphism.css`: Glass effects (frosted glass), background and animated blobs.
  - `controls.css`: General styles for controls (sliders, containers).
  - `inputs.css`: Specific input styling (range, color, text).
  - `buttons.css`: Buttons (reset, copy).
  - `tabs.css`: Tab system (CSS vs Dart).
  - `animations.css`: Keyframes for background animations.

### JavaScript (`js/`)

#### 1. Controller

- **`main.js`**: Initializes the application, listens for View events (via `bindEvents`) and updates Model and View in response.

#### 2. Model

- **`model/ShadowModel.js`**:
  - `state`: Stores horizontal, vertical, blur, spread, color, opacity, inset, borderRadius, padding.
  - `getCSS()`: Returns the `box-shadow` string.
  - `getDart()`: Returns Flutter `BoxShadow` / `BoxDecoration` code with `BorderRadius` support.
    Flutter has no native inset shadow, so `inset` is emitted as a comment noting the
    [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) package;
    when multiple background gradients exist, only the top layer is exported (`BoxDecoration`
    accepts a single gradient).
  - `getTailwind()`: Returns `shadow-[...] bg-[...]` arbitrary utility classes.

#### 3. View

- **`view/ShadowView.js`**:
  - Selects DOM elements.
  - `updatePreview()`: Applies styles to the preview box.
  - `updateInputs()`: Syncs inputs with current state.
  - `bindEvents()`: Associates listeners to inputs and buttons.
  - Delegates functions to `TabManager` and `NotificationManager`.

#### 4. Components (`js/components/`)

- **`TabManager.js`**: Manages tab switching logic (CSS/Dart) and content visibility.
- **`NotificationManager.js`**: Manages copy button visual feedback.
- **`LayerManager.js`**: Manages shadow layer list rendering.
- **`BackgroundManager.js`**: Manages background gradient controls.
- **`GradientManager.js`**: Manages gradient stop controls.
- **`ControlFactory.js`**: Factory for creating UI controls.

## Data Flow

1. User interacts with an input (e.g., blur slider).
2. `ShadowView` captures the event and notifies `ShadowController`.
3. `ShadowController` calls `ShadowModel.update()` to change state.
4. `ShadowController` requests new state and generated strings from Model.
5. `ShadowController` calls `ShadowView.updatePreview()` and `updateInputs()` to reflect changes on screen.
