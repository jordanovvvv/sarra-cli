Geolocation and IP utilities for network information and diagnostics.

COMMANDS
my-ip Get your current public IP address
lookup Get geolocation information for an IP address
validate Validate an IP address (IPv4 or IPv6)
local Get local network interface information

GLOBAL OPTIONS

--format <format> Output format (text | json)

EXAMPLES

Get Your Public IP

    # Get your current public IP
    sarra geo my-ip

    # Get IPv4 only
    sarra geo my-ip --ipv4

    # Get IPv6 only
    sarra geo my-ip --ipv6

    # JSON output
    sarra geo --format json my-ip

IP Geolocation Lookup

    # Lookup geolocation for an IP
    sarra geo lookup 8.8.8.8

    # Lookup your own IP info
    sarra geo lookup

    # Lookup with JSON output
    sarra geo --format json lookup 1.1.1.1

    # Lookup from variable
    IP="8.8.8.8"
    sarra geo lookup $IP

IP Address Validation

    # Validate IPv4 address
    sarra geo validate 192.168.1.1

    # Validate IPv6 address
    sarra geo validate 2001:db8::1

    # Validate in scripts (exit code 0 for valid, 1 for invalid)
    if sarra geo validate 10.0.0.1; then
      echo "Valid IP"
    fi

    # JSON output
    sarra geo --format json validate 192.168.1.1

Local Network Interfaces

    # Show all network interfaces
    sarra geo local

    # JSON output for scripting
    sarra geo --format json local

COMMAND DETAILS

my-ip

    Get your current public IP address using ipify.org API.

    Usage:
        sarra geo my-ip [options]

    Options:
        -4, --ipv4    Show only IPv4 address
        -6, --ipv6    Show only IPv6 address

    Output (text format):
        Public IP: 203.0.113.42

    Output (JSON format):
        {
          "ip": "203.0.113.42"
        }

    Notes:
        • Requires internet connection
        • Uses free ipify.org API
        • IPv6 requires IPv6 connectivity

lookup

    Get detailed geolocation information for any IP address.

    Usage:
        sarra geo lookup [ip]

    Arguments:
        ip    IP address to lookup (optional, uses your IP if omitted)

    Output (text format):
        📍 IP Geolocation Information

          IP Address: 8.8.8.8
          City: Mountain View
          Region: California
          Country: United States (US)
          Timezone: America/Los_Angeles
          ISP: Google LLC
          Postal: 94035
          Coordinates: 37.386, -122.0838

    Output (JSON format):
        {
          "ip": "8.8.8.8",
          "city": "Mountain View",
          "region": "California",
          "country_name": "United States",
          "country_code": "US",
          "timezone": "America/Los_Angeles",
          "org": "Google LLC",
          "postal": "94035",
          "latitude": 37.386,
          "longitude": -122.0838
        }

    Notes:
        • Requires internet connection
        • Uses ipapi.co free API
        • Rate limited to 1000 requests/day
        • Some fields may be N/A for certain IPs

validate

    Validate IPv4 and IPv6 addresses using Node.js IP parsing.

    Usage:
        sarra geo validate <ip>

    Arguments:
        ip    IP address to validate (required)

    Output (text format - valid):
        ✓ Valid IP address
          Type: IPv4
          Address: 192.168.1.1

    Output (text format - invalid):
        ✗ Invalid IP address
          Input: 999.999.999.999

    Output (JSON format):
        {
          "ip": "192.168.1.1",
          "valid": true,
          "type": "IPv4"
        }

    Exit codes:
        0    Valid IP address
        1    Invalid IP address

    Notes:
        • Works offline (no API calls)
        • Supports both IPv4 and IPv6
        • Useful for script validation

local

    Display local network interface information.

    Usage:
        sarra geo local

    Output (text format):
        🌐 Local Network Interfaces

          [1] eth0
              Address: 192.168.1.100
              Type: IPv4
              MAC: 00:1a:2b:3c:4d:5e

          [2] wlan0
              Address: 2001:db8::1
              Type: IPv6
              MAC: aa:bb:cc:dd:ee:ff

    Output (JSON format):
        [
          {
            "interface": "eth0",
            "address": "192.168.1.100",
            "family": "IPv4",
            "mac": "00:1a:2b:3c:4d:5e"
          },
          {
            "interface": "wlan0",
            "address": "2001:db8::1",
            "family": "IPv6",
            "mac": "aa:bb:cc:dd:ee:ff"
          }
        ]

    Notes:
        • Works offline (no API calls)
        • Skips loopback interfaces
        • Shows both IPv4 and IPv6
        • Displays MAC addresses

OPTIONS SUMMARY

Global options (apply to all commands):

    --format <format>       Output format: text (default) or json

Command-specific options:

    my-ip:
        -4, --ipv4          Show only IPv4 address
        -6, --ipv6          Show only IPv6 address

WORKFLOW EXAMPLES

Network Diagnostics

    # Check your public IP and location
    sarra geo my-ip
    sarra geo lookup

    # Get full network info
    sarra geo local

IP Validation in Scripts

    #!/bin/bash
    IP="192.168.1.1"

    if sarra geo validate "$IP" > /dev/null 2>&1; then
      echo "IP is valid, looking up location..."
      sarra geo lookup "$IP"
    else
      echo "Invalid IP address"
      exit 1
    fi

Geolocation Lookup

    # Lookup multiple IPs
    for ip in 8.8.8.8 1.1.1.1 208.67.222.222; do
      echo "Looking up $ip..."
      sarra geo lookup $ip
      echo "---"
    done

JSON Output for Scripts

    # Extract city from geolocation
    CITY=$(sarra geo --format json lookup 8.8.8.8 | jq -r '.city')
    echo "Location: $CITY"

    # Get all network interfaces as JSON
    sarra geo --format json local > interfaces.json

Combine with Other Tools

    # Get IP and lookup in one line
    MY_IP=$(sarra geo my-ip | grep -oE '[0-9.]+')
    sarra geo lookup $MY_IP

    # Validate IPs from a file
    while read ip; do
      if sarra geo validate "$ip" > /dev/null 2>&1; then
        echo "$ip is valid"
      fi
    done < ips.txt

NOTES

• my-ip and lookup require internet connection
• lookup uses ipapi.co free tier (1000 requests/day limit)
• validate and local work completely offline
• All commands support --format json for programmatic usage
• Text output includes emoji icons for better readability
• validate command uses exit codes for shell scripting
• local command filters out loopback interfaces (127.0.0.1, ::1)
• All API calls use HTTPS for secure communication
• Rate limiting applies to lookup command only

API INFORMATION

ipify.org (my-ip):
• Free public IP detection service
• No API key required
• IPv4 and IPv6 support
• No rate limits for reasonable use

ipapi.co (lookup):
• Free tier: 1000 requests per day
• No API key required for free tier
• Comprehensive geolocation data
• Rate limit resets daily
• Consider upgrading for higher limits

TROUBLESHOOTING

"Failed to retrieve IP address"
• Check your internet connection
• Verify firewall isn't blocking HTTPS requests
• Try again in a few moments

"Invalid IP address or lookup failed"
• Verify the IP address format
• Check if IP is a private/internal address (may have limited data)
• Try with a different public IP

"No external network interfaces found"
• All interfaces may be loopback/internal
• Check network adapter status
• Try running with elevated permissions

Rate limit exceeded (lookup):
• Free tier is 1000 requests/day
• Wait until daily reset (midnight UTC)
• Consider using --format json to cache results
• Upgrade to paid plan for higher limits
