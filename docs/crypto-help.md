# Crypto Commands

Cryptographic utilities for hashing, encoding, and encryption.

## Global Options

```
--format <format>    Output format for all crypto subcommands
                     Supported values: text | json
```

## Commands

| Command       | Description                                               |
| ------------- | --------------------------------------------------------- |
| `hash`        | Generate cryptographic hashes (md5, sha1, sha256, sha512) |
| `base64`      | Base64 encode or decode data                              |
| `aes-encrypt` | Encrypt data using AES-256-GCM                            |
| `aes-decrypt` | Decrypt AES-256-GCM encrypted data                        |
| `rsa-keygen`  | Generate RSA key pair                                     |
| `rsa-encrypt` | Encrypt data using RSA public key                         |
| `rsa-decrypt` | Decrypt data using RSA private key                        |

## Examples

### Hash Generation

```bash
# Generate a SHA-256 hash
sarra crypto hash sha256 "hello world"

# Generate a hash from stdin
echo "hello" | sarra crypto hash sha256

# Different hash algorithms
sarra crypto hash md5 "data"
sarra crypto hash sha1 "data"
sarra crypto hash sha512 "data"

# With JSON format
sarra crypto --format json hash sha256 "hello world"
```

### Base64 Encoding/Decoding

```bash
# Encode a string
sarra crypto base64 "hello world"

# Decode base64
sarra crypto base64 --decode SGVsbG8gd29ybGQ=
sarra crypto base64 -d SGVsbG8gd29ybGQ=

# Encode from stdin
echo "hello" | sarra crypto base64

# Decode from stdin
echo SGVsbG8= | sarra crypto base64 --decode

# Pipe workflows
cat file.txt | sarra crypto base64 | sarra crypto base64 -d
```

### AES Encryption/Decryption

```bash
# Encrypt with auto-generated key
sarra crypto aes-encrypt "secret message"
sarra crypto aes-encrypt "secret message" -y

# Encrypt with specific key (64 hex chars = 32 bytes)
sarra crypto aes-encrypt "message" -k 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Encrypt from stdin
echo "secret data" | sarra crypto aes-encrypt

# Encrypt to JSON format (includes key, IV, auth tag)
sarra crypto --format json aes-encrypt "message" -o encrypted.json

# Decrypt (requires key, IV, and auth tag from encryption)
sarra crypto aes-decrypt <encrypted-hex> \
  -k <key-hex> \
  -i <iv-hex> \
  -t <auth-tag-hex>

# Decrypt from stdin
echo "<encrypted-data>" | sarra crypto aes-decrypt -k <key> -i <iv> -t <tag>

# Decrypt to file
sarra crypto aes-decrypt <data> -k <key> -i <iv> -t <tag> -o decrypted.txt
```

### RSA Key Generation

```bash
# Generate 2048-bit RSA key pair (default)
sarra crypto rsa-keygen

# Generate with specific key size
sarra crypto rsa-keygen --size 4096
sarra crypto rsa-keygen -s 3072

# Output to specific directory
sarra crypto rsa-keygen -o ./my-keys

# Output keys to stdout
sarra crypto rsa-keygen -y
```

### RSA Encryption/Decryption

```bash
# Encrypt with public key
sarra crypto rsa-encrypt "secret message" -p public_key.pem

# Encrypt from stdin
echo "message" | sarra crypto rsa-encrypt -p public_key.pem

# Encrypt to file
sarra crypto rsa-encrypt "data" -p public_key.pem -o encrypted.txt

# Decrypt with private key
sarra crypto rsa-decrypt <base64-data> -k private_key.pem

# Decrypt from stdin
cat encrypted.txt | sarra crypto rsa-decrypt -k private_key.pem

# Decrypt to file
sarra crypto rsa-decrypt <data> -k private_key.pem -o decrypted.txt
```

### Output to Files

```bash
# Interactive prompt (default behavior)
sarra crypto hash sha256 "secret data"
sarra crypto base64 "encode this"
sarra crypto aes-encrypt "message"

# Skip prompt and output to stdout
sarra crypto hash sha256 "data" -y
sarra crypto base64 "data" -y
sarra crypto aes-encrypt "data" -y

# Write directly to file (skips prompt)
sarra crypto hash sha256 "data" -o hash.txt
sarra crypto base64 "data" -o encoded.txt
sarra crypto aes-encrypt "data" -o encrypted.json

# JSON output to file
sarra crypto --format json hash sha256 "data" -o hash.json
sarra crypto --format json base64 "data" -o result.json
sarra crypto --format json aes-encrypt "data" -o encrypted.json

# Custom paths with nested directories (auto-created)
sarra crypto hash sha256 "secret" -o ./output/hashes/secret.txt
```

## Interactive Mode

By default, commands will prompt you before saving to a file:

```
📁 Save Location
   Current directory: /home/user/projects
   Default file: hash.txt
   Full path: /home/user/projects/hash.txt

Save to file? (Y/n/path):
```

**Options:**

- Press Enter or type 'y' → Save to default location
- Type 'n' → Output to stdout (terminal)
- Type a path → Save to custom location

**Skip the prompt:**

- Use `-y` flag to output directly to stdout
- Use `-o/--out` flag to save directly to a file

## Algorithms

### Hash Algorithms

| Algorithm | Description                                 |
| --------- | ------------------------------------------- |
| `md5`     | 128-bit hash (not cryptographically secure) |
| `sha1`    | 160-bit hash (deprecated for security)      |
| `sha256`  | 256-bit hash (recommended)                  |
| `sha512`  | 512-bit hash (maximum security)             |

### Encryption Algorithms

| Algorithm     | Description                                              |
| ------------- | -------------------------------------------------------- |
| `AES-256-GCM` | Authenticated encryption (256-bit key, 128-bit auth tag) |
| `RSA-OAEP`    | RSA encryption with OAEP padding and SHA-256             |

### RSA Key Sizes

| Size      | Security Level              |
| --------- | --------------------------- |
| 2048 bits | Standard security (default) |
| 3072 bits | High security               |
| 4096 bits | Maximum security            |

## Security Notes

### AES Encryption

- ⚠️ **Always save the encryption key securely** - you cannot decrypt without it
- The IV (initialization vector) and auth tag are required for decryption
- Use JSON format output to save all required decryption parameters together
- Never reuse the same key + IV combination for different messages
- AES-256-GCM provides authenticated encryption (detects tampering)

### RSA Encryption

- 🔒 **Keep private keys secure and never share them**
- Public keys can be freely distributed
- RSA is suitable for encrypting small amounts of data (key exchange)
- For large data, use RSA to encrypt an AES key, then use AES for the data
- Private key file should have restricted permissions (`chmod 600`)

## Command Reference

### `hash`

```bash
sarra crypto hash <algorithm> [input] [options]

Arguments:
  algorithm    Hash algorithm (md5 | sha1 | sha256 | sha512)
  input        Input string to hash (reads from stdin if omitted)

Options:
  -o, --out <file>    Write output to a file (skips prompt)
  -y, --yes           Skip prompt and output to stdout
```

### `base64`

```bash
sarra crypto base64 [input] [options]

Arguments:
  input        Input string to encode (reads from stdin if omitted)

Options:
  -d, --decode        Decode base64 instead of encode
  -o, --out <file>    Write output to a file (skips prompt)
  -y, --yes           Skip prompt and output to stdout
```

### `aes-encrypt`

```bash
sarra crypto aes-encrypt [input] [options]

Arguments:
  input        Input string to encrypt (reads from stdin if omitted)

Options:
  -k, --key <key>     Encryption key (hex, 32 bytes). Auto-generated if omitted
  -o, --out <file>    Write output to a file (skips prompt)
  -y, --yes           Skip prompt and output to stdout
```

### `aes-decrypt`

```bash
sarra crypto aes-decrypt [input] [options]

Arguments:
  input        Encrypted data (hex) (reads from stdin if omitted)

Options:
  -k, --key <key>     Decryption key (hex, 32 bytes) [required]
  -i, --iv <iv>       Initialization vector (hex, 16 bytes) [required]
  -t, --tag <tag>     Auth tag (hex, 16 bytes) [required]
  -o, --out <file>    Write output to a file (skips prompt)
  -y, --yes           Skip prompt and output to stdout
```

### `rsa-keygen`

```bash
sarra crypto rsa-keygen [options]

Options:
  -s, --size <bits>   Key size in bits (2048, 3072, 4096) [default: 2048]
  -o, --out <dir>     Output directory (skips prompt)
  -y, --yes           Skip prompt and output to stdout
```

### `rsa-encrypt`

```bash
sarra crypto rsa-encrypt [input] [options]

Arguments:
  input               Input string to encrypt (reads from stdin if omitted)

Options:
  -p, --public-key <file>    Path to public key file (PEM) [required]
  -o, --out <file>           Write output to a file (skips prompt)
  -y, --yes                  Skip prompt and output to stdout
```

### `rsa-decrypt`

```bash
sarra crypto rsa-decrypt [input] [options]

Arguments:
  input                  Encrypted data (base64) (reads from stdin if omitted)

Options:
  -k, --private-key <file>   Path to private key file (PEM) [required]
  -o, --out <file>           Write output to a file (skips prompt)
  -y, --yes                  Skip prompt and output to stdout
```

## Notes

- Global `--format` option must appear BEFORE the subcommand
- If no input argument is provided, input is read from stdin
- Hash output is always hexadecimal
- Base64 encoding is standard (not URL-safe)
- Without `-o` or `-y` flags, you'll be prompted for save location
- Directories are created automatically when using `-o/--out`
- Use SHA-256 or SHA-512 for security-sensitive applications
- AES keys must be exactly 32 bytes (64 hexadecimal characters)
- RSA encrypted output is base64-encoded
- RSA keys are stored in PEM format
