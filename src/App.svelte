<script lang="ts">
  import Toolbar from './lib/components/Toolbar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import PreviewBox from './lib/components/PreviewBox.svelte';
  import CodeOutput from './lib/components/CodeOutput.svelte';
  import Footer from './lib/components/Footer.svelte';
</script>

<a href="#box-shadow-generator" class="skip-link">Pular para o conteúdo principal</a>

<div class="bg-blobs" aria-hidden="true">
  <div class="blob"></div>
  <div class="blob"></div>
  <div class="blob"></div>
</div>

<div class="main-wrapper glass-panel">
  <header id="main-header">
    <h1>Layered <span>Shade</span></h1>
    <p>Crie sombras modernas e exporte para CSS ou Flutter</p>
  </header>

  <main id="main-content">
    <Toolbar />

    <div id="box-shadow-generator">
      <Sidebar />
      <PreviewBox />
    </div>

    <CodeOutput />
  </main>

  <Footer />
</div>
