Cryptographic utilities for hashing and encoding.

GLOBAL OPTIONS
--format <format> Output format for all crypto subcommands
Supported values: text | json

COMMANDS
hash Generate cryptographic hashes (md5, sha1, sha256, sha512)
base64 Base64 encode or decode data

EXAMPLES

Hash generation

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

Base64 encoding/decoding

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

Output to files

    # Interactive prompt (default behavior)
    sarra crypto hash sha256 "secret data"
    sarra crypto base64 "encode this"

    # Skip prompt and output to stdout
    sarra crypto hash sha256 "data" -y
    sarra crypto base64 "data" -y

    # Write directly to file (skips prompt)
    sarra crypto hash sha256 "data" -o hash.txt
    sarra crypto base64 "data" -o encoded.txt

    # JSON output to file
    sarra crypto --format json hash sha256 "data" -o hash.json
    sarra crypto --format json base64 "data" -o result.json

    # Custom paths with nested directories (auto-created)
    sarra crypto hash sha256 "secret" -o ./output/hashes/secret.txt

INTERACTIVE MODE

By default, commands will prompt you before saving to a file:

    📁 Save Location
       Current directory: /home/user/projects
       Default file: hash.txt
       Full path: /home/user/projects/hash.txt

    Save to file? (Y/n/path):

Options:
• Press Enter or type 'y' → Save to default location
• Type 'n' → Output to stdout (terminal)
• Type a path → Save to custom location

Skip the prompt:
• Use -y flag to output directly to stdout
• Use -o/--out flag to save directly to a file

HASH ALGORITHMS
md5 128-bit hash (not cryptographically secure)
sha1 160-bit hash (deprecated for security)
sha256 256-bit hash (recommended)
sha512 512-bit hash (maximum security)

NOTES

• Global --format option must appear BEFORE the subcommand
• If no input argument is provided, input is read from stdin
• Hash output is always hexadecimal
• Base64 encoding is standard (not URL-safe)
• Without -o or -y flags, you'll be prompted for save location
• Directories are created automatically when using -o/--out
• Use SHA-256 or SHA-512 for security-sensitive applications
