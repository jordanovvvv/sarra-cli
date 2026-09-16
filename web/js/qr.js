// ---------- qr ----------
function qrModules(text, ec) {
  const qr = qrcode(0, ec || 'M');
  qr.addData(text); qr.make();
  const n = qr.getModuleCount();
  const grid = [];
  for (let r = 0; r < n; r++) { const row = []; for (let c = 0; c < n; c++) row.push(qr.isDark(r, c)); grid.push(row); }
  return grid;
}
function runQrImage() {
  try {
    const text = $('qrText').value;
    if (!text) return setOut('qrMeta', 'Enter text first.');
    if (text.length > 2953) $('qrMeta').textContent = 'Warning: >2953 chars may not scan. ';
    const size = bounded($('qrSize').value, 128, 1024, 256);
    const ec = $('qrEC').value;
    const grid = qrModules(text, ec);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = $('qrLight').value; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = $('qrDark').value;
    const cell = size / grid.length;
    grid.forEach((row, r) => row.forEach((dark, c) => { if (dark) ctx.fillRect(Math.floor(c * cell), Math.floor(r * cell), Math.ceil(cell), Math.ceil(cell)); }));
    const img = $('qrImg');
    img.src = canvas.toDataURL('image/png'); img.classList.remove('hidden');
    setOut('qrMeta', `Modules: ${grid.length}×${grid.length}\nEC: ${ec}\nSize: ${size}px\nChars: ${text.length}`);
  } catch (e) { setOut('qrMeta', 'Error: ' + e.message); }
}
function runQrTerminal(fromFileCard) {
  try {
    const text = fromFileCard ? $('qrTermInput').value : $('qrText').value;
    if (!text) return setOut('qrAscii', 'Enter text first.');
    const grid = qrModules(text.slice(0, 2953), 'M');
    const ascii = grid.map(row => row.map(d => d ? '██' : '  ').join('')).join('\n');
    setOut('qrAscii', ascii + `\n\nEncoded ${Math.min(text.length, 2953)} chars`);
  } catch (e) { setOut('qrAscii', 'Error: ' + e.message); }
}
