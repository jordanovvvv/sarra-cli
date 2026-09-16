// RSA PEM helpers
function abToB64(buf) {
  const b = new Uint8Array(buf); let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}
function b64ToAb(b64) {
  const s = atob(b64.replace(/\s+/g, ''));
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a.buffer;
}
function pemEncode(b64, label) {
  const lines = b64.match(/.{1,64}/g).join('\n');
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}
function pemDecode(pem) {
  return pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
}
async function runRsaKeygen() {
  try {
    setOut('rsaOut', 'Generating… (4096 takes a few seconds)');
    const size = parseInt($('rsaSize').value, 10);
    const kp = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: size, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
    const pub = await crypto.subtle.exportKey('spki', kp.publicKey);
    const priv = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
    $('rsaKey').value = pemEncode(abToB64(priv), 'PRIVATE KEY');
    setOut('rsaOut', pemEncode(abToB64(pub), 'PUBLIC KEY') + '\n\n' + pemEncode(abToB64(priv), 'PRIVATE KEY'));
  } catch (e) { setOut('rsaOut', 'Error: ' + e.message); }
}
async function runRsaEnc() {
  try {
    const msg = $('rsaInput').value; const pem = $('rsaKey').value;
    if (!msg || !pem) return setOut('rsaIoOut', 'Need a message + public key PEM.');
    const key = await crypto.subtle.importKey('spki', b64ToAb(pemDecode(pem)), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    const ct = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, new TextEncoder().encode(msg));
    setOut('rsaIoOut', abToB64(ct));
  } catch (e) { setOut('rsaIoOut', 'Error: ' + e.message); }
}
async function runRsaDec() {
  try {
    const ct = $('rsaInput').value.trim(); const pem = $('rsaKey').value;
    if (!ct || !pem) return setOut('rsaIoOut', 'Need base64 ciphertext + private key PEM.');
    const key = await crypto.subtle.importKey('pkcs8', b64ToAb(pemDecode(pem)), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, b64ToAb(ct));
    setOut('rsaIoOut', new TextDecoder().decode(pt));
  } catch (e) { setOut('rsaIoOut', 'Error: ' + e.message); }
}
