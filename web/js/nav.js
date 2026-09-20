// ---------- nav ----------
document.addEventListener('click', (event) => {
  const button = event.target.closest('.nav-btn[data-target]');
  if (!button) return;
  if (typeof window.activateWorkspaceTab === 'function') {
    window.activateWorkspaceTab(button.dataset.target);
  }
  if (window.innerWidth < 768 && button.closest('#sideNav')) {
    $('sidebar').classList.add('hidden');
    $('sidebar').classList.remove('flex');
  }
});
$('menuBtn').addEventListener('click', () => {
  const s = $('sidebar');
  const isHidden = s.classList.toggle('hidden');
  s.classList.toggle('flex', !isHidden);
  s.classList.add('flex-col');
});
$('navSearch').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#sideNav .nav-btn').forEach(b => {
    b.style.display = b.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
