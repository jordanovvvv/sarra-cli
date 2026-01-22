Output demo.gif
Output demo.mp4

Set FontSize 16
Set Width 1400
Set Height 800
Set TypingSpeed 50ms
Set Theme "Dracula"
# Using bash because the Docker container is Linux-based
Set Shell bash

# ----------------------------------------
# Startup
# ----------------------------------------
Type "clear"
Enter
Sleep 500ms

Type "# Sarra CLI Demo - Daily Developer Tools"
Enter
Sleep 1s
Type "# Fast, zero-config utilities for developers"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# Verify availability
# ----------------------------------------
Type "npx -y sarra --version"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 1. ID Generation
# ----------------------------------------
Type "# 1. ID Generation"
Enter
Type "npx -y sarra id uuid --count 3"
Enter
Sleep 2s

Type ""
Enter
Type "# UUID v7 (time-ordered)"
Enter
Type "npx -y sarra id uuid --uuid-version v7 --count 2"
Enter
Sleep 2s

Type ""
Enter
Type "# Random secure token"
Enter
Type "npx -y sarra id random --length 32"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 2. Cryptography
# ----------------------------------------
Type "# 2. Cryptography"
Enter
Type "echo 'hello world' | npx -y sarra crypto hash sha256"
Enter
Sleep 2s

Type ""
Enter
Type "# Base64 encode"
Enter
Type "npx -y sarra crypto base64 'secret data'"
Enter
Sleep 2s

Type ""
Enter
Type "# Base64 decode"
Enter
Type "npx -y sarra crypto base64 --decode 'c2VjcmV0IGRhdGE='"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 3. JSON Processing
# ----------------------------------------
Type "# 3. JSON Utilities"
Enter

# Use backticks for the Type command to handle the internal quotes
Type `echo '{"name": "John", "age": 30, "city": "NYC"}' > data.json`
Enter
Sleep 1s

Type ""
Enter
Type "# Pretty format"
Enter
Type "npx -y sarra data json format data.json"
Enter
Sleep 2s

Type ""
Enter
Type "# Query field"
Enter
Type "npx -y sarra data json query name data.json"
Enter
Sleep 2s

Type ""
Enter
Type "# Validate JSON"
Enter
Type "npx -y sarra data json validate data.json"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 4. QR Codes
# ----------------------------------------
Type "# 4. QR Codes"
Enter
Type "npx -y sarra qr generate 'https://github.com/jordanovvvv/sarra-cli' -t"
Enter
Sleep 4s

Type ""
Enter
Type "# ASCII preview"
Enter
Type "npx -y sarra qr terminal 'Hello Sarra!'"
Enter
Sleep 3s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 5. Time Utilities
# ----------------------------------------
Type "# 5. Time Utilities"
Enter
Type "npx -y sarra time now"
Enter
Sleep 1s

Type ""
Enter
Type "npx -y sarra time now --unix"
Enter
Sleep 1s

Type ""
Enter
Type "npx -y sarra time now --format date"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# 6. SSL Certificates
# ----------------------------------------
Type "# 6. SSL Certificates"
Enter
Type "npx -y sarra ssl generate --domain localhost"
Enter
Sleep 4s

Type ""
Enter
Type "ls localhost.*"
Enter
Sleep 2s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# Finale
# ----------------------------------------
Type "# Sarra CLI"
Enter
Type "# Install once: npm install -g sarra"
Enter
Type "# Or run anywhere: npx sarra <command>"
Enter
Type "# Docs: https://github.com/jordanovvvv/sarra-cli"
Enter
Sleep 4s