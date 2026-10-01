# 🗺️ Jornadas de Usuário

**Projeto:** UTFgo
**Versão:** 1.0.0
**Última atualização:** 2026-10-01

> Este documento registra o que a pessoa vive durante as jornadas críticas do
> produto, com atenção aos pontos em que ela pode esperar, travar ou desistir.

---

## Jornada 1 — Compra de fichas

**Story:** US02 — Compra de fichas
**Critérios que ela marca:** sai do site e volta · depende do tempo · depende
de outra parte agir · pode ser abandonada no meio

```mermaid
flowchart TD
    A(["Passageiro abre a carteira"]) --> B["«pessoa» escolhe comprar fichas"]
    B --> C["«pessoa» informa de 1 a 30 fichas"]
    C --> D{"Quantidade válida?"}

    D -->|"não"| E["«pessoa» corrige a quantidade"]
    E --> C

    D -->|"sim"| F["«pessoa» escolhe Pix ou cartão"]
    F --> G(["Pedido aguardando pagamento"])
    G --> H["«pessoa» realiza o pagamento no gateway"]

    H --> I{"O passageiro volta ao UTFgo?"}
    I -->|"não, fecha a página"| X1[["Passageiro some durante o pagamento"]]
    I -->|"sim"| J{"Pagamento já foi confirmado?"}

    X1 --> K{"Confirmação chega em até 15 minutos?"}
    J -->|"ainda não"| L["«pessoa» vê pagamento em processamento"]
    L --> K

    J -->|"sim"| M(["Pedido pago e fichas creditadas"])
    K -->|"sim"| M
    K -->|"não"| N(["Pedido expirado sem fichas"])

    N --> O{"Confirmação chegou depois?"}
    O -->|"sim"| P(["Valor encaminhado para estorno"])
    O -->|"não"| Q(["Fluxo encerrado"])

    style X1 fill:#ffe0e0,stroke:#c62828,stroke-width:2px
```

**O que decidimos sobre o nó vermelho:**

Se o passageiro fechar a página do pagamento, o pedido continuará aguardando
por até 15 minutos. Fechar a página ou retornar ao UTFgo não libera fichas. Se o
gateway confirmar o pagamento dentro do prazo, as fichas serão creditadas mesmo
que o passageiro não volte naquele momento. Sem confirmação, o pedido expira;
uma confirmação posterior será encaminhada para estorno.

---

## Dúvidas em aberto

Nenhuma no momento.
