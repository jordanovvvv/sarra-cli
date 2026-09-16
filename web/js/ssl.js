// ---------- ssl ----------
async function runSslGen() {
  try {
    if (typeof forge === 'undefined') return setOut('sslCert', 'Forge CDN failed to load — use CLI: sarra ssl generate --save'), setOut('sslKey', '');
    const domain = ($('sslDomain').value || 'localhost').trim();
    const validity = bounded($('sslValidity').value, 1, 365, 365);
    $('sslStatus').textContent = `Generating RSA-2048 for ${domain}…`;
    const keys = await new Promise((res, rej) => {
      forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, kp) => err ? rej(err) : res(kp));
    });
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01' + Math.floor(Math.random() * 1000000);
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + validity);
    const attrs = [{ name: 'commonName', value: domain }];
    cert.setSubject(attrs); cert.setIssuer(attrs);
    cert.setExtensions([
      { name: 'basicConstraints', cA: false },
      { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
      { name: 'subjectAltName', altNames: [{ type: 2, value: domain }] }
    ]);
    cert.sign(keys.privateKey, forge.md.sha256.create());
    setOut('sslCert', forge.pki.certificateToPem(cert).trim());
    setOut('sslKey', forge.pki.privateKeyToPem(keys.privateKey).trim());
    $('sslStatus').textContent = `Done: ${domain} · ${validity} days · RSA-2048/SHA-256 · dev only, browsers will warn until trusted.`;
  } catch (e) { $('sslStatus').textContent = 'Error: ' + e.message; }
}
function runLeBuilder() {
  const d = $('leDomain').value.trim(), e = $('leEmail').value.trim();
  if (!d || !e) return setOut('leOut', 'Domain + email required.');
  if (d === 'localhost' || d.endsWith('.local')) return setOut('leOut', "Let's Encrypt never works for localhost/.local — use self-signed above.");
  const mode = $('leMode').value;
  const staging = $('leStaging').checked ? ' --staging' : '';
  const challenge = mode === 'standalone' ? '--standalone' : `--webroot /var/www/html (your path: ${$('leWebroot').value.trim() || '/var/www/html'})`;
  const webrootFlag = mode === 'standalone' ? '--standalone' : `--webroot ${$('leWebroot').value.trim() || '/var/www/html'}`;
  setOut('leOut', `# 1. Install certbot (once)\n# macOS: brew install certbot | Ubuntu: sudo apt install certbot\n\nsarra ssl letsencrypt -d ${d} -e ${e} ${webrootFlag}${staging}\n\n# raw certbot equivalent:\ncertbot certonly --non-interactive --agree-tos -d ${d} -m ${e} ${webrootFlag}${staging}\n\n# certs land at /etc/letsencrypt/live/${d}/ (fullchain.pem + privkey.pem)\n# renew test: certbot renew --dry-run`);
}
