(function(){
  const form = document.getElementById('signupForm');
  if(!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if(name && email) {
      // Save to localStorage as a mock auth system
      localStorage.setItem('algovian_user', JSON.stringify({ name, email }));
      
      // Redirect to home page
      window.location.href = 'index.html';
    }
  });
})();
