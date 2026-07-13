/**
 * controlsConfig.js
 */
export const shadowControls = [
    { id: 'horizontal', label: 'Deslocamento Horizontal', min: -100, max: 100, value: 5, category: 'shadow' },
    { id: 'vertical', label: 'Deslocamento Vertical', min: -100, max: 100, value: 5, category: 'shadow' },
    { id: 'blur', label: 'Desfoque (Blur)', min: 0, max: 100, value: 10, category: 'shadow' },
    { id: 'spread', label: 'Propagação (Spread)', min: -100, max: 100, value: 3, category: 'shadow' },
    { id: 'color', label: 'Cor da Sombra', type: 'color', value: '#000000', category: 'shadow' },
    { id: 'opacity', label: 'Opacidade', min: 0, max: 100, value: 100, category: 'shadow' },
    { id: 'inset', label: 'Sombra interna? (Inset)', type: 'checkbox', category: 'shadow' },
    
    { id: 'borderRadius', label: 'Arredondamento (Radius)', min: 0, max: 50, value: 0, category: 'shape' },
];
