JSON utilities for formatting, validating, querying, and transforming JSON data.

COMMANDS
format (pretty) Pretty-print JSON with configurable indentation
minify (min) Minify JSON by removing whitespace
validate (check) Validate JSON syntax
query (get) Extract values using dot notation path
merge Merge multiple JSON files into one
to-csv Convert JSON array to CSV format

EXAMPLES

Format/Pretty-print JSON

    # Format a JSON file
    sarra data json format data.json

    # Format with custom indentation (4 spaces)
    sarra data json format data.json -i 4

    # Format from stdin
    echo '{"a":1,"b":2}' | sarra data json format

    # Format piped API output
    curl https://api.example.com/data | sarra data json format

    # Save formatted output
    sarra data json format data.json -o formatted.json

Minify JSON

    # Minify a JSON file
    sarra data json minify large.json

    # Minify and save
    sarra data json minify config.json -o config.min.json

    # Minify from stdin
    cat data.json | sarra data json minify -y

Validate JSON

    # Validate a JSON file
    sarra data json validate config.json

    # Validate from stdin
    echo '{"valid": true}' | sarra data json validate

    # Check API response
    curl https://api.example.com/data | sarra data json validate

Query/Extract data

    # Extract a simple property
    sarra data json query "user.name" data.json

    # Extract from array
    sarra data json query "items[0].id" data.json

    # Extract nested property
    sarra data json query "config.database.host" settings.json

    # Extract and save
    sarra data json query "users" data.json -o users.json

    # Query from stdin
    echo '{"user":{"name":"Alice"}}' | sarra data json query "user.name" -y

Merge JSON files

    # Merge two files
    sarra data json merge config1.json config2.json

    # Merge multiple files
    sarra data json merge base.json dev.json local.json -o merged.json

    # Later files override earlier ones
    sarra data json merge defaults.json overrides.json

Convert to CSV

    # Convert JSON array to CSV
    sarra data json to-csv users.json

    # Save to CSV file
    sarra data json to-csv data.json -o output.csv

    # From stdin
    curl https://api.example.com/users | sarra data json to-csv -y

OUTPUT MANAGEMENT

Interactive prompt (default behavior)

    # Will prompt for save location
    sarra data json format data.json
    sarra data json query "user.name" data.json

Skip prompt and output to stdout

    sarra data json format data.json -y
    sarra data json minify data.json -y

Save directly to file (skips prompt)

    sarra data json format data.json -o formatted.json
    sarra data json merge file1.json file2.json -o merged.json

Custom paths with nested directories (auto-created)

    sarra data json format data.json -o ./output/formatted/data.json

INTERACTIVE MODE

By default, most commands will prompt you before saving to a file:

    📁 Save Location
       Current directory: /home/user/projects
       Default file: formatted.json
       Full path: /home/user/projects/formatted.json

    Save to file? (Y/n/path):

Options:
• Press Enter or type 'y' → Save to default location
• Type 'n' → Output to stdout (terminal)
• Type a path → Save to custom location

Skip the prompt:
• Use -y flag to output directly to stdout
• Use -o/--out flag to save directly to a file

Exception: validate command always outputs to stdout (no prompt)

QUERY PATH SYNTAX

Simple property: "name"
Nested property: "user.profile.email"
Array index: "items[0]"
Nested array: "data.users[0].name"
Complex path: "config.servers[0].database.host"

OPTIONS

Common options for most commands:

    -o, --out <file>        Write output to a file (skips prompt)
    -y, --yes               Skip prompt and output to stdout

Format command only:

    -i, --indent <spaces>   Number of spaces for indentation (default: 2)

NOTES

• If no file is provided, input is read from stdin
• Invalid JSON will result in an error with descriptive message
• Merge combines objects (later files override earlier ones)
• Query returns the extracted value (object, array, or primitive)
• to-csv requires input to be an array of objects
• CSV output properly escapes commas and quotes
• All commands support piping and shell workflows
• Without -o or -y flags, you'll be prompted for save location
• Directories are created automatically when using -o/--out
• validate command always outputs to stdout (no file save)

WORKFLOW EXAMPLES

# API to formatted file

curl https://api.example.com/data | sarra data json format -o api-response.json

# Format then minify

sarra data json format ugly.json -o pretty.json
sarra data json minify pretty.json -o min.json

# Extract and convert to CSV

sarra data json query "users" data.json -y | sarra data json to-csv -o users.csv

# Merge configs and format

sarra data json merge base.json env.json | sarra data json format -o config.json

# Validate before processing

sarra data json validate data.json && sarra data json query "items" data.json
