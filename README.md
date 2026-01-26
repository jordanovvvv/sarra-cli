# Sarra CLI

Daily developer enhancement tools - A collection of CLI utilities for common development tasks including ID generation, cryptography, data formatting, QR code generation, time utilities, and SSL certificate management.

## Installation

### For CLI Usage (Global)

```bash
npm install -g sarra
```

Or use directly with npx:

```bash
npx sarra <command>
```

### For App/Library Usage (Local)

```bash
npm install sarra
```

**→ [See SDK Documentation below](#sdk) for using Sarra in your Node.js/React applications.**

## Demo

![Sarra CLI Demo](demo.gif)

## Quick Start

```bash
# Generate a UUID
sarra id uuid

# Hash some data
sarra crypto hash sha256 "hello world"

# Format JSON
echo '{"a":1}' | sarra data json format

# Generate a QR code
sarra qr generate "Hello World"

# Get current timestamp
sarra time now

# Generate SSL certificate for local development
sarra ssl generate
```

## Command Groups

- **[`id`](#id---identifiers-tokens-and-uuids)** - Identifiers, tokens, UUIDs ([detailed docs](./docs/id-help.md))
- **[`crypto`](#crypto---cryptography-utilities)** - Cryptography utilities ([detailed docs](./docs/crypto-help.md))
- **[`data`](#data---data-encoding-and-formatting)** - Data encoding and formatting ([detailed docs](./docs/data-help.md))
- **[`qr`](#qr---qr-code-generation)** - QR code generation ([detailed docs](./docs/qr-help.md))
- **[`time`](#time---date-and-time-utilities)** - Date and time utilities ([detailed docs](./docs/time-help.md))
- **[`ssl`](#ssl---ssl-certificate-generation)** - SSL certificate generation ([detailed docs](./docs/ssl-help.md))
- **[`ssl`](#geo---geo-and-ip-location-utilization)** - Geolocation and IP location utilities ([detailed docs](./docs/geo-help.md))

Use `--help` on any command for more details:

```bash
sarra --help
sarra id --help
sarra crypto --help
sarra qr --help
sarra ssl --help
```

---

## `id` - Identifiers, Tokens, and UUIDs

Generate and manage identifiers, tokens, and unique values commonly used in databases, APIs, authentication, and distributed systems.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/blob/master/docs/id-help.md)**

### Commands

- `uuid` - Generate UUIDs (v4, v7)
- `random` - Generate cryptographically secure random tokens

### Quick Examples

```bash
# Generate UUID
sarra id uuid

# Generate UUID v7 (time-ordered, recommended for databases)
sarra id uuid --uuid-version v7 --count 5

# Generate random token
sarra id random --length 32

# Output to file
sarra id uuid --count 10 -o uuids.txt

# JSON format
sarra id --format json uuid --uuid-version v7 -o uuids.json
```

### Interactive Mode

Commands will prompt before saving:

```
📁 Save Location
   Current directory: /home/user/projects
   Default file: uuids.txt
   Full path: /home/user/projects/uuids.txt

Save to file? (Y/n/path):
```

- Press Enter or `y` → Save to default location
- Type `n` → Output to stdout
- Type a path → Save to custom location
- Use `-y` flag to skip prompt and output to stdout
- Use `-o <file>` flag to save directly without prompt

---

# `crypto` - Cryptography Utilities

Cryptographic utilities for hashing, encoding, and encryption.

## Commands

- `hash` - Generate cryptographic hashes (md5, sha1, sha256, sha512)
- `base64` - Base64 encode or decode data
- `aes-encrypt` - Encrypt data using AES-256-GCM
- `aes-decrypt` - Decrypt AES-256-GCM encrypted data
- `rsa-keygen` - Generate RSA key pair
- `rsa-encrypt` - Encrypt data using RSA public key
- `rsa-decrypt` - Decrypt data using RSA private key

## Global Options

```
--format <format>    Output format: text | json
```

## Examples

### Hashing

```bash
# Generate hashes
sarra crypto hash sha256 "hello world"
sarra crypto hash sha512 "data"
echo "hello" | sarra crypto hash sha256

# JSON output
sarra crypto --format json hash sha256 "data"
```

### Base64

```bash
# Encode and decode
sarra crypto base64 "hello world"
sarra crypto base64 --decode SGVsbG8gd29ybGQ=
echo "hello" | sarra crypto base64
```

### AES Encryption

```bash
# Encrypt (auto-generates key)
sarra crypto aes-encrypt "secret message"

# Encrypt with custom key
sarra crypto aes-encrypt "message" -k <64-hex-chars>

# Decrypt (requires key, IV, auth tag)
sarra crypto aes-decrypt <encrypted-hex> -k <key> -i <iv> -t <tag>

# JSON format (saves all parameters)
sarra crypto --format json aes-encrypt "data" -o encrypted.json
```

### RSA Keys

```bash
# Generate key pair
sarra crypto rsa-keygen
sarra crypto rsa-keygen --size 4096 -o ./my-keys

# Encrypt/Decrypt
sarra crypto rsa-encrypt "message" -p public_key.pem
sarra crypto rsa-decrypt <base64-data> -k private_key.pem
```

### Output Options

```bash
# Interactive prompt (default)
sarra crypto hash sha256 "data"

# Output to stdout
sarra crypto hash sha256 "data" -y

# Save to file
sarra crypto hash sha256 "data" -o hash.txt
sarra crypto --format json aes-encrypt "data" -o encrypted.json
```

## Supported Algorithms

**Hash Algorithms:**

- `md5` - 128-bit (not cryptographically secure)
- `sha1` - 160-bit (deprecated for security)
- `sha256` - 256-bit (recommended)
- `sha512` - 512-bit (maximum security)

**Encryption:**

- `AES-256-GCM` - Authenticated symmetric encryption (256-bit key)
- `RSA-OAEP` - Asymmetric encryption (2048/3072/4096-bit keys)

## Command Reference

### `hash`

```bash
sarra crypto hash <algorithm> [input] [options]

Options:
  -o, --out <file>    Write output to file
  -y, --yes           Output to stdout
```

### `base64`

```bash
sarra crypto base64 [input] [options]

Options:
  -d, --decode        Decode instead of encode
  -o, --out <file>    Write output to file
  -y, --yes           Output to stdout
```

### `aes-encrypt`

```bash
sarra crypto aes-encrypt [input] [options]

Options:
  -k, --key <key>     Encryption key (hex, 32 bytes)
  -o, --out <file>    Write output to file
  -y, --yes           Output to stdout
```

### `aes-decrypt`

```bash
sarra crypto aes-decrypt [input] [options]

Options:
  -k, --key <key>     Decryption key (required)
  -i, --iv <iv>       Initialization vector (required)
  -t, --tag <tag>     Auth tag (required)
  -o, --out <file>    Write output to file
  -y, --yes           Output to stdout
```

### `rsa-keygen`

```bash
sarra crypto rsa-keygen [options]

Options:
  -s, --size <bits>   Key size: 2048, 3072, 4096 (default: 2048)
  -o, --out <dir>     Output directory
  -y, --yes           Output to stdout
```

### `rsa-encrypt`

```bash
sarra crypto rsa-encrypt [input] [options]

Options:
  -p, --public-key <file>    Public key file (required)
  -o, --out <file>           Write output to file
  -y, --yes                  Output to stdout
```

### `rsa-decrypt`

```bash
sarra crypto rsa-decrypt [input] [options]

Options:
  -k, --private-key <file>   Private key file (required)
  -o, --out <file>           Write output to file
  -y, --yes                  Output to stdout
```

## Security Notes

- ⚠️ **AES**: Save encryption keys securely - you cannot decrypt without them. Use JSON format to save all decryption parameters together.
- 🔒 **RSA**: Keep private keys secure and never share them. Use `chmod 600` on private key files.
- ✓ Use SHA-256 or SHA-512 for cryptographically secure hashing.
- ✓ For large data, use RSA to encrypt an AES key, then use AES for the data.

---

## `data` - Data Encoding and Formatting

JSON utilities for formatting, validating, querying, and transforming JSON data.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/blob/master/docs/data-help.md)**

### Commands

- `format` (pretty) - Pretty-print JSON with configurable indentation
- `minify` (min) - Minify JSON by removing whitespace
- `validate` (check) - Validate JSON syntax
- `query` (get) - Extract values using dot notation path
- `merge` - Merge multiple JSON files into one
- `to-csv` - Convert JSON array to CSV format

### Quick Examples

```bash
# Format JSON
sarra data json format data.json

# Format with custom indentation
sarra data json format data.json -i 4

# Minify JSON
sarra data json minify large.json -o min.json

# Validate JSON
sarra data json validate config.json

# Query/extract data
sarra data json query "user.name" data.json
sarra data json query "items[0].id" data.json

# Merge JSON files
sarra data json merge config1.json config2.json -o merged.json

# Convert to CSV
sarra data json to-csv users.json -o users.csv

# Pipe workflows
curl https://api.example.com/data | sarra data json format
```

---

## `qr` - QR Code Generation

QR code generation utilities for creating scannable codes from text, URLs, and files.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/blob/master/docs/qrcode-help.md)**

### Commands

- `generate` (gen) - Generate QR code from text
- `terminal` (term) - Display QR code as ASCII art only (no file)
- `url` - Generate QR code from a URL
- `file` - Generate QR code from file content

### Quick Examples

```bash
# Generate QR code
sarra qr generate "Hello World"

# Generate with terminal preview
sarra qr generate "Data" -t

# Quick ASCII preview (no file)
sarra qr terminal "Quick check"

# Generate from URL
sarra qr url https://github.com

# Generate from file
sarra qr file config.json

# Custom size and colors
sarra qr generate "Styled" -s 500 --dark '#FF0000' --light '#FFFF00'

# Save to file
sarra qr generate "Data" -o qrcode.png

# High error correction for damaged codes
sarra qr generate "Important" -e H -o code.png
```

### Error Correction Levels

- **L** - Low (7% recovery)
- **M** - Medium (15% recovery) [default]
- **Q** - Quartile (25% recovery)
- **H** - High (30% recovery)

### Size Recommendations

- **300px** - Screen display, mobile sharing
- **400px** - General purpose, web embedding
- **500-800px** - Printing on paper, posters
- **1000px+** - Large format printing, banners

---

## `time` - Date and Time Utilities

Date and time utilities for scripting, logging, and debugging.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/blob/master/docs/time-help.md)**

### Commands

- `now` - Print the current timestamp

### Quick Examples

```bash
# Current timestamp (ISO 8601)
sarra time now

# Unix timestamp (seconds)
sarra time now --unix

# Unix timestamp (milliseconds)
sarra time now --ms

# Date only
sarra time now --format date

# Time only
sarra time now --format time

# Use in scripts
echo "Started at $(sarra time now)"
```

### Output Formats

- **Default (ISO 8601)**: `2026-01-21T13:45:22.123Z`
- **`--unix`**: `1737468322`
- **`--ms`**: `1737468322123`
- **`--format date`**: `2026-01-21`
- **`--format time`**: `13:45:22.123`

---

## `ssl` - SSL Certificate Generation

SSL/TLS certificate generation for local development and production environments. Generate self-signed certificates instantly or obtain trusted certificates from Let's Encrypt.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/blob/master/docs/ssl-help.md)**

### Commands

- `generate` - Generate self-signed SSL certificates for local development
- `letsencrypt` - Obtain trusted SSL certificates from Let's Encrypt for production

### Quick Examples

```bash
# Generate self-signed certificate for localhost
sarra ssl generate

# Generate for custom local domain
sarra ssl generate --domain myapp.local

# Generate with custom validity period
sarra ssl generate --domain dev.example.com --validity 90

# Get Let's Encrypt certificate (standalone mode)
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone

# Get Let's Encrypt certificate (with existing web server)
sarra ssl letsencrypt -d example.com -e admin@example.com --webroot /var/www/html

# Test Let's Encrypt setup first
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone --staging
```

### When to Use Each Command

**`ssl generate` - Self-Signed Certificates**

- ✅ Local development (`https://localhost`)
- ✅ Internal testing environments
- ✅ Development teams (share certificate)
- ❌ NOT for production websites
- ❌ NOT for public applications

**`ssl letsencrypt` - Let's Encrypt Certificates**

- ✅ Production websites
- ✅ Public-facing applications
- ✅ Any service requiring browser trust
- ❌ NOT for localhost development
- ❌ NOT for offline environments

### Certificate Specifications (Self-Signed)

- **Key Algorithm:** RSA 2048-bit
- **Signature Algorithm:** SHA-256
- **Validity:** Up to 365 days
- **Output:** `.crt` and `.key` files in PEM format

### Prerequisites for Let's Encrypt

1. **Certbot installed:**
   - macOS: `brew install certbot`
   - Ubuntu: `sudo apt install certbot`
   - Windows: Download from https://certbot.eff.org

2. **Domain ownership:**
   - Real domain (not `localhost` or `.local`)
   - DNS points to your server's IP
   - Verify: `dig +short example.com`

3. **Network access:**
   - Port 80 open and accessible
   - Firewall allows incoming connections

### Making Self-Signed Certificates Trusted

To eliminate browser warnings during local development:

**macOS:**

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certs/localhost.crt
```

**Windows (as Administrator):**

```bash
certutil -addstore -f "ROOT" ./certs/localhost.crt
```

**Linux:**

```bash
sudo cp ./certs/localhost.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

> **Note:** This only trusts the certificate on your machine. Other users will still see warnings.

---

## Interactive Mode

Most commands support an interactive mode that prompts you before saving files:

```
📁 Save Location
   Current directory: /home/user/projects
   Default file: output.txt
   Full path: /home/user/projects/output.txt

Save to file? (Y/n/path):
```

**Your options:**

- Press **Enter** or type **y** → Save to default location
- Type **n** → Output to stdout (terminal)
- Type a **custom path** → Save to specified location

**Skip the prompt:**

- Use **`-y`** flag to output directly to stdout
- Use **`-o <file>`** flag to save directly to a file

**Examples:**

```bash
# Interactive (will prompt)
sarra id uuid --count 5

# Skip prompt, output to stdout
sarra id uuid --count 5 -y

# Skip prompt, save to file
sarra id uuid --count 5 -o uuids.txt

# Custom nested path (auto-creates directories)
sarra qr generate "Data" -o ./output/qrcodes/code.png
```

---

## Common Patterns

### Piping and Workflows

```bash
# API response to formatted JSON
curl https://api.example.com/data | sarra data json format

# Hash pipeline
echo "data" | sarra crypto base64 | sarra crypto hash sha256

# Format then minify
sarra data json format ugly.json | sarra data json minify -o min.json

# Validate before processing
sarra data json validate data.json && sarra data json query "users" data.json
```

### File Output

```bash
# Direct file output
sarra id uuid --count 100 -o uuids.txt
sarra crypto hash sha256 "data" -o hash.txt
sarra qr generate "https://example.com" -o qr.png
sarra ssl generate --domain myapp.local

# Nested directories (auto-created)
sarra id random --length 32 -o ./secrets/tokens/api-key.txt
sarra data json format data.json -o ./output/formatted/data.json
```

### JSON Format Output

```bash
# Global format flag (before subcommand)
sarra id --format json uuid --count 5
sarra crypto --format json hash sha256 "data"

# Save JSON output
sarra id --format json uuid -o uuids.json
sarra crypto --format json base64 "data" -o encoded.json
```

### Geolocation and IP Utilities

IP address and geolocation utilities for network information.
Commands

```bash
my-ip - Get your current public IP address
lookup - Get geolocation information for an IP address
validate - Validate an IP address (IPv4 or IPv6)
local - Get local network interface information
```

# Examples

## Get your public IP

```bash
sarra geo my-ip
```

# Get IPv4 only

```bash
sarra geo my-ip --ipv4
```

# Lookup IP geolocation

```bash
sarra geo lookup 8.8.8.8
```

# Lookup your own IP info

```bash
sarra geo lookup
```

# Validate IP addresses

```bash
sarra geo validate 192.168.1.1
sarra geo validate 2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

# Show local network interfaces

sarra geo local

# JSON output

```bash
sarra geo --format json my-ip
sarra geo --format json lookup 1.1.1.1
```

Options:

```bash
  -4, --ipv4    Show only IPv4 address
  -6, --ipv6    Show only IPv6 address
```

Arguments:
ip IP address to validate

# Notes

```bash
my-ip and lookup commands require internet connection
lookup uses ipapi.co free API (rate limited to 1000 requests/day)
validate and local work offline
Local command skips loopback interfaces
All commands support --format json for programmatic usage
```

---

## Tips

- Use **`--help`** on any command for detailed information
- Use **`--version`** to see the current version
- Global options like `--format` must appear **before** the subcommand
- Many commands support reading from **stdin** for pipeline operations
- Directories are **automatically created** when using `-o/--out`
- Use **`-y`** flag to skip interactive prompts and output to stdout
- Use **`-o`** flag to save directly to a file without prompts
- SSL certificates are **zero-dependency** - no OpenSSL installation required

---

## Documentation

Detailed documentation for each command group:

- [ID Commands (UUID, Random Tokens)](./docs/id-help.md)
- [Crypto Commands (Hash, Base64)](./docs/crypto-help.md)
- [Data Commands (JSON utilities)](./docs/data-help.md)
- [QR Code Commands](./docs/qr-help.md)
- [Time Commands](./docs/time-help.md)
- [SSL Commands (Certificate Generation)](./docs/ssl-help.md)
- [Geo and IP Commands](./docs/geo-help.md)

---

## Examples by Use Case

### Development

```bash
# Generate API key
sarra id random --length 32 -o api-key.txt

# Hash password
echo "mypassword" | sarra crypto hash sha256

# Format API response
curl https://api.example.com/users | sarra data json format

# Setup local HTTPS development
sarra ssl generate --domain localhost
```

### Configuration

```bash
# Merge configs
sarra data json merge base.json env.json local.json -o config.json

# Validate config
sarra data json validate config.json

# Extract specific config
sarra data json query "database.host" config.json
```

### QR Codes

```bash
# WiFi QR code
sarra qr generate "WIFI:T:WPA;S:MyNetwork;P:password;;" -o wifi.png

# URL sharing
sarra qr url https://myapp.com -s 500 -o share.png

# Contact info
sarra qr generate "BEGIN:VCARD..." -e H -o contact.png
```

### Data Processing

```bash
# Extract users and convert to CSV
sarra data json query "users" data.json | sarra data json to-csv -o users.csv

# Format then validate
sarra data json format raw.json | sarra data json validate
```

### SSL/TLS Setup

```bash
# Local development environment
sarra ssl generate --domain localhost
sarra ssl generate --domain myapp.local --validity 180

# Production website deployment
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone

# Multiple environments
sarra ssl generate --domain dev.myapp.local
sarra ssl generate --domain staging.myapp.local
sarra ssl letsencrypt -d myapp.com -e ops@myapp.com --webroot /var/www/html
```

### DevOps & CI/CD

```bash
# Generate unique deployment IDs
sarra id uuid --uuid-version v7 -y

# Hash artifact checksums
cat build.zip | sarra crypto hash sha256 -o checksum.txt

# Validate configuration files
sarra data json validate config.json && deploy.sh

# Generate QR codes for mobile app testing
sarra qr url "https://testflight.apple.com/join/abc123" -o testflight.png

# Timestamp build logs
echo "Build started: $(sarra time now)" >> build.log
```

---

## Security Notes

### Self-Signed Certificates

- ⚠️ **Only for development** - browsers will show warnings
- ⚠️ **Not trusted by default** - requires manual installation
- ⚠️ **Never use in production** - visitors will see security errors

### Let's Encrypt Certificates

- ✅ **Automatically trusted** by all browsers and devices
- ✅ **Free and automated** - renews every 90 days
- ✅ **Production-ready** - industry-standard security
- ⚠️ **Requires domain ownership** - cannot be used for localhost
- ⚠️ **Rate limited** - 50 certificates per domain per week

### Best Practices

1. Use `ssl generate` for local development
2. Test Let's Encrypt with `--staging` flag first
3. Never commit `.key` files to version control
4. Rotate certificates regularly
5. Keep certbot updated for security patches

---

## Troubleshooting

### SSL Certificate Issues

**"Certbot not found"**

- Install certbot: `brew install certbot` (macOS) or `sudo apt install certbot` (Linux)

**"Let's Encrypt doesn't work with localhost"**

- Use `sarra ssl generate` for local development instead

**"Domain must point to this server's IP"**

- Verify DNS: `dig +short example.com` should show your server's IP

**"Port 80 must be accessible"**

- Check firewall rules: `sudo ufw status`
- Ensure no other service is using port 80

### Other Common Issues

**"Command not found"**

- Reinstall globally: `npm install -g sarra`
- Check PATH: `echo $PATH`

**"Permission denied" when saving files**

- Use `sudo` for system directories
- Save to user-writable locations instead

**JSON validation fails**

- Check for trailing commas
- Verify quote types (must use double quotes)
- Use `sarra data json format` to auto-fix formatting

---

# SDK

Use Sarra's powerful utilities in your Node.js and React applications.

## Usage

### Import

```typescript
// Import the entire SDK
import { sarra } from "sarra";

// Or import specific modules
import { id, crypto, geo } from "sarra";
```

## API Reference

### ID Generation

Generate UUIDs and cryptographically secure random tokens.

#### `sarra.id.uuid(options)`

Generate UUIDs (v4 or v7).

```typescript
interface UUIDOptions {
  version?: "v4" | "v7"; // Default: 'v4'
  count?: number; // Default: 1
}

interface UUIDResult {
  version: string;
  uuids: string[];
}
```

**Examples:**

```typescript
// Generate single UUID v4
const result = sarra.id.uuid();
console.log(result.uuids[0]); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

// Generate 5 UUID v4s
const result = sarra.id.uuid({ count: 5 });
console.log(result.uuids); // Array of 5 UUIDs

// Generate UUID v7 (time-ordered)
const result = sarra.id.uuid({ version: "v7", count: 3 });
console.log(result.uuids); // Array of 3 time-ordered UUIDs
```

#### `sarra.id.random(options)`

Generate cryptographically secure random tokens.

```typescript
interface RandomTokenOptions {
  length?: number; // Byte length, default: 16
  count?: number; // Default: 1
}

interface RandomTokenResult {
  tokens: string[];
  count: number;
  length: number;
  encoding: "hex";
}
```

**Examples:**

```typescript
// Generate 16-byte token (32 hex characters)
const result = sarra.id.random();
console.log(result.tokens[0]); // '4f3d2e1c0b9a8f7e6d5c4b3a2f1e0d9c'

// Generate 32-byte token (64 hex characters)
const result = sarra.id.random({ length: 32 });
console.log(result.tokens[0]); // 64-character hex string

// Generate multiple tokens
const result = sarra.id.random({ length: 16, count: 5 });
console.log(result.tokens); // Array of 5 tokens
```

---

### Cryptography

Hash, encode, encrypt, and decrypt data.

#### `sarra.crypto.hash(options)`

Generate cryptographic hashes.

```typescript
interface HashOptions {
  algorithm: "md5" | "sha1" | "sha256" | "sha512";
  input: string;
}
```

**Examples:**

```typescript
// SHA-256 hash
const hash = sarra.crypto.hash({
  algorithm: "sha256",
  input: "hello world",
});
console.log(hash); // 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'

// MD5 hash
const md5 = sarra.crypto.hash({
  algorithm: "md5",
  input: "secret",
});
```

#### `sarra.crypto.base64(options)`

Base64 encode or decode strings.

```typescript
interface Base64Options {
  input: string;
  decode?: boolean; // Default: false
}
```

**Examples:**

```typescript
// Encode
const encoded = sarra.crypto.base64({ input: "hello world" });
console.log(encoded); // 'aGVsbG8gd29ybGQ='

// Decode
const decoded = sarra.crypto.base64({
  input: "aGVsbG8gd29ybGQ=",
  decode: true,
});
console.log(decoded); // 'hello world'
```

#### `sarra.crypto.aesEncrypt(options)`

Encrypt data using AES-256-GCM.

```typescript
interface AESEncryptOptions {
  input: string;
  key?: string; // Optional 64-char hex string
}

interface AESEncryptResult {
  encrypted: string;
  iv: string;
  authTag: string;
  key: string;
}
```

**Examples:**

```typescript
// Encrypt with auto-generated key
const result = sarra.crypto.aesEncrypt({
  input: "secret message",
});

console.log(result.encrypted); // Encrypted data (hex)
console.log(result.key); // 64-char hex key
console.log(result.iv); // 32-char hex IV
console.log(result.authTag); // 32-char hex auth tag

// Encrypt with custom key
const result = sarra.crypto.aesEncrypt({
  input: "secret message",
  key: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
});
```

#### `sarra.crypto.aesDecrypt(options)`

Decrypt AES-256-GCM encrypted data.

```typescript
interface AESDecryptOptions {
  encrypted: string;
  key: string;
  iv: string;
  authTag: string;
}
```

**Examples:**

```typescript
// Decrypt data
const decrypted = sarra.crypto.aesDecrypt({
  encrypted: result.encrypted,
  key: result.key,
  iv: result.iv,
  authTag: result.authTag,
});

console.log(decrypted); // 'secret message'
```

#### `sarra.crypto.rsaKeygen(options)`

Generate RSA key pair.

```typescript
interface RSAKeygenOptions {
  size?: 2048 | 3072 | 4096; // Default: 2048
}

interface RSAKeygenResult {
  publicKey: string; // PEM format
  privateKey: string; // PEM format
}
```

**Examples:**

```typescript
// Generate 2048-bit key pair
const keys = sarra.crypto.rsaKeygen();
console.log(keys.publicKey); // '-----BEGIN PUBLIC KEY-----...'
console.log(keys.privateKey); // '-----BEGIN PRIVATE KEY-----...'

// Generate 4096-bit key pair
const keys = sarra.crypto.rsaKeygen({ size: 4096 });
```

#### `sarra.crypto.rsaEncrypt(options)`

Encrypt data using RSA public key.

```typescript
interface RSAEncryptOptions {
  input: string;
  publicKey: string; // PEM format
}
```

**Examples:**

```typescript
const keys = sarra.crypto.rsaKeygen();

const encrypted = sarra.crypto.rsaEncrypt({
  input: "secret message",
  publicKey: keys.publicKey,
});

console.log(encrypted); // Base64-encoded encrypted data
```

#### `sarra.crypto.rsaDecrypt(options)`

Decrypt data using RSA private key.

```typescript
interface RSADecryptOptions {
  encrypted: string; // Base64 format
  privateKey: string; // PEM format
}
```

**Examples:**

```typescript
const decrypted = sarra.crypto.rsaDecrypt({
  encrypted: encrypted,
  privateKey: keys.privateKey,
});

console.log(decrypted); // 'secret message'
```

---

### Geolocation & IP

Get IP addresses, validate IPs, and lookup geolocation data.

#### `sarra.geo.myIp(ipv6?)`

Get your public IP address.

```typescript
interface IpInfo {
  ip: string;
}
```

**Examples:**

```typescript
// Get IPv4 address
const result = await sarra.geo.myIp();
console.log(result.ip); // '203.0.113.42'

// Get IPv6 address
const result = await sarra.geo.myIp(true);
console.log(result.ip); // '2001:0db8:85a3::8a2e:0370:7334'
```

#### `sarra.geo.lookup(ip?)`

Get geolocation information for an IP address.

```typescript
interface GeolocationData {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  timezone?: string;
  org?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
}
```

**Examples:**

```typescript
// Lookup specific IP
const data = await sarra.geo.lookup("8.8.8.8");
console.log(data.city); // 'Mountain View'
console.log(data.country_name); // 'United States'
console.log(data.org); // 'Google LLC'

// Lookup your own IP
const data = await sarra.geo.lookup();
console.log(data.city, data.country_name);
```

#### `sarra.geo.validate(ip)`

Validate an IP address (IPv4 or IPv6).

```typescript
interface IpValidation {
  ip: string;
  valid: boolean;
  type: "IPv4" | "IPv6" | null;
}
```

**Examples:**

```typescript
// Validate IPv4
const result = sarra.geo.validate("192.168.1.1");
console.log(result.valid); // true
console.log(result.type); // 'IPv4'

// Validate IPv6
const result = sarra.geo.validate("2001:0db8:85a3::8a2e:0370:7334");
console.log(result.valid); // true
console.log(result.type); // 'IPv6'

// Invalid IP
const result = sarra.geo.validate("999.999.999.999");
console.log(result.valid); // false
console.log(result.type); // null
```

---

## React Examples

### UUID Generator Component

```tsx
import { useState } from "react";
import { sarra } from "sarra";

function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUIDs = () => {
    const result = sarra.id.uuid({ version: "v4", count: 5 });
    setUuids(result.uuids);
  };

  return (
    <div>
      <button onClick={generateUUIDs}>Generate UUIDs</button>
      <ul>
        {uuids.map((uuid) => (
          <li key={uuid}>{uuid}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Hash Generator

```tsx
import { useState } from "react";
import { sarra } from "sarra";

function HashGenerator() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  const generateHash = () => {
    const result = sarra.crypto.hash({
      algorithm: "sha256",
      input,
    });
    setHash(result);
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash"
      />
      <button onClick={generateHash}>Generate SHA-256</button>
      {hash && <code>{hash}</code>}
    </div>
  );
}
```

### IP Lookup Component

```tsx
import { useState } from "react";
import { sarra } from "sarra";

function IPLookup() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    try {
      const result = await sarra.geo.lookup(ip || undefined);
      setData(result);
    } catch (error) {
      console.error("Lookup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="Enter IP (or leave empty for your IP)"
      />
      <button onClick={lookup} disabled={loading}>
        {loading ? "Looking up..." : "Lookup"}
      </button>

      {data && (
        <div>
          <p>IP: {data.ip}</p>
          <p>City: {data.city}</p>
          <p>Country: {data.country_name}</p>
          <p>ISP: {data.org}</p>
        </div>
      )}
    </div>
  );
}
```

### Encryption Example

```tsx
import { useState } from "react";
import { sarra } from "sarra";

function Encryptor() {
  const [message, setMessage] = useState("");
  const [encrypted, setEncrypted] = useState(null);
  const [decrypted, setDecrypted] = useState("");

  const encrypt = () => {
    const result = sarra.crypto.aesEncrypt({ input: message });
    setEncrypted(result);
  };

  const decrypt = () => {
    if (!encrypted) return;
    const result = sarra.crypto.aesDecrypt({
      encrypted: encrypted.encrypted,
      key: encrypted.key,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });
    setDecrypted(result);
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={encrypt}>Encrypt</button>

      {encrypted && (
        <>
          <div>
            <p>Encrypted: {encrypted.encrypted.slice(0, 50)}...</p>
            <p>Key: {encrypted.key.slice(0, 20)}...</p>
          </div>
          <button onClick={decrypt}>Decrypt</button>
          {decrypted && <p>Decrypted: {decrypted}</p>}
        </>
      )}
    </div>
  );
}
```

---

## TypeScript Support

Sarra is written in TypeScript and includes full type definitions.

```typescript
import { sarra, UUIDOptions, GeolocationData } from "sarra";

const options: UUIDOptions = {
  version: "v4",
  count: 5,
};

const result = sarra.id.uuid(options);

const data: GeolocationData = await sarra.geo.lookup("8.8.8.8");
```

---

## Notes

### Crypto Module

- All cryptographic operations use Node.js built-in `crypto` module
- AES keys must be exactly 32 bytes (64 hexadecimal characters)
- RSA is suitable for encrypting small amounts of data
- For large files, use RSA to encrypt an AES key, then use AES for the data

### Geo Module

- `myIp()` and `lookup()` require internet connection
- `lookup()` uses ipapi.co free tier (rate limited to 1000 requests/day)
- `validate()` works offline (no API calls)
- All API calls use HTTPS for secure communication

---

## License

See the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG](CHANGELOG.md) for version history and updates.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## Roadmap

Planned features for future releases:

- 📊 More data format conversions (YAML, TOML, XML)
- 🌐 DNS utilities and domain validation
- 🔑 SSH key generation and management
- 📦 Archive utilities (zip, tar)
- 🎨 Image processing and optimization
- 🔍 File search and text processing

---
