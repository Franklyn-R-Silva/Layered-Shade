/**
 * i18n.svelte.ts
 * UI copy in pt-BR and English. `t()` reads the reactive `i18n.lang`, so markup that calls it
 * re-renders when the language changes. The exported code is English in both languages.
 */
export type Lang = 'pt' | 'en';

const pt = {
  // Top bar
  skipToPreview: 'Pular para o preview',
  tagline: 'Sombras em camadas para seis plataformas',
  metaTitle: 'Layered Shade | Gerador de sombras para CSS, Flutter, Compose e SwiftUI',
  metaDescription:
    'Monte sombras em camadas para caixas e textos e copie o código em CSS, Tailwind, Flutter, Jetpack Compose, SwiftUI e React Native. Grátis e sem cadastro.',
  historyAndShare: 'Histórico e compartilhamento',
  undo: 'Desfazer (Ctrl+Z)',
  redo: 'Refazer (Ctrl+Shift+Z)',
  copyLink: 'Copiar link',
  linkCopied: 'Link copiado',
  linkInAddressBar: 'Link na barra de endereço',
  linkCopiedStatus: 'Link desta sombra copiado.',
  linkInAddressBarStatus: 'Não deu para copiar: o link desta sombra está na barra de endereço.',
  // Names the OTHER language, in that language (the switch offers it).
  switchLang: 'Switch to English',
  author: 'Autor',
  byAuthor: 'por Franklyn R. Silva',
  onGitHub: 'Franklyn R. Silva no GitHub',
  onLinkedIn: 'Franklyn R. Silva no LinkedIn',

  // Sidebar
  controls: 'Controles',
  settingsPanels: 'Painéis de configuração',
  shadow: 'Sombra',
  background: 'Fundo',
  layerN: 'Camada {n}',
  shape: 'Forma',
  resetAll: 'Resetar tudo',

  // Layer list
  shadowLayers: 'Camadas de sombra',
  add: 'Adicionar',
  insetTag: ' (interna)',
  hiddenTag: ' (oculta)',
  hideLayerN: 'Ocultar camada {n}',
  hideLayer: 'Ocultar camada',
  removeLayerN: 'Remover camada {n}',
  removeLayer: 'Remover camada',
  lastLayer: 'A sombra precisa de pelo menos uma camada',
  layerActionsN: 'Ações da camada {n}',
  duplicate: 'Duplicar',
  moveUp: 'Subir',
  moveDown: 'Descer',

  // Layer tools
  importCss: 'Importar CSS',
  // The import hint wraps two <code> snippets: before, between and after them.
  importHintA: 'Cole um ',
  importHintB: ', uma regra CSS ou uma classe ',
  importHintC: '',
  importReplace: 'Importar e substituir camadas',
  importedOne: '1 camada importada. Ctrl+Z desfaz.',
  importedMany: '{n} camadas importadas. Ctrl+Z desfaz.',
  importFailed:
    'Não reconheci essa sombra. Use valores em px e cores em hex ou rgb(), separando camadas por vírgula.',
  smoothShadow: 'Gerar sombra suave',
  smoothHint:
    'Várias camadas cujo deslocamento e desfoque dobram a cada uma: a queda suave que uma sombra só não consegue.',
  layers: 'Camadas',
  distance: 'Distância',
  intensity: 'Intensidade',
  color: 'Cor',
  smoothReplace: 'Gerar e substituir camadas',

  // Text controls
  typography: 'Tipografia',
  text: 'Texto',
  font: 'Fonte',
  fontMissing: 'Fonte não encontrada neste computador; o navegador usa uma substituta.',
  loadFont: 'Carregar fonte',
  fontStaysLocal: 'A fonte fica só neste navegador; nada é enviado.',
  textLinesHint: 'Até 6 linhas; Enter quebra a linha.',
  fontSearchHint: 'Digite para buscar entre as fontes do sistema e as {name} do Google Fonts.',
  listLocalFonts: 'Listar as fontes deste computador',
  localFontsFound: '{name} fontes deste computador entraram na lista.',
  localFontsDenied: 'Sem permissão para listar as fontes; digite o nome.',
  localFontsUnsupported: 'Este navegador não lista as fontes instaladas; digite o nome ou escolha uma da lista.',
  googleFontLoad: 'Carregar “{name}” do Google Fonts',
  googleFontNotice: 'A fonte é baixada de fonts.google.com, então o Google recebe o seu endereço IP.',
  googleFontLoading: 'Carregando “{name}”…',
  googleFontLoaded: '“{name}” carregada do Google Fonts.',
  googleFontFailed: 'Não deu para carregar a fonte do Google Fonts.',
  fontTooBig: 'Arquivo grande demais: o limite é 5 MB.',
  fontDefaultName: 'Fonte carregada',
  fontLoaded: 'Fonte {name} carregada.',
  fontUnreadable: 'Não consegui ler esse arquivo de fonte.',
  size: 'Tamanho',
  sizeInPixels: 'Tamanho em pixels',
  weight: 'Peso',
  textColorHex: 'Cor do texto em hexadecimal',

  // Shadow and shape controls (labels of src/lib/config/controls.ts)
  horizontal: 'Deslocamento Horizontal',
  vertical: 'Deslocamento Vertical',
  blur: 'Desfoque (Blur)',
  spread: 'Propagação (Spread)',
  shadowColor: 'Cor da Sombra',
  opacity: 'Opacidade',
  inset: 'Sombra interna (inset)',
  borderRadius: 'Arredondamento (Radius)',
  inHex: '{label} em hexadecimal',
  inPercent: '{label} em porcentagem',
  inPixels: '{label} em pixels',

  // Background panel
  baseColor: 'Cor base',
  solidBoxColor: 'Cor sólida da caixa',
  gradients: 'Gradientes',
  noGradients: 'Sem gradientes: a caixa usa só a cor base. Adicione um para empilhar gradientes sobre ela.',
  removeGradientN: 'Remover gradiente {n}',
  removeGradient: 'Remover gradiente',
  gradientN: 'Gradiente {n}',
  type: 'Tipo',
  angle: 'Ângulo',
  positionX: 'Posição X',
  positionY: 'Posição Y',
  farthestCorner: 'Canto distante (padrão)',
  closestSide: 'Lado próximo',
  closestCorner: 'Canto próximo',
  farthestSide: 'Lado distante',
  colors: 'Cores',
  colorN: 'Cor {n}',
  colorPositionN: 'Posição da cor {n}',
  removeColorN: 'Remover cor {n}',
  removeColor: 'Remover cor',
  minColors: 'Um gradiente precisa de pelo menos 2 cores',

  // Stage bar
  startFrom: 'Começar de',
  element: 'Elemento',
  box: 'Caixa',
  card: 'Card',
  button: 'Botão',
  canvas: 'Fundo',
  light: 'Claro',
  dark: 'Escuro',
  canvasColor: 'Cor do fundo da prancha',
  guides: 'Cotas',

  // Preview
  textSample: 'Texto “{text}” de demonstração com sombra de texto',
  sampleOneLayer: '{name} de demonstração com 1 camada de sombra',
  sampleLayers: '{name} de demonstração com {n} camadas de sombra',
  sampleTitle: 'Relatório semanal',
  sampleText: '12 pedidos novos, 3 aguardando envio',
  sampleMeta: 'Atualizado há 5 min',
  sampleButton: 'Comprar agora',
  stageCaption: 'Camada {i} de {n}{inset}, escala 1:1',
  stageCaptionInset: ', interna',
  spreadOutline: 'contorno com spread',
  blurReach: 'alcance do blur',
  textDrops: 'texto: sem spread e sem inset',
  dragHint: 'Arraste na prancha para mover a sombra',
  lightRay: 'luz',

  // Code output
  generatedCode: 'Código gerado',
  variant: 'Variante',
  properties: 'Propriedades',
  cssVariable: 'Variável CSS',
  theme: 'Tema (v4)',
  // Notes wrap a <code> snippet: before and after it.
  dartInsetA: 'O ',
  dartInsetB: ' do Flutter não tem inset. Para as camadas internas, instale o pacote:',
  dartGradientA: 'O ',
  dartGradientB: ' aceita um gradiente só: o Dart exporta o gradiente 1 (o do topo). CSS e Tailwind levam todos.',
  copied: 'Copiado',
  copyTab: 'Copiar {tab}',
  copiedStatus: 'Código {tab} copiado para a área de transferência.',
  copyFailed: 'Não deu para copiar. Selecione o código acima e use Ctrl+C.',

  // Image mode (#75)
  image: 'Imagem',
  imageFile: 'Arquivo de imagem',
  imageHint:
    'PNG, JPEG, WebP, GIF ou SVG, até 10 MB. A imagem fica só neste navegador; nada é enviado. O link de compartilhamento não leva a imagem.',
  imageLoaded: 'Imagem {name} carregada.',
  imageTooBig: 'Arquivo grande demais: o limite é 10 MB.',
  imageWrongType: 'Formato não aceito: use PNG, JPEG, WebP, GIF ou SVG.',
  imageUnreadable: 'Não consegui ler esse arquivo de imagem.',
  imageWidth: 'Largura',
  imageSample: 'Imagem de exemplo',
  imageDrops: 'imagem (drop-shadow): sem spread e sem inset',
  // Exports (#77)
  exportFormat: 'Formato',
  inlineStyle: 'Estilo inline',
  // Technical controls (#76)
  inDegrees: '{label} em graus',
  lightClamped: 'X e Y vão até ±100 px: a distância foi encurtada.',
  globalLight: 'Luz global (camadas visíveis)',
  lightHandle: 'Arraste para girar a luz',
};

export type Key = keyof typeof pt;

// Typed against `pt`: a missing key fails the type check.
const en: Record<Key, string> = {
  skipToPreview: 'Skip to preview',
  tagline: 'Layered shadows for six platforms',
  metaTitle: 'Layered Shade | Shadow generator for CSS, Flutter, Compose and SwiftUI',
  metaDescription:
    'Design layered box and text shadows and copy the code as CSS, Tailwind, Flutter, Jetpack Compose, SwiftUI or React Native. Free, no sign-up.',
  historyAndShare: 'History and sharing',
  undo: 'Undo (Ctrl+Z)',
  redo: 'Redo (Ctrl+Shift+Z)',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  linkInAddressBar: 'Link in the address bar',
  linkCopiedStatus: 'Link to this shadow copied.',
  linkInAddressBarStatus: 'Could not copy: the link to this shadow is in the address bar.',
  switchLang: 'Mudar para português',
  author: 'Author',
  byAuthor: 'by Franklyn R. Silva',
  onGitHub: 'Franklyn R. Silva on GitHub',
  onLinkedIn: 'Franklyn R. Silva on LinkedIn',

  controls: 'Controls',
  settingsPanels: 'Settings panels',
  shadow: 'Shadow',
  background: 'Background',
  layerN: 'Layer {n}',
  shape: 'Shape',
  resetAll: 'Reset all',

  shadowLayers: 'Shadow layers',
  add: 'Add',
  insetTag: ' (inset)',
  hiddenTag: ' (hidden)',
  hideLayerN: 'Hide layer {n}',
  hideLayer: 'Hide layer',
  removeLayerN: 'Remove layer {n}',
  removeLayer: 'Remove layer',
  lastLayer: 'A shadow needs at least one layer',
  layerActionsN: 'Layer {n} actions',
  duplicate: 'Duplicate',
  moveUp: 'Move up',
  moveDown: 'Move down',

  importCss: 'Import CSS',
  importHintA: 'Paste a ',
  importHintB: ', a CSS rule or a ',
  importHintC: ' class',
  importReplace: 'Import and replace layers',
  importedOne: '1 layer imported. Ctrl+Z undoes it.',
  importedMany: '{n} layers imported. Ctrl+Z undoes it.',
  importFailed: 'Could not read that shadow. Use px values and hex or rgb() colors, with commas between layers.',
  smoothShadow: 'Smooth shadow',
  smoothHint:
    'Several layers whose offset and blur double each time: the soft falloff a single shadow cannot give.',
  layers: 'Layers',
  distance: 'Distance',
  intensity: 'Intensity',
  color: 'Color',
  smoothReplace: 'Generate and replace layers',

  typography: 'Typography',
  text: 'Text',
  font: 'Font',
  fontMissing: 'Font not found on this computer; the browser uses a fallback.',
  loadFont: 'Load font',
  fontStaysLocal: 'The font stays in this browser; nothing is uploaded.',
  textLinesHint: 'Up to 6 lines; Enter starts a new line.',
  fontSearchHint: 'Type to search system fonts and the {name} Google Fonts families.',
  listLocalFonts: 'List the fonts on this computer',
  localFontsFound: '{name} fonts from this computer were added to the list.',
  localFontsDenied: 'No permission to list the fonts; type the name.',
  localFontsUnsupported: 'This browser cannot list installed fonts; type a name or pick one from the list.',
  googleFontLoad: 'Load “{name}” from Google Fonts',
  googleFontNotice: 'The font is downloaded from fonts.google.com, so Google receives your IP address.',
  googleFontLoading: 'Loading “{name}”…',
  googleFontLoaded: '“{name}” loaded from Google Fonts.',
  googleFontFailed: 'Could not load the font from Google Fonts.',
  fontTooBig: 'File too large: the limit is 5 MB.',
  fontDefaultName: 'Uploaded font',
  fontLoaded: 'Font {name} loaded.',
  fontUnreadable: 'Could not read that font file.',
  size: 'Size',
  sizeInPixels: 'Size in pixels',
  weight: 'Weight',
  textColorHex: 'Text color in hex',

  horizontal: 'Horizontal offset',
  vertical: 'Vertical offset',
  blur: 'Blur',
  spread: 'Spread',
  shadowColor: 'Shadow color',
  opacity: 'Opacity',
  inset: 'Inner shadow (inset)',
  borderRadius: 'Border radius',
  inHex: '{label} in hex',
  inPercent: '{label} in percent',
  inPixels: '{label} in pixels',

  baseColor: 'Base color',
  solidBoxColor: 'Solid box color',
  gradients: 'Gradients',
  noGradients: 'No gradients: the box uses only the base color. Add one to stack gradients over it.',
  removeGradientN: 'Remove gradient {n}',
  removeGradient: 'Remove gradient',
  gradientN: 'Gradient {n}',
  type: 'Type',
  angle: 'Angle',
  positionX: 'Position X',
  positionY: 'Position Y',
  farthestCorner: 'Farthest corner (default)',
  closestSide: 'Closest side',
  closestCorner: 'Closest corner',
  farthestSide: 'Farthest side',
  colors: 'Colors',
  colorN: 'Color {n}',
  colorPositionN: 'Color {n} position',
  removeColorN: 'Remove color {n}',
  removeColor: 'Remove color',
  minColors: 'A gradient needs at least 2 colors',

  startFrom: 'Start from',
  element: 'Element',
  box: 'Box',
  card: 'Card',
  button: 'Button',
  canvas: 'Canvas',
  light: 'Light',
  dark: 'Dark',
  canvasColor: 'Canvas color',
  guides: 'Guides',

  textSample: 'Sample text “{text}” with a text shadow',
  sampleOneLayer: '{name} sample with 1 shadow layer',
  sampleLayers: '{name} sample with {n} shadow layers',
  sampleTitle: 'Weekly report',
  sampleText: '12 new orders, 3 awaiting shipment',
  sampleMeta: 'Updated 5 min ago',
  sampleButton: 'Buy now',
  stageCaption: 'Layer {i} of {n}{inset}, 1:1 scale',
  stageCaptionInset: ', inset',
  spreadOutline: 'spread outline',
  blurReach: 'blur reach',
  textDrops: 'text: no spread, no inset',
  dragHint: 'Drag on the canvas to move the shadow',
  lightRay: 'ray',

  generatedCode: 'Generated code',
  variant: 'Variant',
  properties: 'Properties',
  cssVariable: 'CSS variable',
  theme: 'Theme (v4)',
  dartInsetA: "Flutter's ",
  dartInsetB: ' has no inset. For the inset layers, install the package:',
  dartGradientA: '',
  dartGradientB: ' takes a single gradient: Dart exports gradient 1 (the top one). CSS and Tailwind get them all.',
  copied: 'Copied',
  copyTab: 'Copy {tab}',
  copiedStatus: '{tab} code copied to the clipboard.',
  copyFailed: 'Could not copy. Select the code above and press Ctrl+C.',

  // Image mode (#75)
  image: 'Image',
  imageFile: 'Image file',
  imageHint:
    'PNG, JPEG, WebP, GIF or SVG, up to 10 MB. The image stays in this browser; nothing is uploaded. Share links do not carry the image.',
  imageLoaded: 'Image {name} loaded.',
  imageTooBig: 'File too large: the limit is 10 MB.',
  imageWrongType: 'Format not accepted: use PNG, JPEG, WebP, GIF or SVG.',
  imageUnreadable: 'Could not read that image file.',
  imageWidth: 'Width',
  imageSample: 'Sample image',
  imageDrops: 'image (drop-shadow): no spread, no inset',
  // Exports (#77)
  exportFormat: 'Format',
  inlineStyle: 'Inline style',
  // Technical controls (#76)
  inDegrees: '{label} in degrees',
  lightClamped: 'X and Y stop at ±100 px, so the distance was shortened.',
  globalLight: 'Global light (visible layers)',
  lightHandle: 'Drag to turn the light',
};

const dict: Record<Lang, Record<Key, string>> = { pt, en };
const LANG_KEY = 'layered-shade:lang';
/** Value for the `lang` attribute. */
export const HTML_LANG: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };
const isLang = (v: unknown): v is Lang => v === 'pt' || v === 'en';

/** `?lang=` wins, then the saved choice, then the browser language. */
function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang');
  if (isLang(param)) return param;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage blocked (private mode, sandbox): fall back to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export const i18n = $state<{ lang: Lang }>({ lang: initialLang() });
applyDocument(i18n.lang);

/** Title, description and canonical follow the language, so `?lang=en` is a real English page. */
function applyDocument(lang: Lang): void {
  document.documentElement.lang = HTML_LANG[lang];
  document.title = dict[lang].metaTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict[lang].metaDescription);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `${location.origin}/${lang === 'en' ? '?lang=en' : ''}`);
}

export function setLang(lang: Lang): void {
  i18n.lang = lang;
  applyDocument(lang);
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Remembering the choice is a convenience.
  }
  // A `?lang=` link would switch back on reload: keep the parameter, with the new value.
  const search = location.search.replace(/([?&]lang=)[^&]*/, `$1${lang}`);
  if (search !== location.search) history.replaceState(null, '', location.pathname + search + location.hash);
}

/** Copy for `key` in the current language; `{name}` takes `params.name`. */
export function t(key: Key, params: Record<string, string | number> = {}): string {
  return dict[i18n.lang][key].replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m));
}
