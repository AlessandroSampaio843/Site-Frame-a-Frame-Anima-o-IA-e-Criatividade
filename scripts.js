// ══════════════════════════════════════════════════
//  FRAME A FRAME — scripts.js
// ══════════════════════════════════════════════════

// ── PALAVRAS PROIBIDAS ────────────────────────────
const PALAVRAS_PROIBIDAS = [
  'merda','bosta','porra','idiota','imbecil','burro','burra',
  'otário','otaria','lixo','inútil','inutil','cretino','cretina',
  'fdp','vsf','desgraça','desgraca','maldito','estúpido','estupido',
  'nojento','nojenta','ridículo','ridiculo',
];

function temPalavraProibida(texto) {
  return PALAVRAS_PROIBIDAS.some(p => texto.toLowerCase().includes(p));
}

function filtrarTexto(texto) {
  let r = texto;
  PALAVRAS_PROIBIDAS.forEach(p => {
    r = r.replace(new RegExp(p, 'gi'), m => '*'.repeat(m.length));
  });
  return r;
}

// ── ESTADO GLOBAL ─────────────────────────────────
let usuarioLogado  = null;
let categoriaAtual = 'todos';

// ── POSTS COM IMAGENS REAIS DO UNSPLASH ───────────
// Cada post tem uma imagem real de animação/arte/IA do Unsplash
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
    tipo: 'imagem-url',
    // Imagem: render 3D artístico
    imagemUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    tags: [{ label: '🎬 Blender', classe: '' }, { label: '✨ 3D', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 2400, likes: 1820, dislikes: 43, comentarios: 347,
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
    texto: 'Depois de semanas testando, consegui criar um pipeline estável que mantém o estilo e proporções do personagem consistentes entre frames. Funciona com SDXL e Flux.',
    tipo: 'imagem-url',
    // Imagem: arte digital gerada por IA
    imagemUrl: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80',
    tags: [{ label: '🤖 ComfyUI', classe: '' }, { label: '🎭 Character', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 1100, likes: 934, dislikes: 12, comentarios: 212,
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
    texto: 'Curto e grosso: não. A IA está mudando o que animadores fazem, não eliminando o papel deles. A criatividade, o senso narrativo, a direção artística — isso continua sendo humano.',
    tipo: 'imagem-url',
    // Imagem: pessoa desenhando/criando
    imagemUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    tags: [{ label: '💬 Discussão', classe: '' }, { label: '🤖 IA', classe: '' }, { label: '🎨 Indústria', classe: '' }],
    votos: 876, likes: 701, dislikes: 89, comentarios: 589,
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
    texto: 'Squash e stretch é o primeiro princípio da animação da Disney e o mais ignorado por iniciantes. Tutorial de 18 minutos do básico ao avançado.',
    tipo: 'video',
    // Vídeo: thumbnail escura com play
    imagemUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    tags: [{ label: '📚 Tutorial', classe: '' }, { label: '🎬 After Effects', classe: '' }, { label: '✅ Iniciante', classe: 'green' }],
    votos: 654, likes: 589, dislikes: 8, comentarios: 98,
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
    texto: 'Mesmo prompt, três modelos diferentes. Kling ganhou em movimentação de câmera, Runway em coerência temporal, Pika em estilo visual.',
    tipo: 'imagem-url',
    // Imagem: tela de computador com arte digital
    imagemUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
    tags: [{ label: '🤖 Kling', classe: '' }, { label: '🤖 Runway', classe: '' }, { label: '⭐ Análise', classe: 'gold' }],
    votos: 441, likes: 390, dislikes: 21, comentarios: 203,
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
    texto: 'Sem nenhum software caro! Só papel, lápis, caixa de luz improvisada e câmera do celular. 480 frames desenhados à mão em 3 semanas.',
    tipo: 'imagem-url',
    // Imagem: desenho animado colorido
    imagemUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
    tags: [{ label: '✏️ Frame a Frame', classe: '' }, { label: '📱 Celular', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 3200, likes: 2910, dislikes: 34, comentarios: 421,
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
    texto: 'Nunca tinha feito stop motion antes. Comprei massinha colorida, montei um estúdio improvisado com caixas e comecei a gravar. Erro atrás de erro, até ficar algo que me orgulha.',
    tipo: 'imagem-url',
    // Imagem: stop motion / arte com argila
    imagemUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=800&q=80',
    tags: [{ label: '🧸 Stop Motion', classe: '' }, { label: '🎭 Massinha', classe: '' }, { label: '✅ OC', classe: 'green' }],
    votos: 1870, likes: 1654, dislikes: 17, comentarios: 156,
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
    texto: 'Uma character sheet bem feita economiza horas de retrabalho na animação. Mostro meu processo: pesquisa, esboços, refinamento de proporções e versão final em vetor.',
    tipo: 'imagem-url',
    // Imagem: concept art / esboço de personagem
    imagemUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    tags: [{ label: '🎭 Character Design', classe: '' }, { label: '📐 Sheet', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 992, likes: 876, dislikes: 5, comentarios: 87,
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
    texto: 'Passei um mês testando prompts no Runway Gen-4. Separei os 50 melhores por categoria: movimento de câmera, expressões faciais, cenas de ação e cenários.',
    tipo: 'imagem-url',
    // Imagem: arte gerada por IA / futurista
    imagemUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: [{ label: '🤖 Runway', classe: '' }, { label: '📝 Prompts', classe: '' }, { label: '⭐ Destaque', classe: 'gold' }],
    votos: 2100, likes: 1987, dislikes: 28, comentarios: 334,
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
    texto: 'Peguei o meme clássico do gato tocando piano e reanimei frame a frame no estilo Ghibli. Demorou 2 semanas. O gato virou um espírito da floresta kkk',
    tipo: 'video',
    // Imagem thumbnail do vídeo
    imagemUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    tags: [{ label: '😂 Meme', classe: '' }, { label: '🎌 Ghibli', classe: '' }, { label: '🎬 Shorts', classe: '' }],
    votos: 5600, likes: 5210, dislikes: 67, comentarios: 892,
  },
];

// ── EMOJIS DE REAÇÃO ──────────────────────────────
const EMOJIS = [
  { emoji: '❤️', label: 'Amei'      },
  { emoji: '🔥', label: 'Incrível'  },
  { emoji: '😂', label: 'Haha'      },
  { emoji: '😮', label: 'Uau'       },
  { emoji: '😢', label: 'Triste'    },
  { emoji: '👏', label: 'Parabéns'  },
];

// ── TOAST ─────────────────────────────────────────
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
  setTimeout(() => { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; }, 10);
  setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 400); }, 3000);
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
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) fecharModal(o.id); });
});

// ── GOOGLE LOGIN ──────────────────────────────────
// Chamada pelo SDK do Google quando o usuário escolhe a conta
function handleGoogleLogin(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  usuarioLogado = {
    nome:    payload.name,
    email:   payload.email,
    foto:    payload.picture,
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
  if (!nome)           { mostrarToast('Escolha um nome!', 'aviso'); return; }
  if (!email && !tel)  { mostrarToast('Informe e-mail ou telefone!', 'aviso'); return; }
  if (senha.length < 6){ mostrarToast('Senha muito curta!', 'erro'); return; }
  usuarioLogado = { nome, email: email || tel, foto: null, inicial: nome[0].toUpperCase() };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Conta criada! Bem-vindo, ${nome}! 🚀`, 'sucesso');
});

// ── TROCAR ABA LOGIN/CADASTRO ─────────────────────
function trocarAba(qual) {
  document.querySelectorAll('.auth-tab').forEach((t, i) =>
    t.classList.toggle('active', (i===0 && qual==='login') || (i===1 && qual==='cadastro'))
  );
  const fl = document.getElementById('form-login');
  const fc = document.getElementById('form-cadastro');
  fl.style.cssText = qual==='login'    ? 'display:flex;flex-direction:column;gap:10px;' : 'display:none;';
  fc.style.cssText = qual==='cadastro' ? 'display:flex;flex-direction:column;gap:10px;' : 'display:none;';
}

// ── ATUALIZA HEADER APÓS LOGIN ────────────────────
function atualizarUILogin() {
  const btn = document.getElementById('btnLogin');
  btn.innerHTML = '';
  btn.style.cssText = `
    width:34px;height:34px;border-radius:50%;padding:0;overflow:hidden;
    background:linear-gradient(135deg,#b44dff,#7b2fff);
    color:#fff;font-size:14px;font-weight:700;border:2px solid #b44dff;
    display:flex;align-items:center;justify-content:center;cursor:pointer;
  `;
  if (usuarioLogado.foto) {
    const img = document.createElement('img');
    img.src = usuarioLogado.foto;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    btn.appendChild(img);
  } else {
    btn.textContent = usuarioLogado.inicial;
  }
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

// ── RENDERIZAR POSTS ──────────────────────────────
function renderizarPosts(lista) {
  const container = document.getElementById('posts-container');
  container.innerHTML = '';

  if (lista.length === 0) {
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

    // Monta o bloco de mídia do post
    let midia = '';
    if (post.tipo === 'video') {
      // Vídeo: mostra a imagem como thumbnail com botão de play por cima
      midia = `
        <div class="video-thumb" title="Assistir" style="background-image:url('${post.imagemUrl}');background-size:cover;background-position:center;">
          <div class="play-btn"></div>
        </div>`;
    } else if (post.tipo === 'imagem-url') {
      // Imagem real do Unsplash
      midia = `
        <img
          src="${post.imagemUrl}"
          alt="${post.titulo}"
          class="post-img-real"
          loading="lazy"
          onerror="this.style.display='none'"
        >`;
    }

    const tagsHTML = post.tags.map(t => `<span class="tag ${t.classe}">${t.label}</span>`).join('');
    const votosDisplay = post.votos >= 1000
      ? (post.votos/1000).toFixed(1).replace('.0','')+'k' : post.votos;

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

        <!-- Área de likes/dislikes + reações com emojis -->
        <div class="interacoes-wrap">

          <!-- Likes e dislikes simples (para quem não quer usar emojis) -->
          <div class="like-dislike-wrap">
            <button class="btn-like" data-post="${post.id}" title="Gostei">
              👍 <span class="like-count">${post.likes}</span>
            </button>
            <button class="btn-dislike" data-post="${post.id}" title="Não gostei">
              👎 <span class="dislike-count">${post.dislikes}</span>
            </button>
          </div>

          <!-- Reações com emojis (estilo Facebook) -->
          <div class="reacoes-wrap" data-post="${post.id}"></div>

        </div>

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

    // Inicializa os sistemas interativos do post
    inicializarVotos(card.querySelector('.vote-col'), post.votos);
    inicializarLikeDislike(card, post);
    inicializarReacoes(card.querySelector('.reacoes-wrap'));
  });
}

// ── FILTRAR POR CATEGORIA ────────────────────────
function filtrarCategoria(categoria) {
  categoriaAtual = categoria;

  // Atualiza links ativos
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(a => a.classList.remove('active'));

  const lista = categoria === 'todos' || categoria === 'trending'
    ? [...POSTS].sort((a,b) => b.votos - a.votos)
    : POSTS.filter(p => p.categoria === categoria);

  // Mostra label da categoria
  const label = document.getElementById('categoria-label');
  const nomes = {
    todos: null, trending: '🔥 Trending',
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
  document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
}

// ── VOTOS (upvote/downvote) ───────────────────────
function inicializarVotos(col, votosIniciais) {
  const upBtn   = col.querySelector('.vote-btn.up');
  const downBtn = col.querySelector('.vote-btn.down');
  const countEl = col.querySelector('.vote-count');
  let count   = votosIniciais;
  let current = 0;

  function render() {
    countEl.textContent = count >= 1000
      ? (count/1000).toFixed(1).replace('.0','')+'k' : count;
    upBtn.style.color   = current ===  1 ? '#b44dff' : '';
    downBtn.style.color = current === -1 ? '#ff5555' : '';
    countEl.style.color = current ===  1 ? '#b44dff' : current === -1 ? '#ff5555' : '';
  }

  upBtn.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para votar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    current===1 ? (count--,current=0) : (count+=current===-1?2:1,current=1,mostrarToast('Upvote! 🔺','sucesso'));
    render();
  });
  downBtn.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para votar! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    current===-1 ? (count++,current=0) : (count-=current===1?2:1,current=-1,mostrarToast('Downvote 🔻','info'));
    render();
  });
}

// ── LIKE / DISLIKE ────────────────────────────────
// Sistema simples de 👍 e 👎 separado das reações com emoji
function inicializarLikeDislike(card, post) {
  const btnLike    = card.querySelector('.btn-like');
  const btnDislike = card.querySelector('.btn-dislike');
  const likeCount    = card.querySelector('.like-count');
  const dislikeCount = card.querySelector('.dislike-count');

  let likes    = post.likes;
  let dislikes = post.dislikes;
  let estado   = null; // 'like', 'dislike' ou null

  function render() {
    likeCount.textContent    = likes;
    dislikeCount.textContent = dislikes;
    // Ativa o botão clicado com cor verde (like) ou vermelha (dislike)
    btnLike.style.background    = estado === 'like'    ? '#1a3a1a' : '';
    btnLike.style.color         = estado === 'like'    ? '#3ddc84' : '';
    btnLike.style.borderColor   = estado === 'like'    ? '#3ddc84' : '';
    btnDislike.style.background = estado === 'dislike' ? '#3a1a1a' : '';
    btnDislike.style.color      = estado === 'dislike' ? '#ff5555' : '';
    btnDislike.style.borderColor= estado === 'dislike' ? '#ff5555' : '';
  }

  btnLike.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para curtir! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    if (estado === 'like') {
      // Remove o like
      likes--; estado = null;
    } else {
      // Se tinha dislike, remove ele
      if (estado === 'dislike') dislikes--;
      likes++; estado = 'like';
      mostrarToast('Você curtiu esse post! 👍', 'sucesso');
    }
    render();
  });

  btnDislike.addEventListener('click', () => {
    if (!usuarioLogado) { mostrarToast('Entre para reagir! 👤', 'aviso'); abrirModal('modal-auth'); return; }
    if (estado === 'dislike') {
      // Remove o dislike
      dislikes--; estado = null;
    } else {
      // Se tinha like, remove ele
      if (estado === 'like') likes--;
      dislikes++; estado = 'dislike';
      mostrarToast('Você não curtiu esse post 👎', 'info');
    }
    render();
  });
}

// ── REAÇÕES COM EMOJIS ────────────────────────────
function inicializarReacoes(wrap) {
  if (!wrap) return;
  const contagens = {};
  let reacaoUsuario = null;

  const btnReagir = document.createElement('button');
  btnReagir.className = 'btn-reagir';
  btnReagir.innerHTML = '😊 Reagir';

  const picker = document.createElement('div');
  picker.className = 'emoji-picker';

  EMOJIS.forEach(({ emoji, label }) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-opt';
    btn.textContent = emoji;
    btn.title = label;
    btn.addEventListener('click', () => {
      if (!usuarioLogado) { mostrarToast('Entre para reagir! 👤','aviso'); abrirModal('modal-auth'); picker.classList.remove('aberto'); return; }
      if (reacaoUsuario === emoji) {
        contagens[emoji]=(contagens[emoji]||1)-1;
        if(contagens[emoji]<=0)delete contagens[emoji];
        reacaoUsuario=null;
      } else {
        if(reacaoUsuario){contagens[reacaoUsuario]--;if(contagens[reacaoUsuario]<=0)delete contagens[reacaoUsuario];}
        reacaoUsuario=emoji;
        contagens[emoji]=(contagens[emoji]||0)+1;
        mostrarToast(`Você reagiu com ${emoji}`,'sucesso');
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

  function renderBubbles() {
    wrap.querySelectorAll('.reacao-bubble').forEach(b => b.remove());
    Object.entries(contagens).forEach(([emoji, qtd]) => {
      if(qtd<=0)return;
      const bubble = document.createElement('button');
      bubble.className='reacao-bubble'+(reacaoUsuario===emoji?' ativa':'');
      bubble.innerHTML=`${emoji} <span class="contagem">${qtd}</span>`;
      bubble.addEventListener('click',()=>{
        if(!usuarioLogado){abrirModal('modal-auth');return;}
        if(reacaoUsuario===emoji){contagens[emoji]--;if(contagens[emoji]<=0)delete contagens[emoji];reacaoUsuario=null;}
        else{if(reacaoUsuario){contagens[reacaoUsuario]--;if(contagens[reacaoUsuario]<=0)delete contagens[reacaoUsuario];}reacaoUsuario=emoji;contagens[emoji]=(contagens[emoji]||0)+1;}
        renderBubbles();
      });
      wrap.insertBefore(bubble,btnReagir);
    });
  }
}

// ── COMENTÁRIOS ───────────────────────────────────
function inicializarComentarios(secao, postId) {
  if (secao.dataset.inicializado) return;
  secao.dataset.inicializado = 'true';

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
    if (!usuarioLogado) { mostrarToast('Entre para comentar! 👤','aviso'); abrirModal('modal-auth'); return; }
    const texto = textarea.value.trim();
    if (!texto) { mostrarToast('Escreva algo!','aviso'); return; }
    const filtrado = temPalavraProibida(texto);
    const obj = { autor: usuarioLogado.nome, inicial: usuarioLogado.inicial, foto: usuarioLogado.foto, texto: filtrarTexto(texto), filtrado };
    renderComentario(obj, lista);
    const numEl = document.querySelector(`#${postId} .num-comentarios`);
    if (numEl) numEl.textContent = parseInt(numEl.textContent)+1;
    if (filtrado) mostrarToast('Comentário filtrado ⚠️','aviso');
    else mostrarToast('Comentário enviado! 💬','sucesso');
    textarea.value = '';
  });

  textarea.addEventListener('keydown', e => { if(e.key==='Enter'&&e.ctrlKey)btnEnviar.click(); });
  wrap.appendChild(textarea);
  wrap.appendChild(btnEnviar);
  secao.appendChild(wrap);
  const lista = document.createElement('div');
  secao.appendChild(lista);
}

function renderComentario(c, lista) {
  const card = document.createElement('div');
  card.className = 'comentario-card';
  const avatarHTML = c.foto
    ? `<img src="${c.foto}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
    : `<div class="comentario-avatar">${c.inicial}</div>`;
  card.innerHTML = `
    ${avatarHTML}
    <div class="comentario-corpo">
      <div class="comentario-autor">u/${c.autor}</div>
      <div class="comentario-texto">${c.texto}</div>
      ${c.filtrado?`<div class="comentario-aviso">⚠️ Parte deste comentário foi ocultada por violar as regras.</div>`:''}
    </div>`;
  lista.appendChild(card);
}

// ── DELEGAÇÃO DE EVENTOS DO FEED ─────────────────
document.getElementById('feed').addEventListener('click', function(e) {
  const btnComentar = e.target.closest('.btn-comentar');
  if (btnComentar) {
    const postId = btnComentar.dataset.target;
    const secao  = document.getElementById('comentarios-'+postId);
    if (secao) { inicializarComentarios(secao,postId); secao.style.display=secao.style.display==='none'?'block':'none'; }
  }
  if (e.target.closest('.btn-compartilhar')) {
    navigator.clipboard?.writeText(window.location.href).catch(()=>{});
    mostrarToast('Link copiado! 🔗','sucesso');
  }
  if (e.target.closest('.btn-salvar')) {
    if (!usuarioLogado) { mostrarToast('Entre para salvar! 👤','aviso'); abrirModal('modal-auth'); return; }
    const btn = e.target.closest('.btn-salvar');
    const salvo = btn.textContent.includes('Salvo');
    btn.textContent = salvo ? '⭐ Salvar' : '✅ Salvo';
    mostrarToast(salvo?'Removido dos salvos.':'Post salvo! ⭐', salvo?'info':'sucesso');
  }
});

// ── MODAL DE CRIAR POST ───────────────────────────
document.getElementById('btnPostar').addEventListener('click', () => {
  if (!usuarioLogado) { mostrarToast('Entre para postar! 👤','aviso'); abrirModal('modal-auth'); return; }
  abrirModal('modal-post');
});

document.getElementById('post-imagem').addEventListener('change', function() {
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

document.getElementById('btnPublicar').addEventListener('click', () => {
  const titulo    = document.getElementById('post-titulo').value.trim();
  const legenda   = document.getElementById('post-legenda').value.trim();
  const musica    = document.getElementById('post-musica').value.trim();
  const categoria = document.getElementById('post-categoria').value;
  const preview   = document.getElementById('upload-preview');
  const temImg    = preview.style.display !== 'none' && preview.src;
  if (!titulo) { mostrarToast('Título obrigatório!','aviso'); return; }

  const novoPost = {
    id: 'post-'+Date.now(), categoria,
    autor: usuarioLogado.nome, inicial: usuarioLogado.inicial,
    avatarCor: '#7b2fff', comunidade: 'f/geral', tempo: 'agora',
    titulo, texto: legenda,
    tipo: temImg ? 'imagem-url' : 'texto',
    imagemUrl: temImg ? preview.src : null,
    tags: [], votos: 1, likes: 0, dislikes: 0, comentarios: 0,
  };

  POSTS.unshift(novoPost);
  filtrarCategoria(categoriaAtual);
  fecharModal('modal-post');
  document.getElementById('post-titulo').value  = '';
  document.getElementById('post-legenda').value = '';
  document.getElementById('post-musica').value  = '';
  preview.style.display='none'; preview.src='';
  document.getElementById('upload-texto').textContent='📁 Clique para escolher uma imagem da galeria';
  mostrarToast('Post publicado! 🚀','sucesso');
});

// ── TABS ──────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    if (this.textContent.includes('Em Alta')) filtrarCategoria('trending');
    else filtrarCategoria('todos');
  });
});

// ── BUSCA ─────────────────────────────────────────
document.getElementById('search').addEventListener('input', function() {
  const termo = this.value.toLowerCase().trim();
  if (!termo) { filtrarCategoria(categoriaAtual); return; }
  renderizarPosts(POSTS.filter(p => p.titulo.toLowerCase().includes(termo)));
});

// ── BOTÕES FIXOS ──────────────────────────────────
document.getElementById('btnLogin').addEventListener('click', () => abrirModal('modal-auth'));

document.getElementById('btnJoin').addEventListener('click', () => {
  if (!usuarioLogado) { mostrarToast('Entre para participar! 👤','aviso'); abrirModal('modal-auth'); return; }
  const btn = document.getElementById('btnJoin');
  const entrou = btn.textContent.includes('Membro');
  btn.textContent = entrou ? 'Entrar na Comunidade' : '✅ Membro!';
  btn.style.background = entrou ? 'var(--accent)' : 'var(--green)';
  mostrarToast(entrou?'Você saiu da comunidade.':'Você entrou! 🎉', entrou?'info':'sucesso');
});

// ── INICIALIZAÇÃO ─────────────────────────────────
renderizarPosts(POSTS);

card.innerHTML = `
  <!-- Coluna de votos -->
  <div class="vote-col">