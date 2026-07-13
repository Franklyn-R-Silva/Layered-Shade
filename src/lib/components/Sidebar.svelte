<script lang="ts">
  import { ui, actions } from '../state.svelte';
  import LayerList from './LayerList.svelte';
  import ShadowControls from './ShadowControls.svelte';
  import ShapeControls from './ShapeControls.svelte';
  import BackgroundPanel from './BackgroundPanel.svelte';
</script>

<aside id="controls" aria-label="Controles de sombra">
  <div class="sidebar-tabs" role="tablist" aria-label="Painéis de configuração">
    <button
      class="sidebar-tab {ui.sidebar === 'shadow' ? 'active' : ''}"
      role="tab"
      aria-selected={ui.sidebar === 'shadow'}
      onclick={() => (ui.sidebar = 'shadow')}
    >
      Sombra
    </button>
    <button
      class="sidebar-tab {ui.sidebar === 'background' ? 'active' : ''}"
      role="tab"
      aria-selected={ui.sidebar === 'background'}
      onclick={() => (ui.sidebar = 'background')}
    >
      Fundo
    </button>
  </div>

  <div class="sidebar-content {ui.sidebar === 'shadow' ? 'active' : ''}" role="tabpanel">
    <h2>Configurações da Sombra:</h2>
    <div id="layer-controls-container"><LayerList /></div>
    <div id="shadow-controls-container"><ShadowControls /></div>

    <h2 class="section-title-secondary">Forma &amp; Tamanho</h2>
    <div id="shape-controls-container"><ShapeControls /></div>
  </div>

  <div class="sidebar-content {ui.sidebar === 'background' ? 'active' : ''}" role="tabpanel">
    <BackgroundPanel />
  </div>

  <div class="form-control button-control">
    <button
      type="button"
      id="resetButton"
      class="reset-btn"
      aria-label="Resetar todas as configurações para valores padrão"
      onclick={() => actions.reset()}
    >
      ↺ Resetar Tudo
    </button>
  </div>
</aside>
