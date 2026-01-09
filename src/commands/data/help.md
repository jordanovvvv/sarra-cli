JSON utilities for formatting and inspecting JSON data.

COMMANDS

format Pretty-print JSON input

USAGE

sarra data json format [file]

DESCRIPTION

Formats JSON with consistent indentation (2 spaces).
Input can be provided via a file or stdin.

EXAMPLES

# Format a JSON file

sarra data json format data.json

# Format JSON from stdin

echo '{"a":1,"b":2}' | sarra data json format

# Format piped API output

curl https://api.example.com/data | sarra data json format

NOTES

- If no file is provided, input is read from stdin
- Invalid JSON will result in an error
- Output is always written to stdout
