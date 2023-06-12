function logout() {
  // Redireciona o usuário para a página de login
  window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);
});
