(function(){
  const INITIAL = [64,34,25,12,22,11,90,45,67,38];
  let arr = [...INITIAL];
  let steps = [];
  let stepIdx = 0;
  let timer = null;
  let speed = 3;
  let algo = 'bubble';
  const area = document.getElementById('vizArea');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const speedInput = document.getElementById('speedInput');
  const tabs = document.querySelectorAll('.viz-tab');
  const info = document.getElementById('vizInfo');
  
  // AI Explainer elements
  const explainStepBtn = document.getElementById('explainStepBtn');
  const stepExplanation = document.getElementById('stepExplanation');

  const ALGOS = {
    bubble:{ name:'Bubble Sort', desc:'Repeatedly swap adjacent pairs that are in the wrong order.', t:'O(n²)', s:'O(1)'},
    selection:{ name:'Selection Sort', desc:'Find the minimum and place it at the front, repeat.', t:'O(n²)', s:'O(1)'},
    insertion:{ name:'Insertion Sort', desc:'Insert each element into its place in the sorted prefix.', t:'O(n²)', s:'O(1)'}
  };

  function buildSteps(){
    const a = [...INITIAL];
    const out = [];
    if(algo==='bubble'){
      for(let i=0;i<a.length;i++){
        for(let j=0;j<a.length-i-1;j++){
          out.push({arr:[...a], hi:[j,j+1], sorted:a.length-i});
          if(a[j]>a[j+1]){ [a[j],a[j+1]]=[a[j+1],a[j]]; out.push({arr:[...a], hi:[j,j+1], sorted:a.length-i}); }
        }
      }
    } else if(algo==='selection'){
      for(let i=0;i<a.length;i++){
        let m=i;
        for(let j=i+1;j<a.length;j++){ out.push({arr:[...a], hi:[m,j], sorted:i}); if(a[j]<a[m]) m=j; }
        if(m!==i){ [a[i],a[m]]=[a[m],a[i]]; }
        out.push({arr:[...a], hi:[i], sorted:i+1});
      }
    } else {
      for(let i=1;i<a.length;i++){
        let j=i;
        while(j>0 && a[j-1]>a[j]){ out.push({arr:[...a], hi:[j-1,j], sorted:0}); [a[j-1],a[j]]=[a[j],a[j-1]]; j--; }
        out.push({arr:[...a], hi:[j], sorted:i+1});
      }
    }
    out.push({arr:[...a], hi:[], sorted:a.length});
    return out;
  }

  function render(state){
    const max = Math.max(...state.arr);
    area.innerHTML = state.arr.map((v,i)=>{
      const pct = (v/max)*100;
      const cls = state.hi.includes(i) ? 'bar active' : (i >= state.arr.length - (state.sorted||0) ? 'bar' : 'bar');
      const sortedCls = state.sorted && i >= state.arr.length - state.sorted ? ' sorted' : '';
      return `<div class="${cls}${sortedCls}" style="height:${pct}%;width:42px">${v}</div>`;
    }).join('');
    
    // Manage Explain button visibility
    if (timer || stepIdx === 0 || stepIdx >= steps.length) {
      if (explainStepBtn) explainStepBtn.style.display = 'none';
    } else {
      if (explainStepBtn) explainStepBtn.style.display = 'inline-block';
    }
    
    // Clear previous explanation when state changes
    if (stepExplanation && !stepExplanation.classList.contains('hidden') && stepExplanation.dataset.step !== String(stepIdx)) {
      stepExplanation.classList.add('hidden');
    }
  }

  function tick(){
    if(stepIdx >= steps.length){ stop(); return; }
    render(steps[stepIdx]);
    stepIdx++;
  }

  function play(){
    if(timer){ stop(); render(steps[Math.max(0, stepIdx-1)]); return; }
    if(stepIdx>=steps.length){ stepIdx=0; }
    const delay = 600 / speed;
    timer = setInterval(tick, delay);
    playBtn.textContent = 'Pause';
    if (explainStepBtn) explainStepBtn.style.display = 'none';
  }
  
  function stop(){ 
    clearInterval(timer); 
    timer=null; 
    playBtn.textContent='Play'; 
  }
  
  function reset(){
    stop();
    steps = buildSteps();
    stepIdx = 0;
    render({arr:[...INITIAL], hi:[], sorted:0});
    if (stepExplanation) stepExplanation.classList.add('hidden');
  }

  function setAlgo(name){
    algo = name;
    tabs.forEach(t=>t.classList.toggle('active', t.dataset.algo===name));
    const a = ALGOS[name];
    info.innerHTML = `<strong>${a.name}.</strong> ${a.desc} Time complexity: <strong>${a.t}</strong> · Space: <strong>${a.s}</strong>.`;
    reset();
  }

  // Explain Step click handler
  if (explainStepBtn) {
    explainStepBtn.addEventListener('click', async () => {
      const currentState = steps[Math.max(0, stepIdx - 1)];
      if (!currentState) return;

      explainStepBtn.disabled = true;
      stepExplanation.classList.remove('hidden');
      stepExplanation.innerHTML = '<div class="ai-thinking">Thinking<span>.</span><span>.</span><span>.</span></div>';
      stepExplanation.dataset.step = String(stepIdx); // remember which step we are explaining

      try {
        if (window.API) {
          const res = await window.API.explainStep(ALGOS[algo].name, currentState.arr, currentState.hi);
          stepExplanation.innerHTML = `<strong>AI Explanation:</strong> ${res.explanation}`;
        }
      } catch (e) {
        console.error(e);
        stepExplanation.innerHTML = "Could not generate explanation.";
      }
      explainStepBtn.disabled = false;
    });
  }

  tabs.forEach(t=> t.addEventListener('click', ()=> setAlgo(t.dataset.algo)));
  playBtn.addEventListener('click', play);
  resetBtn.addEventListener('click', reset);
  speedInput.addEventListener('input', e=>{
    speed = +e.target.value;
    if(timer){ stop(); play(); }
  });
  setAlgo('bubble');
})();
