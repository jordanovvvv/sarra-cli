// ---------- crypto ----------
const bufToHex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
const hexToBuf = (hex) => {
  const clean = hex.trim().replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2 !== 0) throw new Error('Invalid hex');
  const a = new Uint8Array(clean.length / 2);
  for (let i = 0; i < a.length; i++) a[i] = parseInt(clean.substr(i * 2, 2), 16);
  return a.buffer;
};
function md5(str) {
  // Compact MD5 (utf8) — standard algorithm implementation
  function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
  function addU(x, y) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
  function f(x,y,z){return (x&y)|(~x&z);} function g(x,y,z){return (x&z)|(y&~z);} function h(x,y,z){return x^y^z;} function ii(x,y,z){return y^(x|~z);}
  function ff(a,b,c,d,x,s,ac){a=addU(a,addU(addU(f(b,c,d),x),ac));return addU(rotl(a,s),b);}
  function gg(a,b,c,d,x,s,ac){a=addU(a,addU(addU(g(b,c,d),x),ac));return addU(rotl(a,s),b);}
  function hh(a,b,c,d,x,s,ac){a=addU(a,addU(addU(h(b,c,d),x),ac));return addU(rotl(a,s),b);}
  function iii(a,b,c,d,x,s,ac){a=addU(a,addU(addU(ii(b,c,d),x),ac));return addU(rotl(a,s),b);}
  const bytes = new TextEncoder().encode(str);
  const origLen = bytes.length;
  const withOne = origLen + 1;
  const padLen = (64 - ((withOne + 8) % 64)) % 64;
  const total = withOne + padLen + 8;
  const msg = new Uint8Array(total);
  msg.set(bytes); msg[origLen] = 0x80;
  const bits = origLen * 8;
  for (let i = 0; i < 8; i++) msg[total - 8 + i] = (bits / Math.pow(2, 8 * i)) & 0xff;
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const X = new Array(16);
  for (let i = 0; i < total; i += 64) {
    for (let j = 0; j < 16; j++) X[j] = msg[i+j*4] | (msg[i+j*4+1]<<8) | (msg[i+j*4+2]<<16) | (msg[i+j*4+3]<<24);
    const AA=a, BB=b, CC=c, DD=d;
    a=ff(a,b,c,d,X[0],7,0xd76aa478); d=ff(d,a,b,c,X[1],12,0xe8c7b756); c=ff(c,d,a,b,X[2],17,0x242070db); b=ff(b,c,d,a,X[3],22,0xc1bdceee);
    a=ff(a,b,c,d,X[4],7,0xf57c0faf); d=ff(d,a,b,c,X[5],12,0x4787c62a); c=ff(c,d,a,b,X[6],17,0xa8304613); b=ff(b,c,d,a,X[7],22,0xfd469501);
    a=ff(a,b,c,d,X[8],7,0x698098d8); d=ff(d,a,b,c,X[9],12,0x8b44f7af); c=ff(c,d,a,b,X[10],17,0xffff5bb1); b=ff(b,c,d,a,X[11],22,0x895cd7be);
    a=ff(a,b,c,d,X[12],7,0x6b901122); d=ff(d,a,b,c,X[13],12,0xfd987193); c=ff(c,d,a,b,X[14],17,0xa679438e); b=ff(b,c,d,a,X[15],22,0x49b40821);
    a=gg(a,b,c,d,X[1],5,0xf61e2562); d=gg(d,a,b,c,X[6],9,0xc040b340); c=gg(c,d,a,b,X[11],14,0x265e5a51); b=gg(b,c,d,a,X[0],20,0xe9b6c7aa);
    a=gg(a,b,c,d,X[5],5,0xd62f105d); d=gg(d,a,b,c,X[10],9,0x2441453); c=gg(c,d,a,b,X[15],14,0xd8a1e681); b=gg(b,c,d,a,X[4],20,0xe7d3fbc8);
    a=gg(a,b,c,d,X[9],5,0x21e1cde6); d=gg(d,a,b,c,X[14],9,0xc33707d6); c=gg(c,d,a,b,X[3],14,0xf4d50d87); b=gg(b,c,d,a,X[8],20,0x455a14ed);
    a=gg(a,b,c,d,X[13],5,0xa9e3e905); d=gg(d,a,b,c,X[2],9,0xfcefa3f8); c=gg(c,d,a,b,X[7],14,0x676f02d9); b=gg(b,c,d,a,X[12],20,0x8d2a4c8a);
    a=hh(a,b,c,d,X[5],4,0xfffa3942); d=hh(d,a,b,c,X[8],11,0x8771f681); c=hh(c,d,a,b,X[11],16,0x6d9d6122); b=hh(b,c,d,a,X[14],23,0xfde5380c);
    a=hh(a,b,c,d,X[1],4,0xa4beea44); d=hh(d,a,b,c,X[4],11,0x4bdecfa9); c=hh(c,d,a,b,X[7],16,0xf6bb4b60); b=hh(b,c,d,a,X[10],23,0xbebfbc70);
    a=hh(a,b,c,d,X[13],4,0x289b7ec6); d=hh(d,a,b,c,X[0],11,0xeaa127fa); c=hh(c,d,a,b,X[3],16,0xd4ef3085); b=hh(b,c,d,a,X[6],23,0x4881d05);
    a=hh(a,b,c,d,X[9],4,0xd9d4d039); d=hh(d,a,b,c,X[12],11,0xe6db99e5); c=hh(c,d,a,b,X[15],16,0x1fa27cf8); b=hh(b,c,d,a,X[2],23,0xc4ac5665);
    a=iii(a,b,c,d,X[0],6,0xf4292244); d=iii(d,a,b,c,X[7],10,0x432aff97); c=iii(c,d,a,b,X[14],15,0xab9423a7); b=iii(b,c,d,a,X[5],21,0xfc93a039);
    a=iii(a,b,c,d,X[12],6,0x655b59c3); d=iii(d,a,b,c,X[3],10,0x8f0ccc92); c=iii(c,d,a,b,X[10],15,0xffeff47d); b=iii(b,c,d,a,X[1],21,0x85845dd1);
    a=iii(a,b,c,d,X[8],6,0x6fa87e4f); d=iii(d,a,b,c,X[15],10,0xfe2ce6e0); c=iii(c,d,a,b,X[6],15,0xa3014314); b=iii(b,c,d,a,X[13],21,0x4e0811a1);
    a=iii(a,b,c,d,X[4],6,0xf7537e82); d=iii(d,a,b,c,X[11],10,0xbd3af235); c=iii(c,d,a,b,X[2],15,0x2ad7d2bb); b=iii(b,c,d,a,X[9],21,0xeb86d391);
    a=addU(a,AA); b=addU(b,BB); c=addU(c,CC); d=addU(d,DD);
  }
  const out = [a,b,c,d].map(v => {
    let s = '';
    for (let i = 0; i < 4; i++) s += ((v >> (8*i)) & 0xff).toString(16).padStart(2,'0');
    return s;
  });
  return out.join('');
}
async function runHash() {
  try {
    const input = $('hashInput').value;
    if (!input) return setOut('hashOut', 'Enter input text first.');
    const algo = $('hashAlgo').value;
    if (algo === 'md5') return setOut('hashOut', md5(input));
    const map = { sha1: 'SHA-1', sha256: 'SHA-256', sha512: 'SHA-512' };
    const digest = await crypto.subtle.digest(map[algo], new TextEncoder().encode(input));
    setOut('hashOut', bufToHex(digest));
  } catch (e) { setOut('hashOut', 'Error: ' + e.message); }
}
function runB64(decode) {
  try {
    const v = $('b64Input').value;
    if (!v) return setOut('b64Out', 'Enter input first.');
    if (!decode) setOut('b64Out', btoa(unescape(encodeURIComponent(v))));
    else setOut('b64Out', decodeURIComponent(escape(atob(v.trim()))));
  } catch (e) { setOut('b64Out', 'Error: invalid base64 — ' + e.message); }
}
let lastAes = null;
async function runAesEnc() {
  try {
    const input = $('aesEncInput').value;
    if (!input) return setOut('aesEncOut', 'Enter a message first.');
    let keyHex = $('aesEncKey').value.trim();
    let keyBytes;
    if (keyHex) {
      if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) return setOut('aesEncOut', 'Key must be 64 hex chars (32 bytes).');
      keyBytes = new Uint8Array(await hexToBuf(keyHex));
    } else {
      keyBytes = new Uint8Array(32); crypto.getRandomValues(keyBytes);
      keyHex = bufToHex(keyBytes.buffer);
    }
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);
    const iv = new Uint8Array(12); crypto.getRandomValues(iv);
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(input));
    const bytes = new Uint8Array(ct);
    const tag = bytes.slice(bytes.length - 16);
    const data = bytes.slice(0, bytes.length - 16);
    lastAes = { encrypted: bufToHex(data.buffer), iv: bufToHex(iv.buffer), authTag: bufToHex(tag.buffer), key: keyHex };
    setOut('aesEncOut', JSON.stringify(lastAes, null, 2));
  } catch (e) { setOut('aesEncOut', 'Error: ' + e.message); }
}
async function runAesDec() {
  try {
    const enc = $('aesCipher').value.trim(), keyHex = $('aesKey').value.trim();
    const ivHex = $('aesIv').value.trim(), tagHex = $('aesTag').value.trim();
    if (!enc || !keyHex || !ivHex || !tagHex) return setOut('aesDecOut', 'All four hex fields are required.');
    const keyBytes = new Uint8Array(await hexToBuf(keyHex));
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    const data = new Uint8Array(await hexToBuf(enc));
    const tag = new Uint8Array(await hexToBuf(tagHex));
    const combined = new Uint8Array(data.length + tag.length);
    combined.set(data); combined.set(tag, data.length);
    const iv = new Uint8Array(await hexToBuf(ivHex));
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
    setOut('aesDecOut', new TextDecoder().decode(pt));
  } catch (e) { setOut('aesDecOut', 'Error (wrong key/iv/tag?): ' + e.message); }
}
function fillAesDemo() {
  if (!lastAes) return setOut('aesDecOut', 'Run Encrypt first.');
  $('aesCipher').value = lastAes.encrypted; $('aesKey').value = lastAes.key;
  $('aesIv').value = lastAes.iv; $('aesTag').value = lastAes.authTag;
  setOut('aesDecOut', 'Fields filled — press Decrypt.');
}
