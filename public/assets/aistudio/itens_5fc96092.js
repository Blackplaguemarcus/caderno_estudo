/* itens.js — o banco de treino do Caderno de Erros (ACT 2027 · Professor de Arte)
 *
 * Fonte única: 03 - Estudo-ACT/itapoa/erros_act_2027_arte.md e as cinco fichas.
 * Cada item carrega a âncora (página) e, quando existe, a FRASE LITERAL da ficha.
 * Regra do Caderno: não fixar a letra — fixar o conceito, a página e a palavra exata.
 *
 * Para acrescentar munição: adiciona uma ficha ao set certo, com id estável.
 * O id é a chave do progresso — nunca o mudes depois de jogado.
 */
window.BANCO = {
  versao: '2026-11-16',

  /* ══════════════════════════════════════════════════════════════════
     MODO 1 — PAR: CAMPO → ELEMENTOS
     Mata a recidiva mais teimosa do Caderno (03-04, 05-05, 06-12):
     entregar os elementos de um campo no nome de outro.
     ══════════════════════════════════════════════════════════════════ */
  parear: [
    {
      id: 'danca',
      grupo: 'Campos da Dança',
      fonte: 'Arte, p. 568',
      tamanho: 3,
      rotulos: {
        'Espaço': ['direção', 'nível', 'amplitude', 'foco', 'ordem', 'forma'],
        'Ritmo': ['tempo', 'duração', 'ênfase', 'compasso'],
        'Dinâmica': ['força', 'energia', 'tensão', 'relaxamento', 'fluxo'],
        'Forma': ['relação com o outro', 'relação com o espaço', 'relação com os objetos'],
        'Locomoção': ['caminhar', 'pular', 'correr', 'saltar', 'rolar', 'estirar-se', 'rodopiar'],
        'Gesto': ['rotação', 'flexão', 'extensão', 'vibração']
      }
    },
    {
      id: 'laban',
      grupo: 'Fatores de Laban',
      fonte: 'Arte, p. 494',
      tamanho: 3,
      rotulos: {
        'Tempo': ['pulso', 'duração', 'intensidade', 'velocidade', 'começo, intervalo e encerramento'],
        'Peso': ['subida e descida', 'a força necessária'],
        'Fluência': ['contido', 'livre'],
        'Espaço': ['a dimensão ocupada ao esticar os membros ao máximo']
      }
    },
    {
      id: 'colunasav',
      grupo: 'Colunas da matriz · Artes Visuais',
      fonte: 'Arte, p. 492 e 528',
      tamanho: 3,
      rotulos: {
        'Elementos da Linguagem': ['linha', 'ponto', 'cor', 'forma', 'planos', 'textura', 'volume', 'ritmo', 'movimento'],
        'Outros Conceitos na Arte': ['arte como ritual', 'símbolos', 'espaço', 'corpo', 'seriação', 'repetição'],
        'Materialidades': ['suportes', 'materiais', 'ferramentas', 'procedimentos'],
        'Linguagens': ['desenho', 'gravura', 'muralismo', 'grafite']
      }
    }
  ],

  /* ══════════════════════════════════════════════════════════════════
     MODO 2 — COLUNAS: sentir × julgar · gavetas do século · o verbo
     Mata a palavra certa na coluna errada (02-06, 05-04, 06-13),
     o eixo dos séculos (01-03, 02-05) e o verbo negativo (06-06).
     ══════════════════════════════════════════════════════════════════ */
  classificar: [
    {
      id: 'sentir-julgar',
      grupo: 'Estética × Crítica',
      fonte: 'Arte, p. 599',
      quantos: 10,
      colunas: [
        { id: 'estetica', nome: 'Estética — o sentir' },
        { id: 'critica', nome: 'Crítica de Arte — o julgar' }
      ],
      fichas: [
        { id: 'sj-01', texto: 'fruição', col: 'estetica' },
        { id: 'sj-02', texto: 'apreciação', col: 'estetica' },
        { id: 'sj-03', texto: 'vivência estética', col: 'estetica' },
        { id: 'sj-04', texto: 'o estudo do belo e também do feio', col: 'estetica' },
        { id: 'sj-05', texto: 'o campo do sentir', col: 'estetica' },
        { id: 'sj-06', texto: 'julgamento', col: 'critica' },
        { id: 'sj-07', texto: 'análise', col: 'critica' },
        { id: 'sj-08', texto: 'interpretação', col: 'critica' },
        { id: 'sj-09', texto: 'padrões de beleza', col: 'critica' },
        { id: 'sj-10', texto: 'o campo do julgamento', col: 'critica' }
      ]
    },
    {
      id: 'seculo',
      grupo: 'Gavetas do Século',
      fonte: 'História da Arte, p. 547',
      quantos: 12,
      colunas: [
        { id: 'xix', nome: 'Século XIX' },
        { id: 'xx', nome: 'Início do séc. XX' },
        { id: 'pos', nome: 'Pós-guerra' },
        { id: 'contemp', nome: 'Contemporâneo' }
      ],
      fichas: [
        { id: 'sec-01', texto: 'Realismo', col: 'xix' },
        { id: 'sec-02', texto: 'Impressionismo', col: 'xix' },
        { id: 'sec-03', texto: 'Surrealismo', col: 'xx' },
        { id: 'sec-04', texto: 'Dadaísmo', col: 'xx' },
        { id: 'sec-05', texto: 'Suprematismo', col: 'xx' },
        { id: 'sec-06', texto: 'Neoplasticismo', col: 'xx' },
        { id: 'sec-07', texto: 'Futurismo', col: 'xx' },
        { id: 'sec-08', texto: 'deslocamento do eixo Paris → Nova York', col: 'pos' },
        { id: 'sec-09', texto: 'Expressionismo Abstrato', col: 'pos' },
        { id: 'sec-10', texto: 'Arte Pop', col: 'pos' },
        { id: 'sec-11', texto: 'Minimalismo', col: 'pos' },
        { id: 'sec-12', texto: 'Body Art', col: 'contemp' },
        { id: 'sec-13', texto: 'Op Art', col: 'contemp' },
        { id: 'sec-14', texto: 'instalações', col: 'contemp' }
      ]
    },
    {
      id: 'verbo',
      grupo: 'O Verbo do Enunciado',
      fonte: 'Fundamentos, p. 25-26 · leitura de prova',
      quantos: 9,
      colunas: [
        { id: 'elimina', nome: '«superar» → o defeito que se elimina' },
        { id: 'constroi', nome: '«garantir» → o dever que se constrói' }
      ],
      fichas: [
        { id: 'vb-01', texto: 'a fragmentação das propostas pedagógicas', col: 'elimina' },
        { id: 'vb-02', texto: 'o espontaneísmo (o desenvolvimento «natural»)', col: 'elimina' },
        { id: 'vb-03', texto: 'a exclusão, no lugar da inclusão', col: 'elimina' },
        { id: 'vb-04', texto: 'a polivalência imposta ao professor de arte', col: 'elimina' },
        { id: 'vb-05', texto: 'a intuição individual como origem do conhecimento', col: 'elimina' },
        { id: 'vb-06', texto: 'a formação humana omnilateral', col: 'constroi' },
        { id: 'vb-07', texto: 'a educação integral', col: 'constroi' },
        { id: 'vb-08', texto: 'a transversalidade da Educação Especial', col: 'constroi' },
        { id: 'vb-09', texto: 'a mediação docente', col: 'constroi' },
        { id: 'vb-10', texto: 'o acesso ao ensino obrigatório como direito público subjetivo', col: 'constroi' }
      ]
    }
  ],

  /* ══════════════════════════════════════════════════════════════════
     MODO 3 — A PALAVRA LITERAL (escolha múltipla com armadilha)
     Mata o mecanismo 4 (a lei trocada por sinónimo) e a inversão de sinal.
     A opção certa é sempre a frase da ficha; as erradas são as que já te
     enganaram nos simulados.
     ══════════════════════════════════════════════════════════════════ */
  literal: [
    {
      id: 'lit-ldb-3-xii',
      grupo: 'LDB · art. 3º',
      fonte: 'LDB, art. 3º, XII',
      enunciado: 'Qual é o princípio fixado no art. 3º, XII da LDB?',
      opcoes: [
        'Consideração com a diversidade étnico-racial',
        'Pluralismo de ideias e de concepções pedagógicas',
        'Garantia do direito de acesso a informações públicas sobre a gestão da educação',
        'Valorização da diversidade étnico-cultural'
      ],
      certa: 0,
      nota: '3º-XII = diversidade ÉTNICO-RACIAL (Lei 12.796/2013). III = pluralismo de ideias; XV = transparência. Este inciso já te traiu duas vezes (02-01 e RE-01) — a certa repete a palavra da lei, não a que soa bonita.'
    },
    {
      id: 'lit-ldb-12-v',
      grupo: 'LDB · art. 12',
      fonte: 'LDB, art. 12, V',
      enunciado: 'A palavra literal do art. 12, V da LDB é «recuperação dos alunos de menor…»:',
      opcoes: [
        'rendimento',
        'desempenho',
        'aproveitamento',
        'frequência'
      ],
      certa: 0,
      nota: 'RENDIMENTO — não «desempenho». Uma só palavra separa a certa da quase-certa, e a banca cobra a letra da lei (03-01, mecanismo 4).'
    },
    {
      id: 'lit-eca-54-1',
      grupo: 'ECA · art. 54',
      fonte: 'ECA, art. 54, § 1º',
      enunciado: 'Segundo o § 1º, o acesso ao ensino obrigatório e gratuito é:',
      opcoes: [
        'direito público subjetivo',
        'favor do poder público, conforme a disponibilidade de vagas',
        'benefício assistencial, mediante comprovação de renda',
        'concessão discricionária da direção da escola'
      ],
      certa: 0,
      nota: 'DIREITO PÚBLICO SUBJETIVO — exigível. A alternativa «favor» é a inversão de sinal clássica (03-02): a que soa de bom senso é a armadilha.'
    },
    {
      id: 'lit-eca-54-v',
      grupo: 'ECA · art. 54',
      fonte: 'ECA, art. 54, V',
      enunciado: 'O inciso V do art. 54 do ECA assegura:',
      opcoes: [
        'acesso aos níveis mais elevados do ensino, da pesquisa e da criação artística, segundo a capacidade de cada um',
        'acesso gratuito e obrigatório a todos os níveis de ensino, sem distinção',
        'acesso ao ensino superior apenas após exame nacional de seleção',
        'acesso à educação profissional de nível técnico, exclusivamente'
      ],
      certa: 0,
      nota: 'O inciso é o da cara desta prova: cita a CRIAÇÃO ARTÍSTICA. O distrator genérico («gratuito para todos») perdeu-te em 04-01.'
    },
    {
      id: 'lit-art-482-hist',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 482',
      enunciado: '«Refere-se à realidade histórica, no caso a história da arte.» Este conceito é:',
      opcoes: [
        'Historicidade',
        'Linguagens',
        'Processo de criação',
        'Sistema da arte'
      ],
      certa: 0,
      nota: 'HISTORICIDADE é a história da arte; o FAZER artístico é o Processo de criação. Trocar os dois foi o erro 05-03.'
    },
    {
      id: 'lit-art-483-proc',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 483',
      enunciado: '«Refere-se ao fazer artístico: elaborar, criar, produzir, construir e materializar.» Este conceito é:',
      opcoes: [
        'Processo de criação (poética e poiética)',
        'Historicidade',
        'Estética',
        'Sistema da arte'
      ],
      certa: 0,
      nota: 'PROCESSO DE CRIAÇÃO = fazer artístico (02-04). O «sistema da arte» é o dos espaços onde circulam obras e pessoas.'
    },
    {
      id: 'lit-art-485-permeiam',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 485',
      enunciado: 'Quais conceitos permeiam todos os campos sem figurar na matriz?',
      opcoes: [
        'Semiose e axiologias / ideologias',
        'Processo de criação e linguagens',
        'Historicidade e sistema da arte',
        'Estética e crítica'
      ],
      certa: 0,
      nota: 'SEMIOSE (produção e apreensão de sentido) e AXIOLOGIAS (ética e estética) permeiam sem figurar (03-03). Processo de criação e linguagens FIGURAM na matriz.'
    },
    {
      id: 'lit-art-599-est',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'A Estética é o campo:',
      opcoes: [
        'do sentir',
        'do julgamento',
        'da técnica',
        'da crítica'
      ],
      certa: 0,
      nota: 'Estética = SENTIR; Crítica de Arte = JULGAR (02-06 e 05-04 — duas ocorrências). Nenhum dos dois é «técnica».'
    },
    {
      id: 'lit-art-599-vivencia',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'A vivência estética corresponde a:',
      opcoes: [
        'fruição e apreciação',
        'julgamento e padrões de beleza',
        'análise e interpretação',
        'contextualização histórica'
      ],
      certa: 0,
      nota: 'Vivência estética = FRUIÇÃO e APRECIAÇÃO; o julgamento é da Crítica. Foi a terceira vez que trocaste a coluna (06-13).'
    },
    {
      id: 'lit-art-484-est',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 484',
      enunciado: 'A Estética é o estudo:',
      opcoes: [
        'do belo e também do feio',
        'exclusivamente do julgamento técnico da obra',
        'da técnica de produção',
        'dos padrões de mercado'
      ],
      certa: 0,
      nota: 'Belo E feio (05-04). O julgamento técnico pertence à Crítica — não à Estética.'
    },
    {
      id: 'lit-fund-33',
      grupo: 'Fundamentos · a Proposta',
      fonte: 'Fundamentos, p. 33',
      enunciado: 'Na Proposta, a relação do homem com a sociedade dá-se:',
      opcoes: [
        'pela produção e apropriação de bens materiais',
        'pela intuição individual, independente da cultura',
        'pela reprodução de modelos herdados',
        'pelo domínio técnico dos instrumentos'
      ],
      certa: 0,
      nota: 'Materialismo histórico: PRODUÇÃO E APROPRIAÇÃO DE BENS MATERIAIS (05-01). «Intuição individual» é o avesso da Proposta — Cartão 4.'
    },
    {
      id: 'lit-fund-47',
      grupo: 'Fundamentos · a Proposta',
      fonte: 'Fundamentos, p. 47 (Leontiev)',
      enunciado: 'Para Leontiev, o mundo:',
      opcoes: [
        'não é dado imediatamente ao indivíduo; apresenta-se como um problema a resolver',
        'é dado imediatamente ao indivíduo pela observação',
        'é apreendido pela intuição individual, independente da cultura',
        'é reproduzido espontaneamente pelo psiquismo infantil'
      ],
      certa: 0,
      nota: 'O «NÃO» carrega a questão inteira (04-02). E o desenvolvimento não é natural nem espontâneo (02-03) — é cultural e mediado.'
    },
    {
      id: 'lit-fund-26',
      grupo: 'Fundamentos · a Proposta',
      fonte: 'Fundamentos, p. 26',
      enunciado: 'A escola deve SUPERAR:',
      opcoes: [
        'a fragmentação das propostas pedagógicas',
        'a formação humana omnilateral',
        'a educação integral',
        'a mediação docente'
      ],
      certa: 0,
      nota: 'Verbo negativo → pede o DEFEITO. A omnilateralidade é o que se constrói (p. 25), não o que se supera. Foi o erro 06-06 (Cartão 8).'
    },
    {
      id: 'lit-art-476',
      grupo: 'Arte · eixos estruturantes',
      fonte: 'Arte, p. 476',
      enunciado: 'O eixo estruturante da formação docente em Arte propõe:',
      opcoes: [
        'ampliar a formação docente nas linguagens específicas, a fim de evitar a exigência da polivalência',
        'unificar as quatro linguagens num único componente, dispensando a formação específica',
        'substituir as linguagens por projetos interdisciplinares sem conteúdo próprio',
        'ensinar apenas a linguagem da habilitação do professor'
      ],
      certa: 0,
      nota: 'A Proposta quer FORMAÇÃO ESPECÍFICA para EVITAR a polivalência (05-02). A alternativa «prática» (unificar, dispensar) é a armadilha — inversão de sinal.'
    },
    {
      id: 'lit-art-547',
      grupo: 'História da Arte',
      fonte: 'História da Arte, p. 547',
      enunciado: 'O deslocamento do eixo Paris → Nova York acontece:',
      opcoes: [
        'após a 2ª Guerra Mundial, com o Expressionismo Abstrato, a Arte Pop e o Minimalismo',
        'com as vanguardas europeias do início do século XX',
        'com o Realismo e o Impressionismo',
        'no Renascimento, com a perspectiva linear'
      ],
      certa: 0,
      nota: 'Pós-guerra. As vanguardas são PRÉ-guerra (início do séc. XX) e Realismo/Impressionismo são séc. XIX (01-03 e 02-05) — não misturar as gavetas.'
    },
    {
      id: 'lit-art-494-peso',
      grupo: 'Fatores de Laban',
      fonte: 'Arte, p. 494',
      enunciado: '«Movimentos de subida e descida, considerando-se a força necessária.» Este fator é:',
      opcoes: [
        'peso',
        'espaço',
        'tempo',
        'fluência'
      ],
      certa: 0,
      nota: 'PESO = subida e descida + a força necessária. A «dimensão ocupada ao esticar os membros ao máximo» é ESPAÇO (04-03).'
    },
    {
      id: 'lit-art-498-spolin',
      grupo: 'Teatro',
      fonte: 'Arte, p. 498',
      enunciado: '«Quem, onde e o que» pertencem a:',
      opcoes: [
        'Spolin, no jogo dramático',
        'Laban, nos fatores do movimento',
        'à matriz curricular de Arte de Itapoá',
        'ao teatro grego formalizado'
      ],
      certa: 0,
      nota: 'SPOLIN = quem / onde / o que. LABAN = tempo / peso / fluência / espaço (05-06). Não trocar os autores.'
    },
    {
      id: 'lit-art-497-gregos',
      grupo: 'Teatro',
      fonte: 'Arte, p. 497-498',
      enunciado: 'Enquanto expressão artística, o teatro foi formalizado pelos:',
      opcoes: [
        'gregos',
        'romanos',
        'egípcios',
        'medievais'
      ],
      certa: 0,
      nota: 'GREGOS — o teatro grego antecede o romano (01-02). A ordem da história não se inverte.'
    },
    {
      id: 'lit-eca-54-ii',
      grupo: 'ECA · art. 54',
      fonte: 'ECA, art. 54, II',
      enunciado: 'O inciso II do art. 54 do ECA assegura, quanto ao ensino médio:',
      opcoes: [
        'progressiva extensão da obrigatoriedade e gratuidade',
        'obrigatoriedade e gratuidade imediatas',
        'gratuidade apenas para quem não puder pagar',
        'oferta facultativa pelos sistemas de ensino'
      ],
      certa: 0,
      nota: 'PROGRESSIVA extensão (07-04) — nunca «imediatamente». A lei promete progressividade; o distrator promete o imediato, que soa melhor e é falso.'
    },
    {
      id: 'lit-art-585-intensidade',
      grupo: 'Arte · a música',
      fonte: 'Arte, p. 585',
      enunciado: 'Na música, a intensidade do som refere-se a:',
      opcoes: [
        'ser forte ou fraco',
        'ser agudo ou grave',
        'ser curto ou longo',
        'a fonte sonora que o produz'
      ],
      certa: 0,
      nota: 'INTENSIDADE = forte/fraco. Agudo/grave é ALTURA; curto/longo é DURAÇÃO; a fonte é o TIMBRE (07-09 — e a altura acertaste no 08-10).'
    },
    {
      id: 'lit-art-494-fluencia',
      grupo: 'Fatores de Laban',
      fonte: 'Arte, p. 494',
      enunciado: 'No fator FLUÊNCIA, Laban explora movimentos:',
      opcoes: [
        'ora contidos, ora com liberdade de expressão',
        'de subida e descida, com a força necessária',
        'que ocupam a dimensão máxima do corpo esticado',
        'de pulso, ritmo, duração e velocidade'
      ],
      certa: 0,
      nota: 'FLUÊNCIA = contido ou livre (07-10). Subida/descida é PESO; a dimensão máxima é ESPAÇO; pulso e duração são TEMPO. Quatro fatores, quatro colunas.'
    },
    {
      id: 'lit-art-568-forma',
      grupo: 'Campos da Dança',
      fonte: 'Arte, p. 568',
      enunciado: 'Na matriz de Dança, o campo FORMA explora:',
      opcoes: [
        'a relação com o outro, com o espaço e com os objetos',
        'rotação, flexão, extensão e vibração',
        'direção, nível, amplitude, foco, ordem e forma',
        'força, energia, tensão, relaxamento e fluxo'
      ],
      certa: 0,
      nota: 'FORMA = relação (07-11). Rotação/flexão/extensão/vibração é GESTO; direção/nível/amplitude é ESPAÇO; força/energia/tensão é DINÂMICA.'
    },
    {
      id: 'lit-art-599-julgamento',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'O julgamento, no campo da arte, envolve:',
      opcoes: [
        'análise, interpretação e padrões de beleza',
        'fruição, apreciação e vivência',
        'sensação, emoção e subjetividade',
        'domínio técnico e reprodução de modelos'
      ],
      certa: 0,
      nota: 'JULGAR = análise, interpretação, padrões de beleza — é a Crítica de Arte. Fruição e apreciação são a VIVÊNCIA ESTÉTICA, que é o sentir (07-13, quarta vez).'
    },
    {
      id: 'lit-fund-25-reducionista',
      grupo: 'Fundamentos · a Proposta',
      fonte: 'Fundamentos, p. 25',
      enunciado: 'A Proposta manda romper com visões reducionistas que privilegiam:',
      opcoes: [
        'ou a dimensão intelectual (cognitiva) ou a dimensão afetiva',
        'a educabilidade humana em sua totalidade',
        'o percurso formativo como continuum',
        'a formação omnilateral do sujeito'
      ],
      certa: 0,
      nota: 'O verbo é ROMPER: a resposta é o DEFEITO descrito, não o ideal que se defende (08b-06). Totalidade, continuum e omnilateral são o que a Proposta constrói — e por isso são os distratores.'
    },
    {
      id: 'lit-art-476-marco',
      grupo: 'Arte · marco legal',
      fonte: 'Arte, p. 476',
      enunciado: 'Sobre o marco legal do componente Arte, é correto afirmar:',
      opcoes: [
        'a Lei 5.692/1971 criou a Educação Artística, como atividade; em 2016 a LDB passou a incluir Artes Visuais, Dança, Música e Teatro',
        'a Lei 5.692/1971 tornou a Arte componente obrigatório com as quatro linguagens',
        'a LDB 9.394/1996 incluiu as quatro linguagens no art. 26 desde a promulgação',
        'a BNCC de 2018 criou a obrigatoriedade do componente Arte'
      ],
      certa: 0,
      nota: '1971 = atividade · 1996 = obrigatoriedade (sem as quatro) · 2016 = as quatro linguagens no art. 26 (08b-08). Três datas, três factos — trocar uma derruba a questão.'
    },
    {
      id: 'lit-ldb-12-iv',
      grupo: 'LDB · art. 12',
      fonte: 'LDB, art. 12, IV e art. 13, II',
      enunciado: 'O plano de trabalho de cada docente aparece em dois incisos. Qual par está correto?',
      opcoes: [
        'art. 12, IV — o estabelecimento vela pelo cumprimento do plano de trabalho de cada docente; art. 13, II — o docente elabora e cumpre o plano segundo a proposta pedagógica',
        'art. 12, IV — o docente vela pelo cumprimento do plano; art. 13, II — o estabelecimento elabora e cumpre o plano',
        'art. 12, I — o estabelecimento elabora e cumpre o plano; art. 13, I — o docente vela pelo seu cumprimento',
        'art. 12, V — o estabelecimento elabora e cumpre o plano; art. 13, IV — o docente vela pelo seu cumprimento'
      ],
      certa: 0,
      nota: 'Dois donos, dois verbos: a ESCOLA vela (12-IV), o DOCENTE elabora e cumpre (13-II). Foi o erro 10-02 — o plano tem dono em cada ponta.'
    },
    {
      id: 'lit-ldb-14-3',
      grupo: 'LDB · art. 14',
      fonte: 'LDB, art. 14, § 3º',
      enunciado: 'O Fórum dos Conselhos Escolares é composto por:',
      opcoes: [
        '2 representantes do órgão responsável pelo sistema de ensino e 2 representantes de cada Conselho Escolar da circunscrição',
        'cinco representantes eleitos por seus pares, mais o Diretor da Escola como membro nato',
        'um representante de cada escola da rede, eleito exclusivamente entre os professores',
        'membros indicados pelo Conselho Tutelar e pelo Ministério Público'
      ],
      certa: 0,
      nota: 'FÓRUM (§ 3º) = 2 + 2. O Diretor nato com cinco categorias é o CONSELHO ESCOLAR (§ 1º) — trocar os dois foi o erro 11-04.'
    },
    {
      id: 'lit-ldb-14-1',
      grupo: 'LDB · art. 14',
      fonte: 'LDB, art. 14, § 1º',
      enunciado: 'O Conselho Escolar, órgão deliberativo, é composto por:',
      opcoes: [
        'Diretor da Escola, membro nato, e representantes das comunidades escolar e local, eleitos por seus pares em cinco categorias',
        '2 representantes do órgão do sistema de ensino e 2 representantes de cada escola',
        'apenas professores e servidores administrativos da escola',
        'membros indicados pelo Conselho Tutelar do município'
      ],
      certa: 0,
      nota: 'CONSELHO (§ 1º) = Diretor nato + cinco categorias eleitas (professores e especialistas, demais servidores, estudantes, pais, comunidade local). É órgão do art. 14 — NÃO responde pelas incumbências do art. 12 (11-02 e 11-04).'
    },
    {
      id: 'lit-ldb-14-caput',
      grupo: 'LDB · art. 14',
      fonte: 'LDB, art. 14, caput',
      enunciado: 'As normas da gestão democrática do ensino público na educação básica são definidas:',
      opcoes: [
        'pelos sistemas de ensino, de acordo com as suas peculiaridades',
        'pelo estabelecimento de ensino, no seu regimento interno',
        'pelo Conselho Tutelar do município',
        'pelos docentes, em assembleia'
      ],
      certa: 0,
      nota: 'SISTEMAS DE ENSINO definem as normas (art. 14). O estabelecimento tem incumbências (art. 12) e provê meios (12-V). A palavra «Conselho» não define nada — erros 13-01 e RE-04.'
    },
    {
      id: 'lit-ldb-14644',
      grupo: 'LDB · marco legal',
      fonte: 'LDB, arts. 12, XII e 14 — Lei 14.644/2023',
      enunciado: 'O que a Lei 14.644/2023 fez na LDB?',
      opcoes: [
        'incluiu no art. 12 a incumbência de instituir os Conselhos Escolares e reescreveu o art. 14, com a composição do Conselho e o Fórum',
        'criou a notificação obrigatória de violência, automutilação e tentativa de suicídio',
        'tornou obrigatório o ensino das quatro linguagens no art. 26',
        'instituiu o direito público subjetivo ao ensino obrigatório e gratuito'
      ],
      certa: 0,
      nota: 'Trio de datas: 2016 = quatro linguagens · 2023 = Conselhos Escolares (12-XII + art. 14) · 2025 = violência/automutilação (12-VIII). Erros 11-03 e RE-02.'
    },
    {
      id: 'lit-eca-56-ii',
      grupo: 'ECA · art. 56',
      fonte: 'ECA, art. 56, II',
      enunciado: 'Para comunicar ao Conselho Tutelar a reiteração de faltas e a evasão, o art. 56 exige que:',
      opcoes: [
        'estejam esgotados os recursos escolares',
        'as faltas superem trinta por cento do percentual permitido em lei',
        'o caso seja previamente submetido à autoridade judiciária',
        'a família tenha sido advertida antes pelo Conselho Tutelar'
      ],
      certa: 0,
      nota: 'ECA 56-II = recursos escolares ESGOTADOS. Os 30% pertencem à LDB 12-VIII, «a» — outra lei, outro gatilho, o mesmo destinatário (10-07).'
    },
    {
      id: 'lit-art-492-outros',
      grupo: 'Arte · colunas da matriz',
      fonte: 'Arte, p. 492 (e p. 528)',
      enunciado: 'Na matriz de Artes Visuais, «seriação» e «repetição» pertencem à coluna:',
      opcoes: [
        'Outros Conceitos na Arte',
        'Elementos da Linguagem',
        'Materialidades',
        'Possibilidades de Exploração'
      ],
      certa: 0,
      nota: 'Outros Conceitos = arte como ritual, símbolos, espaço, corpo, seriação, repetição. Elementos (p. 528) = linha, ponto, cor, forma, planos, textura, volume, ritmo, movimento. Erros 11-08 e RE-03 — a coluna errada MUDA a cada prova.'
    },
    {
      id: 'lit-art-568-pares',
      grupo: 'Campos da Dança',
      fonte: 'Arte, p. 568',
      enunciado: 'Além dos seis campos de exploração, a matriz de Dança prevê pares de qualidades do movimento. Quais?',
      opcoes: [
        'simétrico e assimétrico, contínuo e descontínuo',
        'convencional e não convencional',
        'forte e fraco, agudo e grave',
        'analógico e digital'
      ],
      certa: 0,
      nota: 'Os pares da DANÇA são simétrico/assimétrico e contínuo/descontínuo. «Convencional e não convencional» são os ESPAÇOS DO TEATRO; forte/fraco e agudo/grave são propriedades do SOM; analógico/digital é da materialidade. Erro 10-09.'
    },
    {
      id: 'lit-art-585-duracao',
      grupo: 'Arte · a música',
      fonte: 'Arte, p. 585',
      enunciado: 'Na música, a duração do som refere-se a:',
      opcoes: [
        'ser curto ou longo',
        'ser forte ou fraco',
        'ser agudo ou grave',
        'a fonte sonora que o produz'
      ],
      certa: 0,
      nota: 'DURAÇÃO = curto/longo. Forte/fraco é INTENSIDADE (o erro 07-09); agudo/grave é ALTURA; a fonte é o TIMBRE. O quarteto fecha sempre por pares.'
    },
    {
      id: 'lit-art-599-estranhamento',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'O estranhamento, na Proposta, é elemento do campo:',
      opcoes: [
        'da Estética',
        'da Crítica de Arte',
        'do Sistema da Arte',
        'da Historicidade'
      ],
      certa: 0,
      nota: 'Estética = sentir: sensação, emoção, subjetividade, relações, sentidos e ESTRANHAMENTO. Análise, interpretação e padrões de beleza são da Crítica. Erro 11-11.'
    },
    {
      id: 'lit-fund-25-constroi',
      grupo: 'Fundamentos · a Proposta',
      fonte: 'Fundamentos, p. 25',
      enunciado: 'A educação integral visa GARANTIR:',
      opcoes: [
        'a formação humana omnilateral — o sujeito em sua totalidade',
        'ou a dimensão intelectual (cognitiva) ou a dimensão afetiva',
        'a fragmentação das propostas pedagógicas',
        'a superação da educabilidade humana'
      ],
      certa: 0,
      nota: 'O par do lit-fund-25-reducionista. O verbo mudou: GARANTIR pede o DEVER que se constrói; ROMPER pedia o DEFEITO. ==Este par existe porque o cartão do «romper» tinha e0 no jogo e o mecanismo caiu quatro vezes na prova (06-06, 08b-06, 13-07, RE-05): ele reconhecia a alternativa, não lia o verbo.=='
    }
  ]
};
