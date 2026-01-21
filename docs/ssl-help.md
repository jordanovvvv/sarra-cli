# 🌐 Sarra CLI: SSL Utility Guide

The `ssl` command provides tools for generating SSL/TLS certificates for both local development and production environments.

---

## Command Overview

All SSL-related commands are grouped under the `ssl` namespace.

### `ssl generate`

Generates a self-signed SSL certificate along with its private key using RSA (2048-bit).

**Intended for:**

- Local development
- Internal testing
- Non-production environments

### `ssl letsencrypt`

Obtains a trusted SSL certificate from Let's Encrypt for production use.

**Intended for:**

- Production websites
- Public-facing applications
- Any service requiring browser-trusted certificates

---

## `ssl generate` - Self-Signed Certificates

### Usage

```bash
sarra ssl generate [options]
```

### Options

| Option              | Alias   | Description                                                                        | Default     |
| ------------------- | ------- | ---------------------------------------------------------------------------------- | ----------- |
| `--domain <domain>` | `-d`    | Domain name for the certificate (used as Common Name and Subject Alternative Name) | `localhost` |
| `--validity <days>` | `--val` | Certificate validity period in days (maximum 365)                                  | `365`       |

### Example Commands

**Generate a certificate for localhost:**

```bash
sarra ssl generate
```

**Generate a certificate for a custom domain:**

```bash
sarra ssl generate --domain example.local
```

**Generate a certificate valid for 90 days:**

```bash
sarra ssl generate --domain example.local --validity 90
```

### Output Files

The command generates two files:

- `<domain>.key` — Private key (PEM format)
- `<domain>.crt` — Self-signed certificate (PEM format)

**Example:**

- `localhost.key`
- `localhost.crt`

### Certificate Specifications

The generated certificates include:

- **Key Algorithm:** RSA 2048-bit
- **Signature Algorithm:** SHA-256
- **Extensions:**
  - `basicConstraints` (non-CA)
  - `keyUsage` (digital signature, key encipherment)
  - `subjectAltName` (matching the provided domain)

---

## `ssl letsencrypt` - Trusted Certificates

### Usage

```bash
sarra ssl letsencrypt [options]
```

### Options

| Option              | Alias | Description                                         | Required |
| ------------------- | ----- | --------------------------------------------------- | -------- |
| `--domain <domain>` | `-d`  | Your domain name (e.g., example.com)                | ✅       |
| `--email <email>`   | `-e`  | Email address for renewal notifications             | ✅       |
| `--standalone`      | -     | Use standalone mode (requires port 80 to be free)   | \*       |
| `--webroot <path>`  | -     | Webroot path for HTTP challenge                     | \*       |
| `--staging`         | -     | Use Let's Encrypt staging environment (for testing) | ❌       |

\*One of `--standalone` or `--webroot` is required

### Example Commands

**Get a certificate (standalone mode):**

```bash
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone
```

**Using existing web server:**

```bash
sarra ssl letsencrypt -d example.com -e admin@example.com --webroot /var/www/html
```

**Test mode first (recommended):**

```bash
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone --staging
```

### Prerequisites

Before running `ssl letsencrypt`, ensure:

1. **Certbot is installed:**

   - macOS: `brew install certbot`
   - Ubuntu/Debian: `sudo apt install certbot`
   - Windows: Download from https://certbot.eff.org

2. **Domain ownership:**

   - You own a real domain (not `localhost` or `.local`)
   - DNS points to your server's IP address
   - Verify with: `dig +short example.com`

3. **Network access:**
   - Port 80 is open and accessible from the internet
   - Firewall allows incoming connections
   - No web server using port 80 (if using `--standalone`)

### Output

On success, certificates are stored at:

```
/etc/letsencrypt/live/<domain>/fullchain.pem
/etc/letsencrypt/live/<domain>/privkey.pem
```

### Certificate Renewal

Let's Encrypt certificates are valid for 90 days and auto-renew via certbot timer.

**Test renewal:**

```bash
certbot renew --dry-run
```

---

## Understanding the Difference

### Self-Signed Certificates (`ssl generate`)

**How they work:**

- Generated locally on your machine
- Signed by their own private key (not a trusted authority)
- Free and instant

**Trust level:**

- ❌ **Not trusted by browsers** by default
- ⚠️ Browsers show "Your connection is not private" warning
- ✅ Can be manually trusted on your development machine only

**Best for:**

- Local development (`https://localhost`)
- Internal testing environments
- Development teams (share the certificate)

**Not for:**

- Production websites
- Public applications
- Anywhere strangers need to access your site

### Let's Encrypt Certificates (`ssl letsencrypt`)

**How they work:**

- Issued by Let's Encrypt (a trusted Certificate Authority)
- Validates you control the domain via HTTP or DNS challenge
- Free but requires domain ownership and internet access

**Trust level:**

- ✅ **Automatically trusted** by all browsers and devices
- ✅ Green padlock, no warnings
- ✅ Works for all visitors worldwide

**Best for:**

- Production websites
- Public-facing applications
- Any service requiring universal trust

**Not for:**

- Local development (won't work with `localhost`)
- Offline environments
- Quick testing (requires setup time)

---

## Making Self-Signed Certificates Trusted (Local Development)

If you want to eliminate browser warnings during local development, you can manually trust your self-signed certificate:

### macOS

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certs/localhost.crt
```

Or via GUI:

1. Double-click the `.crt` file
2. Add to "System" keychain
3. Double-click the cert in Keychain Access
4. Expand "Trust" → Set to "Always Trust"

### Windows

```bash
# Run as Administrator
certutil -addstore -f "ROOT" ./certs/localhost.crt
```

Or via GUI:

1. Double-click `.crt` file
2. Install Certificate → Local Machine
3. Place in "Trusted Root Certification Authorities"

### Linux (Ubuntu/Debian)

```bash
sudo cp ./certs/localhost.crt /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
```

> **Note:** This only trusts the certificate on **your machine**. Other users will still see warnings unless they also manually trust it.

---

## ⚠️ Important Warnings

### For Self-Signed Certificates

> **WARNING:** Self-signed certificates should **NOT** be used in production environments. Browsers and clients will not trust them without manual configuration. Other users visiting your site will see security warnings.

### For Let's Encrypt Certificates

> **NOTE:** Let's Encrypt has rate limits (50 certificates per domain per week). Always test with `--staging` first to avoid hitting limits during development.

---

## Troubleshooting

### "Certbot not found"

Install certbot using your package manager (see Prerequisites above).

### "Domain must point to this server's IP"

Verify DNS: `dig +short example.com` should show your server's IP address.

### "Port 80 must be accessible"

Check firewall rules and ensure no other service is using port 80 when using `--standalone`.

### "Let's Encrypt doesn't work with localhost"

Use `sarra ssl generate` for local development instead.

---

## Quick Reference

| Use Case                    | Command                                                                          |
| --------------------------- | -------------------------------------------------------------------------------- |
| Local HTTPS development     | `sarra ssl generate`                                                             |
| Production website          | `sarra ssl letsencrypt -d example.com -e you@example.com --standalone`           |
| Testing Let's Encrypt setup | `sarra ssl letsencrypt -d example.com -e you@example.com --standalone --staging` |
| Custom local domain         | `sarra ssl generate --domain myapp.local`                                        |
