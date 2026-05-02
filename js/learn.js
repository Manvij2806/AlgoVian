(function(){
  const topics = window.TOPICS;
  const list = document.getElementById('topicList');
  const search = document.getElementById('topicSearch');
  const main = document.getElementById('topicMain');
  let active = topics[0].id;
  let activeTab = 'theory';

  // AI Chat Elements
  const askAIBtn = document.getElementById('askAIBtn');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const aiChatPanel = document.getElementById('aiChatPanel');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatHistory = document.getElementById('chatHistory');
  
  let chatMessages = [];

  function renderList(filter=''){
    const f = filter.trim().toLowerCase();
    list.innerHTML = topics
      .filter(t => !f || t.name.toLowerCase().includes(f))
      .map(t => `<li data-id="${t.id}" class="${t.id===active?'active':''}">
          <span class="dot" style="background:${t.color}"></span>${t.name}
        </li>`).join('');
    list.querySelectorAll('li').forEach(li=>{
      li.addEventListener('click', ()=>{ active = li.dataset.id; activeTab='theory'; renderList(search.value); renderMain(); });
    });
  }

  function renderMain(){
    const t = topics.find(x => x.id === active);
    main.innerHTML = `
      <div class="topic-header">
        <span class="badge" style="background:${t.color}1A;color:${t.color}">${t.name}</span>
        <h1>${t.name}</h1>
        <p>${t.description}</p>
      </div>
      <div class="tabs">
        ${['theory','formulas','code','complexity'].map(k=>`<div class="tab ${k===activeTab?'active':''}" data-tab="${k}">${k[0].toUpperCase()+k.slice(1)}</div>`).join('')}
      </div>
      <div id="tabBody"></div>
      <button class="btn btn-secondary ask-ai">✨ Ask AI about ${t.name}</button>
    `;
    main.querySelectorAll('.tab').forEach(tab=>{
      tab.addEventListener('click', ()=>{ activeTab = tab.dataset.tab; renderMain(); });
    });
    
    const inlineAskBtn = main.querySelector('.ask-ai');
    if (inlineAskBtn) {
      inlineAskBtn.addEventListener('click', openChat);
    }
    
    renderTab(t);
  }

  function renderTab(t){
    const body = document.getElementById('tabBody');
    if(activeTab==='theory'){
      body.innerHTML = `
        <div class="def-box">
          <h4>Definition</h4>
          <p>${t.description}</p>
        </div>
        <h4 style="margin:16px 0 10px;font-size:14px">Key Points</h4>
        <ul class="key-points">${t.keyPoints.map(k=>`<li>${k}</li>`).join('')}</ul>`;
    } else if(activeTab==='formulas'){
      body.innerHTML = `<div class="formula-grid">
        ${t.formulas.map(f=>`<div class="formula-card"><div class="label">${f.label}</div><div class="formula">${f.formula}</div></div>`).join('')}
      </div>`;
    } else if(activeTab==='code'){
      body.innerHTML = `<pre class="code-block">${t.code}</pre>`;
    } else {
      body.innerHTML = `<table class="complex-table">
        <thead><tr><th>Case</th><th>Complexity</th><th>Rating</th></tr></thead>
        <tbody>${t.complexity.map(c=>`<tr><td>${c[0]}</td><td><code>${c[1]}</code></td><td class="cell-${c[2]}">${c[2]==='good'?'Excellent':c[2]==='ok'?'Acceptable':'Poor'}</td></tr>`).join('')}</tbody>
      </table>`;
    }
  }

  // Chat Logic
  function openChat() {
    aiChatPanel.classList.remove('hidden');
    chatInput.focus();
  }

  function closeChat() {
    aiChatPanel.classList.add('hidden');
  }

  if (askAIBtn) askAIBtn.addEventListener('click', openChat);
  if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    const t = topics.find(x => x.id === active);
    
    // Add user msg
    addMessageToUI('user', text);
    chatInput.value = '';
    
    // Add thinking msg
    const loadingId = 'loading-' + Date.now();
    const loadingHtml = `<div class="ai-thinking">Thinking<span>.</span><span>.</span><span>.</span></div>`;
    addMessageToUI('ai', loadingHtml, loadingId);

    try {
      if (window.API) {
        // Send to backend
        const res = await window.API.askAITutor(t.name, text, chatMessages);
        
        // Remove loading
        removeMessageFromUI(loadingId);
        
        // Add AI msg
        addMessageToUI('ai', res.response);
        
        // Update history
        chatMessages.push({ role: 'user', content: text });
        chatMessages.push({ role: 'assistant', content: res.response });
      } else {
        throw new Error("API not loaded");
      }
    } catch (e) {
      console.error(e);
      removeMessageFromUI(loadingId);
      addMessageToUI('ai', 'Sorry, I am having trouble connecting to the server.');
    }
  }

  function addMessageToUI(sender, htmlContent, id = null) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    if (id) div.id = id;
    div.innerHTML = htmlContent;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function removeMessageFromUI(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
  if (chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  search.addEventListener('input', ()=> renderList(search.value));
  renderList();
  renderMain();
})();
