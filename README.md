# Sarra CLI

Daily developer enhancement tools - A collection of CLI utilities for common development tasks including ID generation, cryptography, data formatting, and time utilities.

## Installation

```bash
npm install -g sarra
```

Or use directly with npx:

```bash
npx sarra <command>
```

## Usage

```bash
sarra <command> [options]
```

Use `--help` on any command for more details:

```bash
sarra --help
sarra id --help
sarra crypto --help
```

## Command Groups

### `id` - Identifiers, Tokens, and UUIDs

Generate and manage identifiers, tokens, and unique values commonly used in databases, APIs, authentication, and distributed systems.

#### Global Options

- `--format <format>` - Output format for all id subcommands. Supported values: `text` | `json`

#### Commands

- `uuid` - Generate UUIDs (v4, v7)
- `random` - Generate cryptographically secure random tokens

#### Examples

**UUID generation:**

```bash
# Generate a single UUID (v4, default, text output)
sarra id uuid

# Generate multiple UUIDs (v4)
sarra id uuid --count 5

# Generate a time-ordered UUID (v7)
sarra id uuid --uuid-version v7

# Generate multiple UUID v7 values
sarra id uuid --uuid-version v7 --count 3
```

**Random token generation:**

```bash
# Generate a random token (16 bytes -> 32 hex characters)
sarra id random

# Generate multiple random tokens
sarra id random --count 3

# Generate a longer random token
sarra id random --length 32

# Generate multiple long random tokens
sarra id random --length 32 --count 5
```

**Output formats:**

```bash
# JSON output (global option must come first)
sarra id --format json uuid --uuid-version v7 --count 3
```

**Writing output to files:**

```bash
# Write UUIDs to a text file
sarra id uuid --count 3 --out uuids.txt

# Write UUIDs to a JSON file
sarra id --format json uuid --uuid-version v7 --out uuids.json

# Write tokens to a JSON file
sarra id random --length 32 --count 5 --format json --out tokens.json
```

#### Notes

- Global options must appear BEFORE the subcommand
- Subcommands may define additional options (e.g. `--count`, `--out`)
- If `--out` is omitted, output is written to stdout
- UUID v7 is recommended for databases and ordered indexes

#### UUID Versions

- **v4** - Random (default)
- **v7** - Time-ordered (recommended)

---

### `crypto` - Cryptography Utilities

Cryptographic utilities for hashing and encoding.

#### Commands

- `hash` - Generate cryptographic hashes
- `base64` - Base64 encode or decode data

#### Examples

**Hashing:**

```bash
# Generate a SHA-256 hash
sarra crypto hash sha256 "hello world"

# Generate a hash from stdin
echo "hello" | sarra crypto hash sha256
```

**Base64 encoding/decoding:**

```bash
# Encode a string
sarra crypto base64 "hello world"

# Decode base64
sarra crypto base64 --decode SGVsbG8gd29ybGQ=

# Encode from stdin
echo "hello" | sarra crypto base64

# Decode from stdin
echo SGVsbG8= | sarra crypto base64 --decode
```

#### Notes

- If no input argument is provided, input is read from stdin
- Hash output is always hexadecimal

---

### `data` - Data Encoding and Formatting

JSON utilities for formatting and inspecting JSON data.

#### Commands

- `format` - Pretty-print JSON input

#### Usage

```bash
sarra data json format [file]
```

#### Description

Formats JSON with consistent indentation (2 spaces). Input can be provided via a file or stdin.

#### Examples

```bash
# Format a JSON file
sarra data json format data.json

# Format JSON from stdin
echo '{"a":1,"b":2}' | sarra data json format

# Format piped API output
curl https://api.example.com/data | sarra data json format
```

#### Notes

- If no file is provided, input is read from stdin
- Invalid JSON will result in an error
- Output is always written to stdout

---

### `time` - Date and Time Utilities

Date and time utilities for scripting, logging, and debugging.

#### Commands

- `now` - Print the current timestamp

#### Usage

```bash
sarra time now [options]
```

#### Options

- `--unix` - Output Unix timestamp (seconds)
- `--ms` - Output Unix timestamp in milliseconds
- `--format <format>` - Custom output format: `iso` | `date` | `time` (default: `iso`)

#### Description

Provides simple utilities for working with dates and time values. Useful for scripting, logging, and debugging.

#### Examples

```bash
# Print the current timestamp (ISO 8601, default)
sarra time now

# Print Unix timestamp in seconds
sarra time now --unix

# Print Unix timestamp in milliseconds
sarra time now --ms

# Print only the date (YYYY-MM-DD)
sarra time now --format date

# Print only the time (HH:MM:SS.sss)
sarra time now --format time

# Use in scripts
echo "Started at $(sarra time now)"
```

#### Output

- Default format is ISO 8601: `2026-01-09T13:45:22.123Z`
- With `--unix`: `1736427922`
- With `--ms`: `1736427922123`
- With `--format date`: `2026-01-09`
- With `--format time`: `13:45:22.123`

#### Notes

- Output is always written to stdout
- The timestamp is generated in UTC

---

## Tips

- Use `--help` on any command for more details
- Use `--version` to see the current version
- Global options must appear before subcommands
- Many commands support reading from stdin for pipeline operations

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
