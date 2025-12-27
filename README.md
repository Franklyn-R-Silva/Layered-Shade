# 🎨 Gerador de Box Shadow (CSS & Flutter)

Uma ferramenta web moderna e interativa para gerar sombras CSS (`box-shadow`) e código Dart/Flutter (`BoxShadow`) visualmente.

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://gerador-de-box-shadow.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🛠️ Tecnologias Utilizadas

![Skills](https://go-skill-icons.vercel.app/api/icons?i=html,css,js&theme=dark&perline=3)

## 🚀 Demo

[👉 Acesse a ferramenta online](https://gerador-de-box-shadow.netlify.app/)

![Preview](github/tela.png)

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

## � Stack Técnica

| Tecnologia     | Uso                                                  |
| -------------- | ---------------------------------------------------- |
| **HTML5**      | Estrutura semântica                                  |
| **CSS3**       | Variables, Grid, Flexbox, Animations, Glassmorphism  |
| **JavaScript** | ES6+, Modules, Classes (Vanilla - zero dependências) |

## 📁 Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)**:

```text
js/
├── main.js              # Controller
├── model/
│   └── ShadowModel.js   # Estado e lógica de negócio
├── view/
│   └── ShadowView.js    # Manipulação do DOM
├── components/          # Componentes auxiliares
│   ├── LayerManager.js
│   ├── BackgroundManager.js
│   ├── GradientManager.js
│   └── ...
└── config/
    └── controlsConfig.js
```

Para detalhes técnicos completos, consulte [ARCHITECTURE.md](ARCHITECTURE.md).

## 🚀 Como Usar

### Online

Acesse [gerador-de-box-shadow.netlify.app](https://gerador-de-box-shadow.netlify.app/)

### Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/Franklyn-R-Silva/Gerador-de-box-shadow-com-JavaScript.git
   ```

2. Abra a pasta no VS Code

3. Use a extensão **Live Server** para abrir o `index.html`

> ⚠️ O projeto usa ES Modules, então precisa ser servido via HTTP (não funciona abrindo diretamente o arquivo).

## 📝 Como Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 👤 Autor

Franklyn R. Silva

- GitHub: [@Franklyn-R-Silva](https://github.com/Franklyn-R-Silva)
- LinkedIn: [franklyn-roberto-dev](https://www.linkedin.com/in/franklyn-roberto-dev/)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

⭐ Se este projeto foi útil, considere dar uma estrela!
