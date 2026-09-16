// ---------- nav ----------
document.querySelectorAll('.nav-btn[data-target]').forEach(b => {
  b.addEventListener('click', () => {
    const el = document.getElementById(b.dataset.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    if (window.innerWidth < 768) $('sidebar').classList.add('hidden'), $('sidebar').classList.remove('flex');
  });
});
$('menuBtn').addEventListener('click', () => {
  const s = $('sidebar');
  s.classList.toggle('hidden'); s.classList.toggle('flex'); s.classList.toggle('flex-col');
});
$('navSearch').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#sideNav .nav-btn').forEach(b => {
    b.style.display = b.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
