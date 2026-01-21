# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

<details open>
<summary><h2>[0.3.0] - 2026-01-22</h2></summary>

### Added

#### SSL/TLS Certificate Generation

- New `ssl` command group for certificate management
- `generate` - Generate self-signed SSL certificates for local development
  - Zero-dependency certificate generation using `node-forge`
  - No OpenSSL installation required (works on Windows, macOS, Linux)
  - RSA 2048-bit key generation
  - SHA-256 signature algorithm
  - Customizable domain name (`-d/--domain` option)
  - Configurable validity period (`--val/--validity` option, max 365 days)
  - Outputs `.crt` and `.key` files in PEM format
  - Includes certificate extensions (basicConstraints, keyUsage, subjectAltName)
  - Interactive file save location prompt
- `letsencrypt` - Obtain trusted SSL certificates from Let's Encrypt
  - Integration with Certbot for production-ready certificates
  - Automatic Certbot installation detection with OS-specific installation instructions
  - Two challenge methods:
    - `--standalone` - Standalone mode (requires port 80)
    - `--webroot` - Webroot mode for existing web servers
  - `--staging` flag for testing without hitting rate limits
  - Domain validation (blocks localhost and .local domains)
  - Email requirement for renewal notifications (`-e/--email` option)
  - Detailed error messages and troubleshooting tips
  - Certificate location display on success
  - Auto-renewal information and testing commands

#### Documentation

- Comprehensive SSL documentation in main README
- New `docs/ssl-help.md` with detailed SSL guide
- "Understanding the Difference" section explaining self-signed vs Let's Encrypt
- Manual certificate trust instructions for macOS, Windows, and Linux
- Prerequisites checklist for Let's Encrypt
- Security notes and best practices
- Troubleshooting guide for common SSL issues
- SSL examples in "Examples by Use Case" section
- DevOps & CI/CD workflow examples

### Features

#### Self-Signed Certificates

- Perfect for local HTTPS development
- Supports custom domains (e.g., `myapp.local`, `dev.example.com`)
- Automatic directory creation for certificate output
- Clear warnings about browser trust requirements
- Instructions for manually trusting certificates on each OS

#### Let's Encrypt Integration

- Production-ready trusted certificates
- Automatic browser trust (no manual installation needed)
- 90-day validity with auto-renewal support
- Rate limit protection via staging mode
- Real-time certbot output display
- Comprehensive prerequisite validation
- DNS and network connectivity checks
- Firewall and port 80 availability guidance

#### Developer Experience

- Colored terminal output for better readability
- Step-by-step command examples
- Clear distinction between development and production use cases
- Quick reference table for command selection
- Inline help with common issues and solutions

### Changed

#### Documentation Updates

- Added SSL to main README command groups
- Updated Quick Start section with SSL example
- Extended "Examples by Use Case" with SSL scenarios
- Added "Security Notes" section
- Enhanced troubleshooting section with SSL issues
- Updated roadmap with completed SSL feature

#### Help Text

- Updated main CLI help text to include `ssl` command group
- Added SSL examples to command group overview

### Security

- ⚠️ Clear warnings about self-signed certificate limitations
- ✅ Guidance on proper Let's Encrypt usage
- 🔒 Best practices for certificate management
- 📝 Recommendations against committing `.key` files to version control
- 🔄 Certificate rotation reminders

### Dependencies

- Added `node-forge` for cryptographic operations
- Uses system `certbot` for Let's Encrypt (external dependency, not bundled)

</details>

---

<details>
<summary><h2>[0.2.0] - 2026-01-21</h2></summary>

### Added

#### QR Code Generation

- New `qr` command group with 4 commands
- `generate` (alias `gen`) - Generate QR codes from text with customizable size, colors, and error correction
- `terminal` (alias `term`) - Display QR codes as ASCII art in terminal
- `url` - Generate QR codes specifically from URLs with validation
- `file` - Generate QR codes from file contents
- Terminal preview option (`-t/--terminal`) for all QR commands
- Support for error correction levels (L, M, Q, H)
- Custom color support for QR codes (`--dark` and `--light` options)
- Configurable image size (`-s/--size` option)

#### Interactive File Save Prompts

- User-friendly prompt showing current directory and full path
- Options: save to default, skip (stdout), or specify custom path
- `-y/--yes` flag to skip prompt and output to stdout
- `-o/--out` flag to skip prompt and save directly to file
- Auto-creation of nested directories when saving files

#### Enhanced JSON Utilities

- Extended `data json` command group with 5 new commands
- `minify` (alias `min`) - Remove whitespace from JSON
- `validate` (alias `check`) - Validate JSON syntax with detailed error messages
- `query` (alias `get`) - Extract values using dot notation (e.g., `user.name`, `items[0].id`)
- `merge` - Merge multiple JSON files into one
- `to-csv` - Convert JSON arrays to CSV format with proper escaping
- Configurable indentation for `format` command (`-i/--indent` option)
- Size reduction statistics for minify command

#### Extended Hash Algorithm Support

- `crypto hash` command now supports multiple algorithms
- `md5` - 128-bit hash
- `sha1` - 160-bit hash
- `sha512` - 512-bit hash
- (Previously only supported SHA-256)

#### Enhanced Output Options

- Colored console output with chalk for better readability
- Consistent `-y` flag across all commands for stdout output
- Consistent `-o/--out` flag across all commands for file output
- Full path resolution and display in success messages
- Input/output length statistics for relevant commands

#### Documentation

- Comprehensive help documentation for all command groups
- Detailed examples and use cases
- Interactive mode explanation
- Query path syntax guide for JSON utilities
- Error correction level descriptions for QR codes
- Size recommendations for QR codes

### Changed

#### Breaking Changes

- **BREAKING**: Commands now prompt before saving files by default
  - Previous: Direct stdout output
  - New: Interactive prompt with options
  - Use `-y` flag to restore old stdout behavior
  - Use `-o` flag for direct file save without prompt

#### Improvements

- Colored output (red for errors, green for success, gray for details)
- More descriptive error messages with helpful suggestions
- Better validation messages with specific failure reasons
- Automatic directory creation for nested paths
- Full path resolution and display
- Better error handling for file operations

### Fixed

- TypeScript type compatibility issues with qrcode library options
- Consistent file output behavior across all commands
- Proper error handling for invalid input across all commands

</details>

---

<details>
<summary><h2>[0.1.0] - 2026-01-07</h2></summary>

### Added

#### Initial Release

- Initial release of Sarra CLI with 4 command groups

#### ID Command Group

- `uuid` - Generate UUIDs v4 (random) and v7 (time-ordered)
  - `--uuid-version` flag to choose UUID version
  - `--count` flag to generate multiple UUIDs
  - `--out` flag to write to file
- `random` - Generate cryptographically secure random tokens
  - `--length` flag to specify byte length
  - `--count` flag to generate multiple tokens
  - `--out` flag to write to file
- Global `--format` option (text | json)

#### Crypto Command Group

- `hash` - Generate SHA-256 cryptographic hashes
  - Support for file and text input
  - Stdin input support
- `base64` - Base64 encode or decode data
  - `--decode` flag for decoding
  - Stdin input support

#### Data Command Group

- `json format` - Pretty-print JSON with 2-space indentation
  - Support for file and stdin input
  - Consistent formatting output

#### Time Command Group

- `now` - Get current timestamp
  - `--unix` flag for Unix timestamp (seconds)
  - `--ms` flag for Unix timestamp (milliseconds)
  - `--format` option (iso | date | time)
  - Default ISO 8601 output

### Features

#### Core Functionality

- Stdin support for all applicable commands
- File output with `--out` flag
- JSON and text output formats
- Comprehensive help documentation with `--help`
- Version information with `--version`

#### Developer-Friendly

- Colored help output
- Command aliases where appropriate
- Pipeline-friendly design
- Error handling with descriptive messages

</details>

---

## Upgrade Guide

### Upgrading from 0.2.0 to 0.3.0

<details>
<summary>Click to view upgrade instructions</summary>

#### New Features

**SSL Certificate Generation:**

No breaking changes in this release. All existing commands continue to work as before.

**New Commands:**

```bash
# Self-signed certificates for local development
sarra ssl generate
sarra ssl generate --domain myapp.local --validity 90

# Let's Encrypt certificates for production
sarra ssl letsencrypt -d example.com -e admin@example.com --standalone
sarra ssl letsencrypt -d example.com -e admin@example.com --webroot /var/www/html
```

**Prerequisites for Let's Encrypt:**

If you plan to use `sarra ssl letsencrypt`, install certbot first:

```bash
# macOS
brew install certbot

# Ubuntu/Debian
sudo apt install certbot

# Windows
# Download from https://certbot.eff.org
```

**Making Self-Signed Certificates Trusted:**

After generating self-signed certificates, you can optionally trust them on your development machine:

```bash
# macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certs/localhost.crt

# Windows (as Administrator)
certutil -addstore -f "ROOT" ./certs/localhost.crt

# Linux
sudo cp ./certs/localhost.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

</details>

### Upgrading from 0.1.0 to 0.2.0

<details>
<summary>Click to view upgrade instructions</summary>

#### Breaking Changes

**File Output Behavior**

**Before (v0.1.0):**

```bash
# Outputs directly to stdout
sarra id uuid
sarra crypto hash sha256 "data"
```

**After (v0.2.0):**

```bash
# Now prompts for save location
sarra id uuid
# Prompts: Save to file? (Y/n/path):

# Use -y to output to stdout (restore old behavior)
sarra id uuid -y
sarra crypto hash sha256 "data" -y

# Use -o to save directly to file (skip prompt)
sarra id uuid -o uuids.txt
```

#### Migration Guide

**For Scripts Using Stdout:**
Add the `-y` flag to all commands that need stdout output:

```bash
#!/bin/bash
# Before
UUID=$(sarra id uuid)

# After
UUID=$(sarra id uuid -y)
```

**For Scripts Using File Output:**
No changes needed - `--out` flag still works and now skips the prompt:

```bash
#!/bin/bash
# This still works
sarra id uuid --count 10 --out uuids.txt
```

#### New Features to Explore

**QR Code Generation:**

```bash
# Generate QR codes
sarra qr generate "Hello World"
sarra qr url https://github.com -t
sarra qr file config.json -s 500
```

**Enhanced JSON Utilities:**

```bash
# New JSON commands
sarra data json minify large.json -o min.json
sarra data json validate config.json
sarra data json query "user.email" data.json
sarra data json merge base.json env.json -o config.json
sarra data json to-csv users.json -o users.csv
```

**More Hash Algorithms:**

```bash
# Now available
sarra crypto hash md5 "data"
sarra crypto hash sha1 "data"
sarra crypto hash sha512 "data"
```

**More Time Commands:**

```bash
# Now available
sarra time now
sarra time now --unix
sarra time now --ms
sarra time now --format date
sarra time now --format time
sarra time now --format locale

convert (conv) — Timestamp conversion

Automatically detect and convert between ISO, Unix (seconds/ms), date-only, and locale formats.

sarra time convert 1737468322
sarra time convert "2026-01-21T13:45:22.123Z" --to unix
sarra time conv 1737468322 --to locale

add — Time arithmetic

Add or subtract time units from the current timestamp or a provided value.

sarra time add --days 5
sarra time add "2026-01-21T10:00:00Z" --hours 2
sarra time add --days 1 --hours 3 --minutes 30
sarra time add --days -3 --hours -2


Supports output formatting:

sarra time add --days 7 --format unix

diff — Time difference calculation

Calculate duration between two timestamps, or from a timestamp to now.

sarra time diff "2026-01-21T00:00:00Z" "2026-02-01T00:00:00Z" --unit days
sarra time diff 1737468322 1737554722
sarra time diff "2026-01-21T10:00:00Z" --unit hours
sarra time diff "2026-01-21T10:00:00Z" "2026-01-20T10:00:00Z" --abs

parse — Validation and inspection

Validate timestamps and inspect parsed values.

sarra time parse "2026-01-21T13:45:22.123Z"
sarra time parse 1737468322
sarra time parse "2026-01-21T13:45:22.123Z" --verbose
sarra time parse "2026-01-21"
```

</details>

---

## Links

- [GitHub Repository](https://github.com/jordanovvvv/sarra-cli)
- [Issue Tracker](https://github.com/jordanovvvv/sarra-cli/issues)
- [Documentation](./docs/)
- [NPM Package](https://www.npmjs.com/package/sarra-cli)
