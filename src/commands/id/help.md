Generate and manage identifiers, tokens, and unique values commonly used in
databases, APIs, authentication, and distributed systems.

GLOBAL OPTIONS
--format <format> Output format for all id subcommands
Supported values: text | json

COMMANDS
uuid Generate UUIDs (v4, v7)
random Generate cryptographically secure random tokens

EXAMPLES

UUID generation

    # Generate a single UUID (v4, default, text output)
    sarra id uuid

    # Generate multiple UUIDs (v4)
    sarra id uuid --count 5

    # Generate a time-ordered UUID (v7)
    sarra id uuid --uuid-version v7

    # Generate multiple UUID v7 values
    sarra id uuid --uuid-version v7 --count 3

Random token generation

    # Generate a random token (16 bytes -> 32 hex characters)
    sarra id random

    # Generate multiple random tokens
    sarra id random --count 3

    # Generate a longer random token
    sarra id random --length 32

    # Generate multiple long random tokens
    sarra id random --length 32 --count 5

Output formats

    # JSON output (global option must come first)
    sarra id --format json uuid --uuid-version v7 --count 3

Writing output to files

    # Write UUIDs to a text file
    sarra id uuid --count 3 --out uuids.txt

    # Write UUIDs to a JSON file
    sarra id --format json uuid --uuid-version v7 --out uuids.json

    # Write tokens to a JSON file
    sarra id random --length 32 --count 5 --format json --out tokens.json

NOTES

- Global options must appear BEFORE the subcommand.
- Subcommands may define additional options (e.g. --count, --out).
- If --out is omitted, output is written to stdout.
- UUID v7 is recommended for databases and ordered indexes.

UUID VERSIONS
v4 Random (default)
v7 Time-ordered (recommended)
