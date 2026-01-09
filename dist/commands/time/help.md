Date and time utilities.

COMMANDS

now Print the current timestamp

USAGE

sarra time <command>

DESCRIPTION

Provides simple utilities for working with dates and time values.
Useful for scripting, logging, and debugging.

EXAMPLES

# Print the current timestamp (ISO 8601)

sarra time now

# Use in scripts

echo "Started at $(sarra time now)"

OUTPUT

- Timestamp is printed in ISO 8601 format
- Example: 2026-01-09T13:45:22.123Z

NOTES

- Output is always written to stdout
- The timestamp is generated in UTC
