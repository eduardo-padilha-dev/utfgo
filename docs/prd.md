# 📄 Product Requirements Document (PRD)

**Projeto:** UTFgo
**Versão:** 1.1.0
**Última atualização:** 2026-09-30

> Fonte da verdade sobre o que o produto faz. Decisões de tecnologia e
> implementação pertencem ao `docs/architecture.md`.

---

## 🎯 1. Visão Geral e Objetivo

**O problema:** Membros da comunidade acadêmica da UTFPR têm dificuldade para
ir até a universidade e retornar dela, embora muitas pessoas façam trajetos
equivalentes, em horários semelhantes e partindo de pontos comuns da cidade.

**A solução:** O UTFgo conecta membros da comunidade acadêmica que oferecem
caronas a passageiros que precisam ir ao campus ou retornar dele. A reserva de
vagas utiliza fichas pré-pagas, com regras de cancelamento e acompanhamento de
assiduidade.

**Como saberemos que deu certo:** Será possível acompanhar passageiros e
condutores cadastrados, caronas concluídas, canceladas ou expiradas e os pontos
de encontro com maior utilização.

**Validação do tema:** aceito pelo professor.

---

## 📖 2. Glossário Ubíquo

| Termo | Significa | Não confundir com |
| :-- | :-- | :-- |
| **Administrador** | Usuário que gere pontos, documentos, contas e contestações. | Passageiro ou condutor. |
| **Passageiro** | Usuário ativo que busca caronas e solicita vagas. | Visitante ou usuário inativo. |
| **Condutor** | Passageiro maior de 18 anos com CNH e CRLV aprovados. | Motorista de aplicativo comercial. |
| **Ponto de Encontro** | Local oficial de embarque ou desembarque. | Endereço arbitrário. |
| **Carona** | Deslocamento solidário entre um ponto oficial e o campus. | Corrida comercial. |
| **Sentido** | Ida ao campus ou volta do campus. | Rota entre destinos arbitrários. |
| **Vaga** | Assento disponível em uma carona. | Reserva. |
| **Solicitação de Reserva** | Pedido de vaga que aguarda o condutor. | Reserva confirmada. |
| **Reserva** | Direito à vaga após o aceite do condutor. | Solicitação pendente. |
| **Ficha** | Crédito interno de R$ 2,00, usado em reservas e convertível integralmente em dinheiro. | Dinheiro em conta bancária. |
| **Carteira** | Saldo de fichas compradas, recebidas ou doadas. | Conta bancária externa. |
| **Pedido de Fichas** | Solicitação de compra com quantidade e valor total. | Pagamento confirmado. |
| **Pagamento** | Quitação de pedido por Pix ou cartão que libera fichas após confirmação. | Saque. |
| **Pontos de Penalidade** | Pontos por descumprimento de regras usados para suspender usuários. | Fichas. |
| **Contestação** | Pedido para o administrador rever o repasse de uma carona. | Denúncia geral. |

---

## 👤 3. Atores e Permissões

| Ator | Quem é | Pode | Não pode |
| :-- | :-- | :-- | :-- |
| **Passageiro** | Membro com conta ativa. | Gerir perfil e carteira; buscar caronas; solicitar e cancelar reservas; pedir homologação; avaliar e denunciar após a carona. | Reservar sem saldo ou durante suspensão; criar conflito de horário; oferecer sem homologação; acessar dados sensíveis alheios. |
| **Condutor** | Passageiro maior de 18 anos com CNH e CRLV aprovados. | Publicar e gerir caronas; decidir solicitações; registrar presença; iniciar e finalizar; avaliar e denunciar. | Oferecer com documentos vencidos ou durante suspensão; criar conflito de horário; alterar ponto publicado; acessar dados sensíveis de passageiros. |
| **Administrador** | Gestor da plataforma. | Gerir pontos; aprovar CNH e CRLV; moderar contas; decidir contestações e estornos; consultar relatórios e auditoria. | Participar de caronas com a conta administrativa; alterar avaliações; apagar históricos; acessar documentos sem registro; criar fichas sem operação formal. |

Ao atingir 10 pontos, o usuário fica suspenso por um mês para reservar e
oferecer caronas, mas ainda pode acessar a conta e administrar a carteira.

---

## 📝 4. Escopo Funcional (User Stories)

### Must Have — escopo comprometido do MVP

#### US01 — Cadastro e acesso institucional · `Must Have` · `M` · Status: `🟡 Ready`

**Como** membro da UTFPR, **quero** acessar por código enviado ao e-mail
institucional **para que** eu use o UTFgo sem cadastrar senha.

- [ ] **Dado** e-mail `alunos.utfpr.edu.br` ou `utfpr.edu.br`, **quando** solicitar acesso, **então** será enviado um código válido por 15 minutos.
- [ ] **Dado** código válido, **quando** informar nome e CPF válido e único, **então** a conta será criada; a foto será opcional.
- [ ] **Dado** usuário existente, **quando** validar o código, **então** acessará a conta sem duplicá-la.
- [ ] **Dado** domínio não aceito, CPF repetido, código incorreto ou expirado, **quando** tentar concluir, **então** a ação será recusada.
- [ ] **Dado** novo código emitido ou fluxo abandonado, **quando** houver nova tentativa, **então** o código anterior será inválido e nenhuma conta incompleta existirá.

**Regras relacionadas:** RN01–RN04.

#### US02 — Compra de fichas · `Must Have` · `M` · Status: `🟡 Ready`

**Como** passageiro, **quero** comprar fichas por Pix ou cartão **para que**
eu tenha saldo para reservar caronas.

- [ ] **Dado** usuário autenticado, **quando** pedir de 1 a 30 fichas inteiras, **então** será criado um pedido a R$ 2,00 por ficha.
- [ ] **Dado** pedido válido, **quando** escolher Pix ou cartão, **então** o pagamento será iniciado em gateway integrado no ambiente sandbox.
- [ ] **Dado** confirmação assíncrona e autêntica dentro do prazo, **quando** processada, **então** as fichas serão creditadas uma única vez.
- [ ] **Dado** Pix sem pagamento por 15 minutos, **quando** expirar, **então** não haverá crédito.
- [ ] **Dado** Pix confirmado após expiração, **quando** recebido, **então** não haverá crédito e o valor será encaminhado para estorno.
- [ ] **Dado** quantidade inválida, recusa, cancelamento ou abandono, **quando** o pedido encerrar, **então** nenhuma ficha será liberada.

**Regras relacionadas:** RN05–RN10.

#### US03 — Homologação de condutor · `Must Have` · `M` · Status: `🟡 Ready`

**Como** passageiro maior de 18 anos, **quero** enviar CNH e CRLV **para que**
eu possa oferecer caronas após aprovação.

- [ ] **Dado** CNH e CRLV legíveis, válidos e vigentes, **quando** enviados, **então** aguardarão análise.
- [ ] **Dado** idade comprovada e documentos regulares, **quando** o administrador aprovar, **então** o perfil será habilitado.
- [ ] **Dado** documento irregular, **quando** recusado, **então** o motivo e a possibilidade de reenvio serão informados.
- [ ] **Dado** análise pendente, recusada ou abandonada, **quando** tentar publicar, **então** a ação será impedida.
- [ ] **Dado** documento posteriormente vencido, **quando** tentar nova publicação, **então** ela será impedida sem cancelar caronas agendadas nem retirar permissões de passageiro.

**Regras relacionadas:** RN11–RN14.

#### US04 — Gestão de pontos de encontro · `Must Have` · `S` · Status: `🟡 Ready`

**Como** administrador, **quero** gerir pontos oficiais **para que** as caronas
usem apenas locais homologados.

- [ ] **Dado** nome e localização válidos, **quando** cadastrar, **então** o ponto ficará disponível.
- [ ] **Dado** ponto existente, **quando** editar, desativar ou reativar, **então** a mudança valerá para novas caronas.
- [ ] **Dado** ponto já utilizado, **quando** desativado, **então** seu histórico e as caronas agendadas serão preservados.
- [ ] **Dado** usuário sem permissão ou nenhum ponto ativo, **quando** tentar gerir ou publicar, **então** a ação será recusada com explicação.

**Regras relacionadas:** RN15–RN16.

#### US05 — Publicação de carona · `Must Have` · `M` · Status: `🟡 Ready`

**Como** condutor, **quero** publicar uma carona **para que** passageiros
solicitem as vagas.

- [ ] **Dado** condutor habilitado, **quando** informar sentido, data, hora, ponto ativo e 1 a 4 vagas com 1h30 de antecedência, **então** a carona será publicada.
- [ ] **Dado** documento vencido, suspensão, ponto inativo, prazo ou vagas inválidos, **quando** publicar, **então** a ação será recusada.
- [ ] **Dado** outra carona do condutor com menos de 30 minutos de intervalo, **quando** publicar, **então** a ação será recusada.
- [ ] **Dado** preenchimento abandonado, **quando** retornar, **então** nenhuma carona incompleta existirá.

**Regras relacionadas:** RN17–RN20.

#### US06 — Busca e solicitação de reserva · `Must Have` · `M` · Status: `🟡 Ready`

**Como** passageiro, **quero** buscar caronas e solicitar uma vaga **para que**
eu me desloque entre um ponto oficial e o campus.

- [ ] **Dado** caronas publicadas, **quando** filtrar por sentido, data ou ponto, **então** verá opções futuras com vagas.
- [ ] **Dado** opção válida e saldo, **quando** solicitar, **então** uma ficha será retida enquanto aguarda o condutor.
- [ ] **Dado** saldo insuficiente, suspensão, falta de vaga ou conflito inferior a 30 minutos, **quando** solicitar, **então** não haverá débito.
- [ ] **Dado** busca vazia ou fluxo abandonado, **quando** terminar, **então** o vazio será informado e nenhuma ficha será retida.

**Regras relacionadas:** RN21–RN24.

#### US07 — Decisão sobre reserva · `Must Have` · `M` · Status: `🟡 Ready`

**Como** condutor, **quero** aceitar ou recusar solicitações **para que** eu
controle a ocupação da carona.

- [ ] **Dado** solicitação pendente e vaga, **quando** aceitar, **então** ela virará reserva confirmada.
- [ ] **Dado** solicitação pendente, **quando** recusar, **então** a ficha voltará e a vaga permanecerá disponível.
- [ ] **Dado** 30 minutos sem decisão, **quando** expirar, **então** a solicitação encerrará e a ficha voltará.
- [ ] **Dado** vagas esgotadas, **quando** restarem solicitações, **então** elas expirarão com devolução.
- [ ] **Dado** usuário diferente do condutor, **quando** tentar decidir, **então** a ação será recusada.

**Regras relacionadas:** RN25–RN27.

#### US08 — Edição de vagas · `Must Have` · `S` · Status: `🟡 Ready`

**Como** condutor, **quero** ajustar vagas livres **para que** a oferta reflita
a capacidade disponível.

- [ ] **Dado** mais de uma hora de antecedência, **quando** definir de 1 a 4 vagas sem afetar reservas, **então** o total será atualizado.
- [ ] **Dado** redução abaixo das reservas confirmadas ou prazo insuficiente, **quando** editar, **então** a ação será recusada.
- [ ] **Dado** edição abandonada, **quando** retornar, **então** o total anterior será mantido.

**Regras relacionadas:** RN18 e RN28.

#### US09 — Gestão da carona e presença · `Must Have` · `M` · Status: `🟡 Ready`

**Como** condutor, **quero** registrar presença, iniciar e finalizar **para que**
o resultado e o repasse sejam apurados.

- [ ] **Dado** horário alcançado e reservas, **quando** registrar presentes e ausentes, **então** poderá iniciar.
- [ ] **Dado** passageiro ausente, **quando** fechar a presença, **então** sua ficha ficará retida sem novos pontos.
- [ ] **Dado** carona iniciada, **quando** finalizar, **então** começará a janela de 24 horas antes do repasse.
- [ ] **Dado** presença aberta ou usuário incorreto, **quando** iniciar ou finalizar, **então** a ação será recusada.
- [ ] **Dado** carona sem reservas, **quando** encerrar, **então** não haverá repasse.

**Regras relacionadas:** RN29–RN32.

#### US10 — Cancelamento pelo passageiro · `Must Have` · `S` · Status: `🟡 Ready`

**Como** passageiro, **quero** cancelar minha reserva **para que** a vaga seja
liberada quando eu não puder comparecer.

- [ ] **Dado** mais de uma hora de antecedência, **quando** cancelar, **então** a ficha voltará sem penalidade.
- [ ] **Dado** uma hora ou menos, **quando** cancelar, **então** a ficha será retida e dois pontos serão adicionados.
- [ ] **Dado** carona iniciada/finalizada ou confirmação abandonada, **quando** tentar cancelar, **então** a reserva será mantida.

**Regras relacionadas:** RN33–RN34.

#### US11 — Cancelamento pelo condutor · `Must Have` · `M` · Status: `🟡 Ready`

**Como** condutor, **quero** cancelar uma carona **para que** passageiros sejam
avisados e ressarcidos.

- [ ] **Dado** mais de uma hora de antecedência, **quando** cancelar, **então** todas as fichas voltarão sem penalidade.
- [ ] **Dado** uma hora ou menos, **quando** cancelar, **então** as fichas voltarão e dois pontos serão adicionados ao condutor.
- [ ] **Dado** carona iniciada/finalizada ou confirmação abandonada, **quando** tentar cancelar, **então** a carona será mantida.

**Regras relacionadas:** RN33 e RN35.

#### US12 — Expiração por falta de início · `Must Have` · `S` · Status: `🟡 Ready`

**Como** plataforma, **quero** expirar caronas não iniciadas **para que**
passageiros não fiquem presos a uma carona abandonada.

- [ ] **Dado** carona não iniciada, **quando** passar uma hora do horário, **então** ela expirará e devolverá todas as fichas.
- [ ] **Dado** a expiração, **quando** registrada, **então** quatro pontos serão adicionados ao condutor uma única vez.
- [ ] **Dado** carona iniciada ou cancelada, **quando** passar o prazo, **então** nenhum efeito será repetido.

**Regras relacionadas:** RN36.

#### US13 — Finalização por tempo excedido · `Must Have` · `S` · Status: `🟡 Ready`

**Como** plataforma, **quero** finalizar caronas longamente abertas **para que**
o fluxo financeiro não fique pendente.

- [ ] **Dado** carona em andamento, **quando** completar 12 horas desde o início, **então** será finalizada automaticamente.
- [ ] **Dado** finalização automática, **quando** ocorrer, **então** começará a janela de contestação de 24 horas.
- [ ] **Dado** carona já encerrada, **quando** o prazo chegar, **então** nenhum efeito será repetido.

**Regras relacionadas:** RN31 e RN37.

#### US14 — Saque simulado · `Must Have` · `S` · Status: `🟡 Ready`

**Como** usuário, **quero** converter fichas em saque Pix simulado **para que**
eu demonstre o resgate do saldo no MVP.

- [ ] **Dado** saldo, **quando** pedir quantidade inteira, **então** cada ficha valerá R$ 2,00 sem taxa ou desconto.
- [ ] **Dado** fichas de qualquer origem, **quando** a simulação concluir, **então** serão debitadas uma única vez.
- [ ] **Dado** saldo insuficiente, fração ou chave ausente, **quando** solicitar, **então** nada será debitado.
- [ ] **Dado** recusa ou abandono, **quando** encerrar, **então** as fichas permanecerão.
- [ ] **Dado** o MVP, **quando** demonstrar o saque, **então** nenhum dinheiro real será transferido.

**Regras relacionadas:** RN05 e RN38–RN39.

### Should Have — escopo flexível

#### US15 — Contestação · `Should Have` · `M` · Status: `⚪ Draft`

**Como** passageiro, **quero** contestar uma carona finalizada **para que** o
repasse seja revisto.

- [ ] **Dado** até 24 horas após finalizar, **quando** informar motivo, **então** o repasse será retido.
- [ ] **Dado** decisão administrativa, **quando** julgar, **então** a ficha voltará ao passageiro ou será liberada ao condutor.
- [ ] **Dado** prazo encerrado, carona não concluída ou falta de reserva, **quando** contestar, **então** a ação será recusada.

**Regras relacionadas:** RN31 e RN40–RN41.

#### US16 — Avaliação mútua · `Should Have` · `S` · Status: `⚪ Draft`

**Como** participante, **quero** avaliar a outra parte **para que** a comunidade
conheça o histórico de convivência.

- [ ] **Dado** participação em carona finalizada, **quando** avaliar, **então** a avaliação será registrada uma vez.
- [ ] **Dado** ausência, carona aberta ou não participação, **quando** avaliar, **então** a ação será recusada.
- [ ] **Dado** nenhuma avaliação, **quando** consultar o perfil, **então** o vazio será informado.

**Regras relacionadas:** RN42.

#### US17 — Denúncia · `Should Have` · `S` · Status: `⚪ Draft`

**Como** participante, **quero** denunciar ocorrência de uma carona **para que**
o administrador possa analisá-la.

- [ ] **Dado** participante, motivo e descrição, **quando** enviar, **então** a denúncia será registrada.
- [ ] **Dado** pessoa sem vínculo ou dados ausentes, **quando** enviar, **então** a ação será recusada.
- [ ] **Dado** abandono antes do envio, **quando** retornar, **então** nenhuma denúncia incompleta existirá.

**Regras relacionadas:** RN43.

#### US18 — Edição de horário · `Should Have` · `S` · Status: `⚪ Draft`

**Como** condutor, **quero** alterar o horário no mesmo dia **para que** eu
ajuste mudanças antecipadas.

- [ ] **Dado** mais de uma hora de antecedência, **quando** alterar, **então** os passageiros serão informados.
- [ ] **Dado** conflito inferior a 30 minutos ou prazo insuficiente, **quando** editar, **então** a ação será recusada.
- [ ] **Dado** abandono, **quando** retornar, **então** o horário anterior será mantido.

**Regras relacionadas:** RN19, RN28 e RN44.

#### US19 — Atualização de perfil e documentos · `Should Have` · `S` · Status: `⚪ Draft`

**Como** usuário, **quero** atualizar perfil e documentos **para que** meus
dados e minha habilitação permaneçam válidos.

- [ ] **Dado** nome ou foto válidos, **quando** salvar, **então** o perfil será atualizado.
- [ ] **Dado** nova CNH ou CRLV, **quando** enviar, **então** aguardará nova aprovação.
- [ ] **Dado** CPF inválido/repetido ou abandono, **quando** encerrar, **então** os dados anteriores serão preservados.

**Regras relacionadas:** RN03, RN12 e RN14.

#### US20 — Administração do usuário · `Should Have` · `S` · Status: `⚪ Draft`

**Como** administrador, **quero** suspender, banir e reativar usuários **para
que** infrações sejam moderadas.

- [ ] **Dado** usuário ativo, **quando** aplicar medida com motivo, **então** decisão e autoria serão registradas.
- [ ] **Dado** usuário sancionado, **quando** reativar com justificativa, **então** o acesso correspondente voltará.
- [ ] **Dado** falta de permissão ou motivo, **quando** alterar, **então** a ação será recusada.

**Regras relacionadas:** RN45–RN46.

#### US21 — Doação de fichas · `Should Have` · `S` · Status: `⚪ Draft`

**Como** usuário, **quero** doar fichas **para que** eu transfira saldo a outro
membro da comunidade.

- [ ] **Dado** saldo e destinatário ativo, **quando** confirmar quantidade inteira positiva, **então** a transferência ocorrerá uma vez.
- [ ] **Dado** saldo insuficiente, destinatário inválido ou próprio remetente, **quando** doar, **então** a ação será recusada.
- [ ] **Dado** abandono antes da confirmação, **quando** retornar, **então** nenhum saldo terá mudado.

**Regras relacionadas:** RN47.

#### US22 — Relatórios do produto · `Should Have` · `S` · Status: `⚪ Draft`

**Como** administrador, **quero** consultar indicadores do produto **para que**
eu acompanhe sua utilização e os resultados definidos neste PRD.

- [ ] **Dado** administrador autenticado, **quando** escolher um período, **então** verá totais de passageiros, condutores e caronas concluídas, canceladas e expiradas.
- [ ] **Dado** caronas no período, **quando** consultar pontos de encontro, **então** verá sua utilização ordenada.
- [ ] **Dado** período sem movimentação, **quando** consultar, **então** verá indicadores zerados e uma lista vazia, sem dados inventados.
- [ ] **Dado** usuário sem permissão, **quando** tentar consultar relatórios, **então** o acesso será recusado.

**Regras relacionadas:** RN48.

---

## 🛡️ 5. Regras de Negócio

| ID | Regra |
| :-- | :-- |
| **RN01** | Só e-mails `alunos.utfpr.edu.br` e `utfpr.edu.br` podem criar ou acessar contas. |
| **RN02** | O código vale 15 minutos; um novo código invalida o anterior. |
| **RN03** | Nome e CPF são obrigatórios; foto é opcional. |
| **RN04** | O CPF deve ser válido e único. |
| **RN05** | A ficha vale R$ 2,00 na compra e no saque, sem taxa ou desconto. |
| **RN06** | Um pedido contém de 1 a 30 fichas inteiras. |
| **RN07** | A compra usa Pix ou cartão em gateway integrado no sandbox. |
| **RN08** | Só confirmação assíncrona autêntica libera fichas, sem duplicidade. |
| **RN09** | Pedido Pix expira após 15 minutos. |
| **RN10** | Pix confirmado após expiração não libera fichas e vai para estorno. |
| **RN11** | Condutor exige conta ativa, 18 anos, CNH e CRLV. |
| **RN12** | CNH e CRLV têm aprovação manual; CPF tem validação automática. |
| **RN13** | Documento ilegível, inválido ou vencido impede homologação. |
| **RN14** | Documento vencido impede novas publicações, preservando caronas agendadas e o papel de passageiro. |
| **RN15** | Novas caronas usam somente pontos oficiais ativos. |
| **RN16** | Desativar ponto preserva histórico e caronas agendadas. |
| **RN17** | Publicação exige 1h30 de antecedência. |
| **RN18** | Carona oferece de 1 a 4 vagas. |
| **RN19** | Condutor não oferece caronas com menos de 30 minutos de intervalo. |
| **RN20** | Carona liga ponto oficial e campus, em ida ou volta. |
| **RN21** | Passageiro não reserva caronas com menos de 30 minutos de intervalo. |
| **RN22** | Solicitação retém uma ficha até aceite, recusa ou expiração. |
| **RN23** | Reserva exige saldo, conta sem suspensão e vaga. |
| **RN24** | Abandono anterior à solicitação não retém ficha. |
| **RN25** | Só o aceite do condutor confirma a reserva. |
| **RN26** | Recusa devolve ficha e mantém vaga. |
| **RN27** | Solicitação expira em 30 minutos; vagas esgotadas expiram as restantes. |
| **RN28** | Vagas e horário só mudam com mais de uma hora e sem remover reservas. |
| **RN29** | Condutor registra presença antes de iniciar. |
| **RN30** | Ausência do passageiro retém ficha sem pontos extras. |
| **RN31** | Finalização abre 24 horas para contestação antes do repasse. |
| **RN32** | Carona sem reservas encerra sem repasse. |
| **RN33** | Cancelamento com mais de uma hora não penaliza. |
| **RN34** | Cancelamento tardio do passageiro retém ficha e soma dois pontos. |
| **RN35** | Cancelamento tardio do condutor devolve fichas e soma dois pontos. |
| **RN36** | Falta de início por uma hora expira a carona, devolve fichas e soma quatro pontos ao condutor. |
| **RN37** | Carona em andamento por 12 horas é finalizada automaticamente. |
| **RN38** | Qualquer ficha disponível pode ser sacada, independentemente da origem. |
| **RN39** | O saque do MVP é simulado via Pix e não move dinheiro real. |
| **RN40** | Só passageiro com reserva contesta, até 24 horas após finalizar. |
| **RN41** | Contestação aceita devolve ficha; recusada libera ficha ao condutor. |
| **RN42** | Avaliação ocorre uma vez entre participantes de carona finalizada. |
| **RN43** | Denúncia exige vínculo com a carona e motivo. |
| **RN44** | Alterar horário exige o mesmo dia e ausência de conflito. |
| **RN45** | Sanção administrativa exige justificativa e autoria registradas. |
| **RN46** | Dez pontos suspendem reservas e ofertas por um mês, preservando conta e carteira. |
| **RN47** | Doação transfere fichas inteiras entre usuários distintos sem exceder saldo. |
| **RN48** | Relatórios respeitam o período escolhido e contabilizam apenas registros existentes, sem alterar históricos. |

---

## 🚫 6. Fora de Escopo

- Chat interno em tempo real — será usado o Discord após a confirmação.
- Rastreamento de localização ao vivo — não é necessário ao fluxo principal.
- Pontos intermediários ou destinos arbitrários — a carona liga ponto oficial e campus.
- Moderação complexa e automatizada — a análise prevista é manual.
- Pagamento parcelado ou cartão de débito — o MVP usa Pix e crédito no sandbox.
- Saque com dinheiro real — o MVP demonstra saque simulado.
- Valor dinâmico da ficha — permanece R$ 2,00 para reduzir o escopo.

---

## ⚙️ 7. Requisitos Não Funcionais

| ID | Requisito | Justificativa |
| :-- | :-- | :-- |
| **RNF01** | Só o titular do e-mail institucional acessa a conta por código temporário. | Restringe o produto à UTFPR. |
| **RNF02** | Dados pessoais têm acesso restrito e acessos administrativos são registrados. | Protege dados sensíveis e permite auditoria. |
| **RNF03** | O UTFgo não armazena dados de cartão. | Reduz exposição financeira. |
| **RNF04** | Repetições e rotinas automáticas não duplicam créditos, débitos ou penalidades. | Mantém estados consistentes. |
| **RNF05** | Operações com fichas ocorrem integralmente ou não alteram saldo. | Evita saldos divergentes. |
| **RNF06** | Históricos essenciais são preservados. | Sustenta auditoria e contestação. |
| **RNF07** | A interface funciona em celular e computador e explica erros e vazios. | Atende ao uso em mobilidade. |
| **RNF08** | Busca e carteira respondem sem demora perceptível no uso normal do MVP. | São fluxos frequentes. |
| **RNF09** | Segredos de integrações não aparecem no repositório ou ao usuário. | Evita uso indevido. |
| **RNF10** | O ambiente demonstra aprovação, recusa, expiração e estorno sem dinheiro real. | Atende à disciplina com segurança. |

---

## ❓ 8. Dúvidas em Aberto

Nenhuma no momento. Dúvidas descobertas em `/utf-flows` ou
`/utf-architecture` devem voltar ao dono do produto antes de mudar regras.

---

## 🛠️ 9. Histórico

| Data | Versão | O que mudou |
| :-- | :-- | :-- |
| 2026-09-20 | 1.0.0 | Versão inicial gerada pela entrevista `/utf-prd`. |
| 2026-09-30 | 1.1.0 | Reavaliação: template limpo, escopo reduzido, stories verificáveis, regras renumeradas e pagamento sandbox explicitado. |
