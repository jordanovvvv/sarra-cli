Date and time utilities for timestamps, conversions, and calculations.

COMMANDS
now Print the current timestamp
convert (conv) Convert between timestamp formats
add Add time to a timestamp
diff Calculate time difference between timestamps
parse Parse and validate a timestamp

EXAMPLES

Current timestamp

    # ISO 8601 format (default)
    sarra time now

    # Unix timestamp (seconds)
    sarra time now --unix

    # Unix timestamp (milliseconds)
    sarra time now --ms

    # Date only
    sarra time now --format date

    # Time only
    sarra time now --format time

    # Local format
    sarra time now --format locale

Convert timestamps

    # Convert Unix timestamp to ISO
    sarra time convert 1737468322

    # Convert ISO to Unix
    sarra time convert "2026-01-21T13:45:22.123Z" --to unix

    # Convert to milliseconds
    sarra time convert 1737468322 --to ms

    # Convert to date only
    sarra time convert "2026-01-21T13:45:22.123Z" --to date

    # Convert to locale format
    sarra time conv 1737468322 --to locale

Add time

    # Add 5 days to current time
    sarra time add --days 5

    # Add 2 hours to a specific timestamp
    sarra time add "2026-01-21T10:00:00Z" --hours 2

    # Add multiple units
    sarra time add --days 1 --hours 3 --minutes 30

    # Add time and get Unix timestamp
    sarra time add --days 7 --format unix

    # Subtract time (use negative values)
    sarra time add --days -3 --hours -2

Calculate time difference

    # Days until a future date
    sarra time diff "2026-01-21T00:00:00Z" "2026-02-01T00:00:00Z" --unit days

    # Hours since a past event
    sarra time diff "2026-01-20T10:00:00Z" --unit hours

    # Seconds between two timestamps
    sarra time diff 1737468322 1737554722

    # Minutes difference
    sarra time diff "2026-01-21T10:00:00Z" "2026-01-21T14:30:00Z" --unit minutes

    # Absolute difference (always positive)
    sarra time diff "2026-01-21T10:00:00Z" "2026-01-20T10:00:00Z" --abs --unit hours

Parse and validate

    # Parse and validate ISO timestamp
    sarra time parse "2026-01-21T13:45:22.123Z"

    # Parse Unix timestamp
    sarra time parse 1737468322

    # Detailed information
    sarra time parse "2026-01-21T13:45:22.123Z" --verbose

    # Validate date string
    sarra time parse "2026-01-21"

Scripting and automation

    # Log with timestamp
    echo "Started at $(sarra time now)"

    # Calculate deadline (7 days from now)
    DEADLINE=$(sarra time add --days 7)
    echo "Deadline: $DEADLINE"

    # Check if timestamp is valid
    sarra time parse "$USER_INPUT" && echo "Valid" || echo "Invalid"

    # Days until event
    DAYS=$(sarra time diff "$(sarra time now)" "2026-12-31T00:00:00Z" --unit days)
    echo "Days until end of year: $DAYS"

TIMESTAMP FORMATS

Input formats (auto-detected): - ISO 8601: 2026-01-21T13:45:22.123Z - Unix seconds: 1737468322 - Unix milliseconds: 1737468322123 - Date string: 2026-01-21 - Any valid JavaScript Date string

Output formats: - iso: 2026-01-21T13:45:22.123Z (default) - unix: 1737468322 (seconds) - ms: 1737468322123 (milliseconds) - date: 2026-01-21 - time: 13:45:22.123 - locale: 1/21/2026, 1:45:22 PM (system locale)

OPTIONS

now command:
--unix Unix timestamp in seconds
--ms Unix timestamp in milliseconds
--format <format> Output format (iso | date | time | locale)

convert command:
--to <format> Output format (iso | unix | ms | date | time | locale)

add command:
-s, --seconds <n> Add/subtract seconds
-m, --minutes <n> Add/subtract minutes
-h, --hours <n> Add/subtract hours
-d, --days <n> Add/subtract days
--format <format> Output format (iso | unix | ms | date)

diff command:
--unit <unit> Output unit (ms | seconds | minutes | hours | days)
--abs Absolute value (always positive)

parse command:
--verbose Show detailed timestamp information

NOTES

• All timestamps are in UTC unless specified otherwise
• Output is always written to stdout
• Use negative values with add command to subtract time
• The convert command auto-detects input format
• Unix timestamps < 10 billion are treated as seconds, >= as milliseconds
• diff command defaults to current time as second timestamp if omitted
• Locale format depends on system settings

USE CASES

Logging and debugging:
• Add timestamps to log entries
• Calculate script execution time
• Validate timestamp formats

Scheduling and deadlines:
• Calculate future dates
• Determine time until deadline
• Add business days to dates

Data processing:
• Convert timestamps between formats
• Parse timestamps from various sources
• Validate user-provided timestamps

Time calculations:
• Calculate age or duration
• Determine time differences
• Add/subtract time periods
