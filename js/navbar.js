// Renders the shared navbar and highlights the active page.
(function () {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'learn.html', label: 'Learn' },
    { href: 'visualizer.html', label: 'Visualize' },
    { href: 'game.html', label: 'Play' },
    { href: 'leaderboard.html', label: 'Leaderboard' }
  ];

  // Check for logged in user
  let userHtml = '';
  try {
    const userStr = localStorage.getItem('algovian_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const firstName = user.name.split(' ')[0];
      userHtml = `
        <div style="margin-left:auto; display:flex; align-items:center; gap: 12px;">
          <div class="user-badge" style="display:flex; align-items:center; gap:8px; background:var(--primary-tint); padding:4px 12px; border-radius:999px; color:var(--primary); font-weight:600; font-size:13px;">
            <div style="width:24px; height:24px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px;">${firstName.charAt(0).toUpperCase()}</div>
            Hi, ${firstName}
          </div>
          <button id="logoutBtn" style="font-size:13px; color:var(--text-secondary); text-decoration:underline; cursor:pointer; background:none; border:none; padding:0;">Log out</button>
        </div>
      `;
    } else {
      userHtml = `<a class="btn btn-primary" href="signup.html" style="margin-left:auto">Sign up</a>`;
    }
  } catch (e) {
    userHtml = `<a class="btn btn-primary" href="signup.html" style="margin-left:auto">Sign up</a>`;
  }

  const html = `
    <div class="nav-inner">
      <a class="brand" href="index.html">
        <span class="brand-icon">A</span>
        <span>AlgoVian</span>
      </a>
      <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
      <nav class="nav-links" id="navLinks">
        ${links.map(l => `<a class="nav-link ${page === l.href ? 'active' : ''}" href="${l.href}">${l.label}</a>`).join('')}
      </nav>
      ${userHtml}
    </div>`;

  const nav = document.getElementById('navbar');
  if (nav) {
    nav.className = 'navbar';
    nav.innerHTML = html;
    const t = document.getElementById('menuToggle');
    const l = document.getElementById('navLinks');
    t.addEventListener('click', () => l.classList.toggle('open'));

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('algovian_user');
        window.location.reload();
      });
    }
  }
})();
