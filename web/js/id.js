// ---------- id ----------
function uuidV7() {
  const ts = Date.now().toString(16).padStart(12, '0');
  const rnd = new Uint8Array(10); crypto.getRandomValues(rnd);
  const hex = Array.from(rnd).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${ts.slice(0,8)}-${ts.slice(8,12)}-7${hex.slice(0,3)}-${hex.slice(3,7)}-${hex.slice(7)}`;
}
function runUuid() {
  const v = $('uuidVersion').value;
  const c = bounded($('uuidCount').value, 1, 100, 5);
  const out = [];
  for (let i = 0; i < c; i++) out.push(v === 'v7' ? uuidV7() : crypto.randomUUID());
  setOut('uuidOut', out.join('\n'));
}
function runRandom() {
  const len = bounded($('randLength').value, 1, 64, 16);
  const c = bounded($('randCount').value, 1, 100, 3);
  const out = [];
  for (let i = 0; i < c; i++) {
    const b = new Uint8Array(len); crypto.getRandomValues(b);
    out.push(Array.from(b).map(x => x.toString(16).padStart(2, '0')).join(''));
  }
  setOut('randOut', out.join('\n'));
}
