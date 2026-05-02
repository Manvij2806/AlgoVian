(function(){
  const DATA = {
    'all':[
      {name:'Aarav Sharma', score:9840, wins:142, level:'Expert'},
      {name:'Mei Tanaka', score:9210, wins:131, level:'Expert'},
      {name:'Liam O\'Connor', score:8675, wins:118, level:'Advanced'},
      {name:'Sofia Rossi', score:7320, wins:96, level:'Advanced'},
      {name:'Diego Martín', score:5980, wins:74, level:'Intermediate'}
    ],
    'week':[
      {name:'Mei Tanaka', score:2410, wins:38, level:'Expert'},
      {name:'Aarav Sharma', score:2180, wins:33, level:'Expert'},
      {name:'Sofia Rossi', score:1640, wins:24, level:'Advanced'},
      {name:'Liam O\'Connor', score:1520, wins:22, level:'Advanced'},
      {name:'Diego Martín', score:980, wins:15, level:'Intermediate'}
    ],
    'today':[
      {name:'Aarav Sharma', score:520, wins:8, level:'Expert'},
      {name:'Mei Tanaka', score:480, wins:7, level:'Expert'},
      {name:'Liam O\'Connor', score:340, wins:5, level:'Advanced'},
      {name:'Diego Martín', score:260, wins:4, level:'Intermediate'},
      {name:'Sofia Rossi', score:180, wins:3, level:'Advanced'}
    ]
  };
  const COLORS = ['#534AB7','#2BA39A','#D9A441','#7E5BD0','#3BA776'];
  const tbody = document.getElementById('lbBody');

  function initials(n){ return n.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(); }
  function levelClass(l){ return 'level level-'+l.toLowerCase(); }

  function render(key){
    const rows = DATA[key];
    tbody.innerHTML = rows.map((p,i)=>`
      <tr>
        <td class="rank rank-${i+1}">#${i+1}</td>
        <td><div class="player-cell">
          <div class="av-sm" style="background:${COLORS[i%COLORS.length]}">${initials(p.name)}</div>
          <span>${p.name}</span>
        </div></td>
        <td><strong>${p.score.toLocaleString()}</strong></td>
        <td>${p.wins}</td>
        <td><span class="${levelClass(p.level)}">${p.level}</span></td>
      </tr>`).join('');
  }

  document.querySelectorAll('.lb-tab').forEach(t=>{
    t.addEventListener('click', ()=>{
      document.querySelectorAll('.lb-tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      render(t.dataset.range);
    });
  });
  render('all');
})();
