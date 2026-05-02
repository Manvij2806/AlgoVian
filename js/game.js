(function(){
  let QUESTIONS = [
    {q:"What is the time complexity of merge sort?", opts:["O(n²)","O(n log n)","O(log n)","O(n)"], a:1, explanation: "Merge sort divides the array in half (log n) and merges them (n), resulting in O(n log n)."},
    {q:"Which algorithm uses the greedy approach?", opts:["Merge sort","Floyd-Warshall","Dijkstra's","Bellman-Ford"], a:2, explanation: "Dijkstra's algorithm always chooses the closest vertex, making it a greedy algorithm."},
    {q:"What does memoization do in DP?", opts:["Sorts recursively","Stores subproblem results","Prunes branches","Divides input"], a:1, explanation: "Memoization stores the results of expensive function calls to avoid recalculating them."},
    {q:"BFS uses which data structure?", opts:["Stack","Queue","Heap","Tree"], a:1, explanation: "BFS explores level by level, which naturally requires a FIFO Queue."},
    {q:"Worst case of quicksort is?", opts:["O(n log n)","O(n)","O(n²)","O(log n)"], a:2, explanation: "Quicksort's worst case O(n²) occurs when the pivot chosen is consistently the smallest or largest element."}
  ];

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(t=>{
    t.addEventListener('click', ()=>{
      document.querySelectorAll('.mode-tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.mode-panel').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('mode-'+t.dataset.mode).classList.add('active');
    });
  });

  // VS AI mode
  let qIdx=0, you=0, bot=0, locked=false, timer=null, timeLeft=15;
  let isGenerating = false;
  const qText = document.getElementById('qText');
  const optsEl = document.getElementById('options');
  const dotsEl = document.getElementById('dots');
  const youScore = document.getElementById('youScore');
  const botScore = document.getElementById('botScore');
  const timerEl = document.getElementById('timer');
  const getHintBtn = document.getElementById('getHintBtn');
  const hintBox = document.getElementById('hintBox');
  const aiThinking = document.getElementById('ai-thinking');

  async function fetchNextQuestion() {
    isGenerating = true;
    aiThinking.classList.remove('hidden');
    aiThinking.innerHTML = 'AlgoBot is crafting the next question<span>.</span><span>.</span><span>.</span>';
    
    // Default topic if we don't have a specific one
    const topic = "Design and Analysis of Algorithms";
    let difficulty = "medium";
    if (you > bot + 2) difficulty = "hard";
    if (you < bot) difficulty = "easy";

    try {
      if (window.API) {
        const data = await window.API.generateQuestion(topic, difficulty, you, bot);
        QUESTIONS.push({
          q: data.question,
          opts: data.options,
          a: data.correct_index,
          explanation: data.explanation
        });
      } else {
        throw new Error("API not loaded");
      }
    } catch (e) {
      console.error(e);
      // Fallback
      QUESTIONS.push({
        q: "What is the time complexity of binary search?",
        opts: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        a: 2,
        explanation: "Binary search halves the search space each step."
      });
    }
    
    aiThinking.classList.add('hidden');
    isGenerating = false;
    renderQuestion();
  }

  function renderQuestion(){
    locked = false;
    const q = QUESTIONS[qIdx];
    qText.textContent = q.q;
    optsEl.innerHTML = q.opts.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join('');
    optsEl.querySelectorAll('.option').forEach(b=> b.addEventListener('click', ()=> answer(+b.dataset.i)));
    
    // Keep at most 5 dots visible for UI cleanliness
    const startIdx = Math.max(0, qIdx - 4);
    dotsEl.innerHTML = QUESTIONS.slice(startIdx, startIdx + 5).map((_, i) => {
      const actualIdx = startIdx + i;
      return `<span class="qdot ${actualIdx === qIdx ? 'active' : actualIdx < qIdx ? 'done' : ''}"></span>`;
    }).join('');
    
    youScore.textContent = `Score: ${you}`;
    botScore.textContent = `Score: ${bot}`;
    
    hintBox.classList.add('hidden');
    hintBox.textContent = '';
    getHintBtn.style.display = 'inline-block';
    getHintBtn.disabled = false;
    
    timeLeft = 15; timerEl.textContent = `${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(()=>{
      timeLeft--; timerEl.textContent = `${timeLeft}s`;
      if(timeLeft<=0){ clearInterval(timer); if(!locked) answer(-1); }
    }, 1000);
  }

  if (getHintBtn) {
    getHintBtn.addEventListener('click', async () => {
      if (locked || you < 2) {
        if (you < 2) alert("You need at least 2 points to get a hint!");
        return;
      }
      getHintBtn.disabled = true;
      getHintBtn.textContent = 'Loading hint...';
      try {
        const q = QUESTIONS[qIdx];
        if (window.API) {
          const res = await window.API.getHint(q.q, q.opts);
          you -= 2;
          youScore.textContent = `Score: ${you}`;
          hintBox.textContent = `Hint: ${res.hint}`;
          hintBox.classList.remove('hidden');
        }
      } catch (e) {
        console.error(e);
        hintBox.textContent = "Could not load hint.";
        hintBox.classList.remove('hidden');
      }
      getHintBtn.textContent = 'Get Hint (-2 pts)';
      getHintBtn.style.display = 'none';
    });
  }

  function answer(i){
    if(locked) return; locked = true;
    clearInterval(timer);
    getHintBtn.style.display = 'none';
    
    const q = QUESTIONS[qIdx];
    const buttons = optsEl.querySelectorAll('.option');
    buttons.forEach(b=> b.disabled = true);
    
    if(i === q.a){ you++; if(buttons[i]) buttons[i].classList.add('correct'); }
    else { if(i>=0 && buttons[i]) buttons[i].classList.add('wrong'); buttons[q.a].classList.add('correct'); }
    
    youScore.textContent = `Score: ${you}`;
    
    // AI thinks before answering
    aiThinking.classList.remove('hidden');
    aiThinking.innerHTML = 'AlgoBot is thinking<span>.</span><span>.</span><span>.</span>';
    
    setTimeout(()=>{
      // AI logic: adapts based on difference
      let aiProb = 0.55;
      if (bot < you) aiProb = 0.8;
      else if (bot > you) aiProb = 0.4;
      
      const aiCorrect = Math.random() < aiProb;
      if(aiCorrect) bot++;
      botScore.textContent = `Score: ${bot}`;
      
      aiThinking.innerHTML = `<strong>AlgoBot says:</strong> ${q.explanation || 'I knew it!'}`;
      
      setTimeout(()=>{
        aiThinking.classList.add('hidden');
        qIdx++;
        if(qIdx >= QUESTIONS.length){ 
          fetchNextQuestion();
        } else {
          renderQuestion();
        }
      }, 3000);
    }, 1500);
  }

  // Friend room code
  const code = 'ALG-' + Math.floor(100 + Math.random()*900);
  const codeBox = document.getElementById('roomCode');
  if(codeBox){
    codeBox.textContent = code;
    document.getElementById('copyCode').addEventListener('click', ()=>{
      navigator.clipboard && navigator.clipboard.writeText(code);
      const b = document.getElementById('copyCode');
      const old = b.textContent; b.textContent = 'Copied!';
      setTimeout(()=> b.textContent = old, 1200);
    });
  }

  renderQuestion();
})();
