// ---------- geo ----------
function validateIp(ip) {
  const v4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (v4.test(ip)) return { valid: true, type: 'IPv4' };
  if (ip.includes(':')) {
    if (/[^0-9a-fA-F:.%]/.test(ip)) return { valid: false, type: null };
    const parts = ip.split('::');
    if (parts.length > 2) return { valid: false, type: null };
    const head = parts[0] ? parts[0].split(':') : [];
    const tail = parts[1] ? parts[1].split(':') : [];
    const all = head.concat(tail);
    if (parts.length === 1 && all.length !== 8) return { valid: false, type: null };
    if (all.length > 8) return { valid: false, type: null };
    for (const g of all) {
      if (g.includes('.')) { if (!v4.test(g) || g !== all[all.length-1]) return { valid: false, type: null }; }
      else if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return { valid: false, type: null };
    }
    return { valid: true, type: 'IPv6' };
  }
  return { valid: false, type: null };
}
function runGeoValidate() {
  const ip = $('geoValidateInput').value.trim();
  if (!ip) return setOut('geoValidateOut', 'Enter an IP first.');
  const r = validateIp(ip);
  setOut('geoValidateOut', r.valid ? `✓ Valid IP address\nType: ${r.type}\nAddress: ${ip}` : `✗ Invalid IP address\nInput: ${ip}`);
}
function needConsent() {
  if (!$('geoConsent').checked) { setOut('geoNetOut', 'Tick the consent box first — network calls are opt-in.'); return false; }
  return true;
}
async function runMyIp(v6) {
  if (!needConsent()) return;
  try {
    setOut('geoNetOut', 'Fetching…');
    const r = await fetch(v6 ? 'https://api64.ipify.org?format=json' : 'https://api.ipify.org?format=json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    setOut('geoNetOut', JSON.stringify(await r.json(), null, 2));
  } catch (e) { setOut('geoNetOut', 'Error: ' + e.message); }
}
async function runLookup() {
  if (!needConsent()) return;
  try {
    setOut('geoNetOut', 'Looking up…');
    const ip = $('geoLookupInput').value.trim();
    const r = await fetch(ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : 'https://ipapi.co/json/');
    if (!r.ok) throw new Error('HTTP ' + r.status + ' (rate limit is 1000/day)');
    const d = await r.json();
    if (d.error) throw new Error(d.reason || 'Lookup failed');
    setOut('geoNetOut', JSON.stringify(d, null, 2));
  } catch (e) { setOut('geoNetOut', 'Error: ' + e.message); }
}
function runLocalInfo() {
  setOut('localOut', `Browser context (sandboxed — full list needs CLI):\nOnline: ${navigator.onLine}\nPlatform: ${navigator.platform}\nLanguage: ${navigator.language}\nCores: ${navigator.hardwareConcurrency || 'n/a'}\n\nFor interfaces/MAC run:\n  sarra geo local\n  sarra geo --format json local`);
}
