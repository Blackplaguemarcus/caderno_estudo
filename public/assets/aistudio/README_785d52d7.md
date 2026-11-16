# O Caderno Vivo — o jogo de treino do ACT 2027 (Arte)

> **O que é:** um jogo de browser que treina os **mecanismos de erro** do
> [[erros_act_2027_arte|Caderno de Erros]], não as perguntas da banca. Cada cartão
> carrega a âncora da ficha e a frase literal — errar devolve sempre a página.
> **Onde vive:** `03 - Estudo-ACT/itapoa/jogo/` · **Como se abre:** duplo clique em `index.html`
> (não precisa de servidor nem de build) · **Munição:** `itens.js`.

---

## 1. Os quatro ficheiros (e o que cada um governa)

| Ficheiro | Governa | Quando mexer |
|---|---|---|
| `index.html` | o esqueleto: cabeçalho, `#ecra`, carrega os dois scripts | quase nunca |
| `estilo.css` | a pele — tinta sobre papel escuro | só para ler melhor |
| `itens.js` | **a munição**: 132 cartões em três blocos (`parear`, `classificar`, `literal`) | sempre que o Caderno ganhar um erro novo |
| `app.js` | os três motores, a maestria, a fila do dia, o mapa, **o som do gabarito e o chill do mapa** | só quando se muda uma regra |

Fora do jogo, no mesmo dono: `../narrar.py` gera o áudio do caderno (`../audio/`) e
`../narrar_aula.py` narra as **aulas faladas** escritas em `../aulas/` (`../audio/aulas/`).
As faixas do caderno são um índice em voz alta; as aulas são o assunto explicado — quando
uma contradizer a outra, a aula ganha por ser escrita para o ouvido, e a ficha ganha sobre
as duas.

---

## 2. O inventário — 132 cartões

| Grupo | Motor | Cartões | De onde vem |
|---|---|---:|---|
| Campos da Dança | parear | **29** | Arte, p. 568 — Espaço 6 · Ritmo 4 · Dinâmica 5 · Forma 3 · Locomoção 7 · Gesto 4 |
| Fatores de Laban | parear | **10** | Arte, p. 494 — Tempo 5 · Peso 2 · Fluência 2 · Espaço 1 |
| **Colunas da matriz · Artes Visuais** | parear | **23** | Arte, p. 492 e 528 — Elementos 9 · Outros Conceitos 6 · Materialidades 4 · Linguagens 4 |
| Estética × Crítica | classificar | **10** | Arte, p. 599 — 5 do sentir, 5 do julgar |
| Gavetas do Século | classificar | **14** | História da Arte, p. 547 — XIX 2 · início XX 5 · pós-guerra 4 · contemporâneo 3 |
| O Verbo do Enunciado | classificar | **10** | Fundamentos, p. 25-26 — 5 que se eliminam, 5 que se constroem |
| A Palavra Literal | literal | **36** | LDB 3º-XII, 12-V, 12-IV, 14-§1º, 14-§3º, 14-caput e a Lei 14.644/2023 · ECA 54 §1º, II, V e 56-II · Fundamentos · Arte 476/482/483/484/485/492/494/497/498/547/568/585/599 |

**Os seis mecanismos que estes cartões atacam** (os mesmos do Caderno):

1. troca de âncora de inciso → *A Palavra Literal*
2. inversão de sinal (o que soa «de bom senso» é a armadilha) → *A Palavra Literal*
3. eixo dos séculos → *Gavetas do Século*
4. palavra literal trocada por sinónimo → *A Palavra Literal*
5. rúbrica trocada dentro da mesma taxonomia → *Campos da Dança*, *Fatores de Laban*, *Estética × Crítica*
6. verbo negativo do enunciado (*superar* ≠ *garantir*) → *O Verbo do Enunciado*

---

## 3. As regras (as do motor, não as da esperança)

**Maestria por cartão** — 🌱 hesitante · ⚡ praticado · 🔥 hábito · 👑 assinatura.
Sobe **um grau a cada dois acertos seguidos**; desce **um grau com um erro**. Um acerto
isolado já conta para a próxima subida (`seg`), mas não sobe sozinho.

**A fila do dia** — um cartão vencido volta depois de **48 h** (se está em 🌱/⚡) ou de
**7 dias** (em 🔥/👑). Nunca jogado = sempre vencido. Uma fila compõe:
1 rodada de pareamento (o grupo com mais cartões vencidos) + 1 de colunas (idem) +
até 5 perguntas literais.

**A fila avalia só o que venceu** — na Fila do dia e em «Os frágeis» só contam para a
maestria as fichas escolhidas pelo filtro. As restantes aparecem no tabuleiro como
*âncora* (o par precisa de alternativa para haver escolha) e **não** mexem no save. A
linha por baixo do título diz quantas fichas contam.

**Tecto de duas tentativas** — uma ficha errada desconta no máximo **duas vezes por
rodada**; à segunda, a resposta é revelada e a ficha ancora-se no campo certo **sem
ganhar acerto**. Sem esse tecto, clicar à toa era a forma mais rápida de destruir uma
maestria — e de estragar o ranking.

**O que a maestria não é:** não é nota de prova. Mede repetição limpa, não domínio.
Quem decide se a matéria está sabida é o simulado.

---

## 4. O save

Vive em `localStorage`, chave **`raven_estudo_act_v1`**, num objeto
`id do cartão → {v, a, e, seg, ultimo}`:

| campo | significado |
|---|---|
| `v` | grau de maestria, 0 a 3 |
| `a` | acertos acumulados |
| `e` | **tentativas** erradas (um par pode ter 2 erros na mesma ficha) |
| `seg` | acertos seguidos desde a última mudança de grau |
| `ultimo` | carimbo de tempo em ms |

**Nunca mudar o `id` de um cartão já jogado** — o id é a chave do progresso. Mudar o
texto de uma ficha muda o id (nos pares o id inclui o texto); nesses casos o cartão
renasce em 🌱, o que é aceitável, mas não deve ser feito por gosto.

**Ler o save:** no jogo → **«O meu mapa»**. Tem três andares: os cinco contadores de
maestria, o **ranking dos grupos** (do mais frágil ao mais firme, por taxa de acerto) e
a lista de cartões com a pílula tingida pelo grau. O botão **«copiar o save (JSON)»**
entrega o progresso em texto — o JSON colado aqui é analisável (ver §7).

> **Como ler o ranking:** a ordem é a **maestria média dos cartões já jogados** (do mais
> frágil ao mais firme); a taxa só desempata, e um grupo sem cartões jogados vai para o
> fim com «—». O parêntesis `(jogados/total)` é a base da média — 3.0 em 1 de 29 não é o
> mesmo que 3.0 em 29 de 29. A taxa continua a contar **tentativas** (num par, errar e
> depois acertar dá 1✓/1✗), por isso compara o ranking consigo mesmo no tempo, não entre
> motores diferentes.

---

## 5. Acrescentar munição

1. Abre `itens.js` e encontra o bloco certo (`parear`, `classificar` ou `literal`).
2. Copia a forma de um item existente. Todo o item leva **âncora** (`fonte`) e, no
   caso do `literal`, a **frase da ficha** em `opcoes[certa]` e uma `nota` que diga
   *qual erro do Caderno* ele treina.
3. A opção certa fica **sempre em `certa: 0`** no ficheiro — o motor baralha as
   posições a cada tiragem (a banca também as baralha).
4. `node --check itens.js` antes de jogar.
5. Regista no Caderno o erro que motivou o cartão novo.

---

## 6. Diário de sessões

> Uma linha por sessão: o que se jogou, o que doeu, o que se decidiu. É este quadro
> que faz o jogo crescer na direção certa — sem ele, cada sessão começa do zero.

| Data | Sessão | Medido | Decisão |
|---|---|---|---|
| 2026-10-26 | jogo criado (91 cartões) + primeira passagem completa | 141✓ / 60✗ = **70%** | ver §7 |
| 2026-10-26 | Simulado 07 conferido (9/14) e 08 anulado (gabarito todo em A) | 5 erros novos no Caderno | **+5 cartões** (96): ECA 54-II, intensidade, fluência, Forma, julgamento |
| 2026-10-26 | **08b refeito: 12/14** (86%) | 2 erros: o verbo *romper* e o marco legal em três datas | **+2 cartões** (98) |
| 2026-10-26 | save analisado | 70 🌱 · 17 ⚡ · 4 🔥 · **0 👑** | focar gavetas do século e os 6 erros puros |
| 2026-10-26 | treino livre passou a **deixar escolher o grupo** e nasceu **«Os frágeis»** | — | o sorteio impedia apontar à ferida |
| 2026-10-26 | **quatro defeitos do motor corrigidos** (fila a avaliar só o vencido, tecto de 2 tentativas, corrida do «← sair», ranking pela maestria dos jogados) | provado no browser: 1 vencido → 10 fichas, **1 contada**; 6 cliques errados → **2 erros**, não 6; sem `TypeError` ao sair | a fila dizia «1 cartão» e jogava o grupo inteiro |
| 2026-10-26 | **Leitor das 5 Aulas Faladas (40 min) integrado**, mini-barra global de áudio persistente, **importação de save (JSON)**, contagem regressiva da prova e atalhos de teclado 1-4 no modo literal | áudio `../audio/aulas/` navega em 2º plano; JSON restaurável no mapa | agora o Caderno se joga e se escuta sem sair do browser |
| 2026-11-16 | **auditoria do banco contra os 44 erros** do Caderno (Simulados 01–13) | 98 cartões, mas **9 dos 12 erros de 16/11 não tinham cartão** — e os quatro que resistiram à reversão (RE-02 a RE-05) também não | **+34 cartões** (132): grupo parear *Colunas da matriz · AV* (23) e 11 literais novos — art. 12-IV, 14-§1º, 14-§3º, 14-caput, Lei 14.644/2023, ECA 56-II, p. 492, p. 568 (pares), p. 585 (duração), p. 599 (estranhamento) e o par **invertido** do verbo *garantir* |
| 2026-11-16 | **save analisado** (JSON do Criador, 98 chaves) | **98/98 antigos jogados, 0 órfãs** · maestria 5 🌱 / 22 ⚡ / 60 🔥 / 11 👑 · taxa global **81%** (475✓/108✗, contra 70% em 26/10) · **um só frágil**: `par:laban:Tempo:intensidade` (a9/e9) | ver §7.2 — o plano dos seis dias |
| 2026-11-16 | **som de gabarito** pedido pelo Criador | — | `somGabaritou()` em Web Audio: arpejo dó–mi–sol–dó de quatro notas, **sem ficheiro de áudio** (o jogo corre em `file://` e não tem assets de som). Toca **só quando a sessão termina com zero erros** — o ramo do `fim()` que já dizia «Nenhum erro nesta sessão». O `AudioContext` é desbloqueado no primeiro `pointerdown`, porque o fim chega 420 ms depois do último clique (fora do handler) e o browser bloqueia áudio sem gesto. |
| 2026-11-16 | **som de fecho com erros** (a «média» pedida pelo Criador) | — | `somDoFim(acertos, erros)` escolhe o registo: **0 erros** → arpejo ascendente (dó–mi–sol–dó, triangular); **com erros** → **duas notas descendentes** (sol3 → mi3), seno, volume 0.09 contra 0.16 — ==mais grave e mais baixo, um ponto final e não um castigo.== Sem buzzer: quem erra já viu a resposta e a âncora. |
| 2026-11-16 | **chill em loop n'«O meu mapa»** | — | ambiente sintetizado em quatro acordes (**Am7 – Fmaj7 – Cmaj7 – G6**) — hoje a 72 BPM, **6,67 s por acorde**, volta de ~26,7 s. Toca ao entrar no mapa, **pára ao sair** (`casa`, `aulas`, `arrancar`). Botão **«som: ligado/desligado»** no cabeçalho, guardado em `raven_estudo_act_chill_v1`. Se uma aula começar a falar com o mapa aberto, `chillDuck()` baixa-o para quase inaudível — ==a voz manda.== |
| 2026-11-16 | **chill subiu de volume** (o Criador: «está muito baixo») | — | mestre **0.07 → 0.18** e vozes 0.34/0.26/0.20/0.14; e nasceu uma **quinta voz — a oitava da fundamental** (0.12). ==O problema não era só o volume: as fundamentais (130–220 Hz) perdem-se em altifalantes de portátil. A oitava é o que faz o acorde existir sem gritar.== O *duck* passou a 0.03. |
| 2026-11-16 | **chill ganhou filtro e humanização** (dicas trazidas pelo Criador) | — | **(1) Low-pass** `BiquadFilter` a 900 Hz, Q 0.7, no caminho das vozes, com um **LFO de 0.05 Hz** (±380 Hz) a passear o corte entre ~520 e ~1280 Hz. **(2) Humanização:** cada acorde entra com **jitter de ±15 ms** e cada voz com **velocity 0.85–1.00**. |
| 2026-11-16 | **o chill passou a sequenciador** — pad + arpejo | — | Grelha única de **72 BPM**, **8 tempos por acorde** (6,67 s; volta de ~26,7 s). Duas camadas: **pad** (4 acordes, legato com sobreposição de 0,6 s) e **arpejo** (uma nota por tempo, padrão `0-2-1-3-4-3-1-2`, a nota 4 é a fundamental duas oitavas acima). **Swing de 12%** nos tempos ímpares + **jitter de ±15 ms** e **velocity 0.70–1.00** por nota. ==O relógio é o `audioCtx.currentTime`, com lookahead de 0,5 s a cada 120 ms — nunca um `setTimeout` por nota, que deriva.== Se a aba esteve parada, o scheduler **ressincroniza** em vez de despejar o atraso todo de uma vez. |
| 2026-11-16 | **o mapa deixou de ser um retrato e passou a ter memória** | taxas por mecanismo: 1 → 75% · 2 → 78% · 3 → 76% · 4 → 90% · 5 → 80% · 6 → **91%** · 7 → 90% | **(1)** as pílulas mostram **a/e à vista** e **«parado há N dias»** (usa o `ultimo` que o save já guardava — deitado fora desde outubro); **(2)** faixa **«Os sete mecanismos»** no topo, com taxa, contagem e cor de ferida; **(3)** **histórico diário** em `raven_estudo_act_hist_v1`, um snapshot por dia, com barra dos últimos 14. ==A 6.ª linha é a prova viva de que maestria alta não é mecanismo fechado: 91% no jogo e quatro quedas na prova.== |

---

## 7. O retrato de 2026-10-26 (a primeira passagem inteira)

**O que já está curado**
- *Sentir × Julgar*: **1 erro em 10 fichas** — a recidiva das três vezes está morta no treino.
- *O Verbo do Enunciado*: 8 dos 10 em ⚡ — o mecanismo 6 está assimilado.
- Laban-peso e Laban-espaço, Dança-Ritmo e Dança-Forma: limpos.

**Onde dói**
- **Gavetas do Século**: os 4 🔥 são os casos óbvios (Realismo, Body Art, Op Art,
  instalações). As vanguardas e o pós-guerra resistem — **Minimalismo 4✓/5✗**,
  **Neoplasticismo 3✓/4✗**, Futurismo, Impressionismo, Surrealismo. É o mecanismo 3.
- **Seis erros puros, todos na Palavra Literal** (respondidos uma vez, errados, nunca
  revistos): `lit-ldb-12-v` (rendimento), `lit-art-599-est` (sentir),
  `lit-art-599-vivencia` (fruição), `lit-art-482-hist` (Historicidade),
  `lit-art-476` (eixos/polivalência), `lit-art-498-spolin` (Spolin × Laban).
- **Dança**: Locomoção (correr, saltar), Espaço (ordem, forma), Gesto (vibração),
  Dinâmica (energia) com 2 erros cada — a confusão de rúbrica, ainda viva.
- **Laban-Tempo e Fluência**: começo/intervalo/encerramento 3✓/3✗ · livre 2✓/3✗.

**O que isso quer dizer:** 70% no jogo e 70,2% nos simulados são o mesmo número. O jogo
não é mais fácil que a prova — é a mesma mão a falhar nos mesmos sítios.

---

## 7.1 O retrato de 2026-11-16 (a auditoria que faltava)

O banco estava datado de **2026-10-26** e não tinha acompanhado o Caderno: em 16/11 o
Caderno chegou a **44 erros** (Simulados 01–13), e o jogo continuava com a munição do 08b.
==A regra do §5 — «sempre que o Caderno ganhar um erro novo» — estava a ser violada há três
semanas, sem que ninguém medisse.==

**A lacuna, medida.** Dos **12 erros** do dia 16/11 (10-02 a 13-09), só **3** tinham cartão
(13-02 o direito público subjetivo, 13-07 o verbo *romper*, 13-09 a vivência estética) — e
por coincidência de mecanismo, não por desenho. ==Nove erros não tinham uma única ficha que
os treinasse.== E os **quatro que resistiram à prova de reversão** (RE-02 a RE-05) também
não estavam lá — com uma exceção reveladora: **RE-05 tinha cartão** (`lit-fund-25-reducionista`)
e caiu mesmo assim. ==Ter munição não é ter maestria: o cartão existe, mas não foi martelado
até 👑.==

**O que foi acrescentado em 16/11 (+34, de 98 para 132):**

| Novo | Cobre |
|---|---|
| grupo parear **Colunas da matriz · Artes Visuais** (23 fichas) | Elementos × Outros Conceitos × Materialidades × Linguagens — os erros 11-08, 10-09 e **RE-03**. ==É a primeira vez que a matriz de AV é treinada por colunas, e não por conceito solto.== |
| `lit-ldb-12-iv` | o plano de trabalho com dois donos — 10-02 |
| `lit-ldb-14-1` · `lit-ldb-14-3` · `lit-ldb-14-caput` | Conselho Escolar (§ 1º) × Fórum (§ 3º) × sistemas de ensino — 11-02, 11-04, 13-01, **RE-04** |
| `lit-ldb-14644` | o trio de datas 2016 / 2023 / 2025 — 11-03 e **RE-02** |
| `lit-eca-56-ii` | os dois gatilhos do Conselho Tutelar — 10-07 |
| `lit-art-492-outros` | «seriação/repetição» em Outros Conceitos — 11-08 |
| `lit-art-568-pares` | simétrico/assimétrico e contínuo/descontínuo — 10-09 |
| `lit-art-585-duracao` · `lit-art-599-estranhamento` | o quarteto do som e o vocabulário do sentir |

**O que continua em falta (por prioridade):**

1. **Teatro** — só há dois literais (Spolin e os gregos). Nada sobre **espaços convencionais
   e não convencionais**, **elementos cênicos** (figurino, cenário, iluminação) nem **técnicas**
   (sombras, fantoches, mudo, musical). É a linguagem com menos cobertura do banco.
2. **Fundamentos** — nenhum cartão sobre os **quatro pilares**, a **Atividade Orientadora de
   Ensino** (os quatro passos) ou a **Educação Especial transversal**. São itens que já caíram
   em simulado (09-07, 03-08, 02-02) e não têm treino.
3. **LDB, incumbências restantes** — 12-II, 12-III, 12-VII, 12-XII e 13-I. Hoje só existem
   12-V (rendimento) e 12-IV (velar).
4. **ECA, o resto do bloco** — 53 (os cinco incisos), 101 (§ 2º, parágrafo único, III),
   2º parágrafo único e 58. Nenhum cartão.
5. **Música** — só intensidade e duração. **Timbre** e **altura** continuam fora, e são o par
   que a banca troca.
6. **História** — as gavetas cobrem os movimentos, mas não factos datados: **Semana de 1922**,
   a **fotografia** como linguagem, o Impressionismo como descrição.

**Aviso sobre o save.** Os 33 cartões novos têm **ids novos** — nenhum id antigo foi tocado,
por isso o progresso existente continua válido. O que muda o save é **editar o texto de uma
ficha já jogada** (§4), e isso não foi feito.

---

## 7.2 O retrato do save de 2026-11-16

Lido o JSON do Criador (98 chaves) contra o banco. ==É o primeiro retrato do jogo feito a
partir do **save**, e não da memória de quem jogou.==

**O estado.** 98 dos 98 cartões antigos jogados, **zero órfãs** — prova de que nenhum `id`
foi alguma vez mudado, que é a regra do §4. Os 34 novos estão todos em 🌱, como devia.

| Maestria | Cartões |
|---|---:|
| 🌱 hesitante | **5** |
| ⚡ praticado | 22 |
| 🔥 hábito | 60 |
| 👑 assinatura | **11** |

**A taxa global subiu:** 475 acertos contra 108 erros = **81%**, contra os 70% de 26/10.
O jogo melhorou dez pontos em três semanas. E, no mesmo dia, os simulados deram 76% no
ciclo — ==a correlação de 26/10 continua de pé.==

**Grupos, do mais firme ao mais frágil (taxa):**

| Grupo | Jogados | Taxa |
|---|---|---|
| Fundamentos · a Proposta | 4/4 | 100% |
| História da Arte (literal) | 1/1 | 100% |
| Estética × Crítica | 10/10 | **93%** |
| O Verbo do Enunciado | 10/10 | 90% |
| Arte · conceitos gerais | 7/8 | 88% |
| Teatro | 2/2 | 82% |
| Campos da Dança | 30/31 | 81% |
| ECA · art. 54 | 3/3 | 80% |
| Fatores de Laban | 12/12 | 77% |
| **Gavetas do Século** | 14/14 | **75%** |

**Três achados que a nota esconde:**

1. **Um único frágil em 98** — e é revelador: `par:laban:Tempo:intensidade` com **9 acertos e 9 erros** (v0). Não é falta de estudo: é uma **colisão de vocabulário da própria fonte**. ==«Intensidade» existe duas vezes na Proposta — no fator *tempo* de Laban e nas *propriedades do som* (forte/fraco).== O cartão está a ser derrotado pela mesma palavra em duas taxonomias. Jogar com a âncora à vista: em Laban, intensidade é **do movimento**; no som, é **forte ou fraco**.

2. **O mecanismo 6 tem `e0` no jogo e caiu quatro vezes na prova.** `lit-fund-25-reducionista` (o verbo *romper*) e `lit-fund-26` nunca foram errados aqui — e o 06-06, o 08b-06, o 13-07 e o RE-05 caíram todos. ==O cartão media **reconhecimento da alternativa**, não leitura do verbo.== Por isso nasceu o par invertido `lit-fund-25-constroi` (verbo *garantir*): só quem lê o verbo acerta os dois.

3. **As Gavetas continuam a sangrar.** 20 erros acumulados nos 14 cartões, e os piores são os de sempre: **Minimalismo** (a7/e6), **Neoplasticismo** (a7/e5), **Expressionismo Abstrato** (a6/e4), Paris→NY e Futurismo (3 erros cada). O grupo tem 6 👑 e mesmo assim a pior taxa — porque a média de maestria esconde os fracos. ==Três semanas depois do primeiro retrato, o mecanismo 3 está no mesmo sítio.==

**O plano dos seis dias (por ordem):**

1. **Os 34 novos** — em duas sessões: o grupo *Colunas da matriz · AV* (23 fichas) e os 11 literais novos. É a matéria de 16/11.
2. **As gavetas frágeis** — `sec-11`, `sec-06`, `sec-09`, `sec-02`, `sec-07`, `sec-08`, até saírem de 🌱/⚡.
3. **`par:laban:Tempo:intensidade`** — até sair de v0; com a nota da colisão à frente.
4. **`lit-art-476`** (v0, a5/e4 — polivalência) e **`lit-ldb-3-xii`** (v1, a4/e2 — o inciso que já traiu duas vezes).
5. **`lit-eca-54-1`** (v1, a3/e1 — o direito público subjetivo, errado outra vez no 13-02).

> **O que a maestria não resolve.** `lit-fund-25-reducionista` está em ⚡ com zero erros e o mecanismo dele já custou quatro questões de prova. ==O jogo mede repetição limpa; a prova mede leitura sob pressão.== O plano acima ordena o treino — mas quem fecha o mecanismo é o simulado.

**Actualização — fim do dia 16/11 (132/132 jogados).** O Criador jogou os 34 novos na mesma tarde: **805 tentativas, 182✓ / 40✗**. A taxa global subiu a **82%**, as assinaturas 👑 passaram de **11 para 22**, e a média desceu ligeiramente (1,79 → 1,78) — ==a matemática normal de meter 34 cartões em 🌱==. Os 34 novos fizeram **78%**, abaixo da média, como deve ser.

| Mecanismo | Antes | Depois |
|---|---:|---:|
| 1. Sujeito e âncora | 75% | **78%** |
| 2. Inversão de sinal | 78% | **82%** |
| 3. Eixo dos séculos | 76% | **78%** |
| 4. Palavra literal | 90% | **92%** |
| 5. Taxonomia | 80% | **79%** ↓ |
| 6. Verbo do enunciado | 91% | **92%** |
| 7. Estética × Crítica | 90% | **91%** |

**E ficaram exatamente dois frágeis** — ambos com a mesma doença: `par:laban:Tempo:intensidade` (9✓/9✗) e `par:colunasav:Outros Conceitos na Arte:espaço` (6✓/6✗). ==A fonte usa a mesma palavra em dois sítios e o cartão fica indecidível: **intensidade** é do movimento em Laban e forte/fraco no som; **espaço** é campo da Dança, fator de Laban *e* "outro conceito" das Artes Visuais.== Não é falta de estudo — é homónimo. O `corpo` (9✓/5✗) sofre do mesmo, ao lado de "corpo e movimento" da Dança.

---

## 8. Fila de trabalho (o que ainda falta)

| Prioridade | O que | Estado |
|---|---|---|
| alta | botão **«Os frágeis»** — sessão só com cartões onde `e > a` | **feito** (2026-10-26) |
| alta | **treino livre por grupo** — escolher o conjunto, não sortear | **feito** (2026-10-26) |
| média | **importar save** (colar o JSON) | **feito** (2026-10-26) |
| média | **as 5 aulas faladas integradas com reprodutor de áudio** (leitura + escuta) | **feito** (2026-10-26) |
| baixa | banco de perguntas maior (os 8 simulados como fonte) | por fazer |

**Treino livre ≠ fila.** O treino livre nunca espera: entra-se em qualquer grupo a
qualquer hora, e cada resposta conta para a maestria. O que ele não faz é *alimentar a
fila de revisão* — só a Fila do dia compõe a sessão pelas datas (48 h / 7 dias).

---

## 9. Doutrina

- **O cartão nunca mente sobre a fonte.** Se não há âncora na ficha, não há cartão.
- **Um cartão, um mecanismo.** Se um cartão treina duas coisas, parte-se em dois.
- **A regra não se afrouxa para o número subir.** Maestria que sobe sem acerto é diploma falso.
- **O jogo serve a prova, não o contrário.** Se o simulado diz uma coisa e o jogo diz
  outra, o simulado manda.
