# Sarra CLI

Daily developer enhancement tools - A collection of CLI utilities for common development tasks including ID generation, cryptography, data formatting, QR code generation, time utilities, and SSL certificate management.

## Installation

```bash
npm install -g sarra
```

Or use directly with npx:

```bash
npx sarra <command>
```

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

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/id-help.md)**

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

## `crypto` - Cryptography Utilities

Cryptographic utilities for hashing and encoding.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/crypto-help.md)**

### Commands

- `hash` - Generate cryptographic hashes (md5, sha1, sha256, sha512)
- `base64` - Base64 encode or decode data

### Quick Examples

```bash
# Generate SHA-256 hash
sarra crypto hash sha256 "hello world"

# Hash from stdin
echo "data" | sarra crypto hash sha256

# Base64 encode
sarra crypto base64 "hello world"

# Base64 decode
sarra crypto base64 --decode SGVsbG8gd29ybGQ=

# Save hash to file
sarra crypto hash sha512 "secret" -o hash.txt

# JSON format
sarra crypto --format json hash sha256 "data" -o hash.json
```

### Supported Hash Algorithms

- **md5** - 128-bit (not cryptographically secure)
- **sha1** - 160-bit (deprecated for security)
- **sha256** - 256-bit (recommended)
- **sha512** - 512-bit (maximum security)

---

## `data` - Data Encoding and Formatting

JSON utilities for formatting, validating, querying, and transforming JSON data.

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/data-help.md)**

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

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/qrcode-help.md)**

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

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/time-help.md)**

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

📚 **[View detailed documentation](https://github.com/jordanovvvv/sarra-cli/docs/ssl-help.md)**

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

## License

See the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG](CHANGELOG.md) for version history and updates.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## Roadmap

Planned features for future releases:

- 🔐 Additional cryptographic algorithms (AES, RSA)
- 📊 More data format conversions (YAML, TOML, XML)
- 🌐 DNS utilities and domain validation
- 🔑 SSH key generation and management
- 📦 Archive utilities (zip, tar)
- 🎨 Image processing and optimization
- 🔍 File search and text processing
- 🌍 Geolocation and IP utilities

---
