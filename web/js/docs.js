// ---------- docs ----------
async function loadDoc() {
  const f = $('docSelect').value;
  try {
    const r = await fetch('../docs/' + f);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const md = await r.text();
    $('docView').innerHTML = marked.parse(md);
  } catch (e) {
    $('docView').innerHTML = `<p class="text-sm">Could not fetch <code>docs/${f}</code> (${e.message}). Serve the repo root over HTTP — <code>npx serve .</code> then open <code>/web/index.html</code> — or read the file directly. CLI help stays available: <code>sarra ${f.split('-')[0]} --help</code>.</p>`;
  }
}
