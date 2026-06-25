// ══════════════════════════════════════════════════════
//  FRAME A FRAME — script.js
//  Toda a lógica interativa do site:
//  - Login / Cadastro simulado
//  - Modal de criar post com preview de imagem
//  - Sistema de votos (upvote / downvote)
//  - Reações com emojis (estilo Facebook)
//  - Seção de comentários com filtro de linguagem
//  - Navegação e tabs
//  - Notificações (toast)
// ══════════════════════════════════════════════════════


// ── LISTA DE PALAVRAS PROIBIDAS NOS COMENTÁRIOS ──────
// Se o comentário tiver alguma dessas palavras, elas serão
// substituídas por asteriscos e um aviso será exibido.
const PALAVRAS_PROIBIDAS = [
  'merda','bosta','porra','idiota','imbecil','burro','burra',
  'otário','otaria','lixo','inútil','inutil','cretino','cretina',
  'fdp','vsf','desgraça','desgraca','maldito','estúpido','estupido',
  'nojento','nojenta','ridículo','ridiculo','odeio','horrível',
];

// Retorna true se o texto contiver alguma palavra proibida
// CERTO:
function temPalavraProibida(texto) {
  return PALAVRAS_PROIBIDAS.some(p => texto.toLowerCase().includes(p));
}

// Substitui palavras proibidas por asteriscos (ex: "merda" → "*****")
function filtrarTexto(texto) {
  let resultado = texto;
  PALAVRAS_PROIBIDAS.forEach(palavra => {
    const regex = new RegExp(palavra, 'gi'); // 'gi' = case insensitive + global
    resultado = resultado.replace(regex, match => '*'.repeat(match.length));
  });
  return resultado;
}


// ── ESTADO GLOBAL ─────────────────────────────────────
// Armazena o usuário logado. null = não logado.
// Estrutura: { nome: string, email: string, inicial: string }
let usuarioLogado = null;


// ── TOAST (notificação flutuante) ─────────────────────
// Mostra uma mensagem temporária no rodapé da tela.
// tipo: 'info' | 'sucesso' | 'aviso' | 'erro'
function mostrarToast(msg, tipo = 'info') {
  const cores = {
    info:    '#b44dff', // roxo
    sucesso: '#3ddc84', // verde
    aviso:   '#f5c842', // amarelo
    erro:    '#ff4466', // vermelho
  };

  // Cria o elemento do toast dinamicamente
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${cores[tipo]};
    color: #fff;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    opacity: 0;
    transition: all .3s;
    box-shadow: 0 4px 20px rgba(0,0,0,.4);
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    pointer-events: none;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Animação de entrada (aparece subindo)
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  // Remove automaticamente após 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}


// ── MODAIS ────────────────────────────────────────────

// Abre um modal pelo id, com animação de fade-in
function abrirModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.style.display = 'flex';
  m.style.opacity = '0';
  setTimeout(() => (m.style.opacity = '1'), 10);
}

// Fecha um modal pelo id, com animação de fade-out
function fecharModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.style.opacity = '0';
  setTimeout(() => (m.style.display = 'none'), 200);
}

// Fecha o modal ao clicar no overlay escuro (fora da caixa)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function (e) {
    // Só fecha se o clique foi no overlay e não dentro do modal-box
    if (e.target === this) fecharModal(this.id);
  });
});


// ── ALTERNÂNCIA ENTRE LOGIN E CADASTRO ───────────────
// Chamada pelos botões "Entrar" e "Criar conta" dentro do modal de auth
function trocarAba(qual) {
  // Atualiza visual das abas
  document.querySelectorAll('.auth-tab').forEach((tab, i) => {
    tab.classList.toggle('active', (i === 0 && qual === 'login') || (i === 1 && qual === 'cadastro'));
  });

  // Mostra o formulário correto
  document.getElementById('form-login').style.display    = qual === 'login'    ? 'flex' : 'none';
  document.getElementById('form-cadastro').style.display = qual === 'cadastro' ? 'flex' : 'none';

  // Garante os forms com flex-direction column
  ['form-login','form-cadastro'].forEach(id => {
    const el = document.getElementById(id);
    if (el.style.display === 'flex') el.style.flexDirection = 'column';
    if (el.style.display === 'flex') el.style.gap = '10px';
  });
}

// Inicializa os formulários como coluna com gap
document.getElementById('form-login').style.cssText    += 'display:flex;flex-direction:column;gap:10px;';
document.getElementById('form-cadastro').style.cssText += 'display:none;flex-direction:column;gap:10px;';


// ── LOGIN COM GOOGLE (simulado) ───────────────────────
// Em produção, aqui entraria o SDK do Google OAuth
document.getElementById('btnGoogle').addEventListener('click', () => {
  // Simula login com uma conta Google fictícia
  usuarioLogado = { nome: 'Usuário Google', email: 'voce@gmail.com', inicial: 'G' };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast('Bem-vindo! Login com Google realizado ✅', 'sucesso');
});


// ── LOGIN COM EMAIL E SENHA ───────────────────────────
document.getElementById('btnEntrarEmail').addEventListener('click', () => {
  const email = document.getElementById('input-email').value.trim();
  const senha = document.getElementById('input-senha').value.trim();

  // Validações básicas
  if (!email || !senha) {
    mostrarToast('Preencha e-mail e senha!', 'aviso');
    return;
  }
  if (!email.includes('@')) {
    mostrarToast('E-mail inválido!', 'erro');
    return;
  }
  if (senha.length < 6) {
    mostrarToast('Senha deve ter ao menos 6 caracteres!', 'erro');
    return;
  }

  // Simulação: aceita qualquer e-mail/senha válidos (sem backend real)
  const nome = email.split('@')[0]; // usa a parte antes do @ como nome
  usuarioLogado = { nome, email, inicial: nome[0].toUpperCase() };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Bem-vindo, ${nome}! 🎉`, 'sucesso');
});


// ── CADASTRO COM EMAIL / TELEFONE ─────────────────────
document.getElementById('btnCadastrar').addEventListener('click', () => {
  const nome  = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const tel   = document.getElementById('cad-tel').value.trim();
  const senha = document.getElementById('cad-senha').value.trim();

  // Pelo menos nome + (email ou telefone) + senha
  if (!nome) { mostrarToast('Escolha um nome de usuário!', 'aviso'); return; }
  if (!email && !tel) { mostrarToast('Informe e-mail ou telefone!', 'aviso'); return; }
  if (senha.length < 6) { mostrarToast('Senha deve ter ao menos 6 caracteres!', 'erro'); return; }

  // Cria o usuário na memória
  usuarioLogado = { nome, email: email || tel, inicial: nome[0].toUpperCase() };
  fecharModal('modal-auth');
  atualizarUILogin();
  mostrarToast(`Conta criada! Bem-vindo, ${nome}! 🚀`, 'sucesso');
});


// ── ATUALIZA O HEADER APÓS LOGIN ──────────────────────
// Troca o botão "Entrar" pelo avatar do usuário logado
function atualizarUILogin() {
  const btnLogin = document.getElementById('btnLogin');
  if (!usuarioLogado) return;

  // Substitui o botão por um avatar com inicial do nome
  btnLogin.textContent = '';
  btnLogin.style.cssText = `
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #b44dff, #7b2fff);
    color: #fff; font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #b44dff; cursor: pointer;
  `;
  btnLogin.textContent = usuarioLogado.inicial;

  // Ao clicar no avatar, mostra opção de logout
  btnLogin.onclick = () => {
    if (confirm(`Sair da conta de ${usuarioLogado.nome}?`)) {
      usuarioLogado = null;
      // Restaura o botão original
      btnLogin.textContent = 'Entrar';
      btnLogin.style.cssText = '';
      btnLogin.className = 'btn-login';
      btnLogin.onclick = () => abrirModal('modal-auth');
      mostrarToast('Você saiu da conta.', 'info');
    }
  };
}


// ── BOTÃO "+ POSTAR" ──────────────────────────────────
document.getElementById('btnPostar').addEventListener('click', () => {
  if (!usuarioLogado) {
    mostrarToast('Faça login para postar! 👤', 'aviso');
    abrirModal('modal-auth');
    return;
  }
  abrirModal('modal-post');
});


// ── BOTÃO "ENTRAR" NO HEADER ──────────────────────────
document.getElementById('btnLogin').addEventListener('click', () => {
  abrirModal('modal-auth');
});


// ── PREVIEW DE IMAGEM NO MODAL DE POST ───────────────
// Quando o usuário escolhe uma imagem, mostra um preview antes de publicar
document.getElementById('post-imagem').addEventListener('change', function () {
  const arquivo = this.files[0]; // pega o primeiro arquivo selecionado
  if (!arquivo) return;

  const reader = new FileReader(); // lê o arquivo como URL de dados
  reader.onload = function (e) {
    const preview = document.getElementById('upload-preview');
    const texto   = document.getElementById('upload-texto');
    preview.src = e.target.result; // define a imagem no <img>
    preview.style.display = 'block';
    texto.textContent = '✅ Imagem selecionada!';
  };
  reader.readAsDataURL(arquivo); // converte para base64 (para exibir sem upload)
});


// ── PUBLICAR POST ─────────────────────────────────────
// Cria um novo card de post no topo do feed
document.getElementById('btnPublicar').addEventListener('click', () => {
  const titulo   = document.getElementById('post-titulo').value.trim();
  const legenda  = document.getElementById('post-legenda').value.trim();
  const musica   = document.getElementById('post-musica').value.trim();
  const preview  = document.getElementById('upload-preview');
  const temImagem = preview.style.display !== 'none' && preview.src;

  // Título é obrigatório
  if (!titulo) { mostrarToast('O título é obrigatório!', 'aviso'); return; }

  // Gera um id único para o novo post
  const idPost = 'post-' + Date.now();

  // Monta o HTML do card do novo post
  const card = document.createElement('div');
  card.className = 'post-card';
  card.id = idPost;
  card.innerHTML = `
    <!-- Coluna de votos do novo post -->
    <div class="vote-col">
      <button class="vote-btn up" title="Upvote">▲</button>
      <span class="vote-count">1</span>
      <button class="vote-btn down" title="Downvote">▼</button>
    </div>

    <!-- Corpo do novo post -->
    <div class="post-body">
      <div class="post-meta">
        <div class="avatar-sm" style="background:var(--accent2);">${usuarioLogado.inicial}</div>
        <span class="community">f/geral</span>
        · postado por <strong>u/${usuarioLogado.nome}</strong> · agora
      </div>
      <div class="post-title">${titulo}</div>

      <!-- Imagem do post (se o usuário escolheu uma) -->
      ${temImagem ? `<img src="${preview.src}" style="width:100%;max-height:360px;object-fit:cover;border-radius:6px;margin-bottom:10px;">` : ''}

      <!-- Legenda/descrição (se preenchida) -->
      ${legenda ? `<div class="post-text">${legenda}</div>` : ''}

      <!-- Música associada (se informada) -->
      ${musica ? `<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">🎵 ${musica}</div>` : ''}

      <!-- Área de reações do novo post -->
      <div class="reacoes-wrap" data-post="${idPost}"></div>

      <!-- Ações do novo post -->
      <div class="post-actions">
        <button class="action-btn btn-comentar" data-target="${idPost}">💬 <span class="num-comentarios">0</span> comentários</button>
        <button class="action-btn btn-compartilhar">🔗 Compartilhar</button>
        <button class="action-btn btn-salvar">⭐ Salvar</button>
      </div>

      <!-- Seção de comentários (oculta inicialmente) -->
      <div class="secao-comentarios" id="comentarios-${idPost}" style="display:none;"></div>
    </div>
  `;

  // Insere o novo post no topo do feed (antes do primeiro post existente)
  const feed = document.querySelector('main');
  const primeirPost = feed.querySelector('.post-card');
  feed.insertBefore(card, primeirPost);

  // Inicializa os votos do novo post
  inicializarVotos(card.querySelector('.vote-col'));

  // Inicializa as reações do novo post
  inicializarReacoes(card.querySelector('.reacoes-wrap'));

  // Inicializa os botões de ação do novo post
  inicializarAcoes(card);

  // Fecha o modal e limpa os campos
  fecharModal('modal-post');
  document.getElementById('post-titulo').value  = '';
  document.getElementById('post-legenda').value = '';
  document.getElementById('post-musica').value  = '';
  preview.style.display  = 'none';
  preview.src = '';
  document.getElementById('upload-texto').textContent = '📁 Clique para escolher uma imagem da galeria';

  mostrarToast('Post publicado com sucesso! 🚀', 'sucesso');
});


// ── SISTEMA DE VOTOS ──────────────────────────────────
// Inicializa os botões de upvote e downvote de uma coluna de votos.
// Recebe o elemento .vote-col como parâmetro.
function inicializarVotos(col) {
  const upBtn   = col.querySelector('.vote-btn.up');
  const downBtn = col.querySelector('.vote-btn.down');
  const countEl = col.querySelector('.vote-count');

  // Pega o valor atual (pode ter "k" no final para milhares)
  let count   = parseInt(countEl.textContent.replace('k','')) * (countEl.textContent.includes('k') ? 1000 : 1);
  let current = 0; // estado atual: -1 = downvote, 0 = neutro, 1 = upvote

  // Atualiza a exibição do contador e cores dos botões
  function render() {
    countEl.textContent = count >= 1000
      ? (count / 1000).toFixed(1).replace('.0', '') + 'k'
      : count;
    upBtn.style.color   = current ===  1 ? '#b44dff' : ''; // roxo se upvotado
    downBtn.style.color = current === -1 ? '#ff5555' : ''; // vermelho se downvotado
    countEl.style.color = current ===  1 ? '#b44dff' : current === -1 ? '#ff5555' : '';
  }

  upBtn.addEventListener('click', () => {
    if (!usuarioLogado) {
      mostrarToast('Entre na conta para votar! 👤', 'aviso');
      abrirModal('modal-auth');
      return;
    }
    if (current === 1) {
      // Clicou de novo no upvote: cancela
      count--;
      current = 0;
    } else {
      // Se estava com downvote, pula 2 pontos; senão soma 1
      count += current === -1 ? 2 : 1;
      current = 1;
      mostrarToast('Upvote dado! 🔺', 'sucesso');
    }
    render();
  });

  downBtn.addEventListener('click', () => {
    if (!usuarioLogado) {
      mostrarToast('Entre na conta para votar! 👤', 'aviso');
      abrirModal('modal-auth');
      return;
    }
    if (current === -1) {
      // Clicou de novo no downvote: cancela
      count++;
      current = 0;
    } else {
      count -= current === 1 ? 2 : 1;
      current = -1;
      mostrarToast('Downvote dado 🔻', 'info');
    }
    render();
  });
}

// Inicializa todos os .vote-col que já existem no HTML
document.querySelectorAll('.vote-col').forEach(col => inicializarVotos(col));


// ── REAÇÕES COM EMOJIS (estilo Facebook) ─────────────
const EMOJIS_DISPONIVEIS = [
  { emoji: '❤️',  label: 'Amei'       },
  { emoji: '🔥',  label: 'Incrível'   },
  { emoji: '😂',  label: 'Haha'       },
  { emoji: '😮',  label: 'Uau'        },
  { emoji: '😢',  label: 'Triste'     },
  { emoji: '👏',  label: 'Parabéns'   },
];

// Inicializa a área de reações de um post.
// Cria o botão "Reagir" e o picker de emojis.
function inicializarReacoes(wrap) {
  if (!wrap) return;

  // Contador das reações: { '❤️': 3, '🔥': 1, ... }
  const contagens = {};
  // Qual emoji o usuário atual escolheu (ou null)
  let reacaoUsuario = null;

  // Cria o botão "😊 Reagir"
  const btnReagir = document.createElement('button');
  btnReagir.className = 'btn-reagir';
  btnReagir.title = 'Reagir';
  btnReagir.innerHTML = '😊 Reagir';

  // Cria o picker flutuante de emojis
  const picker = document.createElement('div');
  picker.className = 'emoji-picker';

  // Adiciona cada emoji ao picker
  EMOJIS_DISPONIVEIS.forEach(({ emoji, label }) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-opt';
    btn.textContent = emoji;
    btn.title = label;

    btn.addEventListener('click', () => {
      if (!usuarioLogado) {
        mostrarToast('Entre para reagir! 👤', 'aviso');
        abrirModal('modal-auth');
        picker.classList.remove('aberto');
        return;
      }

      if (reacaoUsuario === emoji) {
        // Clicou no mesmo emoji: remove a reação
        contagens[emoji] = (contagens[emoji] || 1) - 1;
        if (contagens[emoji] <= 0) delete contagens[emoji];
        reacaoUsuario = null;
      } else {
        // Remove reação anterior (se havia)
        if (reacaoUsuario) {
          contagens[reacaoUsuario] = (contagens[reacaoUsuario] || 1) - 1;
          if (contagens[reacaoUsuario] <= 0) delete contagens[reacaoUsuario];
        }
        // Adiciona nova reação
        reacaoUsuario = emoji;
        contagens[emoji] = (contagens[emoji] || 0) + 1;
        mostrarToast(`Você reagiu com ${emoji}`, 'sucesso');
      }

      // Fecha o picker e re-renderiza as bolhas de reação
      picker.classList.remove('aberto');
      renderReacoes();
    });

    picker.appendChild(btn);
  });

  // Ao clicar em "Reagir", abre/fecha o picker
  btnReagir.appendChild(picker);
  btnReagir.addEventListener('click', (e) => {
    e.stopPropagation(); // não propaga o clique para fechar o picker
    picker.classList.toggle('aberto');
  });

  // Fecha o picker ao clicar em qualquer lugar fora
  document.addEventListener('click', () => picker.classList.remove('aberto'));

  // Adiciona o botão à área de reações
  wrap.appendChild(btnReagir);

  // Renderiza as bolhas de reação com contadores
  function renderReacoes() {
    // Remove bolhas existentes (mas mantém o botão "Reagir")
    wrap.querySelectorAll('.reacao-bubble').forEach(b => b.remove());

    // Cria uma bolha para cada emoji que tem pelo menos 1 reação
    Object.entries(contagens).forEach(([emoji, qtd]) => {
      if (qtd <= 0) return;

      const bubble = document.createElement('button');
      bubble.className = 'reacao-bubble' + (reacaoUsuario === emoji ? ' ativa' : '');
      bubble.innerHTML = `${emoji} <span class="contagem">${qtd}</span>`;
      bubble.title = `${qtd} ${emoji}`;

      // Clicar na bolha também funciona como reagir/remover
      bubble.addEventListener('click', () => {
        if (!usuarioLogado) { abrirModal('modal-auth'); return; }
        if (reacaoUsuario === emoji) {
          contagens[emoji]--;
          if (contagens[emoji] <= 0) delete contagens[emoji];
          reacaoUsuario = null;
        } else {
          if (reacaoUsuario) {
            contagens[reacaoUsuario]--;
            if (contagens[reacaoUsuario] <= 0) delete contagens[reacaoUsuario];
          }
          reacaoUsuario = emoji;
          contagens[emoji] = (contagens[emoji] || 0) + 1;
        }
        renderReacoes();
      });

      // Insere a bolha antes do botão "Reagir"
      wrap.insertBefore(bubble, btnReagir);
    });
  }
}

// Inicializa reações em todos os posts já existentes
document.querySelectorAll('.reacoes-wrap').forEach(wrap => inicializarReacoes(wrap));


// ── SEÇÃO DE COMENTÁRIOS ──────────────────────────────
// Abre (ou fecha) a seção de comentários de um post.
// Cria o campo de escrita e lista os comentários existentes.
function inicializarComentarios(secao, postId) {
  if (secao.dataset.inicializado) return; // evita duplicar
  secao.dataset.inicializado = 'true';

  // Array de comentários desse post (começa vazio)
  const comentarios = [];

  // ── Campo de escrever comentário ──
  const inputWrap = document.createElement('div');
  inputWrap.className = 'comentario-input-wrap';

  const textarea = document.createElement('textarea');
  textarea.className = 'comentario-textarea';
  textarea.placeholder = 'Escreva um comentário respeitoso…';
  textarea.rows = 2;

  const btnEnviar = document.createElement('button');
  btnEnviar.className = 'btn-enviar-comentario';
  btnEnviar.textContent = 'Enviar';

  // ── Envio do comentário ──
  btnEnviar.addEventListener('click', () => {
    if (!usuarioLogado) {
      mostrarToast('Entre para comentar! 👤', 'aviso');
      abrirModal('modal-auth');
      return;
    }

    const texto = textarea.value.trim();
    if (!texto) { mostrarToast('Escreva algo antes de enviar!', 'aviso'); return; }

    // Verifica se tem palavras proibidas
    const foiFiltrado = temPalavraProibida(texto);
    const textoFinal  = filtrarTexto(texto); // aplica os asteriscos

    // Cria o objeto do comentário
    const novoComentario = {
      autor:      usuarioLogado.nome,
      inicial:    usuarioLogado.inicial,
      texto:      textoFinal,
      foiFiltrado,
    };
    comentarios.push(novoComentario);

    // Renderiza o comentário na tela
    renderizarComentario(novoComentario, lista);

    // Atualiza o contador de comentários no botão do post
    const btnComentar = document.querySelector(`[data-target="${postId}"] .num-comentarios`) ||
                        document.querySelector(`#${postId} .num-comentarios`);
    if (btnComentar) btnComentar.textContent = parseInt(btnComentar.textContent) + 1;

    // Avisa se o comentário foi filtrado
    if (foiFiltrado) {
      mostrarToast('Seu comentário tinha palavras inadequadas e foi filtrado ⚠️', 'aviso');
    } else {
      mostrarToast('Comentário enviado! 💬', 'sucesso');
    }

    textarea.value = ''; // limpa o campo
  });

  // Permite enviar com Ctrl+Enter
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) btnEnviar.click();
  });

  inputWrap.appendChild(textarea);
  inputWrap.appendChild(btnEnviar);
  secao.appendChild(inputWrap);

  // ── Lista de comentários ──
  const lista = document.createElement('div');
  lista.className = 'lista-comentarios';
  secao.appendChild(lista);
}

// Cria e adiciona um card de comentário à lista
function renderizarComentario(comentario, lista) {
  const card = document.createElement('div');
  card.className = 'comentario-card';

  card.innerHTML = `
    <!-- Avatar com inicial do autor -->
    <div class="comentario-avatar">${comentario.inicial}</div>
    <div class="comentario-corpo">
      <!-- Nome do autor em roxo -->
      <div class="comentario-autor">u/${comentario.autor}</div>
      <!-- Texto do comentário (pode ter asteriscos se foi filtrado) -->
      <div class="comentario-texto">${comentario.texto}</div>
      <!-- Aviso exibido apenas se o comentário foi filtrado -->
      ${comentario.foiFiltrado
        ? `<div class="comentario-aviso">⚠️ Parte deste comentário foi ocultada por violar as regras da comunidade.</div>`
        : ''}
    </div>
  `;

  lista.appendChild(card);
}

// ── BOTÕES "comentários" DOS POSTS ────────────────────
// Delega eventos para todos os botões .btn-comentar (inclusive novos posts)
document.querySelector('main').addEventListener('click', function (e) {
  // Busca o botão de comentar mais próximo do elemento clicado
  const btn = e.target.closest('.btn-comentar');
  if (!btn) return;

  const postId = btn.dataset.target;
  const secao  = document.getElementById('comentarios-' + postId);
  if (!secao) return;

  // Inicializa a seção na primeira abertura
  inicializarComentarios(secao, postId);

  // Alterna visibilidade da seção
  const aberto = secao.style.display !== 'none';
  secao.style.display = aberto ? 'none' : 'block';
});


// ── BOTÕES "Compartilhar" e "Salvar" ─────────────────
// Delegação de eventos para funcionar em posts novos também
document.querySelector('main').addEventListener('click', function (e) {
  const btn = e.target.closest('.action-btn');
  if (!btn) return;

  if (btn.classList.contains('btn-compartilhar')) {
    // Copia a URL da página para a área de transferência
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    mostrarToast('Link copiado! 🔗', 'sucesso');
  }

  if (btn.classList.contains('btn-salvar')) {
    if (!usuarioLogado) {
      mostrarToast('Entre para salvar posts! 👤', 'aviso');
      abrirModal('modal-auth');
      return;
    }
    // Alterna o estado visual do botão salvar
    const jaSalvo = btn.textContent.includes('Salvo');
    btn.textContent = jaSalvo ? '⭐ Salvar' : '✅ Salvo';
    mostrarToast(jaSalvo ? 'Post removido dos salvos.' : 'Post salvo! ⭐', jaSalvo ? 'info' : 'sucesso');
  }
});


// ── TABS DO FEED ──────────────────────────────────────
// Alterna qual aba está ativa (Em Alta / Novos / Melhores / Comunidade)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    mostrarToast(`Mostrando: ${this.textContent.trim()}`, 'info');
  });
});


// ── LINKS DA SIDEBAR ESQUERDA ────────────────────────
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});


// ── LINKS DO MENU DE NAVEGAÇÃO (NAV) ─────────────────
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // impede reload da página
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
    mostrarToast(`Navegando: ${this.textContent.trim()}`, 'info');
  });
});


// ── BOTÃO "ENTRAR NA COMUNIDADE" (sidebar) ───────────
document.getElementById('btnJoin').addEventListener('click', () => {
  if (!usuarioLogado) {
    mostrarToast('Faça login para entrar na comunidade! 👤', 'aviso');
    abrirModal('modal-auth');
    return;
  }
  const btn = document.getElementById('btnJoin');
  const jaEntrou = btn.textContent.includes('Membro');
  btn.textContent = jaEntrou ? 'Entrar na Comunidade' : '✅ Membro!';
  btn.style.background = jaEntrou ? 'var(--accent)' : 'var(--green)';
  mostrarToast(jaEntrou ? 'Você saiu da comunidade.' : 'Você entrou na comunidade! 🎉', jaEntrou ? 'info' : 'sucesso');
});


// ── BUSCA ─────────────────────────────────────────────
// Filtra os posts do feed em tempo real pelo título
document.getElementById('search').addEventListener('input', function () {
  const termo = this.value.toLowerCase().trim();
  document.querySelectorAll('.post-card').forEach(card => {
    const titulo = card.querySelector('.post-title')?.textContent.toLowerCase() || '';
    // Mostra o card se o título contiver o termo buscado (ou se o campo estiver vazio)
    card.style.display = (!termo || titulo.includes(termo)) ? '' : 'none';
  });
});


// ── INICIALIZAÇÃO DE AÇÕES EM POSTS ──────────────────
// Usado para posts criados dinamicamente pelo usuário
function inicializarAcoes(card) {
  // Os eventos de .btn-comentar, .btn-compartilhar e .btn-salvar
  // são capturados pela delegação de eventos no <main> acima,
  // então não é necessário adicionar listeners individuais aqui.
  // Esta função existe para inicializar votos e reações do novo card.
}