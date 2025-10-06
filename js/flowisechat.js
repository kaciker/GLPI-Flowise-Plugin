*
  flowisechat.js — GLPI → Flowise /api/v1/prediction
  Corregido: sin "return" en top‑level, sin bloques de Custom Function del servidor.
  Este archivo SOLO contiene lógica de navegador.
*/
(() => {
  // Utilidades externas (Markdown + sanitizado)
  (function loadScripts() {
    const add = (src) => { const s = document.createElement('script'); s.src = src; s.defer = true; document.head.appendChild(s); };
    add('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    add('https://cdn.jsdelivr.net/npm/dompurify@3.0.1/dist/purify.min.js');
  })();

  const FLOW_ID = '5c3c7ae7-c2bb-4e69-a16a-8eb15f3f1923';
  const BASE_URL = `${location.protocol}//${location.hostname}:3000`;
  const SESSION_KEY = 'flowise_chat_sessionId';

  let sessionId = localStorage.getItem(SESSION_KEY) || '';
  let glpi = null;

  async function fetchGlpiSession() {
    try {
      const res = await fetch('/plugins/flowisechat/ajax/session.php', { credentials: 'same-origin' });
      if (res.ok) {
        glpi = await res.json();
        if (glpi && glpi.sid) {
          sessionId = glpi.sid;
          localStorage.setItem(SESSION_KEY, sessionId);
          window.FlowiseChatSession = glpi; // opcional
        }
      }
    } catch (e) {
      console.warn('GLPI session fetch error:', e);
    }
  }

  function ensureSession() {
    if (!sessionId) {
      sessionId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
  }

  function ui() {
    const button = document.createElement('button');
    button.innerHTML = `<img src="/plugins/flowisechat/js/img/logo-hutchinson-white.png" alt="AI" style="height:20px; vertical-align:middle; margin-right:6px;"> iA-sistant`;
    Object.assign(button.style, {
      position: 'fixed', bottom: '30px', right: '30px', padding: '14px 18px',
      background: 'linear-gradient(135deg, #E30613, #8B0000)', color: '#fff',
      fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '50px',
      boxShadow: '0 4px 12px rgba(0,0,0,.25)', cursor: 'pointer', zIndex: 10000
    });

    const chat = document.createElement('div');
    Object.assign(chat.style, {
      position: 'fixed', bottom: '90px', right: '30px', width: '380px', maxHeight: '500px',
      background: '#fff', border: '1px solid #ccc', borderRadius: '10px', padding: '10px',
      display: 'none', flexDirection: 'column', zIndex: 10000, boxShadow: '0 4px 12px rgba(0,0,0,.2)'
    });

    const messages = document.createElement('div');
    Object.assign(messages.style, { flex: '1', overflowY: 'auto', marginBottom: '10px' });
    chat.appendChild(messages);

    const input = document.createElement('input');
    input.type = 'text'; input.placeholder = 'Describe tu problema...';
    Object.assign(input.style, { width: '100%', padding: '10px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '5px' });
    chat.appendChild(input);

    const send = document.createElement('button');
    send.innerHTML = `<img src="/plugins/flowisechat/js/img/logo-hutchinson-white.png" alt="Enviar" style="height:20px; vertical-align:middle; margin-right:8px;">Enviar`;
    Object.assign(send.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', background: '#E30613', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' });
    chat.appendChild(send);

    document.body.appendChild(button);
    document.body.appendChild(chat);

    const renderMessage = (role, content) => {
      const wrap = document.createElement('div'); const bubble = document.createElement('div');
      wrap.className = 'message ' + role; bubble.className = 'bubble';
      const raw = (window.marked ? marked.parse(String(content||'').trim()) : String(content||'').trim().replace(/\n/g,'<br>'));
      bubble.innerHTML = (window.DOMPurify ? DOMPurify.sanitize(raw) : raw);
      Object.assign(bubble.style, role === 'user' ? { background:'#f0f0f0', color:'#000', padding:'8px 12px', borderRadius:'8px', margin:'4px 0', alignSelf:'flex-end', maxWidth:'90%', border:'1px solid #ccc' } : role === 'assistant' ? { background:'#e6f0fa', color:'#003366', padding:'8px 12px', borderRadius:'8px', margin:'4px 0', alignSelf:'flex-start', maxWidth:'90%', border:'1px solid #99c2ff' } : { background:'#fff8e1', color:'#333', padding:'8px 12px', borderRadius:'8px', margin:'4px 0', alignSelf:'center', maxWidth:'90%', border:'1px solid #fdd835' });
      wrap.appendChild(bubble); messages.appendChild(wrap); messages.scrollTop = messages.scrollHeight; wrap.scrollIntoView({ behavior:'smooth', block:'start' });
    };

    button.addEventListener('click', () => {
      const open = chat.style.display === 'none';
      chat.style.display = open ? 'flex' : 'none';
      if (open) renderMessage('system', '🤖 Welcome to <b style="color:#E30613">iAiT</b> support'); else messages.innerHTML = '';
    });

    send.addEventListener('click', sendQuestion);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendQuestion(); });

    async function sendQuestion() {
      const q = input.value.trim(); if (!q) return;
      renderMessage('user', q); input.value = ''; const idx = messages.children.length; renderMessage('assistant', '🤖 Pensando...');

      const firstname = window.FlowiseChatSession?.firstname || '';
      const lastname  = window.FlowiseChatSession?.lastname  || '';
      const username  = window.FlowiseChatSession?.username  || '';
      const userid    = window.FlowiseChatSession?.userid    || '';

      const body = {
        question: q,
        overrideConfig: {
          sessionId,
          vars: {
            name: [firstname, lastname].filter(Boolean).join(' ').trim() || username || userid || 'anon',
            user: username || userid || 'anon',
            userid: userid || ''
          }
        }
      };

      console.debug('POST → /api/v1/prediction body:', body);

      try {
        const res = await fetch(`${BASE_URL}/api/v1/prediction/${FLOW_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer 0HWkYMNQtzRyjC_fsbyJ4a-YVT5YF673kSygqIegmo8' },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        messages.removeChild(messages.children[idx]);
        renderMessage('assistant', data.text || JSON.stringify(data));
      } catch (err) {
        messages.removeChild(messages.children[idx]);
        renderMessage('system', '❌ Error de conexión: ' + err.message);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await fetchGlpiSession();
    ensureSession();
    ui();
  });
})();

/* NOTA IMPORTANTE:
   El código de "Custom Function Init" con "return {...}" pertenece a Flowise (nodo del servidor),
   NO debe incrustarse en este archivo de navegador. Si lo pones aquí, el motor JS del navegador
   lanza "Illegal return statement" porque no está dentro de ninguna función. */
