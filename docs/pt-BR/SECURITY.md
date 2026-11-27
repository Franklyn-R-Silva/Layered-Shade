# Política de Segurança

[🇺🇸 English](../../SECURITY.md)

## Versões suportadas

Só a versão mais recente, publicada em [layeredshade.netlify.app](https://layeredshade.netlify.app/), recebe correções.

| Versão | Suportada |
| ------ | --------- |
| 2.x    | ✅ Sim    |
| < 2.0  | ❌ Não    |

## Reportando uma vulnerabilidade

Por favor, **não** abra uma issue pública. Reporte de forma privada, por um destes caminhos:

1. **GitHub**: abra a [aba Security](https://github.com/Franklyn-R-Silva/Layered-Shade/security) e clique em **Report a vulnerability** (o reporte privado de vulnerabilidades está ativado).
2. **E-mail**: `franklyn.dev.mobile@gmail.com`

Inclua a descrição do problema, os passos para reproduzir, o impacto possível e uma sugestão de correção, se tiver.

### Tempo de resposta

- **Confirmação**: em até 48 horas
- **Avaliação inicial**: em até 1 semana
- **Resolução**: depende da severidade

Você será mantido a par e creditado na correção, se quiser.

## Escopo

O Layered Shade é uma ferramenta frontend estática, sem backend. Problemas relevantes incluem:

- XSS (cross-site scripting) ou injeção de código pelo código gerado ou pela interface
- Dependências vulneráveis (npm, GitHub Actions)
- Falhas nos cabeçalhos HTTP do deploy

## O que o projeto faz

- Nenhum dado do usuário é coletado ou armazenado; não há backend, banco de dados nem analytics.
- O site é servido com uma Content Security Policy que só permite scripts, estilos e fontes do próprio app, além de `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, uma política de referrer restrita e uma permissions policy (veja o `netlify.toml`).
- As fontes são hospedadas no próprio app; a página não carrega nada de terceiros.
- No repositório estão ativados os alertas e as atualizações de segurança agrupadas do Dependabot, a varredura de segredos com proteção no push e a análise de código do CodeQL.
- O CI instala pelo lockfile (`npm ci`) e roda lint, testes e um build com checagem de tipos em todo pull request.
