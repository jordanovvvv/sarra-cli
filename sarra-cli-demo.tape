# Output files
Output demo.gif
Output demo.mp4

# Settings
Set FontSize 16
Set Width 1400
Set Height 800
Set TypingSpeed 30ms
Set Theme "Dracula"
Set Shell "powershell"

# ----------------------------------------
# Header
# ----------------------------------------
Sleep 300ms
Type "# 🚀 SARRA CLI - Fast Developer Tools"
Enter
Sleep 800ms
Type "clear"
Enter

# ----------------------------------------
# 1. ID Generation
# ----------------------------------------
Type "# Generate UUIDs"
Enter
Type "sarra id uuid --count 2"
Enter
Sleep 1.5s

Type ""
Enter
Type "sarra id random --length 32"
Enter
Sleep 1.5s
Type "clear"
Enter

# ----------------------------------------
# 2. Cryptography
# ----------------------------------------
Type "# Hash & Encrypt"
Enter
Type "sarra crypto hash sha256 'hello world'"
Enter
Sleep 1.5s

Type ""
Enter
Type "sarra crypto aes-encrypt 'secret message' -y"
Enter
Sleep 2s

Type ""
Enter
Type "sarra crypto base64 'encode this'"
Enter
Sleep 1.5s
Type "clear"
Enter

# ----------------------------------------
# 3. JSON
# ----------------------------------------
Type "# JSON utilities"
Enter
Type `echo '{"name":"John","age":30}' > data.json`
Enter
Sleep 800ms

Type "sarra data json data.json"
Enter
Sleep 1.5s

Type "sarra data json query name data.json"
Enter
Sleep 1.5s
Type "clear"
Enter

# ----------------------------------------
# 4. QR Codes
# ----------------------------------------
Type "# QR code in terminal"
Enter
Type "sarra qr terminal 'https://github.com/jordanovvvv/sarra-cli'"
Enter
Sleep 3s
Type "clear"
Enter

# ----------------------------------------
# 5. Time & SSL
# ----------------------------------------
Type "# Quick utilities"
Enter
Type "sarra time now"
Enter
Sleep 1s

Type ""
Enter
Type "sarra ssl generate --domain localhost"
Enter
Sleep 2.5s
Type "clear"
Enter

# ----------------------------------------
# Finale
# ----------------------------------------
Type "# Install: npm install -g sarra"
Enter
Type "# Docs: github.com/jordanovvvv/sarra-cli"
Enter
Sleep 3s