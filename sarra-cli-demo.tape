# Output files
Output demo.gif
Output demo.mp4

# Settings
Set FontSize 16
Set Width 1400
Set Height 800
Set TypingSpeed 50ms
Set Theme "Dracula"
# Fix: Ensure PowerShell starts cleanly without the copyright banner
Set Shell "powershell"

# ----------------------------------------
# Pretty Header
# ----------------------------------------
Sleep 500ms
Type "################################################"
Enter
Type "#                                              #"
Enter
Type "#   🚀  SARRA CLI: Daily Developer Tools       #"
Enter
Type "#       Fast. Zero-Config. Powerful.           #"
Enter
Type "#                                              #"
Enter
Type "################################################"
Enter
Sleep 1.5s
Type "clear"
Enter
Sleep 500ms

# ----------------------------------------
# Startup & Version
# ----------------------------------------
Type "# Checking installation..."
Enter
Sleep 500ms
Type "sarra --version"
Enter
Sleep 1.5s
Type "clear"
Enter

# ----------------------------------------
# 1. ID Generation
# ----------------------------------------
Type "# 1. ID Generation (UUID v4, v7, and Secure Tokens)"
Enter
Type "sarra id uuid --count 3"
Enter
Sleep 2s

Type ""
Enter
Type "# UUID v7 (Time-ordered for databases)"
Enter
Type "sarra id uuid --uuid-version v7 --count 2"
Enter
Sleep 2s

Type ""
Enter
Type "# Generate a 32-character secure random token"
Enter
Type "sarra id random --length 32"
Enter
Sleep 2s
Type "clear"
Enter

# ----------------------------------------
# 2. Cryptography
# ----------------------------------------
Type "# 2. Cryptography & Encoding"
Enter
Type "echo 'hello world' | sarra crypto hash sha256"
Enter
Sleep 2s

Type ""
Enter
Type "# Quickly Base64 encode a string"
Enter
Type "sarra crypto base64 'secret data'"
Enter
Sleep 2s

Type ""
Enter
Type "# Decode it back"
Enter
Type "sarra crypto base64 --decode 'c2VjcmV0IGRhdGE='"
Enter
Sleep 2s
Type "clear"
Enter

# ----------------------------------------
# 3. JSON Processing
# ----------------------------------------
Type "# 3. JSON Utilities"
Enter
Type `echo '{"name": "John", "age": 30, "city": "NYC"}' > data.json`
Enter
Sleep 1s

Type ""
Enter
Type "# Pretty-print JSON files"
Enter
Type "sarra data json data.json"
Enter
Sleep 2s

Type ""
Enter
Type "# Extract specific fields"
Enter
Type "sarra data json query name data.json"
Enter
Sleep 2s
Type "clear"
Enter

# ----------------------------------------
# 4. QR Codes
# ----------------------------------------
Type "# 4. QR Codes (Generate images or terminal previews)"
Enter
Type "sarra qr generate 'https://github.com/jordanovvvv/sarra-cli' -t"
Enter
Sleep 4s

Type ""
Enter
Type "# Instant ASCII preview in terminal"
Enter
Type "sarra qr terminal 'Hello Sarra!'"
Enter
Sleep 3s
Type "clear"
Enter

# ----------------------------------------
# 5. Time Utilities
# ----------------------------------------
Type "# 5. Time Utilities"
Enter
Type "sarra time now"
Enter
Sleep 1s

Type ""
Enter
Type "sarra time now --unix"
Enter
Sleep 1s
Type "clear"
Enter

# ----------------------------------------
# 6. SSL Certificates
# ----------------------------------------
Type "# 6. SSL Certificates (Local development made easy)"
Enter
Type "sarra ssl generate --domain localhost"
Enter
Sleep 4s

Type ""
Enter
Type "ls localhost.*"
Enter
Sleep 2s
Type "clear"
Enter

# ----------------------------------------
# Finale
# ----------------------------------------
Type "################################################"
Enter
Type "#  Sarra CLI is ready for your workflow.        #"
Enter
Type "#  Install: npm install -g sarra               #"
Enter
Type "#  Docs: github.com/jordanovvvv/sarra-cli      #"
Enter
Type "################################################"
Enter
Sleep 5s