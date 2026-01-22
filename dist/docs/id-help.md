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

    # Interactive prompt (default behavior)
    sarra id uuid --count 3
    sarra id random --length 32 --count 5

    # Skip prompt and output to stdout
    sarra id uuid --count 3 -y
    sarra id random --length 32 -y

    # Write directly to file (skips prompt)
    sarra id uuid --count 3 --out uuids.txt
    sarra id --format json uuid --uuid-version v7 --out uuids.json

    # Custom paths with nested directories (auto-created)
    sarra id uuid --out ./output/data/uuids.txt
    sarra id random --length 32 --count 5 -o ./tokens/secure.json

INTERACTIVE MODE

By default, commands will prompt you before saving to a file:

    📁 Save Location
       Current directory: /home/user/projects
       Default file: uuids.txt
       Full path: /home/user/projects/uuids.txt

    Save to file? (Y/n/path):

Options:
• Press Enter or type 'y' → Save to default location
• Type 'n' → Output to stdout (terminal)
• Type a path → Save to custom location

Skip the prompt:
• Use -y flag to output directly to stdout
• Use -o/--out flag to save directly to a file

NOTES

• Global options must appear BEFORE the subcommand
• Subcommands may define additional options (e.g. --count, --out)
• Without -o or -y flags, you'll be prompted for save location
• Directories are created automatically when using -o/--out
• UUID v7 is recommended for databases and ordered indexes

UUID VERSIONS
v4 Random (default)
v7 Time-ordered (recommended)
