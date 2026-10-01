# 🎨 Tokens de Design

**Projeto:** UTFgo
**Versão:** 1.0.0
**Última atualização:** 2026-10-01

> Este documento define o mínimo necessário para manter a identidade visual
> consistente nas telas do UTFgo. Os nomes expressam o papel de cada token, não
> sua aparência.

---

## Paleta

A paleta parte das cores institucionais da UTFPR. A cor primária usa texto
escuro para manter contraste legível.

| Token | Valor | Onde se usa |
| :-- | :-- | :-- |
| `primaria` | `#FECB29` | ações principais e destaques |
| `primaria-hover` | `#E5B51F` | ação principal sob o ponteiro |
| `sobre-primaria` | `#373435` | texto e ícones sobre a cor primária |
| `superficie` | `#FFFFFF` | cartões, painéis e campos |
| `fundo` | `#F7F7F5` | fundo geral das telas |
| `texto` | `#373435` | texto principal |
| `texto-suave` | `#64605F` | legendas e informações secundárias |
| `perigo` | `#B3261E` | erros, cancelamentos e ações destrutivas |
| `sucesso` | `#1B6E3C` | confirmações e pagamento aprovado |
| `foco` | `#005FCC` | contorno para navegação por teclado |
| `desabilitado` | `#D6D3CC` | controles indisponíveis |

**Referência institucional:** [Manual de uso da marca da UTFPR](https://www.utfpr.edu.br/comunicacao/design/manual-de-uso-da-identidade-visual-da-utfpr/identidade-visual-utfpr-2016-a4-1.pdf).

---

## Escala de espaçamento

Uma única progressão baseada em 4 px será usada em todas as telas.

| Token | Valor | Uso típico |
| :-- | :-- | :-- |
| `xs` | `4px` | separação mínima entre ícone e texto |
| `sm` | `8px` | elementos próximos |
| `md` | `16px` | espaçamento interno de campos e cartões |
| `lg` | `24px` | separação entre grupos |
| `xl` | `32px` | separação entre seções |

---

## Tipografia

| Token | Família · tamanho · peso | Papel |
| :-- | :-- | :-- |
| `titulo-pagina` | Inter · `32px` · 700 | título principal |
| `titulo-secao` | Inter · `24px` · 700 | seções da tela |
| `titulo-card` | Inter · `18px` · 600 | cartões de carona e pagamento |
| `corpo` | Inter · `16px` · 400 | conteúdo e campos |
| `corpo-destaque` | Inter · `16px` · 600 | valores, horários e ações |
| `legenda` | Inter · `14px` · 400 | apoio e informações secundárias |
| `texto-botao` | Inter · `16px` · 600 | botões |

---

## Estados de botão

| Estado | Aparência e comportamento |
| :-- | :-- |
| normal | fundo `primaria`, texto `sobre-primaria` e borda transparente |
| hover | fundo `primaria-hover`, mantendo o texto escuro |
| foco (teclado) | aparência normal com contorno `foco` de `3px` e afastamento de `2px` |
| desabilitado | fundo `desabilitado`, texto `texto-suave` e nenhuma ação disponível |
| carregando | mantém a largura, apresenta indicador e texto “Processando…” e bloqueia novos cliques |

---

## Protótipo

**Status:** pendente
**Link:** ainda não criado

O protótipo deverá conter de 3 a 5 telas derivadas da jornada US02:

1. carteira e início da compra;
2. escolha da quantidade de fichas e da forma de pagamento;
3. pagamento em processamento;
4. resultado do pagamento, incluindo sucesso, expiração ou estorno.

O link deve ser adicionado aqui quando o protótipo existir.
