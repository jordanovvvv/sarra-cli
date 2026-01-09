Cryptographic utilities for hashing and encoding.

COMMANDS
hash Generate cryptographic hashes
base64 Base64 encode or decode data

EXAMPLES

# Generate a SHA-256 hash

sarra crypto hash sha256 "hello world"

# Generate a hash from stdin

echo "hello" | sarra crypto hash sha256

# Encode a string

sarra crypto base64 "hello world"

# Decode base64

sarra crypto base64 --decode SGVsbG8gd29ybGQ=

# Encode from stdin

echo "hello" | sarra crypto base64

# Decode from stdin

echo SGVsbG8= | sarra crypto base64 --decode

NOTES

- If no input argument is provided, input is read from stdin.
- Hash output is always hexadecimal.
