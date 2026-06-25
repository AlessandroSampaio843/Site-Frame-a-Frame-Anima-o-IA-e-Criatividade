// ══════════════════════════════════════════════════
//  FRAME A FRAME — scripts.js
// ══════════════════════════════════════════════════

// ── PALAVRAS PROIBIDAS (filtro de comentários) ────
const PALAVRAS_PROIBIDAS = [
  'merda','bosta','porra','idiota','imbecil','burro','burra',
  'otário','otaria','lixo','inútil','inutil','cretino','cretina',
  'fdp','vsf','desgraça','desgraca','maldito','estúpido','estupido',
  'nojento','nojenta','ridículo','ridiculo',
];

// Verifica se o texto tem palavras proibidas
function temPalavraProibida(texto) {
  return PALAVRAS_PROIBIDAS.some(p => texto.toLowerCase().includes(p));
}

// Substitui palavras proibidas por asteriscos
function filtrarTexto(texto) {
  let r = texto;
  PALAVRAS_PROIBIDAS.forEach(p => {
    r = r.replace(new RegExp(p, 'gi'), m => '*'.repeat(m.length));
  });
  return r;
}

// ── ESTADO GLOBAL ─────────────────────────────────
// Armazena o usuário logado (null = não logado)
let usuarioLogado = null;

// Categoria atualmente selecionada no feed
let categoriaAtual = 'todos';

// ── BASE DE DADOS DOS POSTS ───────────────────────
// Cada post tem: id, categoria, autor, inicial, cor do avatar,
// comunidade, tempo, titulo, texto, tipo (video/imagem/texto),
// tags, votos e comentários pré-existentes
const POSTS = [
  {
    id: 'p1',
    categoria: '3d',
    autor: 'marinacriativa',
    inicial: 'M',
    avatarCor: '#3d1a6e',
    comunidade: 'f/animacao3d',
    tempo: '3h atrás',
    titulo: 'Meu primeiro curta animado feito completamente em Blender — 3 meses de trabalho!',
    texto: 'Finalmente terminei! Esse projeto começou como um exercício de modelagem e virou um curta de 2 minutos sobre uma robozinha que aprende a dançar. Usei Blender 4.2, Grease Pencil para os efeitos 2D e Krita para as texturas pintadas à mão.',
    tipo: 'video',
    tags: [{ label: '🎬 Blender', classe: '' }, { label: '✨ 3D', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 2400,
    comentarios: 347,
  },
  {
    id: 'p2',
    categoria: 'ia',
    autor: 'pixel_dreamer',
    inicial: 'P',
    avatarCor: '#1a3a6e',
    comunidade: 'f/ia_generativa',
    tempo: '5h atrás',
    titulo: 'Fiz um workflow no ComfyUI pra gerar personagens animados consistentes — compartilhando grátis!',
    texto: 'Depois de semanas testando, consegui criar um pipeline estável que mantém o estilo e proporções do personagem consistentes entre frames. Funciona com SDXL e Flux. Link do workflow nos comentários!',
    tipo: 'imagem',
    icone: '🎭',
    iconeLabel: 'Personagens gerados com IA — 4 variações',
    tags: [{ label: '🤖 ComfyUI', classe: '' }, { label: '🎭 Character', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 1100,
    comentarios: 212,
  },
  {
    id: 'p3',
    categoria: 'criatividade',
    autor: 'teoriadaanimacao',
    inicial: 'T',
    avatarCor: '#1a4a2e',
    comunidade: 'f/criatividade',
    tempo: '8h atrás',
    titulo: 'A IA vai substituir animadores? Minha visão depois de 10 anos na área',
    texto: 'Curto e grosso: não, pelo menos não da forma que todo mundo está com medo. A IA está mudando o que animadores fazem, não eliminando o papel deles. A criatividade, o senso narrativo, a direção artística — isso continua sendo humano. O que muda é o pipeline técnico.',
    tipo: 'texto',
    tags: [{ label: '💬 Discussão', classe: '' }, { label: '🤖 IA', classe: '' }, { label: '🎨 Indústria', classe: '' }],
    votos: 876,
    comentarios: 589,
  },
  {
    id: 'p4',
    categoria: 'tutorial',
    autor: 'animadorderua',
    inicial: 'A',
    avatarCor: '#4e1a1a',
    comunidade: 'f/tutoriais',
    tempo: '12h atrás',
    titulo: '[Tutorial] Princípios de squash & stretch com exemplos práticos no After Effects',
    texto: 'Squash e stretch é o primeiro princípio da animação da Disney e o mais ignorado por iniciantes. Nesse tutorial de 18 minutos cubro desde o básico até aplicações avançadas com exemplos reais de curtas premiados.',
    tipo: 'video',
    tags: [{ label: '📚 Tutorial', classe: '' }, { label: '🎬 After Effects', classe: '' }, { label: '✅ Iniciante', classe: 'green' }],
    votos: 654,
    comentarios: 98,
  },
  {
    id: 'p5',
    categoria: 'ferramentas',
    autor: 'techartbr',
    inicial: 'T',
    avatarCor: '#2a1a50',
    comunidade: 'f/ferramentas',
    tempo: '1d atrás',
    titulo: 'Kling AI vs Runway Gen-4 vs Pika 2.0 — comparei os três gerando a mesma cena',
    texto: 'Mesmo prompt, três modelos diferentes. Resultado: Kling ganhou em movimentação de câmera, Runway em coerência temporal, Pika em estilo visual. Detalhei cada aspecto com prints e vídeos comparativos.',
    tipo: 'texto',
    tags: [{ label: '🤖 Kling', classe: '' }, { label: '🤖 Runway', classe: '' }, { label: '⭐ Análise', classe: 'gold' }],
    votos: 441,
    comentarios: 203,
  },
  {
    id: 'p6',
    categoria: 'animacao2d',
    autor: 'garotadolapis',
    inicial: 'G',
    avatarCor: '#1a3a1a',
    comunidade: 'f/animacao2d',
    tempo: '2d atrás',
    titulo: 'Fiz uma animação 2D frame a frame de 30 segundos usando só papel e câmera de celular',
    texto: 'Sem nenhum software caro! Só papel, lápis, uma caixa de luz improvisada e câmera do celular. Levou 3 semanas e 480 frames desenhados à mão. O resultado ficou melhor do que eu esperava.',
    tipo: 'video',
    tags: [{ label: '✏️ Frame a Frame', classe: '' }, { label: '📱 Celular', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 3200,
    comentarios: 421,
  },
  {
    id: 'p7',
    categoria: 'stopmotion',
    autor: 'argilashow',
    inicial: 'A',
    avatarCor: '#3a2a0a',
    comunidade: 'f/stopmotion',
    tempo: '2d atrás',
    titulo: 'Stop motion com massinha: fiz um personagem inteiro em 1 semana — processo completo',
    texto: 'Nunca tinha feito stop motion antes. Comprei massinha colorida, montei um estúdio improvisado com caixas e comecei a gravar. Erro atrás de erro, até que ficou algo que me orgulha de verdade.',
    tipo: 'imagem',
    icone: '🧸',
    iconeLabel: 'Personagem de massinha — 6 poses diferentes',
    tags: [{ label: '🧸 Stop Motion', classe: '' }, { label: '🎭 Massinha', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 1870,
    comentarios: 156,
  },
  {
    id: 'p8',
    categoria: 'character',
    autor: 'designerdealmas',
    inicial: 'D',
    avatarCor: '#2a0a3a',
    comunidade: 'f/character_design',
    tempo: '3d atrás',
    titulo: 'Como criar uma sheet de personagem profissional — do esboço ao modelo final',
    texto: 'Uma character sheet bem feita economiza horas de retrabalho na animação. Mostro o meu processo: pesquisa de referências, esboços rápidos, refinamento das proporções, poses de expressão e a versão final em vetor.',
    tipo: 'imagem',
    icone: '🎭',
    iconeLabel: 'Character sheet completa — frente, costas e expressões',
    tags: [{ label: '🎭 Character Design', classe: '' }, { label: '📐 Sheet', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 992,
    comentarios: 87,
  },
  {
    id: 'p9',
    categoria: 'ia',
    autor: 'prompts_br',
    inicial: 'P',
    avatarCor: '#0a2a3a',
    comunidade: 'f/ia_generativa',
    tempo: '3d atrás',
    titulo: 'Lista com 50 prompts testados para gerar animações no Runway ML — todos funcionam',
    texto: 'Passei um mês testando prompts no Runway Gen-4 para animação de personagens. Separei os 50 que deram os melhores resultados por categoria: movimento de câmera, expressões faciais, cenas de ação e cenários.',
    tipo: 'texto',
    tags: [{ label: '🤖 Runway', classe: '' }, { label: '📝 Prompts', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 2100,
    comentarios: 334,
  },
  {
    id: 'p10',
    categoria: 'shorts',
    autor: 'curtagalerinha',
    inicial: 'C',
    avatarCor: '#3a0a2a',
    comunidade: 'f/shorts',
    tempo: '4d atrás',
    titulo: 'Animei o meme do gato no piano em estilo Studio Ghibli — ficou surreal kkk',
    texto: 'Peguei o meme clássico do gato tocando piano e reanimei frame a frame no estilo Ghibli. Demorou 2 semanas mas a galera aqui precisa ver isso. Spoiler: o gato virou um espírito da floresta.',
    tipo: 'video',
    tags: [{ label: '😂 Meme', classe: '' }, { label: '🎌 Ghibli', classe: '' }, { label: '🎬 Shorts', classe: '' }],
    votos: 5600,
    comentarios: 892,
  },
];

// ── EMOJIS DE REAÇÃO ──────────────────────────────
// Lista de emojis disponíveis para reagir nos posts
const EMOJIS = [
  { emoji: '❤️', label: 'Amei' },
  { emoji: '🔥', label: 'Incrível' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Uau' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '👏', label: 'Parabéns' },
];

// ── TOAST (notificação flutuante) ─────────────────
function mostrarToast(msg, tipo = 'info') {
  const cores = { info: '#b44dff', sucesso: '#3ddc84', aviso: '#f5c842', erro: '#ff4466' };
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px);
    background:${cores[tipo]}; color:#fff; padding:12px 24px; border-radius:30px;
    font-size:14px; font-weight:600; z-index:9999; opacity:0;
    transition:all .3s; box-shadow:0 4px 20px rgba(0,0,0,.4);
    font-family:'Inter',sans-serif; white-space:nowrap; pointer-events:none;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3000);
}

// ── MODAIS ────────────────────────────────────────
function abrirModal(id) {
  const m = document.getElementById(id);
  m.style.display = 'flex'; m.style.opacity = '0';
  setTimeout(() => m.style.opacity = '1', 10);
}
function fecharModal(id) {
  const m = document.getElementById(id);
  m.style.opacity = '0';
  setTimeout(() => m.style.display = 'none', 200);
}
// Fecha modal ao clicar no overlay escuro
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) fecharModal(o.id); });
});

// ── GOOGLE LOGIN ──────────────────────────────────
// Essa função é chamada automaticamente pelo SDK do Google
// quando o usuário escolhe uma conta e confirma o login
function handleGoogleLogin(response) {
  // Decodifica o JWT retornado pelo Google para pegar os dados do usuário
  const payload = JSON.parse(atob(response.credential.split('.')[1]));

  // Salva o usuário logado com nome, email e foto do Google
  usuarioLogado = {
    nome:    payload.name,
    email:   payload.email,
    foto:    payload.picture,  // URL da foto de perfil do Google
    inicial: payload.name[0].toUpperCase(),
  };

  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Bem-vindo, ${payload.given_name}! 🎉`, 'sucesso');
}

// ── LOGIN COM EMAIL ───────────────────────────────
document.getElementById('btnEntrarEmail').addEventListener('click', () => {
  const email = document.getElementById('input-email').value.trim();
  const senha = document.getElementById('input-senha').value.trim();
  if (!email || !senha) { mostrarToast('Preencha e-mail e senha!', 'aviso'); return; }
  if (!email.includes('@')) { mostrarToast('E-mail inválido!', 'erro'); return; }
  if (senha.length < 6) { mostrarToast('Senha muito curta!', 'erro'); return; }
  const nome = email.split('@')[0];
  usuarioLogado = { nome, email, foto: null, inicial: nome[0].toUpperCase() };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Bem-vindo, ${nome}! 🎉`, 'sucesso');
});

// ── CADASTRO ──────────────────────────────────────
document.getElementById('btnCadastrar').addEventListener('click', () => {
  const nome  = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const tel   = document.getElementById('cad-tel').value.trim();
  const senha = document.getElementById('cad-senha').value.trim();
  if (!nome) { mostrarToast('Escolha um nome!', 'aviso'); return; }
  if (!email && !tel) { mostrarToast('Informe e-mail ou telefone!', 'aviso'); return; }
  if (senha.length < 6) { mostrarToast('Senha muito curta!', 'erro'); return; }
  usuarioLogado = { nome, email: email || tel, foto: null, inicial: nome[0].toUpperCase() };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Conta criada! Bem-vindo, ${nome}! 🚀`, 'sucesso');
});

// ── TROCAR ABA LOGIN/CADASTRO ────────────────────
function trocarAba(qual) {
  document.querySelectorAll('.auth-tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0 && qual === 'login') || (i === 1 && qual === 'cadastro'))
  );
  const fl = document.getElementById('form-login');
  const fc = document.getElementById('form-cadastro');
  fl.style.display = qual === 'login'    ? 'flex' : 'none';
  fc.style.display = qual === 'cadastro' ? 'flex' : 'none';
  if (fl.style.display === 'flex') fl.style.flexDirection = 'column', fl.style.gap = '10px';
  if (fc.style.display === 'flex') fc.style.flexDirection = 'column', fc.style.gap = '10px';
}

// ── ATUALIZA O HEADER APÓS LOGIN ─────────────────
// Troca o botão "Entrar" pelo avatar (foto ou inicial) do usuário
function atualizarUILogin() {
  const btn = document.getElementById('btnLogin');
  btn.innerHTML = '';
  btn.style.cssText = `
    width:34px; height:34px; border-radius:50%; padding:0; overflow:hidden;
    background:linear-gradient(135deg,#b44dff,#7b2fff);
    color:#fff; font-size:14px; font-weight:700; border:2px solid #b44dff;
    display:flex; align-items:center; justify-content:center; cursor:pointer;
  `;

  if (usuarioLogado.foto) {
    // Se tem foto do Google, mostra a foto
    const img = document.createElement('img');
    img.src = usuarioLogado.foto;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    btn.appendChild(img);
  } else {
    btn.textContent = usuarioLogado.inicial;
  }

  // Ao clicar no avatar, opção de sair
  btn.onclick = () => {
    if (confirm(`Sair da conta de ${usuarioLogado.nome}?`)) {
      usuarioLogado = null;
      btn.textContent = 'Entrar';
      btn.style.cssText = '';
      btn.className = 'btn-login';
      btn.onclick = () => abrirModal('modal-auth');
      mostrarToast('Você saiu da conta.', 'info');
    }
  };
}

// ── RENDERIZAR POSTS NO FEED ─────────────────────
// Recebe um array de posts e os renderiza no container
function renderizarPosts(lista) {
  const container = document.getElementById('posts-container');
  container.innerHTML = '';

  if (lista.length === 0) {
    // Mensagem quando não há posts na categoria
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--muted);">
        <div style="font-size:48px;margin-bottom:12px;">🎨</div>
        <div style="font-size:16px;font-weight:600;margin-bottom:8px;">Nenhum post por aqui ainda</div>
        <div style="font-size:13px;">Seja o primeiro a postar nessa categoria!</div>
      </div>`;
    return;
  }

  lista.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.categoria = post.categoria;
    card.id = post.id;

    // Monta o conteúdo de mídia do post (vídeo, imagem ou nada)
    let midia = '';
    if (post.tipo === 'video') {
      midia = `<div class="video-thumb" title="Assistir"><div class="play-btn"></div></div>`;
    } else if (post.tipo === 'imagem') {
      midia = `
        <div class="post-image-placeholder">
          <span style="font-size:40px;">${post.icone}</span>
          <span>${post.iconeLabel}</span>
        </div>`;
    }

    // Monta as tags do post
    const tagsHTML = post.tags.map(t =>
      `<span class="tag ${t.classe}">${t.label}</span>`
    ).join('');

    // Formata o número de votos (ex: 2400 → 2.4k)
    const votosDisplay = post.votos >= 1000
      ? (post.votos / 1000).toFixed(1).replace('.0', '') + 'k'
      : post.votos;

    card.innerHTML = `
      <!-- Coluna de votos -->
      <div class="vote-col">
        <button class="vote-btn up" title="Upvote">▲</button>
        <span class="vote-count">${votosDisplay}</span>
        <button class="vote-btn down" title="Downvote">▼</button>
      </div>
      <!-- Corpo do post -->
      <div class="post-body">
        <div class="post-meta">
          <div class="avatar-sm" style="background:${post.avatarCor};">${post.inicial}</div>
          <span class="community">${post.comunidade}</span>
          · postado por <strong>u/${post.autor}</strong> · ${post.tempo}
        </div>
        <div class="post-title">${post.titulo}</div>
        <div class="tags">${tagsHTML}</div>
        ${midia}
        <div class="post-text">${post.texto}</div>
        <!-- Área de reações com emojis -->
        <div class="reacoes-wrap" data-post="${post.id}"></div>
        <!-- Botões de ação -->
        <div class="post-actions">
          <button class="action-btn btn-comentar" data-target="${post.id}">
            💬 <span class="num-comentarios">${post.comentarios}</span> comentários
          </button>
          <button class="action-btn btn-compartilhar">🔗 Compartilhar</button>
          <button class="action-btn btn-salvar">⭐ Salvar</button>
        </div>
        <!-- Seção de comentários (oculta inicialmente) -->
        <div class="secao-comentarios" id="comentarios-${post.id}" style="display:none;"></div>
      </div>
    `;

    container.appendChild(card);

    // Inicializa votos e reações do post recém-criado
    inicializarVotos(card.querySelector('.vote-col'), post.votos);
    inicializarReacoes(card.querySelector('.reacoes-wrap'));
  });
}

// ── FILTRAR POR CATEGORIA ────────────────────────
// Filtra os posts do feed de acordo com a categoria clicada
function filtrarCategoria(categoria) {
  categoriaAtual = categoria;

  // Atualiza o link ativo no nav e sidebar
  document.querySelectorAll('nav a, .sidebar-link').forEach(el => el.classList.remove('active'));

  // Filtra os posts
  const lista = categoria === 'todos' || categoria === 'trending'
    ? [...POSTS].sort((a, b) => b.votos - a.votos) // todos ou trending = ordenado por votos
    : POSTS.filter(p => p.categoria === categoria);

  // Mostra o label da categoria atual
  const label = document.getElementById('categoria-label');
  const nomes = {
    todos: null, trending: '🔥 Trending — posts mais votados',
    animacao2d: '🎨 Animação 2D', '3d': '🧊 3D & Motion',
    ia: '🤖 IA Generativa', stopmotion: '📽 Stop Motion',
    character: '🎭 Character Design', tutorial: '💡 Tutoriais',
    ferramentas: '🛠 Ferramentas', criatividade: '✨ Criatividade',
    shorts: '🎬 Shorts',
  };

  if (nomes[categoria]) {
    label.textContent = nomes[categoria];
    label.style.display = 'block';
  } else {
    label.style.display = 'none';
  }

  renderizarPosts(lista);
  // Rola suavemente até o topo do feed
  document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
}

// ── VOTOS ─────────────────────────────────────────
// Inicializa o sistema de upvote/downvote de um post
function inicializarVotos(col, votosIniciais) {
  const upBtn   = col.querySelector('.vote-btn.up');
  const downBtn = col.querySelector('.vote-btn.down');
  const countEl = col.querySelector('.vote-count');
  let count   = votosIniciais;
  let current = 0; // -1 = downvote, 0 = neutro, 1 = upvote

  function render() {
    countEl.textContent = count >= 1000
      ? (count / 1000).toFixed(1).replace('.0', '') + 'k' : count;
    upBtn.style.color   = current ===  1 ? '#b44dff' : '';
    downBtn.style.color = current === -1 ? '#ff5555' : '';
    countEl.style.color = current ===  1 ? '#b44dff' : current === -1 ? '#ff5555' : '';
  }

  upBtn.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para votar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    current === 1 ? (count--, current = 0) : (count += current === -1 ? 2 : 1, current = 1, mostrarToast('Upvote! 🔺', 'sucesso'));
    render();
  });
  downBtn.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para votar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    current === -1 ? (count++, current = 0) : (count -= current === 1 ? 2 : 1, current = -1, mostrarToast('Downvote 🔻', 'info'));
    render();
  });
}

// ── REAÇÕES COM EMOJIS ────────────────────────────
// Inicializa o botão de reagir e o picker de emojis de um post
function inicializarReacoes(wrap) {
  if (!wrap) return;
  const contagens = {}; // { '❤️': 3, '🔥': 1 }
  let reacaoUsuario = null; // qual emoji o usuário escolheu

  // Cria o botão "Reagir"
  const btnReagir = document.createElement('button');
  btnReagir.className = 'btn-reagir';
  btnReagir.innerHTML = '😊 Reagir';

  // Cria o picker flutuante
  const picker = document.createElement('div');
  picker.className = 'emoji-picker';

  EMOJIS.forEach(({ emoji, label }) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-opt';
    btn.textContent = emoji;
    btn.title = label;
    btn.addEventListener('click', () => {
      if (!usuarioLogado) { mostrarToast('Entre para reagir! 👤', 'aviso'); abrirModal('modal-auth'); picker.classList.remove('aberto'); return; }
      if (reacaoUsuario === emoji) {
        contagens[emoji] = (contagens[emoji] || 1) - 1;
        if (contagens[emoji] <= 0) delete contagens[emoji];
        reacaoUsuario = null;
      } else {
        if (reacaoUsuario) {
          contagens[reacaoUsuario]--;
          if (contagens[reacaoUsuario] <= 0) delete contagens[reacaoUsuario];
        }
        reacaoUsuario = emoji;
        contagens[emoji] = (contagens[emoji] || 0) + 1;
        mostrarToast(`Você reagiu com ${emoji}`, 'sucesso');
      }
      picker.classList.remove('aberto');
      renderBubbles();
    });
    picker.appendChild(btn);
  });

  btnReagir.appendChild(picker);
  btnReagir.addEventListener('click', e => { e.stopPropagation(); picker.classList.toggle('aberto'); });
  document.addEventListener('click', () => picker.classList.remove('aberto'));
  wrap.appendChild(btnReagir);

  // Renderiza as bolhas de reação com contadores
  function renderBubbles() {
    wrap.querySelectorAll('.reacao-bubble').forEach(b => b.remove());
    Object.entries(contagens).forEach(([emoji, qtd]) => {
      if (qtd <= 0) return;
      const bubble = document.createElement('button');
      bubble.className = 'reacao-bubble' + (reacaoUsuario === emoji ? ' ativa' : '');
      bubble.innerHTML = `${emoji} <span class="contagem">${qtd}</span>`;
      bubble.addEventListener('click', () => {
        if (!usuarioLogado) { abrirModal('modal-auth'); return; }
        if (reacaoUsuario === emoji) {
          contagens[emoji]--; if (contagens[emoji] <= 0) delete contagens[emoji]; reacaoUsuario = null;
        } else {
          if (reacaoUsuario) { contagens[reacaoUsuario]--; if (contagens[reacaoUsuario] <= 0) delete contagens[reacaoUsuario]; }
          reacaoUsuario = emoji; contagens[emoji] = (contagens[emoji] || 0) + 1;
        }
        renderBubbles();
      });
      wrap.insertBefore(bubble, btnReagir);
    });
  }
}

// ── COMENTÁRIOS ───────────────────────────────────
// Inicializa a seção de comentários de um post
function inicializarComentarios(secao, postId) {
  if (secao.dataset.inicializado) return;
  secao.dataset.inicializado = 'true';
  const comentarios = [];

  // Campo de escrever comentário
  const wrap = document.createElement('div');
  wrap.className = 'comentario-input-wrap';
  const textarea = document.createElement('textarea');
  textarea.className = 'comentario-textarea';
  textarea.placeholder = 'Escreva um comentário respeitoso…';
  textarea.rows = 2;
  const btnEnviar = document.createElement('button');
  btnEnviar.className = 'btn-enviar-comentario';
  btnEnviar.textContent = 'Enviar';

  btnEnviar.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para comentar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    const texto = textarea.value.trim();
    if (!texto) { mostrarToast('Escreva algo!', 'aviso'); return; }
    const filtrado = temPalavraProibida(texto);
    const obj = { autor: usuarioLogado.nome, inicial: usuarioLogado.inicial, foto: usuarioLogado.foto, texto: filtrarTexto(texto), filtrado };
    comentarios.push(obj);
    renderComentario(obj, lista);
    // Atualiza o contador de comentários
    const numEl = document.querySelector(`#${postId} .num-comentarios`);
    if (numEl) numEl.textContent = parseInt(numEl.textContent) + 1;
    if (filtrado) mostrarToast('Comentário filtrado por linguagem inadequada ⚠️', 'aviso');
    else mostrarToast('Comentário enviado! 💬', 'sucesso');
    textarea.value = '';
  });

  textarea.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) btnEnviar.click(); });
  wrap.appendChild(textarea);
  wrap.appendChild(btnEnviar);
  secao.appendChild(wrap);

  const lista = document.createElement('div');
  secao.appendChild(lista);
}

// Cria e exibe um card de comentário
function renderComentario(c, lista) {
  const card = document.createElement('div');
  card.className = 'comentario-card';

  // Avatar: foto do Google ou inicial colorida
  const avatarHTML = c.foto
    ? `<img src="${c.foto}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
    : `<div class="comentario-avatar">${c.inicial}</div>`;

  card.innerHTML = `
    ${avatarHTML}
    <div class="comentario-corpo">
      <div class="comentario-autor">u/${c.autor}</div>
      <div class="comentario-texto">${c.texto}</div>
      ${c.filtrado ? `<div class="comentario-aviso">⚠️ Parte deste comentário foi ocultada por violar as regras.</div>` : ''}
    </div>
  `;
  lista.appendChild(card);
}

// ── DELEGAÇÃO DE EVENTOS DO FEED ─────────────────
// Captura cliques nos botões dos posts (funciona para posts novos também)
document.getElementById('feed').addEventListener('click', function (e) {

  // Botão de comentários
  const btnComentar = e.target.closest('.btn-comentar');
  if (btnComentar) {
    const postId = btnComentar.dataset.target;
    const secao  = document.getElementById('comentarios-' + postId);
    if (secao) {
      inicializarComentarios(secao, postId);
      secao.style.display = secao.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Botão compartilhar
  if (e.target.closest('.btn-compartilhar')) {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    mostrarToast('Link copiado! 🔗', 'sucesso');
  }

  // Botão salvar
  if (e.target.closest('.btn-salvar')) {
    if (!usuarioLogado) { mostrarToast('Entre para salvar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    const btn = e.target.closest('.btn-salvar');
    const salvo = btn.textContent.includes('Salvo');
    btn.textContent = salvo ? '⭐ Salvar' : '✅ Salvo';
    mostrarToast(salvo ? 'Removido dos salvos.' : 'Post salvo! ⭐', salvo ? 'info' : 'sucesso');
  }
});

// ── MODAL DE CRIAR POST ───────────────────────────
document.getElementById('btnPostar').addEventListener('click', () => {
  if (!usuarioLogado) { mostrarToast('Entre para postar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
  abrirModal('modal-post');
});

// Preview de imagem no modal de post
document.getElementById('post-imagem').addEventListener('change', function () {
  const arquivo = this.files[0];
  if (!arquivo) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('upload-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
    document.getElementById('upload-texto').textContent = '✅ Imagem selecionada!';
  };
  reader.readAsDataURL(arquivo);
});

// Publicar novo post
document.getElementById('btnPublicar').addEventListener('click', () => {
  const titulo    = document.getElementById('post-titulo').value.trim();
  const legenda   = document.getElementById('post-legenda').value.trim();
  const musica    = document.getElementById('post-musica').value.trim();
  const categoria = document.getElementById('post-categoria').value;
  const preview   = document.getElementById('upload-preview');
  const temImg    = preview.style.display !== 'none' && preview.src;

  if (!titulo) { mostrarToast('Título obrigatório!', 'aviso'); return; }

  // Cria o objeto do novo post e adiciona ao array de posts
  const novoPost = {
    id:        'post-' + Date.now(),
    categoria,
    autor:     usuarioLogado.nome,
    inicial:   usuarioLogado.inicial,
    avatarCor: '#7b2fff',
    comunidade: 'f/geral',
    tempo:     'agora',
    titulo,
    texto:     legenda,
    tipo:      temImg ? 'imagem' : 'texto',
    icone:     '🖼',
    iconeLabel: 'Imagem do post',
    tags:      [],
    votos:     1,
    comentarios: 0,
    imagemBase64: temImg ? preview.src : null,
  };

  POSTS.unshift(novoPost); // adiciona no início do array

  // Re-renderiza o feed mantendo a categoria atual
  filtrarCategoria(categoriaAtual);

  // Fecha o modal e limpa os campos
  fecharModal('modal-post');
  document.getElementById('post-titulo').value  = '';
  document.getElementById('post-legenda').value = '';
  document.getElementById('post-musica').value  = '';
  preview.style.display = 'none'; preview.src = '';
  document.getElementById('upload-texto').textContent = '📁 Clique para escolher uma imagem da galeria';

  mostrarToast('Post publicado! 🚀', 'sucesso');
});

// ── TABS DO FEED ──────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    // Trending ordena por votos; os outros mostram todos
    if (this.textContent.includes('Em Alta')) filtrarCategoria('trending');
    else filtrarCategoria('todos');
  });
});

// ── BUSCA ─────────────────────────────────────────
// Filtra os posts em tempo real pelo título
document.getElementById('search').addEventListener('input', function () {
  const termo = this.value.toLowerCase().trim();
  if (!termo) { filtrarCategoria(categoriaAtual); return; }
  const filtrados = POSTS.filter(p => p.titulo.toLowerCase().includes(termo));
  renderizarPosts(filtrados);
});

// ── BOTÕES DO HEADER ──────────────────────────────
document.getElementById('btnLogin').addEventListener('click', () => abrirModal('modal-auth'));

document.getElementById('btnJoin').addEventListener('click', () => {
  if (!usuarioLogado) { mostrarToast('Entre para participar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
  const btn = document.getElementById('btnJoin');
  const entrou = btn.textContent.includes('Membro');
  btn.textContent = entrou ? 'Entrar na Comunidade' : '✅ Membro!';
  btn.style.background = entrou ? 'var(--accent)' : 'var(--green)';
  mostrarToast(entrou ? 'Você saiu da comunidade.' : 'Você entrou! 🎉', entrou ? 'info' : 'sucesso');
});

// ── INICIALIZAÇÃO ─────────────────────────────────
// Renderiza todos os posts ao carregar a página
renderizarPosts(POSTS);