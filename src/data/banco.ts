import type { AulaItem, BancoData, CardIndexEntry } from '../types/study';

export const BANCO: BancoData = {
  versao: '2026-11-16',

  parear: [
    {
      id: 'danca',
      grupo: 'Campos da Dança',
      fonte: 'Arte, p. 568',
      tamanho: 3,
      rotulos: {
        Espaço: ['direção', 'nível', 'amplitude', 'foco', 'ordem', 'forma'],
        Ritmo: ['tempo', 'duração', 'ênfase', 'compasso'],
        Dinâmica: ['força', 'energia', 'tensão', 'relaxamento', 'fluxo'],
        Forma: ['relação com o outro', 'relação com o espaço', 'relação com os objetos'],
        Locomoção: ['caminhar', 'pular', 'correr', 'saltar', 'rolar', 'estirar-se', 'rodopiar'],
        Gesto: ['rotação', 'flexão', 'extensão', 'vibração'],
      },
    },
    {
      id: 'laban',
      grupo: 'Fatores de Laban',
      fonte: 'Arte, p. 494',
      tamanho: 3,
      rotulos: {
        Tempo: ['pulso', 'duração', 'intensidade', 'velocidade', 'começo, intervalo e encerramento'],
        Peso: ['subida e descida', 'a força necessária'],
        Fluência: ['contido', 'livre'],
        Espaço: ['a dimensão ocupada ao esticar os membros ao máximo'],
      },
    },
    {
      id: 'colunasav',
      grupo: 'Colunas da matriz · Artes Visuais',
      fonte: 'Arte, p. 492 e 528',
      tamanho: 3,
      rotulos: {
        'Elementos da Linguagem': ['linha', 'ponto', 'cor', 'forma', 'planos', 'textura', 'volume', 'ritmo', 'movimento'],
        'Outros Conceitos na Arte': ['arte como ritual', 'símbolos', 'espaço', 'corpo', 'seriação', 'repetição'],
        Materialidades: ['suportes', 'materiais', 'ferramentas', 'procedimentos'],
        Linguagens: ['desenho', 'gravura', 'muralismo', 'grafite'],
      },
    },
  ],

  classificar: [
    {
      id: 'sentir-julgar',
      grupo: 'Estética × Crítica',
      fonte: 'Arte, p. 599',
      quantos: 10,
      colunas: [
        { id: 'estetica', nome: 'Estética — o sentir' },
        { id: 'critica', nome: 'Crítica de Arte — o julgar' },
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
        { id: 'sj-10', texto: 'o campo do julgamento', col: 'critica' },
      ],
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
        { id: 'contemp', nome: 'Contemporâneo' },
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
        { id: 'sec-14', texto: 'instalações', col: 'contemp' },
      ],
    },
    {
      id: 'verbo',
      grupo: 'O Verbo do Enunciado',
      fonte: 'Fundamentos, p. 25-26 · leitura de prova',
      quantos: 9,
      colunas: [
        { id: 'elimina', nome: '«superar» → o defeito que se elimina' },
        { id: 'constroi', nome: '«garantir» → o dever que se constrói' },
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
        { id: 'vb-10', texto: 'o acesso ao ensino obrigatório como direito público subjetivo', col: 'constroi' },
      ],
    },
  ],

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
        'Valorização da diversidade étnico-cultural',
      ],
      certa: 0,
      nota: '3º-XII = diversidade ÉTNICO-RACIAL (Lei 12.796/2013). III = pluralismo de ideias; XV = transparência. Este inciso já te traiu duas vezes (02-01 e RE-01) — a certa repete a palavra da lei, não a que soa bonita.',
    },
    {
      id: 'lit-ldb-12-v',
      grupo: 'LDB · art. 12',
      fonte: 'LDB, art. 12, V',
      enunciado: 'A palavra literal do art. 12, V da LDB é «recuperação dos alunos de menor…»:',
      opcoes: ['rendimento', 'desempenho', 'aproveitamento', 'frequência'],
      certa: 0,
      nota: 'RENDIMENTO — não «desempenho». Uma só palavra separa a certa da quase-certa, e a banca cobra a letra da lei (03-01, mecanismo 4).',
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
        'concessão discricionária da direção da escola',
      ],
      certa: 0,
      nota: 'DIREITO PÚBLICO SUBJETIVO — exigível. A alternativa «favor» é a inversão de sinal clássica (03-02): a que soa de bom senso é a armadilha.',
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
        'acesso à educação profissional de nível técnico, exclusivamente',
      ],
      certa: 0,
      nota: 'O inciso é o da cara desta prova: cita a CRIAÇÃO ARTÍSTICA. O distrator genérico («gratuito para todos») perdeu-te em 04-01.',
    },
    {
      id: 'lit-art-482-hist',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 482',
      enunciado: '«Refere-se à realidade histórica, no caso a história da arte.» Este conceito é:',
      opcoes: ['Historicidade', 'Linguagens', 'Processo de criação', 'Sistema da arte'],
      certa: 0,
      nota: 'HISTORICIDADE é a história da arte; o FAZER artístico é o Processo de criação. Trocar os dois foi o erro 05-03.',
    },
    {
      id: 'lit-art-483-proc',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 483',
      enunciado: '«Refere-se ao fazer artístico: elaborar, criar, produzir, construir e materializar.» Este conceito é:',
      opcoes: ['Processo de criação (poética e poiética)', 'Historicidade', 'Estética', 'Sistema da arte'],
      certa: 0,
      nota: 'PROCESSO DE CRIAÇÃO = fazer artístico (02-04). O «sistema da arte» é o dos espaços onde circulam obras e pessoas.',
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
        'Estética e crítica',
      ],
      certa: 0,
      nota: 'SEMIOSE (produção e apreensão de sentido) e AXIOLOGIAS (ética e estética) permeiam sem figurar (03-03). Processo de criação e linguagens FIGURAM na matriz.',
    },
    {
      id: 'lit-art-599-est',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'A Estética é o campo:',
      opcoes: ['do sentir', 'do julgamento', 'da técnica', 'da crítica'],
      certa: 0,
      nota: 'Estética = SENTIR; Crítica de Arte = JULGAR (02-06 e 05-04 — duas ocorrências). Nenhum dos dois é «técnica».',
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
        'contextualização histórica',
      ],
      certa: 0,
      nota: 'Vivência estética = FRUIÇÃO e APRECIAÇÃO; o julgamento é da Crítica. Foi a terceira vez que trocaste a coluna (06-13).',
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
        'dos padrões de mercado',
      ],
      certa: 0,
      nota: 'Belo E feio (05-04). O julgamento técnico pertence à Crítica — não à Estética.',
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
        'pelo domínio técnico dos instrumentos',
      ],
      certa: 0,
      nota: 'Materialismo histórico: PRODUÇÃO E APROPRIAÇÃO DE BENS MATERIAIS (05-01). «Intuição individual» é o avesso da Proposta — Cartão 4.',
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
        'é reproduzido espontaneamente pelo psiquismo infantil',
      ],
      certa: 0,
      nota: 'O «NÃO» carrega a questão inteira (04-02). E o desenvolvimento não é natural nem espontâneo (02-03) — é cultural e mediado.',
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
        'a mediação docente',
      ],
      certa: 0,
      nota: 'Verbo negativo → pede o DEFEITO. A omnilateralidade é o que se constrói (p. 25), não o que se supera. Foi o erro 06-06 (Cartão 8).',
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
        'ensinar apenas a linguagem da habilitação do professor',
      ],
      certa: 0,
      nota: 'A Proposta quer FORMAÇÃO ESPECÍFICA para EVITAR a polivalência (05-02). A alternativa «prática» (unificar, dispensar) é a armadilha — inversão de sinal.',
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
        'no Renascimento, com a perspectiva linear',
      ],
      certa: 0,
      nota: 'Pós-guerra. As vanguardas são PRÉ-guerra (início do séc. XX) e Realismo/Impressionismo são séc. XIX (01-03 e 02-05) — não misturar as gavetas.',
    },
    {
      id: 'lit-art-494-peso',
      grupo: 'Fatores de Laban',
      fonte: 'Arte, p. 494',
      enunciado: '«Movimentos de subida e descida, considerando-se a força necessária.» Este fator é:',
      opcoes: ['peso', 'espaço', 'tempo', 'fluência'],
      certa: 0,
      nota: 'PESO = subida e descida + a força necessária. A «dimensão ocupada ao esticar os membros ao máximo» é ESPAÇO (04-03).',
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
        'ao teatro grego formalizado',
      ],
      certa: 0,
      nota: 'SPOLIN = quem / onde / o que. LABAN = tempo / peso / fluência / espaço (05-06). Não trocar os autores.',
    },
    {
      id: 'lit-art-497-gregos',
      grupo: 'Teatro',
      fonte: 'Arte, p. 497-498',
      enunciado: 'Enquanto expressão artística, o teatro foi formalizado pelos:',
      opcoes: ['gregos', 'romanos', 'egípcios', 'medievais'],
      certa: 0,
      nota: 'GREGOS — o teatro grego antecede o romano (01-02). A ordem da história não se inverte.',
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
        'oferta facultativa pelos sistemas de ensino',
      ],
      certa: 0,
      nota: 'PROGRESSIVA extensão (07-04) — nunca «imediatamente». A lei promete progressividade; o distrator promete o imediato, que soa melhor e é falso.',
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
        'a fonte sonora que o produz',
      ],
      certa: 0,
      nota: 'INTENSIDADE = forte/fraco. Agudo/grave é ALTURA; curto/longo é DURAÇÃO; a fonte é o TIMBRE (07-09 — e a altura acertaste no 08-10).',
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
        'de pulso, ritmo, duração e velocidade',
      ],
      certa: 0,
      nota: 'FLUÊNCIA = contido ou livre (07-10). Subida/descida é PESO; a dimensão máxima é ESPAÇO; pulso e duração são TEMPO. Quatro fatores, quatro colunas.',
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
        'força, energia, tensão, relaxamento e fluxo',
      ],
      certa: 0,
      nota: 'FORMA = relação (07-11). Rotação/flexão/extensão/vibração é GESTO; direção/nível/amplitude é ESPAÇO; força/energia/tensão é DINÂMICA.',
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
        'domínio técnico e reprodução de modelos',
      ],
      certa: 0,
      nota: 'JULGAR = análise, interpretação, padrões de beleza — é a Crítica de Arte. Fruição e apreciação são a VIVÊNCIA ESTÉTICA, que é o sentir (07-13, quarta vez).',
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
        'a formação omnilateral do sujeito',
      ],
      certa: 0,
      nota: 'O verbo é ROMPER: a resposta é o DEFEITO descrito, não o ideal que se defende (08b-06). Totalidade, continuum e omnilateral são o que a Proposta constrói — e por isso são os distratores.',
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
        'a BNCC de 2018 criou a obrigatoriedade do componente Arte',
      ],
      certa: 0,
      nota: '1971 = atividade · 1996 = obrigatoriedade (sem as quatro) · 2016 = as quatro linguagens no art. 26 (08b-08). Três datas, três factos — trocar uma derruba a questão.',
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
        'art. 12, V — o estabelecimento elabora e cumpre o plano; art. 13, IV — o docente vela pelo seu cumprimento',
      ],
      certa: 0,
      nota: 'Dois donos, dois verbos: a ESCOLA vela (12-IV), o DOCENTE elabora e cumpre (13-II). Foi o erro 10-02 — o plano tem dono em cada ponta.',
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
        'membros indicados pelo Conselho Tutelar e pelo Ministério Público',
      ],
      certa: 0,
      nota: 'FÓRUM (§ 3º) = 2 + 2. O Diretor nato com cinco categorias é o CONSELHO ESCOLAR (§ 1º) — trocar os dois foi o erro 11-04.',
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
        'membros indicados pelo Conselho Tutelar do município',
      ],
      certa: 0,
      nota: 'CONSELHO (§ 1º) = Diretor nato + cinco categorias eleitas (professores e especialistas, demais servidores, estudantes, pais, comunidade local). É órgão do art. 14 — NÃO responde pelas incumbências do art. 12 (11-02 e 11-04).',
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
        'pelos docentes, em assembleia',
      ],
      certa: 0,
      nota: 'SISTEMAS DE ENSINO definem as normas (art. 14). O estabelecimento tem incumbências (art. 12) e provê meios (12-V). A palavra «Conselho» não define nada — erros 13-01 e RE-04.',
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
        'instituiu o direito público subjetivo ao ensino obrigatório e gratuito',
      ],
      certa: 0,
      nota: 'Trio de datas: 2016 = quatro linguagens · 2023 = Conselhos Escolares (12-XII + art. 14) · 2025 = violência/automutilação (12-VIII). Erros 11-03 e RE-02.',
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
        'a família tenha sido advertida antes pelo Conselho Tutelar',
      ],
      certa: 0,
      nota: 'ECA 56-II = recursos escolares ESGOTADOS. Os 30% pertencem à LDB 12-VIII, «a» — outra lei, outro gatilho, o mesmo destinatário (10-07).',
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
        'Possibilidades de Exploração',
      ],
      certa: 0,
      nota: 'Outros Conceitos = arte como ritual, símbolos, espaço, corpo, seriação, repetição. Elementos (p. 528) = linha, ponto, cor, forma, planos, textura, volume, ritmo, movimento. Erros 11-08 e RE-03 — a coluna errada MUDA a cada prova.',
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
        'analógico e digital',
      ],
      certa: 0,
      nota: 'Os pares da DANÇA são simétrico/assimétrico e contínuo/descontínuo. «Convencional e não convencional» são os ESPAÇOS DO TEATRO; forte/fraco e agudo/grave são propriedades do SOM; analógico/digital é da materialidade. Erro 10-09.',
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
        'a fonte sonora que o produz',
      ],
      certa: 0,
      nota: 'DURAÇÃO = curto/longo. Forte/fraco é INTENSIDADE (o erro 07-09); agudo/grave é ALTURA; a fonte é o TIMBRE. O quarteto fecha sempre por pares.',
    },
    {
      id: 'lit-art-599-estranhamento',
      grupo: 'Arte · conceitos gerais',
      fonte: 'Arte, p. 599',
      enunciado: 'O estranhamento, na Proposta, é elemento do campo:',
      opcoes: ['da Estética', 'da Crítica de Arte', 'do Sistema da Arte', 'da Historicidade'],
      certa: 0,
      nota: 'Estética = sentir: sensação, emoção, subjetividade, relações, sentidos e ESTRANHAMENTO. Análise, interpretação e padrões de beleza são da Crítica. Erro 11-11.',
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
        'a superação da educabilidade humana',
      ],
      certa: 0,
      nota: 'O par do lit-fund-25-reducionista. O verbo mudou: GARANTIR pede o DEVER que se constrói; ROMPER pedia o DEFEITO. Este par existe porque o cartão do «romper» tinha zero erros no jogo e o mecanismo caiu quatro vezes na prova (06-06, 08b-06, 13-07, RE-05).',
    },
  ],
};

export const AULAS: AulaItem[] = [
  {
    id: 'aula-01',
    numero: '01',
    titulo: 'Fundamentos da Proposta Curricular',
    subtitulo: 'A Proposta de Itapoá por dentro · Vale 7 das 14 questões da prova',
    duracaoTexto: '7,8 min',
    srcMp3: '/audio/aulas/01-fundamentos.mp3',
    srcWav: '/audio/aulas/01-fundamentos.wav',
    topicos: [
      'Quatro pilares: materialismo histórico dialético, psicologia histórico-cultural, pedagogia histórico-crítica e metodologia orientadora.',
      'Materialismo: a relação homem-sociedade dá-se pela produção e apropriação de bens materiais (não por intuição individual).',
      'Educação integral (estratégia histórica) × formação humana omnilateral (qualidade do sujeito em totalidade).',
      'Educabilidade (condição humana de ser formado) e múltipla dimensionalidade (romper com reducionismos cognitivo vs. afetivo).',
      'Funções psicológicas: cognitivas (memória, atenção, etc.) vs. afetivas (motivação para a ação cognitiva).',
      'Leontiev e Vygotsky: o psiquismo não se desenvolve naturalmente — o mundo não é dado imediatamente, é problema a resolver.',
      'Educação especial como princípio transversal (atendimento preferencialmente na rede regular).',
    ],
  },
  {
    id: 'aula-02',
    numero: '02',
    titulo: 'LDB · Os Artigos 3º, 12, 13 e 14',
    subtitulo: 'A lei que organiza a educação · As alterações recentes mais cobradas pela banca',
    duracaoTexto: '7,6 min',
    srcMp3: '/audio/aulas/02-ldb.mp3',
    srcWav: '/audio/aulas/02-ldb.wav',
    topicos: [
      'Art. 3º (Princípios): II (liberdade e arte expressa), III (pluralismo de ideias), XII (diversidade ÉTNICO-RACIAL), XIII (ao longo da vida) e XV (transparência).',
      'Art. 12 (Incumbências da escola): proposta pedagógica, prover recuperação dos alunos de menor RENDIMENTO, notificar faltas acima de 30% ao Conselho Tutelar.',
      'Art. 13 (Incumbências do professor): participar da proposta, zelar pela aprendizagem, estabelecer estratégias de recuperação.',
      'Art. 14 (Gestão democrática): conselhos escolares e fórum dos conselhos escolares (redação 2023).',
    ],
  },
  {
    id: 'aula-03',
    numero: '03',
    titulo: 'ECA · Estatuto da Criança e do Adolescente',
    subtitulo: 'A lei que garante · Proteção integral e distinção com a LDB',
    duracaoTexto: '8,7 min',
    srcMp3: '/audio/aulas/03-eca.mp3',
    srcWav: '/audio/aulas/03-eca.wav',
    topicos: [
      'Criança (até 12 anos incompletos) e Adolescente (12 a 18 anos); proteção integral.',
      'O que o ECA NÃO tem: deveres do educador, deveres da escola e gestão democrática (tudo isso é LDB).',
      'Art. 53: Direito à educação, igualdade de condições, contestar critérios avaliativos e recorrer a instâncias escolares superiores.',
      'Art. 54: Ensino obrigatório e gratuito como direito público subjetivo (§ 1º); criação artística segundo capacidade de cada um (V); progressiva extensão do ensino médio (II).',
    ],
  },
  {
    id: 'aula-04',
    numero: '04',
    titulo: 'Arte na Proposta Curricular de Itapoá',
    subtitulo: 'Marco legal, formação específica e as quatro linguagens estruturantes',
    duracaoTexto: '11,3 min',
    srcMp3: '/audio/aulas/04-arte.mp3',
    srcWav: '/audio/aulas/04-arte.wav',
    topicos: [
      'Marco legal: 1971 (Educação Artística como atividade) → 1996 (obrigatoriedade no art. 26) → 2016 (as 4 linguagens no art. 26).',
      'Formação docente específica em cada linguagem para EVITAR a polivalência.',
      'Dança — 6 campos: Espaço, Ritmo, Dinâmica, Forma, Locomoção e Gesto.',
      'Laban — 4 fatores do movimento: Tempo, Peso (subida/descida e força), Fluência (contido/livre) e Espaço (dimensão ao esticar membros).',
      'Teatro: formalizado pelos gregos; Spolin nos jogos dramáticos (quem, onde, o que).',
      'Música: Altura (grave/agudo), Intensidade (forte/fraco), Duração (longo/curto) e Timbre (fonte sonora).',
    ],
  },
  {
    id: 'aula-05',
    numero: '05',
    titulo: 'História da Arte · A Linha do Tempo',
    subtitulo: 'Escolas, estilos e rupturas conceituais do século XIX ao Contemporâneo',
    duracaoTexto: '4,7 min',
    srcMp3: '/audio/aulas/05-historia-da-arte.mp3',
    srcWav: '/audio/aulas/05-historia-da-arte.wav',
    topicos: [
      'A Proposta organiza por escolas e rupturas, não por cronologia mecânica de datas.',
      'Século XIX: Realismo e Impressionismo (sensações imediatas, tom realista, luz e ar livre).',
      'Início do século XX: Vanguardas (Surrealismo, Dadaísmo, Suprematismo, Neoplasticismo, Futurismo).',
      'Pós-guerra: Deslocamento do eixo Paris → Nova York (Expressionismo Abstrato, Arte Pop, Minimalismo).',
      'Contemporâneo: Body Art, Op Art e instalações.',
    ],
  },
  {
    id: 'aula-00',
    numero: '00',
    titulo: 'Abertura do Caderno de Erros',
    subtitulo: 'O método de treino dos mecanismos e reversão de falhas',
    duracaoTexto: '3,5 min',
    srcMp3: '/audio/00-abertura-do-caderno.mp3',
    srcWav: '/audio/00-abertura-do-caderno.wav',
    topicos: [
      'Por que treinar o mecanismo do erro em vez da pergunta isolada.',
      'A anatomia do erro no ACT e a disciplina da repetição espaçada.',
    ],
  },
];

export function chipId(gid: string, rot: string, txt: string): string {
  return `par:${gid}:${rot}:${txt}`;
}

export const INDICE: Record<string, CardIndexEntry> = {};
export const IDS_PAREAR: Record<string, string[]> = {};
export const IDS_CLASSIFICAR: Record<string, string[]> = {};
export const IDS_LITERAL: string[] = [];

BANCO.parear.forEach((g) => {
  const ids: string[] = [];
  Object.keys(g.rotulos).forEach((rot) => {
    g.rotulos[rot].forEach((txt) => {
      const id = chipId(g.id, rot, txt);
      INDICE[id] = {
        id,
        tipo: 'parear',
        texto: txt,
        fonte: g.fonte,
        grupo: g.grupo,
        extra: `Campo: ${rot}`,
      };
      ids.push(id);
    });
  });
  IDS_PAREAR[g.id] = ids;
});

BANCO.classificar.forEach((s) => {
  IDS_CLASSIFICAR[s.id] = [];
  s.fichas.forEach((f) => {
    const col = s.colunas.find((c) => c.id === f.col)?.nome ?? '';
    INDICE[f.id] = {
      id: f.id,
      tipo: 'classificar',
      texto: f.texto,
      fonte: s.fonte,
      grupo: s.grupo,
      extra: `Coluna: ${col}`,
    };
    IDS_CLASSIFICAR[s.id].push(f.id);
  });
});

BANCO.literal.forEach((q) => {
  INDICE[q.id] = {
    id: q.id,
    tipo: 'literal',
    texto: q.enunciado,
    fonte: q.fonte,
    grupo: q.grupo,
    extra: q.opcoes[q.certa],
    nota: q.nota,
  };
  IDS_LITERAL.push(q.id);
});

export function todosOsIds(): string[] {
  const todos: string[] = [];
  Object.keys(IDS_PAREAR).forEach((k) => todos.push(...IDS_PAREAR[k]));
  Object.keys(IDS_CLASSIFICAR).forEach((k) => todos.push(...IDS_CLASSIFICAR[k]));
  todos.push(...IDS_LITERAL);
  return todos;
}

export const MECANISMOS = [
  { n: 1, nome: 'Sujeito e âncora' },
  { n: 2, nome: 'Inversão de sinal' },
  { n: 3, nome: 'Eixo dos séculos' },
  { n: 4, nome: 'Palavra literal' },
  { n: 5, nome: 'Taxonomia' },
  { n: 6, nome: 'Verbo do enunciado' },
  { n: 7, nome: 'Estética × Crítica' },
];

const MEC_POR_GRUPO: Record<string, number> = {
  'Campos da Dança': 5,
  'Fatores de Laban': 5,
  'Colunas da matriz · Artes Visuais': 5,
  'Estética × Crítica': 7,
  'Gavetas do Século': 3,
  'O Verbo do Enunciado': 6,
  'LDB · art. 3º': 1,
  'LDB · art. 12': 1,
  'LDB · art. 14': 1,
  'LDB · marco legal': 1,
  'ECA · art. 54': 1,
  'ECA · art. 56': 1,
  'Arte · marco legal': 1,
  'Fundamentos · a Proposta': 2,
  'Arte · conceitos gerais': 4,
  'Arte · a música': 5,
  'Arte · colunas da matriz': 5,
  'Arte · eixos estruturantes': 2,
  Teatro: 4,
  'História da Arte': 3,
};

const MEC_POR_ID: Record<string, number> = {
  'lit-fund-25-reducionista': 6,
  'lit-fund-25-constroi': 6,
  'lit-fund-26': 6,
  'lit-art-599-est': 7,
  'lit-art-599-vivencia': 7,
  'lit-art-599-julgamento': 7,
  'lit-art-599-estranhamento': 7,
  'lit-art-547': 3,
  'lit-art-568-pares': 5,
  'lit-art-494-peso': 5,
  'lit-art-494-fluencia': 5,
  'lit-art-585-intensidade': 5,
  'lit-art-585-duracao': 5,
  'lit-art-492-outros': 5,
};

export function mecanismoDe(id: string): number {
  if (MEC_POR_ID[id]) return MEC_POR_ID[id];
  const it = INDICE[id];
  return (it && MEC_POR_GRUPO[it.grupo]) || 4;
}
