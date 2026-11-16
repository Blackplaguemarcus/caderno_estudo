/* app.js — O Caderno Vivo · treino dos mecanismos de erro (ACT 2027 · Arte)
 *
 * Quatro pilares:
 *   1. parear      — campo → elementos (a recidiva das três vezes)
 *   2. classificar — colunas (sentir × julgar · gavetas do século · o verbo)
 *   3. literal     — escolha múltipla com a frase da ficha e o distrator que já enganou
 *   4. aulas       — as 5 aulas faladas narradas para o ouvido (40 min de conteúdo)
 *
 * Progresso por cartão em localStorage, com a gramática da consola:
 *   🌱 hesitante · ⚡ praticado · 🔥 hábito · 👑 assinatura
 * Sobe com dois acertos seguidos; cai com um erro. A fila do dia segue a regra
 * do plano de estudos: revisita em 48 h e em 7 dias.
 */
(function () {
  'use strict';

  var CHAVE = 'raven_estudo_act_v1';
  var CHAVE_AUDIO = 'raven_estudo_act_audio_v1';
  var ICONE = ['\uD83C\uDF31', '\u26A1', '\uD83D\uDD25', '\uD83D\uDC51']; /* 🌱 ⚡ 🔥 👑 */
  var NOME_NIVEL = ['hesitante', 'praticado', 'hábito', 'assinatura'];
  var H48 = 48 * 3600 * 1000;
  var D7 = 7 * 24 * 3600 * 1000;
  var BANCO = window.BANCO;

  var ecra = document.getElementById('ecra');
  var statsEl = document.getElementById('stats');
  var barraAudioEl = document.getElementById('audio-barra');
  var sessao = null;
  var telaAtual = 'casa';

  /* ════════ as cinco aulas faladas (+ abertura) ════════ */

  var AULAS = [
    {
      id: 'aula-01',
      numero: '01',
      titulo: 'Fundamentos da Proposta Curricular',
      subtitulo: 'A Proposta de Itapoá por dentro · Vale 7 das 14 questões da prova',
      duracaoTexto: '7,8 min',
      srcMp3: '../audio/aulas/01-fundamentos.mp3',
      srcWav: '../audio/aulas/01-fundamentos.wav',
      topicos: [
        'Quatro pilares: materialismo histórico dialético, psicologia histórico-cultural, pedagogia histórico-crítica e metodologia orientadora.',
        'Materialismo: a relação homem-sociedade dá-se pela produção e apropriação de bens materiais (não por intuição individual).',
        'Educação integral (estratégia histórica) × formação humana omnilateral (qualidade do sujeito em totalidade).',
        'Educabilidade (condição humana de ser formado) e múltipla dimensionalidade (romper com reducionismos cognitivo vs. afetivo).',
        'Funções psicológicas: cognitivas (memória, atenção, etc.) vs. afetivas (motivação para a ação cognitiva).',
        'Leontiev e Vygotsky: o psiquismo não se desenvolve naturalmente — o mundo não é dado imediatamente, é problema a resolver.',
        'Educação especial como princípio transversal (atendimento preferencialmente na rede regular).'
      ]
    },
    {
      id: 'aula-02',
      numero: '02',
      titulo: 'LDB · Os Artigos 3º, 12, 13 e 14',
      subtitulo: 'A lei que organiza a educação · As alterações recentes mais cobradas pela banca',
      duracaoTexto: '7,6 min',
      srcMp3: '../audio/aulas/02-ldb.mp3',
      srcWav: '../audio/aulas/02-ldb.wav',
      topicos: [
        'Art. 3º (Princípios): II (liberdade e arte expressa), III (pluralismo de ideias), XII (diversidade ÉTNICO-RACIAL), XIII (ao longo da vida) e XV (transparência).',
        'Art. 12 (Incumbências da escola): proposta pedagógica, prover recuperação dos alunos de menor RENDIMENTO, notificar faltas acima de 30% ao Conselho Tutelar.',
        'Art. 13 (Incumbências do professor): participar da proposta, zelar pela aprendizagem, estabelecer estratégias de recuperação.',
        'Art. 14 (Gestão democrática): conselhos escolares e fórum dos conselhos escolares (redação 2023).'
      ]
    },
    {
      id: 'aula-03',
      numero: '03',
      titulo: 'ECA · Estatuto da Criança e do Adolescente',
      subtitulo: 'A lei que garante · Proteção integral e distinção com a LDB',
      duracaoTexto: '8,7 min',
      srcMp3: '../audio/aulas/03-eca.mp3',
      srcWav: '../audio/aulas/03-eca.wav',
      topicos: [
        'Criança (até 12 anos incompletos) e Adolescente (12 a 18 anos); proteção integral.',
        'O que o ECA NÃO tem: deveres do educador, deveres da escola e gestão democrática (tudo isso é LDB).',
        'Art. 53: Direito à educação, igualdade de condições, contestar critérios avaliativos e recorrer a instâncias escolares superiores.',
        'Art. 54: Ensino obrigatório e gratuito como direito público subjetivo (§ 1º); criação artística segundo capacidade de cada um (V); progressiva extensão do ensino médio (II).'
      ]
    },
    {
      id: 'aula-04',
      numero: '04',
      titulo: 'Arte na Proposta Curricular de Itapoá',
      subtitulo: 'Marco legal, formação específica e as quatro linguagens estruturantes',
      duracaoTexto: '11,3 min',
      srcMp3: '../audio/aulas/04-arte.mp3',
      srcWav: '../audio/aulas/04-arte.wav',
      topicos: [
        'Marco legal: 1971 (Educação Artística como atividade) → 1996 (obrigatoriedade no art. 26) → 2016 (as 4 linguagens no art. 26).',
        'Formação docente específica em cada linguagem para EVITAR a polivalência.',
        'Dança — 6 campos: Espaço, Ritmo, Dinâmica, Forma, Locomoção e Gesto.',
        'Laban — 4 fatores do movimento: Tempo, Peso (subida/descida e força), Fluência (contido/livre) e Espaço (dimensão ao esticar membros).',
        'Teatro: formalizado pelos gregos; Spolin nos jogos dramáticos (quem, onde, o que).',
        'Música: Altura (grave/agudo), Intensidade (forte/fraco), Duração (longo/curto) e Timbre (fonte sonora).'
      ]
    },
    {
      id: 'aula-05',
      numero: '05',
      titulo: 'História da Arte · A Linha do Tempo',
      subtitulo: 'Escolas, estilos e rupturas conceituais do século XIX ao Contemporâneo',
      duracaoTexto: '4,7 min',
      srcMp3: '../audio/aulas/05-historia-da-arte.mp3',
      srcWav: '../audio/aulas/05-historia-da-arte.wav',
      topicos: [
        'A Proposta organiza por escolas e rupturas, não por cronologia mecânica de datas.',
        'Século XIX: Realismo e Impressionismo (sensações imediatas, tom realista, luz e ar livre).',
        'Início do século XX: Vanguardas (Surrealismo, Dadaísmo, Suprematismo, Neoplasticismo, Futurismo).',
        'Pós-guerra: Deslocamento do eixo Paris → Nova York (Expressionismo Abstrato, Arte Pop, Minimalismo).',
        'Contemporâneo: Body Art, Op Art e instalações.'
      ]
    },
    {
      id: 'aula-00',
      numero: '00',
      titulo: 'Abertura do Caderno de Erros',
      subtitulo: 'O método de treino dos mecanismos e reversão de falhas',
      duracaoTexto: '3,5 min',
      srcMp3: '../audio/00-abertura-do-caderno.mp3',
      srcWav: '../audio/00-abertura-do-caderno.wav',
      topicos: [
        'Por que treinar o mecanismo do erro em vez da pergunta isolada.',
        'A anatomia do erro no ACT e a disciplina da repetição espaçada.'
      ]
    }
  ];

  /* ════════ leitor de áudio global ════════ */

  var Player = (function () {
    var audio = new Audio();
    var aulaIdx = -1;
    var tocando = false;
    var vel = 1.0;

    /* carregar estado anterior */
    try {
      var guardado = JSON.parse(localStorage.getItem(CHAVE_AUDIO) || '{}');
      if (typeof guardado.idx === 'number' && guardado.idx >= 0 && guardado.idx < AULAS.length) {
        aulaIdx = guardado.idx;
      }
      if (typeof guardado.vel === 'number') vel = guardado.vel;
    } catch (e) {}

    audio.playbackRate = vel;

    audio.addEventListener('play', function () {
      tocando = true;
      chillDuck(true);
      atualizarUI();
    });

    audio.addEventListener('pause', function () {
      tocando = false;
      chillDuck(false);
      atualizarUI();
    });

    audio.addEventListener('timeupdate', function () {
      atualizarProgresso();
    });

    audio.addEventListener('ended', function () {
      /* auto-avanço para a próxima aula */
      if (aulaIdx + 1 < AULAS.length) {
        carregar(aulaIdx + 1, true);
      } else {
        tocando = false;
        atualizarUI();
      }
    });

    audio.addEventListener('error', function () {
      /* se falhar mp3, tenta wav */
      if (aulaIdx >= 0 && audio.src && audio.src.indexOf('.mp3') !== -1) {
        audio.src = AULAS[aulaIdx].srcWav;
        audio.load();
        if (tocando) audio.play().catch(function () {});
      }
    });

    function guardarEstado() {
      try {
        localStorage.setItem(CHAVE_AUDIO, JSON.stringify({
          idx: aulaIdx,
          vel: vel
        }));
      } catch (e) {}
    }

    function formatarTempo(s) {
      if (!s || isNaN(s)) return '0:00';
      var m = Math.floor(s / 60);
      var seg = Math.floor(s % 60);
      return m + ':' + (seg < 10 ? '0' : '') + seg;
    }

    function carregar(idx, darPlay) {
      if (idx < 0 || idx >= AULAS.length) return;
      var mudou = aulaIdx !== idx;
      aulaIdx = idx;
      guardarEstado();

      if (mudou || !audio.src) {
        audio.src = AULAS[idx].srcMp3;
        audio.playbackRate = vel;
        audio.load();
      }

      if (darPlay) {
        audio.play().then(function () {
          tocando = true;
          atualizarUI();
        }).catch(function () {
          /* reprodução bloqueada sem interação prévia */
          tocando = false;
          atualizarUI();
        });
      } else {
        atualizarUI();
      }
    }

    function alternar() {
      if (aulaIdx < 0) { carregar(0, true); return; }
      if (audio.paused) {
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    }

    function saltar(segundos) {
      if (!audio.duration) return;
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + segundos));
    }

    function definirVelocidade(v) {
      vel = v;
      audio.playbackRate = v;
      guardarEstado();
      atualizarUI();
    }

    function seek(pct) {
      if (!audio.duration) return;
      audio.currentTime = audio.duration * pct;
    }

    function atualizarUI() {
      /* 1. atualiza mini-barra inferior */
      if (barraAudioEl) {
        if (aulaIdx >= 0 && (tocando || telaAtual !== 'aulas')) {
          var a = AULAS[aulaIdx];
          barraAudioEl.style.display = 'flex';
          barraAudioEl.innerHTML = '';

          var info = el('div', 'audio-barra-info');
          info.appendChild(el('div', 'audio-barra-titulo', '🎧 ' + a.numero + ' · ' + a.titulo));
          info.appendChild(el('div', 'audio-barra-sub', a.duracaoTexto + ' · ' + formatarTempo(audio.currentTime) + ' / ' + formatarTempo(audio.duration)));
          barraAudioEl.appendChild(info);

          var ctrls = el('div', 'audio-barra-controles');
          var btnVoltar15 = el('button', 'btn mini', '-15s');
          btnVoltar15.addEventListener('click', function () { saltar(-15); });
          ctrls.appendChild(btnVoltar15);

          var btnPlay = el('button', 'btn mini' + (tocando ? ' quente' : ''), tocando ? '⏸ Pausa' : '▶ Ouvir');
          btnPlay.addEventListener('click', alternar);
          ctrls.appendChild(btnPlay);

          var btnAvancar15 = el('button', 'btn mini', '+15s');
          btnAvancar15.addEventListener('click', function () { saltar(15); });
          ctrls.appendChild(btnAvancar15);

          if (telaAtual !== 'aulas') {
            var btnAbrir = el('button', 'btn mini', 'Abrir leitor →');
            btnAbrir.addEventListener('click', aulas);
            ctrls.appendChild(btnAbrir);
          }

          barraAudioEl.appendChild(ctrls);
        } else if (aulaIdx < 0) {
          barraAudioEl.style.display = 'none';
        }
      }

      /* 2. atualiza leitor principal se estiver na tela de aulas */
      if (telaAtual === 'aulas') {
        renderizarPlayerAulas();
      }
    }

    function atualizarProgresso() {
      if (telaAtual === 'aulas') {
        var slider = document.getElementById('player-slider-input');
        var tempoAtualEl = document.getElementById('player-tempo-atual');
        var tempoFimEl = document.getElementById('player-tempo-fim');
        if (slider && !slider.matches(':active')) {
          slider.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        }
        if (tempoAtualEl) tempoAtualEl.textContent = formatarTempo(audio.currentTime);
        if (tempoFimEl) tempoFimEl.textContent = formatarTempo(audio.duration);
      }
      if (barraAudioEl && barraAudioEl.style.display !== 'none') {
        var sub = barraAudioEl.querySelector('.audio-barra-sub');
        if (sub && aulaIdx >= 0) {
          sub.textContent = AULAS[aulaIdx].duracaoTexto + ' · ' + formatarTempo(audio.currentTime) + ' / ' + formatarTempo(audio.duration);
        }
      }
    }

    return {
      carregar: carregar,
      alternar: alternar,
      saltar: saltar,
      definirVelocidade: definirVelocidade,
      seek: seek,
      formatarTempo: formatarTempo,
      estaTocando: function () { return tocando; },
      obterAulaIdx: function () { return aulaIdx; },
      obterVelocidade: function () { return vel; },
      obterAudio: function () { return audio; },
      atualizarUI: atualizarUI
    };
  })();

  /* ════════ utilidades ════════ */

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function baralhar(a) {
    var c = a.slice();
    for (var i = c.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = c[i]; c[i] = c[j]; c[j] = t;
    }
    return c;
  }

  function chipId(gid, rot, txt) { return 'par:' + gid + ':' + rot + ':' + txt; }

  /* ════════ o índice de todos os cartões ════════ */

  var INDICE = {};
  var IDS = { parear: {}, classificar: {}, literal: [] };

  BANCO.parear.forEach(function (g) {
    var ids = [];
    Object.keys(g.rotulos).forEach(function (rot) {
      g.rotulos[rot].forEach(function (txt) {
        var id = chipId(g.id, rot, txt);
        INDICE[id] = { tipo: 'parear', texto: txt, fonte: g.fonte, grupo: g.grupo, extra: 'Campo: ' + rot };
        ids.push(id);
      });
    });
    IDS.parear[g.id] = ids;
  });

  BANCO.classificar.forEach(function (s) {
    IDS.classificar[s.id] = [];
    s.fichas.forEach(function (f) {
      var col = null;
      s.colunas.forEach(function (c) { if (c.id === f.col) col = c.nome; });
      INDICE[f.id] = { tipo: 'classificar', texto: f.texto, fonte: s.fonte, grupo: s.grupo, extra: 'Coluna: ' + col };
      IDS.classificar[s.id].push(f.id);
    });
  });

  BANCO.literal.forEach(function (q) {
    INDICE[q.id] = { tipo: 'literal', texto: q.enunciado, fonte: q.fonte, grupo: q.grupo, extra: q.opcoes[q.certa], nota: q.nota };
    IDS.literal.push(q.id);
  });

  function todosOsIds() {
    var todos = [];
    Object.keys(IDS.parear).forEach(function (k) { todos = todos.concat(IDS.parear[k]); });
    Object.keys(IDS.classificar).forEach(function (k) { todos = todos.concat(IDS.classificar[k]); });
    return todos.concat(IDS.literal);
  }

  /* ════════ o progresso ════════ */

  var P = (function () {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; }
  })();

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(P)); } catch (e) { /* modo privado: joga-se sem memória */ }
  }

  function reg(id, acertou) {
    var r = P[id] || (P[id] = { v: 0, a: 0, e: 0, seg: 0, ultimo: 0 });
    r.ultimo = Date.now();
    if (acertou) {
      r.a++; r.seg++;
      if (r.seg >= 2 && r.v < 3) { r.v++; r.seg = 0; }
    } else {
      r.e++; r.seg = 0;
      if (r.v > 0) r.v--;
    }
    guardar();
    pintarStats();
    return r;
  }

  function nivelDe(id) { return P[id] ? P[id].v : 0; }

  function estaDevido(id) {
    var r = P[id];
    if (!r) return true;
    var intervalo = r.v < 2 ? H48 : D7;
    return (Date.now() - r.ultimo) >= intervalo;
  }

  function devidosDe(ids) { return ids.filter(estaDevido); }

  /* frágil = os erros passam os acertos (ou nunca acertou) */
  function fragil(id) {
    var r = P[id];
    return !!r && (r.e > r.a || r.a === 0);
  }

  function contarFragil(ids) { return ids.filter(fragil).length; }

  /* o estado de um grupo: acertos, erros, taxa e maestria média */
  function estadoGrupo(ids) {
    var a = 0, e = 0, soma = 0, jogados = 0;
    ids.forEach(function (id) {
      var r = P[id];
      if (!r) return;
      a += r.a; e += r.e; soma += r.v; jogados++;
    });
    return {
      a: a,
      e: e,
      taxa: (a + e) ? a / (a + e) : null,
      media: jogados ? soma / jogados : 0,
      jogados: jogados,
      total: ids.length
    };
  }

  function maestriaMedia(ids) {
    if (!ids.length) return 0;
    var s = 0;
    ids.forEach(function (id) { s += nivelDe(id); });
    return s / ids.length;
  }

  /* ════════ avisos ════════ */

  var avisoEl = null, avisoTimer = null;
  function aviso(txt, tipo) {
    if (!avisoEl) {
      avisoEl = el('div', 'aviso');
      document.body.appendChild(avisoEl);
    }
    avisoEl.textContent = txt;
    avisoEl.className = 'aviso ' + (tipo || 'neutro') + ' on';
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { avisoEl.className = 'aviso'; }, 2600);
  }

  /* ════════ cabeçalho de estatísticas ════════ */

  function diasParaProva() {
    var prova = new Date(2026, 10, 22, 8, 0, 0); /* 22/11/2026 */
    var agora = new Date();
    var diffMs = prova.getTime() - agora.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  function pintarStats() {
    var todos = todosOsIds();
    var devidos = devidosDe(todos).length;
    var fortes = todos.filter(function (id) { return nivelDe(id) >= 2; }).length;
    var dias = diasParaProva();

    statsEl.innerHTML = '';
    if (dias > 0) {
      statsEl.appendChild(el('span', 'stat tempo', '\u23F3 ' + dias + ' dias p/ a prova (22/11)'));
    }
    statsEl.appendChild(el('span', 'stat', 'cartões: ' + todos.length));
    statsEl.appendChild(el('span', 'stat' + (devidos ? ' quente' : ''), 'a rever: ' + devidos));
    statsEl.appendChild(el('span', 'stat', 'fixos ' + '\uD83D\uDD25\uD83D\uDC51' + ': ' + fortes));
  }

  /* ════════ ecrã inicial ════════ */

  function casa() {
    telaAtual = 'casa';
    sessao = null;
    pararChill();
    ecra.innerHTML = '';
    Player.atualizarUI();

    var todos = todosOsIds();
    var devidos = devidosDe(todos);

    var intro = el('section', 'cartao intro');
    intro.appendChild(el('h2', null, 'Escolhe a arma'));
    intro.appendChild(el('p', 'sub', 'Cada modo mata um mecanismo — não uma pergunta. O erro volta a aparecer até deixar de ser erro.'));

    /* Fila do dia */
    var fila = el('button', 'btn grande' + (devidos.length ? '' : ' frio'));
    fila.innerHTML = '<strong>Fila do dia</strong><span>' +
      (devidos.length ? devidos.length + ' cartão(ões) vencido(s) — 48 h / 7 dias' : 'nada vencido: escolhe um treino livre') + '</span>';
    fila.addEventListener('click', function () {
      if (!devidos.length) { aviso('Nada vencido. Treino livre serve.', 'neutro'); return; }
      arrancar(filaDoDia(), 'Fila do dia');
    });
    intro.appendChild(fila);

    /* As Aulas Faladas */
    var aulasBotao = el('button', 'btn grande ouro');
    aulasBotao.innerHTML = '<strong>\uD83C\uDFA7 As Aulas Faladas (5 aulas · 40 min)</strong><span>Fundamentos, LDB, ECA, Arte e História da Arte narradas para o ouvido — com reprodutor integrado</span>';
    aulasBotao.addEventListener('click', aulas);
    intro.appendChild(aulasBotao);

    /* O meu mapa */
    var mapaBotao = el('button', 'btn grande');
    mapaBotao.innerHTML = '<strong>O meu mapa</strong><span>os ' + todosOsIds().length + ' cartões pelo grau de maestria — o que já está na mão e o que ainda é 🌱</span>';
    mapaBotao.addEventListener('click', mapa);
    intro.appendChild(mapaBotao);

    /* Os frágeis */
    var fragilTotal = contarFragil(todos);
    var fragilBotao = el('button', 'btn grande' + (fragilTotal ? '' : ' frio'));
    fragilBotao.innerHTML = '<strong>Os frágeis' + (fragilTotal ? ' (' + fragilTotal + ')' : '') + '</strong><span>' +
      (fragilTotal ? 'só os cartões onde os erros passam os acertos — a ferida, não o mapa' : 'nenhum cartão frágil: joga primeiro e volta aqui') + '</span>';
    fragilBotao.addEventListener('click', function () {
      if (!fragilTotal) { aviso('Sem cartões frágeis. Treino livre serve.', 'neutro'); return; }
      arrancar(comporSessao(fragil), 'Os frágeis');
    });
    intro.appendChild(fragilBotao);

    var livreTit = el('h3', 'separador', 'Treino livre');
    intro.appendChild(livreTit);

    var grelha = el('div', 'modos');

    /* parear */
    var m1 = el('button', 'modo');
    m1.appendChild(el('span', 'modo-icone', '\uD83E\uDDE9'));
    m1.appendChild(el('strong', null, 'Par: Campo → Elementos'));
    m1.appendChild(el('span', 'modo-desc', 'Dança (6 campos) e Laban (4 fatores). Arrasta por toque: escolhe o elemento, depois o campo.'));
    m1.appendChild(barraMaestria(Object.keys(IDS.parear).reduce(function (a, k) { return a.concat(IDS.parear[k]); }, [])));
    m1.addEventListener('click', function () { treino('parear'); });
    grelha.appendChild(m1);

    /* classificar */
    var m2 = el('button', 'modo');
    m2.appendChild(el('span', 'modo-icone', '\uD83D\uDDC2\uFE0F'));
    m2.appendChild(el('strong', null, 'Colunas: sentir × julgar'));
    m2.appendChild(el('span', 'modo-desc', 'Estética × Crítica, as quatro gavetas do século e o verbo do enunciado.'));
    m2.appendChild(barraMaestria(Object.keys(IDS.classificar).reduce(function (a, k) { return a.concat(IDS.classificar[k]); }, [])));
    m2.addEventListener('click', function () { treino('classificar'); });
    grelha.appendChild(m2);

    /* literal */
    var m3 = el('button', 'modo');
    m3.appendChild(el('span', 'modo-icone', '\uD83D\uDCDC'));
    m3.appendChild(el('strong', null, 'A Palavra Literal'));
    m3.appendChild(el('span', 'modo-desc', 'A frase da ficha contra o distrator que já te enganou. ' + IDS.literal.length + ' armadilhas do Caderno.'));
    m3.appendChild(barraMaestria(IDS.literal));
    m3.addEventListener('click', function () { treino('literal'); });
    grelha.appendChild(m3);

    intro.appendChild(grelha);
    ecra.appendChild(intro);

    var pe = el('section', 'cartao pe');
    pe.appendChild(el('p', 'sub', 'Prova: 22/11/2026 · 8h — Escola Municipal Frei Valentim. Corte: 10/14.'));
    var limpar = el('button', 'btn mini', 'apagar o progresso');
    limpar.addEventListener('click', function () {
      if (confirm('Apagar toda a maestria guardada neste navegador?')) {
        P = {}; guardar(); pintarStats(); casa();
      }
    });
    pe.appendChild(limpar);
    ecra.appendChild(pe);

    pintarStats();
  }

  function barraMaestria(ids) {
    var media = maestriaMedia(ids);
    var caixa = el('span', 'maestria');
    var cheio = el('span', 'maestria-cheia');
    cheio.style.width = Math.round((media / 3) * 100) + '%';
    caixa.appendChild(cheio);
    var n = document.createElement('span');
    n.className = 'maestria-num';
    n.textContent = ICONE[Math.min(3, Math.floor(media))] + ' ' + media.toFixed(1);
    caixa.appendChild(n);
    return caixa;
  }

  /* ════════ ecrã das aulas faladas ════════ */

  function aulas() {
    telaAtual = 'aulas';
    sessao = null;
    pararChill();
    ecra.innerHTML = '';

    if (Player.obterAulaIdx() < 0) {
      Player.carregar(0, false);
    }

    var cab = el('div', 'cab');
    var voltar = el('button', 'btn mini', '← voltar');
    voltar.addEventListener('click', casa);
    cab.appendChild(voltar);
    cab.appendChild(el('span', 'cab-titulo', 'As Aulas Faladas · O Caderno em Voz'));
    ecra.appendChild(cab);

    var intro = el('section', 'cartao');
    intro.appendChild(el('h2', null, '\uD83C\uDFA7 O Caderno para o Ouvido'));
    intro.appendChild(el('p', 'sub', 'Cinco aulas faladas (40 min no total) escritas sem listas nem páginas — explicam os eixos mais cobrados da prova de Arte de Itapoá.'));
    ecra.appendChild(intro);

    /* caixa do player interativo */
    var playerCaixa = el('section', 'player-cartao');
    playerCaixa.id = 'player-caixa-container';
    ecra.appendChild(playerCaixa);

    /* lista das aulas */
    var listaSec = el('section', 'cartao');
    listaSec.appendChild(el('h3', null, 'As 5 Aulas + Abertura'));
    listaSec.appendChild(el('p', 'sub', 'Toca numa aula para ouvir. A reprodução continua em segundo plano enquanto navegas pelo caderno.'));

    var lista = el('div', 'aulas-lista');
    AULAS.forEach(function (a, idx) {
      var card = el('div', 'aula-item');
      card.id = 'aula-card-' + idx;

      var topo = el('div', 'aula-item-cab');
      var badge = el('div', 'aula-num-badge', a.numero);
      topo.appendChild(badge);

      var info = el('div', 'aula-item-info');
      info.appendChild(el('div', 'aula-item-titulo', a.titulo));
      info.appendChild(el('div', 'aula-item-sub', a.subtitulo));

      var acoes = el('div', 'aula-item-acoes');
      var btnTocar = el('button', 'btn mini', '▶ Ouvir aula (' + a.duracaoTexto + ')');
      btnTocar.addEventListener('click', function () {
        Player.carregar(idx, true);
      });
      acoes.appendChild(btnTocar);

      info.appendChild(acoes);

      /* tópicos essenciais */
      var ul = el('ul', 'aula-topicos');
      a.topicos.forEach(function (t) {
        ul.appendChild(el('li', null, t));
      });
      info.appendChild(ul);

      topo.appendChild(info);
      card.appendChild(topo);
      lista.appendChild(card);
    });

    listaSec.appendChild(lista);
    ecra.appendChild(listaSec);

    renderizarPlayerAulas();
    pintarStats();
  }

  function renderizarPlayerAulas() {
    var container = document.getElementById('player-caixa-container');
    if (!container) return;
    container.innerHTML = '';

    var idx = Player.obterAulaIdx();
    if (idx < 0) idx = 0;
    var a = AULAS[idx];
    var audio = Player.obterAudio();
    var tocando = Player.estaTocando();
    var vel = Player.obterVelocidade();

    /* topo */
    var topo = el('div', 'player-topo');
    topo.appendChild(el('span', 'player-tag', 'Aula ' + a.numero));
    topo.appendChild(el('span', 'player-duracao', a.duracaoTexto));
    container.appendChild(topo);

    container.appendChild(el('div', 'player-titulo', a.titulo));
    container.appendChild(el('div', 'player-sub', a.subtitulo));

    /* barra de progresso / scrubber */
    var barraProgresso = el('div', 'player-progresso-caixa');
    var tempoAtual = el('span', 'player-tempo', Player.formatarTempo(audio.currentTime));
    tempoAtual.id = 'player-tempo-atual';
    barraProgresso.appendChild(tempoAtual);

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'player-slider-input';
    slider.className = 'player-slider';
    slider.min = '0';
    slider.max = '100';
    slider.step = '0.1';
    slider.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    slider.addEventListener('input', function () {
      Player.seek(parseFloat(slider.value) / 100);
    });
    barraProgresso.appendChild(slider);

    var tempoFim = el('span', 'player-tempo fim', Player.formatarTempo(audio.duration));
    tempoFim.id = 'player-tempo-fim';
    barraProgresso.appendChild(tempoFim);

    container.appendChild(barraProgresso);

    /* controles */
    var controles = el('div', 'player-controles');

    var btnVoltar = el('button', 'btn-ctrl', '⏮');
    btnVoltar.title = 'Aula anterior';
    btnVoltar.addEventListener('click', function () {
      if (idx > 0) Player.carregar(idx - 1, true);
    });
    controles.appendChild(btnVoltar);

    var btnMenos15 = el('button', 'btn-ctrl', '-15s');
    btnMenos15.title = 'Retroceder 15 segundos';
    btnMenos15.addEventListener('click', function () { Player.saltar(-15); });
    controles.appendChild(btnMenos15);

    var btnPlay = el('button', 'btn-ctrl play', tocando ? '⏸' : '▶');
    btnPlay.title = tocando ? 'Pausar' : 'Reproduzir';
    btnPlay.addEventListener('click', Player.alternar);
    controles.appendChild(btnPlay);

    var btnMais15 = el('button', 'btn-ctrl', '+15s');
    btnMais15.title = 'Avançar 15 segundos';
    btnMais15.addEventListener('click', function () { Player.saltar(15); });
    controles.appendChild(btnMais15);

    var btnAvancar = el('button', 'btn-ctrl', '⏭');
    btnAvancar.title = 'Próxima aula';
    btnAvancar.addEventListener('click', function () {
      if (idx + 1 < AULAS.length) Player.carregar(idx + 1, true);
    });
    controles.appendChild(btnAvancar);

    container.appendChild(controles);

    /* velocidades */
    var velocidades = el('div', 'player-velocidades');
    velocidades.appendChild(el('span', 'miudo', 'Velocidade: '));
    [1.0, 1.25, 1.5, 1.75, 2.0].forEach(function (v) {
      var b = el('button', 'btn-vel' + (Math.abs(vel - v) < 0.05 ? ' ativo' : ''), v.toFixed(2).replace('.00', '').replace('0', '') + 'x');
      b.addEventListener('click', function () {
        Player.definirVelocidade(v);
      });
      velocidades.appendChild(b);
    });
    container.appendChild(velocidades);

    /* destacar o card ativo na lista */
    AULAS.forEach(function (_, i) {
      var c = document.getElementById('aula-card-' + i);
      if (c) {
        if (i === idx) c.classList.add('tocando');
        else c.classList.remove('tocando');
      }
    });
  }

  /* ════════ o mapa — maestria, ranking e import/export ════════ */

  function resumoNiveis(ids) {
    var r = { nunca: 0, nv: [0, 0, 0, 0] };
    ids.forEach(function (id) {
      var rec = P[id];
      if (!rec) r.nunca++;
      else r.nv[rec.v] = (r.nv[rec.v] || 0) + 1;
    });
    return r;
  }

  function gruposDoMapa() {
    var g = [];
    BANCO.parear.forEach(function (gr) {
      var itens = [];
      Object.keys(gr.rotulos).forEach(function (rot) {
        gr.rotulos[rot].forEach(function (txt) {
          itens.push({ id: chipId(gr.id, rot, txt), texto: txt, nota: 'Campo: ' + rot });
        });
      });
      g.push({ nome: gr.grupo, fonte: gr.fonte, itens: itens });
    });
    BANCO.classificar.forEach(function (s) {
      var nomes = {};
      s.colunas.forEach(function (c) { nomes[c.id] = c.nome; });
      g.push({
        nome: s.grupo,
        fonte: s.fonte,
        itens: s.fichas.map(function (f) {
          return { id: f.id, texto: f.texto, nota: nomes[f.col] || '' };
        })
      });
    });
    g.push({
      nome: 'A Palavra Literal',
      fonte: 'LDB · ECA · Proposta de Itapoá · Arte',
      itens: BANCO.literal.map(function (q) {
        var resposta = q.opcoes[q.certa];
        var curto = resposta.length > 52 ? resposta.slice(0, 52).replace(/[,;\s]+\S*$/, '') + '…' : resposta;
        return { id: q.id, texto: curto, nota: q.grupo + ' · ' + q.fonte };
      })
    });
    return g;
  }

  /* ─────────── histórico, mecanismos e idade dos cartões ─────────── */

  var CHAVE_HIST = 'raven_estudo_act_hist_v1';

  function historicoLer() {
    try {
      var h = JSON.parse(localStorage.getItem(CHAVE_HIST) || '[]');
      return Object.prototype.toString.call(h) === '[object Array]' ? h : [];
    } catch (e) { return []; }
  }

  /* Um snapshot por dia: acertos, erros, cartões jogados e maestria média.
     É este ficheiro, e não a memória, que permite dizer «há 7 dias → hoje». */
  function registarHistorico() {
    var h = historicoLer();
    var ids = todosOsIds();
    var a = 0, e = 0, jog = 0, soma = 0;
    ids.forEach(function (id) {
      var r = P[id];
      if (!r) return;
      a += r.a; e += r.e; soma += r.v; jog++;
    });
    var d = new Date();
    var chave = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var snap = { d: chave, a: a, e: e, jog: jog, total: ids.length, v: jog ? Math.round(100 * soma / jog) / 100 : 0 };
    var achou = false;
    for (var i = 0; i < h.length; i++) if (h[i].d === chave) { h[i] = snap; achou = true; break; }
    if (!achou) h.push(snap);
    h.sort(function (x, y) { return x.d < y.d ? -1 : x.d > y.d ? 1 : 0; });
    h = h.slice(-60);
    try { localStorage.setItem(CHAVE_HIST, JSON.stringify(h)); } catch (err) {}
    return h;
  }

  /* Há quantos dias o cartão não é tocado (usa o `ultimo` que o save já guardava). */
  function diasParado(ms) {
    if (!ms) return null;
    var d = Math.floor((Date.now() - ms) / 86400000);
    return d < 0 ? 0 : d;
  }

  var MECANISMOS = [
    { n: 1, nome: 'Sujeito e âncora' },
    { n: 2, nome: 'Inversão de sinal' },
    { n: 3, nome: 'Eixo dos séculos' },
    { n: 4, nome: 'Palavra literal' },
    { n: 5, nome: 'Taxonomia' },
    { n: 6, nome: 'Verbo do enunciado' },
    { n: 7, nome: 'Estética × Crítica' }
  ];

  /* A matéria diz o que se estudou; o mecanismo diz como se erra. O mapa por
     grupo vem do Caderno, e os casos ambíguos são fixados por id. */
  var MEC_POR_GRUPO = {
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
    'Teatro': 4,
    'História da Arte': 3
  };

  var MEC_POR_ID = {
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
    'lit-art-492-outros': 5
  };

  function mecanismoDe(id) {
    if (MEC_POR_ID[id]) return MEC_POR_ID[id];
    var it = INDICE[id];
    return (it && MEC_POR_GRUPO[it.grupo]) || 4;
  }

  function mapa() {
    telaAtual = 'mapa';
    sessao = null;
    ecra.innerHTML = '';
    Player.atualizarUI();

    var cab = el('div', 'cab');
    var voltar = el('button', 'btn mini', '← voltar');
    voltar.addEventListener('click', casa);
    cab.appendChild(voltar);
    cab.appendChild(el('span', 'cab-titulo', 'O meu mapa'));
    var btnSom = el('button', 'btn mini', chill.ligado ? 'som: ligado' : 'som: desligado');
    btnSom.title = 'ambiente de estudo — só neste mapa';
    btnSom.addEventListener('click', function () {
      chill.ligado = !chill.ligado;
      guardarChill();
      if (chill.ligado) ligarChill(); else pararChill(true);
      btnSom.textContent = chill.ligado ? 'som: ligado' : 'som: desligado';
    });
    cab.appendChild(btnSom);
    ecra.appendChild(cab);

    var todos = todosOsIds();
    var r = resumoNiveis(todos);

    var topo = el('section', 'cartao');
    topo.appendChild(el('h2', null, 'Onde está a tua mão'));
    topo.appendChild(el('p', 'sub', 'a maestria sobe com dois acertos seguidos e desce um grau com um erro'));

    var numeros = el('div', 'mapa-numeros');
    [['\uD83D\uDC51', 'assinatura', r.nv[3]],
     ['\uD83D\uDD25', 'hábito', r.nv[2]],
     ['\u26A1', 'praticado', r.nv[1]],
     ['\uD83C\uDF31', 'hesitante', r.nv[0]],
     ['\u00B7', 'nunca jogado', r.nunca]].forEach(function (par) {
      var c = el('div', 'mapa-num');
      c.appendChild(el('span', 'mapa-icone', par[0]));
      c.appendChild(el('strong', null, String(par[2])));
      c.appendChild(el('span', 'mapa-rotulo', par[1]));
      numeros.appendChild(c);
    });
    topo.appendChild(numeros);

    var acoes = el('div', 'acoes');

    /* copiar save */
    var copiar = el('button', 'btn mini', 'copiar o save (JSON)');
    copiar.addEventListener('click', function () {
      var json = JSON.stringify(P, null, 1);
      var cxExistente = topo.querySelector('.save-caixa');
      if (cxExistente) cxExistente.remove();
      var area = el('textarea', 'save-caixa');
      area.readOnly = true;
      area.value = json;
      topo.appendChild(area);
      area.focus();
      area.select();
      try {
        if (navigator.clipboard) navigator.clipboard.writeText(json);
        aviso('Save copiado (' + Object.keys(P).length + ' cartões com registo).', 'neutro');
      } catch (e) {
        aviso('Selecionado — Ctrl+C para copiar.', 'neutro');
      }
    });
    acoes.appendChild(copiar);

    /* importar save */
    var importar = el('button', 'btn mini', 'importar save (JSON)');
    importar.addEventListener('click', function () {
      var blocoExistente = topo.querySelector('.import-bloco');
      if (blocoExistente) { blocoExistente.remove(); return; }

      var bloco = el('div', 'import-bloco');
      bloco.appendChild(el('p', 'sub', 'Cola aqui o conteúdo do teu save em JSON e clica em restaurar:'));
      var txtArea = el('textarea');
      txtArea.placeholder = '{"par:danca:...": { "v": 2, "a": 3, "e": 0 }}';
      bloco.appendChild(txtArea);

      var bts = el('div', 'import-botoes');
      var btnCancelar = el('button', 'btn mini', 'cancelar');
      btnCancelar.addEventListener('click', function () { bloco.remove(); });
      bts.appendChild(btnCancelar);

      var btnRestaurar = el('button', 'btn mini', 'restaurar progresso');
      btnRestaurar.addEventListener('click', function () {
        try {
          var val = txtArea.value.trim();
          if (!val) { aviso('Cola o texto JSON primeiro.', 'erro'); return; }
          var dados = JSON.parse(val);
          if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
            throw new Error('Formato inválido');
          }
          P = dados;
          guardar();
          pintarStats();
          aviso('Progresso restaurado com sucesso!', 'neutro');
          mapa();
        } catch (err) {
          aviso('JSON inválido ou corrompido.', 'erro');
        }
      });
      bts.appendChild(btnRestaurar);
      bloco.appendChild(bts);

      topo.appendChild(bloco);
      txtArea.focus();
    });
    acoes.appendChild(importar);

    topo.appendChild(acoes);
    ecra.appendChild(topo);

    /* ── os sete mecanismos ── */
    var secMec = el('section', 'cartao');
    secMec.appendChild(el('h2', null, 'Os sete mecanismos'));
    secMec.appendChild(el('p', 'sub', 'a matéria diz o que estudaste; o mecanismo diz como erras — a taxa de cada um, com os cartões que o treinam'));
    var grade = el('div', 'mecanismos');
    var porMec = {};
    MECANISMOS.forEach(function (m) { porMec[m.n] = []; });
    todos.forEach(function (id) { porMec[mecanismoDe(id)].push(id); });
    MECANISMOS.forEach(function (m) {
      var est = estadoGrupo(porMec[m.n]);
      var cls = 'mec';
      if (est.taxa !== null && est.taxa < 0.70) cls += ' mec-fraco';
      else if (est.taxa !== null && est.taxa > 0.88) cls += ' mec-forte';
      var c = el('div', cls);
      c.appendChild(el('span', 'mec-nome', m.n + '. ' + m.nome));
      c.appendChild(el('span', 'mec-taxa', est.taxa === null ? '—' : Math.round(est.taxa * 100) + '%'));
      c.appendChild(el('span', 'mec-conta', est.a + '✓ ' + est.e + '✗ · ' + est.jogados + '/' + est.total + ' cartões'));
      grade.appendChild(c);
    });
    secMec.appendChild(grade);
    ecra.appendChild(secMec);

    /* ── a evolução ── */
    var hist = registarHistorico();
    var secHist = el('section', 'cartao');
    secHist.appendChild(el('h2', null, 'A tua evolução'));
    if (hist.length < 2) {
      secHist.appendChild(el('p', 'sub', 'o histórico começa hoje. A partir de amanhã, cada abertura do mapa acrescenta um dia a esta linha.'));
    } else {
      var ini = hist[0], fimS = hist[hist.length - 1];
      var tIni = (ini.a + ini.e) ? Math.round(100 * ini.a / (ini.a + ini.e)) : 0;
      var tFim = (fimS.a + fimS.e) ? Math.round(100 * fimS.a / (fimS.a + fimS.e)) : 0;
      var delta = tFim - tIni;
      secHist.appendChild(el('p', 'sub',
        'de ' + ini.d + ' (' + tIni + '%) a ' + fimS.d + ' (' + tFim + '%) — ' +
        (delta >= 0 ? '+' : '') + delta + ' pontos · média ' + fimS.v.toFixed(2) + '/3'));
      var caixa = el('div', 'hist');
      var ultimos = hist.slice(-14);
      ultimos.forEach(function (s, i) {
        var t = (s.a + s.e) ? 100 * s.a / (s.a + s.e) : 0;
        var col = el('div', 'hist-dia');
        var bar = el('div', 'hist-barra' + (i === ultimos.length - 1 ? ' hoje' : ''));
        bar.style.height = Math.max(3, Math.min(100, t)) + '%';
        bar.title = s.d + ' · ' + Math.round(t) + '% · ' + s.jog + '/' + s.total + ' cartões · média ' + s.v.toFixed(2);
        col.appendChild(bar);
        col.appendChild(el('span', 'hist-rot', s.d.slice(5)));
        caixa.appendChild(col);
      });
      secHist.appendChild(caixa);
    }
    ecra.appendChild(secHist);

    var grupos = gruposDoMapa();
    grupos.forEach(function (g) {
      g.ids = g.itens.map(function (i) { return i.id; });
      g.estado = estadoGrupo(g.ids);
    });

    /* ranking */
    var ranking = el('section', 'cartao');
    ranking.appendChild(el('h2', null, 'O ranking'));
    ranking.appendChild(el('p', 'sub', 'do mais frágil ao mais firme pela maestria média dos cartões já jogados · a taxa conta tentativas, não sessões'));

    var tabela = el('table', 'ranking');
    var cabecalho = el('thead');
    var linhaCab = el('tr');
    ['#', 'grupo', 'acerto', 'certo / errado', 'maestria (jogados)'].forEach(function (t) {
      linhaCab.appendChild(el('th', null, t));
    });
    cabecalho.appendChild(linhaCab);
    tabela.appendChild(cabecalho);

    var corpo = el('tbody');
    grupos.slice().sort(function (a, b) {
      var ma = a.estado.jogados ? a.estado.media : 9;
      var mb = b.estado.jogados ? b.estado.media : 9;
      if (ma !== mb) return ma - mb;
      var ta = a.estado.taxa === null ? 2 : a.estado.taxa;
      var tb = b.estado.taxa === null ? 2 : b.estado.taxa;
      return ta - tb;
    }).forEach(function (g, i) {
      var linha = el('tr');
      linha.appendChild(el('td', 'pos', String(i + 1)));
      linha.appendChild(el('td', null, g.nome));
      linha.appendChild(el('td', 'taxa', g.estado.taxa === null ? '—' : Math.round(g.estado.taxa * 100) + '%'));
      linha.appendChild(el('td', 'miudo', g.estado.a + '✓ / ' + g.estado.e + '✗'));
      var celulaM = el('td');
      celulaM.appendChild(document.createTextNode(g.estado.jogados
        ? ICONE[Math.min(3, Math.floor(g.estado.media))] + ' ' + g.estado.media.toFixed(1) + ' '
        : '— '));
      celulaM.appendChild(el('span', 'miudo', '(' + g.estado.jogados + '/' + g.estado.total + ')'));
      linha.appendChild(celulaM);
      corpo.appendChild(linha);
    });
    tabela.appendChild(corpo);
    ranking.appendChild(tabela);
    ecra.appendChild(ranking);

    grupos.forEach(function (g) {
      var sec = el('section', 'cartao grupo-mapa');
      var ids = g.ids;
      var rg = resumoNiveis(ids);
      var cabec = el('div', 'grupo-cab');
      cabec.appendChild(el('h3', null, g.nome));
      cabec.appendChild(el('span', 'grupo-conta',
        (g.estado.taxa === null ? 'sem dados' : Math.round(g.estado.taxa * 100) + '% · ' + g.estado.jogados + '/' + g.estado.total) +
        '  \uD83D\uDC51' + rg.nv[3] + ' \uD83D\uDD25' + rg.nv[2] + ' \u26A1' + rg.nv[1] + ' \uD83C\uDF31' + rg.nv[0]));
      sec.appendChild(cabec);
      sec.appendChild(el('p', 'fonte', g.fonte));

      var lista = el('div', 'pilulas');
      g.itens.forEach(function (it) {
        var rec = P[it.id];
        var nivel = rec ? rec.v : -1;
        var parado = rec ? diasParado(rec.ultimo) : null;
        var p = el('span', 'pilula ' + (nivel < 0 ? 'nv-nunca' : 'nv' + nivel));
        p.title = it.nota + (rec ? ' · ' + rec.a + '✓ / ' + rec.e + '✗' +
          (parado !== null ? ' · parado há ' + parado + ' dia(s)' : '') : ' · ainda não jogado');
        p.appendChild(el('span', 'pilula-icone', nivel < 0 ? '\u00B7' : ICONE[nivel]));
        p.appendChild(document.createTextNode(' ' + it.texto));
        if (rec) {
          p.appendChild(el('span', 'pilula-conta', ' ' + rec.a + '✓' + (rec.e ? '/' + rec.e + '✗' : '')));
          if (parado !== null && parado >= 3) {
            p.appendChild(el('span', 'pilula-conta pilula-parado', ' · ' + parado + 'd'));
          }
        }
        lista.appendChild(p);
      });
      sec.appendChild(lista);
      ecra.appendChild(sec);
    });

    ligarChill();
    pintarStats();
  }

  /* ════════ a sessão ════════ */

  function arrancar(rodadas, titulo) {
    if (!rodadas || !rodadas.length) { aviso('Nada vencido. Escolhe um treino livre.', 'neutro'); return; }
    pararChill(true);
    sessao = { rodadas: rodadas, i: -1, acertos: 0, erros: 0, falhas: [], titulo: titulo };
    proximaRodada();
  }

  function proximaRodada() {
    if (!sessao) return;
    sessao.i++;
    if (sessao.i >= sessao.rodadas.length) { fim(); return; }
    telaAtual = 'rodada';
    ecra.innerHTML = '';
    Player.atualizarUI();

    var cab = el('div', 'cab');
    var sair = el('button', 'btn mini', '← sair');
    sair.addEventListener('click', casa);
    cab.appendChild(sair);
    cab.appendChild(el('span', 'cab-titulo', sessao.titulo));
    var marcas = el('span', 'cab-marcas');
    for (var k = 0; k < sessao.rodadas.length; k++) {
      marcas.appendChild(el('i', 'marca' + (k < sessao.i ? ' feita' : k === sessao.i ? ' viva' : '')));
    }
    cab.appendChild(marcas);
    ecra.appendChild(cab);

    var alvo = el('div', 'rodada');
    ecra.appendChild(alvo);
    sessao.rodadas[sessao.i](alvo, api);
  }

  var api = {
    registar: function (id, acertou) {
      var r = reg(id, acertou);
      if (acertou) sessao.acertos++;
      else { sessao.erros++; if (sessao.falhas.indexOf(id) < 0) sessao.falhas.push(id); }
      return r;
    },
    terminar: function () { setTimeout(function () { if (sessao) proximaRodada(); }, 420); }
  };

  /* ════════ MODO 1 · par: campo → elementos ════════ */

  function rodadaParear(alvo, api, grupo, filtro) {
    var todosCampos = Object.keys(grupo.rotulos);

    function contaAlvo(rot) {
      return grupo.rotulos[rot].filter(function (t) { return filtro(chipId(grupo.id, rot, t)); }).length;
    }

    var escolhidos;
    if (filtro) {
      escolhidos = todosCampos.filter(function (rot) { return contaAlvo(rot) > 0; })
        .sort(function (a, b) { return contaAlvo(b) - contaAlvo(a); })
        .slice(0, grupo.tamanho || 3);
      todosCampos.forEach(function (rot) {
        if (escolhidos.length < 2 && escolhidos.indexOf(rot) < 0) escolhidos.push(rot);
      });
    } else {
      escolhidos = baralhar(todosCampos).slice(0, grupo.tamanho || 3);
    }

    var fichas = [];
    escolhidos.forEach(function (rot) {
      grupo.rotulos[rot].forEach(function (txt) {
        var id = chipId(grupo.id, rot, txt);
        fichas.push({ id: id, txt: txt, rot: rot, erros: 0, aval: !filtro || filtro(id) });
      });
    });
    fichas = baralhar(fichas);
    var nAval = fichas.filter(function (f) { return f.aval; }).length;

    alvo.appendChild(el('h2', null, grupo.grupo));
    alvo.appendChild(el('p', 'fonte', grupo.fonte + (filtro
      ? ' · só ' + nAval + ' ficha(s) contam para a maestria'
      : ' · cada elemento pertence a um só campo')));

    var poco = el('div', 'poco');
    var caixas = el('div', 'caixas');
    var selecionado = null;
    var restantes = fichas.length;

    var mapaCaixas = {};
    var postasDe = {};

    function fixar(f, caixa, postas, acertou) {
      caixa.classList.remove('erro');
      postas.appendChild(selecionado.botao);
      selecionado.botao.classList.remove('sel');
      selecionado.botao.classList.add('posto');
      selecionado.botao.disabled = true;
      selecionado = null;
      if (acertou && f.aval) api.registar(f.id, true);
      restantes--;
      if (restantes === 0) {
        alvo.querySelectorAll('.caixa').forEach(function (c) { c.classList.add('cheia'); });
        api.terminar();
      }
    }

    escolhidos.forEach(function (rot) {
      var caixa = el('div', 'caixa');
      caixa.appendChild(el('h3', null, rot));
      var postas = el('div', 'postas');
      caixa.appendChild(postas);
      mapaCaixas[rot] = caixa;
      postasDe[rot] = postas;

      caixa.addEventListener('click', function () {
        if (!selecionado) { aviso('Escolhe primeiro um elemento.', 'neutro'); return; }
        var f = selecionado.dados;

        if (f.rot === rot) { fixar(f, caixa, postas, true); return; }

        caixa.classList.add('erro');
        setTimeout(function () { caixa.classList.remove('erro'); }, 420);
        f.erros++;
        if (f.aval) api.registar(f.id, false);

        if (f.erros >= 2) {
          aviso('«' + f.txt + '» pertence a «' + f.rot + '».', 'erro');
          fixar(f, mapaCaixas[f.rot], postasDe[f.rot], false);
        } else {
          aviso('Não é aqui. Pensa no que o movimento faz.', 'erro');
        }
      });
      caixas.appendChild(caixa);
    });

    fichas.forEach(function (f) {
      var b = el('button', 'ficha', f.txt);
      b.addEventListener('click', function () {
        if (selecionado) selecionado.botao.classList.remove('sel');
        if (selecionado && selecionado.dados === f) {
          selecionado = null;
          b.classList.remove('sel');
          return;
        }
        selecionado = { botao: b, dados: f };
        b.classList.add('sel');
      });
      poco.appendChild(b);
    });

    alvo.appendChild(poco);
    alvo.appendChild(caixas);
  }

  /* ════════ MODO 2 · colunas ════════ */

  function rodadaClassificar(alvo, api, set, filtro) {
    var quantos = set.quantos || 10;
    var nomeDe = {};
    set.colunas.forEach(function (c) { nomeDe[c.id] = c.nome; });

    var escolhidas;
    if (filtro) {
      escolhidas = set.fichas.filter(function (f) { return filtro(f.id); });
      var vazias = set.colunas.filter(function (c) {
        return !escolhidas.some(function (f) { return f.col === c.id; });
      });
      escolhidas = escolhidas.slice(0, Math.max(1, quantos - vazias.length));
      vazias.forEach(function (c) {
        var ancora = set.fichas.filter(function (f) { return f.col === c.id; })[0];
        if (ancora) escolhidas = escolhidas.concat([ancora]);
      });
    } else {
      var ordenadas = baralhar(set.fichas);
      var porCol = {};
      set.colunas.forEach(function (c) { porCol[c.id] = []; });
      ordenadas.forEach(function (f) { if (porCol[f.col]) porCol[f.col].push(f); });

      escolhidas = [];
      set.colunas.forEach(function (c) {
        escolhidas = escolhidas.concat(porCol[c.id].slice(0, 2));
      });
      var resto = ordenadas.filter(function (f) { return escolhidas.indexOf(f) < 0; });
      escolhidas = escolhidas.concat(resto.slice(0, Math.max(0, quantos - escolhidas.length)));
    }
    escolhidas = baralhar(escolhidas);

    var avaliavel = {};
    escolhidas.forEach(function (f) { avaliavel[f.id] = !filtro || filtro(f.id); });
    var nAval = escolhidas.filter(function (f) { return avaliavel[f.id]; }).length;

    alvo.appendChild(el('h2', null, set.grupo));
    alvo.appendChild(el('p', 'fonte', set.fonte + (filtro
      ? ' · só ' + nAval + ' ficha(s) contam para a maestria'
      : ' · escolhe a ficha, depois a coluna')));

    var poco = el('div', 'poco');
    var colunas = el('div', 'colunas');
    colunas.style.setProperty('--n', set.colunas.length);

    var selecionado = null;
    var restantes = escolhidas.length;
    var errosDe = {};
    var mapaCols = {};
    var depositos = {};

    function fixar(f, coluna, deposito, acertou) {
      coluna.classList.remove('erro');
      deposito.appendChild(selecionado.botao);
      selecionado.botao.classList.remove('sel');
      selecionado.botao.classList.add('posto');
      selecionado.botao.disabled = true;
      selecionado = null;
      if (acertou && avaliavel[f.id]) api.registar(f.id, true);
      restantes--;
      if (restantes === 0) {
        colunas.querySelectorAll('.coluna').forEach(function (x) { x.classList.add('cheia'); });
        api.terminar();
      }
    }

    set.colunas.forEach(function (c) {
      var col = el('div', 'coluna');
      col.appendChild(el('h3', null, c.nome));
      var deposito = el('div', 'deposito');
      col.appendChild(deposito);
      mapaCols[c.id] = col;
      depositos[c.id] = deposito;

      col.addEventListener('click', function () {
        if (!selecionado) { aviso('Escolhe primeiro uma ficha.', 'neutro'); return; }
        var f = selecionado.dados;

        if (f.col === c.id) { fixar(f, col, deposito, true); return; }

        col.classList.add('erro');
        setTimeout(function () { col.classList.remove('erro'); }, 420);
        errosDe[f.id] = (errosDe[f.id] || 0) + 1;
        if (avaliavel[f.id]) api.registar(f.id, false);

        if (errosDe[f.id] >= 2) {
          aviso('«' + f.texto + '» vai para «' + nomeDe[f.col] + '».', 'erro');
          fixar(f, mapaCols[f.col], depositos[f.col], false);
        } else {
          aviso('Não é essa coluna.', 'erro');
        }
      });

      colunas.appendChild(col);
    });

    escolhidas.forEach(function (f) {
      var b = el('button', 'ficha', f.texto);
      b.addEventListener('click', function () {
        if (selecionado) selecionado.botao.classList.remove('sel');
        if (selecionado && selecionado.dados === f) { selecionado = null; b.classList.remove('sel'); return; }
        selecionado = { botao: b, dados: f };
        b.classList.add('sel');
      });
      poco.appendChild(b);
    });

    alvo.appendChild(poco);
    alvo.appendChild(colunas);
  }

  /* ════════ MODO 3 · a palavra literal (+ atalhos de teclado) ════════ */

  function rodadaLiteral(alvo, api, perguntas) {
    alvo.appendChild(el('h2', null, 'A Palavra Literal'));
    alvo.appendChild(el('p', 'fonte', 'a frase da ficha, não a que soa bonita · usa o rato ou as teclas 1, 2, 3, 4'));

    var caixa = el('div', 'perguntas');
    alvo.appendChild(caixa);
    var i = 0;
    var teclaListener = null;

    function mostrar() {
      if (teclaListener) {
        window.removeEventListener('keydown', teclaListener);
        teclaListener = null;
      }

      if (i >= perguntas.length) { api.terminar(); return; }
      var q = perguntas[i];
      caixa.innerHTML = '';

      var topo = el('div', 'pergunta-topo');
      topo.appendChild(el('span', 'etiqueta', q.grupo));
      topo.appendChild(el('span', 'contagem', (i + 1) + ' / ' + perguntas.length));
      caixa.appendChild(topo);

      caixa.appendChild(el('p', 'enunciado', q.enunciado));
      caixa.appendChild(el('p', 'fonte', q.fonte));

      var lista = el('div', 'opcoes');
      var respondido = false;
      var botoesPorIdx = {};
      var botoesNaOrdem = [];

      var indicesBaralhados = baralhar(q.opcoes.map(function (_, k) { return k; }));

      indicesBaralhados.forEach(function (idx, pos) {
        var b = el('button', 'opcao');
        var atalhoBadge = el('span', 'opcao-atalho', '[' + (pos + 1) + ']');
        b.appendChild(atalhoBadge);
        b.appendChild(document.createTextNode(' ' + q.opcoes[idx]));

        botoesPorIdx[idx] = b;
        botoesNaOrdem.push({ idx: idx, botao: b });

        function escolher() {
          if (respondido) return;
          respondido = true;
          var acertou = idx === q.certa;
          api.registar(q.id, acertou);

          botoesPorIdx[q.certa].classList.add('certa');
          if (!acertou) b.classList.add('errada');

          Object.keys(botoesPorIdx).forEach(function (k) { botoesPorIdx[k].disabled = true; });

          var nota = el('div', 'nota ' + (acertou ? 'ok' : 'erro'));
          nota.appendChild(el('strong', null, acertou ? 'Certo.' : 'Caiu na armadilha.'));
          nota.appendChild(el('span', null, ' ' + q.nota));
          caixa.appendChild(nota);

          var seg = el('button', 'btn', i + 1 < perguntas.length ? 'seguinte → (Enter)' : 'fechar (Enter)');
          seg.addEventListener('click', function () { i++; mostrar(); });
          caixa.appendChild(seg);
          seg.focus();
        }

        b.addEventListener('click', escolher);
        lista.appendChild(b);
      });

      caixa.appendChild(lista);

      /* atalhos de teclado 1-4 e Enter/Espaço */
      teclaListener = function (e) {
        if (!respondido) {
          var num = parseInt(e.key, 10);
          if (num >= 1 && num <= botoesNaOrdem.length) {
            e.preventDefault();
            botoesNaOrdem[num - 1].botao.click();
          }
        } else {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var btnSeg = caixa.querySelector('.nota + .btn');
            if (btnSeg) btnSeg.click();
          }
        }
      };
      window.addEventListener('keydown', teclaListener);
    }

    mostrar();
  }

  /* ════════ montar as rodadas ════════ */

  function comporSessao(filtro) {
    var rodadas = [];

    var grupos = BANCO.parear.map(function (g) {
      return { g: g, n: IDS.parear[g.id].filter(filtro).length };
    }).sort(function (a, b) { return b.n - a.n; });
    if (grupos[0] && grupos[0].n > 0) {
      (function (g) { rodadas.push(function (alvo, api) { rodadaParear(alvo, api, g, filtro); }); })(grupos[0].g);
    }

    var sets = BANCO.classificar.map(function (s) {
      return { s: s, n: IDS.classificar[s.id].filter(filtro).length };
    }).sort(function (a, b) { return b.n - a.n; });
    if (sets[0] && sets[0].n > 0) {
      (function (s) { rodadas.push(function (alvo, api) { rodadaClassificar(alvo, api, s, filtro); }); })(sets[0].s);
    }

    var perguntas = baralhar(BANCO.literal.filter(function (q) { return filtro(q.id); })).slice(0, 5);
    if (perguntas.length) {
      rodadas.push(function (alvo, api) { rodadaLiteral(alvo, api, perguntas); });
    }

    return rodadas;
  }

  function filaDoDia() { return comporSessao(estaDevido); }

  /* ════════ treino livre — escolher o grupo ════════ */

  function treino(modo) {
    telaAtual = 'treino';
    sessao = null;
    ecra.innerHTML = '';
    Player.atualizarUI();

    var nomes = {
      parear: 'Par: Campo → Elementos',
      classificar: 'Colunas',
      literal: 'A Palavra Literal'
    };

    var cab = el('div', 'cab');
    var voltar = el('button', 'btn mini', '← voltar');
    voltar.addEventListener('click', casa);
    cab.appendChild(voltar);
    cab.appendChild(el('span', 'cab-titulo', 'Treino livre · ' + nomes[modo]));
    ecra.appendChild(cab);

    var intro = el('section', 'cartao');
    intro.appendChild(el('h2', null, 'Escolhe o grupo'));
    intro.appendChild(el('p', 'sub', 'o treino livre não espera por ninguém — só não sobe a fila de revisão como a Fila do dia'));
    ecra.appendChild(intro);

    var lista = el('div', 'modos');

    function acrescentar(nome, sub, ids, aoClicar, semAviso) {
      var b = el('button', 'modo');
      b.appendChild(el('strong', null, nome));
      b.appendChild(el('span', 'modo-desc', sub));
      var fr = contarFragil(ids);
      if (fr && !semAviso) b.appendChild(el('span', 'modo-fragil', '\u26A0 ' + fr + (fr === 1 ? ' frágil' : ' frágeis')));
      b.appendChild(barraMaestria(ids));
      b.addEventListener('click', aoClicar);
      lista.appendChild(b);
    }

    if (modo === 'parear') {
      BANCO.parear.forEach(function (g) {
        var ids = IDS.parear[g.id];
        acrescentar(g.grupo, g.fonte + ' · ' + ids.length + ' fichas', ids, function () {
          arrancar([function (alvo, api) { rodadaParear(alvo, api, g); }], g.grupo);
        });
      });
      acrescentar('Sortear os dois', 'um grupo ao acaso', Object.keys(IDS.parear).reduce(function (a, k) { return a.concat(IDS.parear[k]); }, []), function () {
        arrancar([function (alvo, api) {
          rodadaParear(alvo, api, BANCO.parear[Math.floor(Math.random() * BANCO.parear.length)]);
        }], 'Par: Campo → Elementos');
      });
    }

    if (modo === 'classificar') {
      BANCO.classificar.forEach(function (s) {
        var ids = IDS.classificar[s.id];
        acrescentar(s.grupo, s.fonte + ' · ' + ids.length + ' fichas', ids, function () {
          arrancar([function (alvo, api) { rodadaClassificar(alvo, api, s); }], s.grupo);
        });
      });
      acrescentar('Sortear os três', 'um conjunto ao acaso', Object.keys(IDS.classificar).reduce(function (a, k) { return a.concat(IDS.classificar[k]); }, []), function () {
        arrancar([function (alvo, api) {
          rodadaClassificar(alvo, api, BANCO.classificar[Math.floor(Math.random() * BANCO.classificar.length)]);
        }], 'Colunas');
      });
    }

    if (modo === 'literal') {
      acrescentar('Todas as ' + IDS.literal.length, 'a volta completa, como na prova', IDS.literal, function () {
        arrancar([function (alvo, api) { rodadaLiteral(alvo, api, baralhar(BANCO.literal)); }], 'A Palavra Literal');
      }, true);
      acrescentar('Seis ao acaso', 'uma tiragem curta', IDS.literal, function () {
        arrancar([function (alvo, api) { rodadaLiteral(alvo, api, baralhar(BANCO.literal).slice(0, 6)); }], 'A Palavra Literal');
      }, true);
      var frag = BANCO.literal.filter(function (q) { return fragil(q.id); });
      if (frag.length) {
        acrescentar('Só as frágeis (' + frag.length + ')', 'as que já te derrubaram', frag.map(function (q) { return q.id; }), function () {
          arrancar([function (alvo, api) { rodadaLiteral(alvo, api, frag); }], 'A Palavra Literal · frágeis');
        });
      }
    }

    if (lista.children.length) {
      intro.appendChild(el('h3', 'separador', modo === 'literal' ? 'as ' + IDS.literal.length + ' armadilhas' : 'os grupos'));
      intro.appendChild(lista);
    }

    pintarStats();
  }

  /* ════════ o fim ════════ */

  /* ─────────────── o som do gabarito ─────────────── */

  /* Sem ficheiros: um arpejo sintetizado em Web Audio. O jogo corre em file://
     e não tem assets de som — e um .mp3 novo pesaria mais do que isto. */
  var ctxSom = null;

  function contextoDeSom() {
    if (!ctxSom) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxSom = new AC();
    }
    if (ctxSom.state === 'suspended') ctxSom.resume();
    return ctxSom;
  }

  /* O browser só abre o áudio depois de um gesto. O fim da sessão chega 420 ms
     depois do último clique, por setTimeout — por isso o contexto é desbloqueado
     no primeiro toque, e não no momento de tocar. */
  document.addEventListener('pointerdown', function () { contextoDeSom(); });

  function somGabaritou() {
    var ctx = contextoDeSom();
    if (!ctx) return;
    var t0 = ctx.currentTime + 0.02;
    /* dó - mi - sol - dó: quatro notas, sino de tinta */
    [523.25, 659.25, 783.99, 1046.50].forEach(function (f, i) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      var t = t0 + i * 0.11;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.6);
    });
  }

  /* O som de fecho, em dois registos. O gabarito é arpejo (quatro notas a subir);
     uma sessão com erros recebe um par descendente, mais grave e mais baixo —
     um ponto final, não um castigo. Não há buzzer: quem erra já viu a resposta. */
  function somDoFim(acertos, erros) {
    if (!erros) { somGabaritou(); return; }
    var ctx = contextoDeSom();
    if (!ctx) return;
    var t0 = ctx.currentTime + 0.02;
    [[392.00, 0], [329.63, 0.16]].forEach(function (par) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = par[0];
      var t = t0 + par[1];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.5);
    });
  }

  /* ─────────────── o chill do mapa ─────────────── */

  /* Um ambiente sintetizado, em loop, só em «O meu mapa». Duas camadas sobre a
     mesma grelha: o PAD (quatro acordes) e o ARPEJO (uma nota por tempo, com
     swing). 72 BPM, 8 tempos por acorde; a volta completa dura ~26,7 s.
     Sem percussão e sem ficheiros: o jogo corre em file://. */
  var CHAVE_CHILL = 'raven_estudo_act_chill_v1';
  var ACORDES_CHILL = [
    [220.00, 261.63, 329.63, 392.00],
    [174.61, 220.00, 261.63, 329.63],
    [130.81, 164.81, 196.00, 246.94],
    [196.00, 246.94, 293.66, 329.63]
  ];
  var CHILL_BPM = 72;
  var CHILL_TEMPOS = 8;
  var CHILL_TEMPO = 60 / CHILL_BPM;
  var CHILL_DUR = CHILL_TEMPO * CHILL_TEMPOS;
  var CHILL_SWING = 0.12;      /* atraso do tempo ímpar, em fracção do tempo */
  var ARP_PADRAO = [0, 2, 1, 3, 4, 3, 1, 2];
  var chill = { ligado: null, timer: null, nos: [], ganho: null, filtro: null, passo: 0, proximo: 0 };
  chill.ligado = chillPreferido();

  function chillPreferido() {
    try {
      var v = localStorage.getItem(CHAVE_CHILL);
      return v === null ? true : v === '1';
    } catch (e) { return true; }
  }

  function guardarChill() {
    try { localStorage.setItem(CHAVE_CHILL, chill.ligado ? '1' : '0'); } catch (e) {}
  }

  function chillPad(ctx, idx, t) {
    var acorde = ACORDES_CHILL[idx];
    var dur = CHILL_DUR + 0.6;               /* sobrepõe-se ao seguinte: legato */
    var vozes = acorde.map(function (f, i) { return [f, [0.34, 0.26, 0.20, 0.14][i] || 0.14]; });
    /* a oitava da fundamental: é o que faz o acorde existir em altifalantes pequenos,
       onde tudo abaixo dos 200 Hz se perde */
    vozes.push([acorde[0] * 2, 0.12]);
    vozes.forEach(function (vz, i) {
      var f = vz[0];
      var v = vz[1] * (0.85 + Math.random() * 0.15);
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = i ? 'sine' : 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 1.9);
      g.gain.exponentialRampToValueAtTime(v * 0.65, t + dur - 1.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(chill.filtro);
      o.start(t);
      o.stop(t + dur + 0.1);
      chill.nos.push(o);
    });
  }

  /* Uma nota por tempo, num padrão de oito passos. O tempo ímpar chega atrasado
     (swing) e cada nota tem a sua própria variação de 15 ms e de intensidade. */
  function chillArpejo(ctx, idx, dentro, t) {
    var acorde = ACORDES_CHILL[idx];
    var pos = ARP_PADRAO[dentro] || 0;
    var f = pos === 4 ? acorde[0] * 4 : acorde[pos];
    var v = 0.13 * (0.70 + Math.random() * 0.30);
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(g);
    g.connect(chill.filtro);
    o.start(t);
    o.stop(t + 1.2);
    chill.nos.push(o);
  }

  /* O relógio: agenda meio segundo à frente, a cada 120 ms. Nunca conta o tempo
     com setTimeout por nota — quem conta é o audioCtx.currentTime, que não deriva. */
  function chillAgenda() {
    if (!chill.ligado || !ctxSom) return;
    var ctx = ctxSom;
    /* se a aba esteve parada, não despeja o atraso todo de uma vez: ressincroniza */
    if (chill.proximo < ctx.currentTime - 0.5) chill.proximo = ctx.currentTime + 0.05;
    var horizonte = ctx.currentTime + 0.5;
    var n = 0;
    while (chill.proximo < horizonte && n < 10) {
      var passo = chill.passo;
      var idx = Math.floor(passo / CHILL_TEMPOS) % ACORDES_CHILL.length;
      var dentro = passo % CHILL_TEMPOS;
      var atraso = (dentro % 2) ? CHILL_TEMPO * CHILL_SWING : 0;
      var jitter = (Math.random() - 0.5) * 0.03;
      if (dentro === 0) chillPad(ctx, idx, chill.proximo);
      chillArpejo(ctx, idx, dentro, chill.proximo + atraso + jitter);
      chill.proximo += CHILL_TEMPO;
      chill.passo++;
      n++;
    }
    chill.nos = chill.nos.slice(-60);
  }

  function ligarChill() {
    if (chill.ligado === null) chill.ligado = chillPreferido();
    if (!chill.ligado) return;
    if (chill.timer) return;
    var ctx = contextoDeSom();
    if (!ctx) return;
    if (!chill.ganho) {
      chill.ganho = ctx.createGain();
      chill.ganho.connect(ctx.destination);
    }
    /* o filtro chill: corta os agudos e deixa um som abafado e quente. E um LFO
       muito lento (0.05 Hz) passeia o corte entre ~520 e ~1280 Hz, para o pad
       nunca soar estático. */
    if (!chill.filtro) {
      chill.filtro = ctx.createBiquadFilter();
      chill.filtro.type = 'lowpass';
      chill.filtro.frequency.value = 900;
      chill.filtro.Q.value = 0.7;
      chill.filtro.connect(chill.ganho);
      var lfo = ctx.createOscillator();
      var lfoGanho = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05;
      lfoGanho.gain.value = 380;
      lfo.connect(lfoGanho);
      lfoGanho.connect(chill.filtro.frequency);
      lfo.start();
    }
    /* baixo por natureza; se as aulas estiverem a tocar, quase inaudível.
       O elemento de áudio vive dentro do módulo Player — pede-se, não se assume. */
    var aula = Player.obterAudio();
    var alvo = (aula && !aula.paused) ? 0.03 : 0.18;
    chill.ganho.gain.cancelScheduledValues(ctx.currentTime);
    chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), ctx.currentTime);
    chill.ganho.gain.exponentialRampToValueAtTime(alvo, ctx.currentTime + 1.4);
    chill.passo = 0;
    chill.proximo = ctx.currentTime + 0.15;
    if (chill.timer) clearInterval(chill.timer);
    chill.timer = setInterval(chillAgenda, 120);
    chillAgenda();
  }

  function pararChill(imediato) {
    if (chill.timer) { clearInterval(chill.timer); chill.timer = null; }
    var nos = chill.nos;
    chill.nos = [];
    if (chill.ganho && ctxSom) {
      var t = ctxSom.currentTime;
      try {
        chill.ganho.gain.cancelScheduledValues(t);
        chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), t);
        chill.ganho.gain.exponentialRampToValueAtTime(0.0001, t + (imediato ? 0.25 : 1.2));
      } catch (e) {}
    }
    setTimeout(function () {
      nos.forEach(function (o) { try { o.stop(); } catch (e) {} });
    }, imediato ? 300 : 1300);
  }

  /* Abaixa o chill enquanto uma aula fala — a voz manda. */
  function chillDuck(mudo) {
    if (!chill.ganho || !ctxSom || !chill.timer) return;
    var t = ctxSom.currentTime;
    try {
      chill.ganho.gain.cancelScheduledValues(t);
      chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), t);
      chill.ganho.gain.exponentialRampToValueAtTime(mudo ? 0.03 : 0.18, t + 0.8);
    } catch (e) {}
  }

  function fim() {
    if (!sessao) return;
    telaAtual = 'fim';
    ecra.innerHTML = '';
    Player.atualizarUI();

    var total = sessao.acertos + sessao.erros;
    var pct = total ? Math.round((sessao.acertos / total) * 100) : 0;

    var c = el('section', 'cartao fim');
    c.appendChild(el('h2', null, sessao.acertos > sessao.erros ? 'A mão já sabe' : 'Ainda tropeça — e é assim que se aprende'));
    c.appendChild(el('p', 'numeros', sessao.acertos + ' acertos · ' + sessao.erros + ' erros · ' + pct + '%'));

    if (sessao.falhas.length) {
      c.appendChild(el('h3', 'separador', 'O que fica para rever'));
      var ul = el('ul', 'rever');
      sessao.falhas.forEach(function (id) {
        var it = INDICE[id];
        if (!it) return;
        var li = el('li');
        li.appendChild(el('strong', null, it.texto));
        li.appendChild(el('span', 'miudo', ' — ' + it.fonte + (it.extra ? ' · ' + it.extra : '')));
        if (it.nota) li.appendChild(el('span', 'miudo nota-linha', ' → ' + it.nota));
        ul.appendChild(li);
      });
      c.appendChild(ul);
    } else {
      c.appendChild(el('p', 'sub', 'Nenhum erro nesta sessão. A repetição seguinte é em 48 h — a memória cobra juros.'));
    }

    somDoFim(sessao.acertos, sessao.erros);

    var acoes = el('div', 'acoes');
    var outra = el('button', 'btn', 'outra sessão');
    outra.addEventListener('click', casa);
    acoes.appendChild(outra);
    c.appendChild(acoes);

    ecra.appendChild(c);
    registarHistorico();
    pintarStats();
  }

  /* ════════ arranque ════════ */

  casa();
})();
