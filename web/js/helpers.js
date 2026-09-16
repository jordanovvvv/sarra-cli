const $ = (id) => document.getElementById(id);
function setOut(id, text) { $(id).textContent = text; }
function copyText(id) {
  const t = $(id).textContent;
  navigator.clipboard.writeText(t).then(() => {
    const el = $(id); el.classList.add('border-sky-500');
    setTimeout(() => el.classList.remove('border-sky-500'), 600);
  });
}
function downloadText(id, filename) {
  const blob = new Blob([$(id).textContent], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function loadFileTo(fileId, targetId) {
  const f = $(fileId).files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { $(targetId).value = String(r.result).slice(0, 20000); };
  r.readAsText(f);
}
function bounded(n, min, max, dflt) {
  n = parseInt(n, 10); if (isNaN(n)) return dflt;
  return Math.min(max, Math.max(min, n));
}
