QR code generation utilities for creating scannable codes from text, URLs, and files.

COMMANDS
generate (gen) Generate QR code from text
terminal (term) Display QR code as ASCII art only (no file)
url Generate QR code from a URL
file Generate QR code from file content

EXAMPLES

Basic QR code generation

    # Preview QR code from text in the terminal (default)
    sarra qr generate "Hello World"
    sarra qr gen "Hello World"

    # Generate with specific size
    sarra qr generate "Data" -s 500

    # Generate with high error correction
    sarra qr generate "Important data" -e H

    # Custom colors
    sarra qr generate "Styled QR" --dark '#FF0000' --light '#FFFF00'

Terminal preview

    # Quick ASCII preview only (no file saved)
    sarra qr terminal "Quick check"
    sarra qr term "Test data"

    # Generate file AND show terminal preview
    sarra qr generate "Data" -t
    sarra qr gen "Hello" --terminal

    # Control ASCII size
    sarra qr terminal "Data" --small
    sarra qr terminal "Data" --no-small

URL QR codes

    # Generate QR code from URL
    sarra qr url https://github.com

    # With custom output and terminal preview
    sarra qr url https://example.com -o site.png -t

    # Larger size for printing
    sarra qr url https://mysite.com -s 800

From file content

    # Generate QR code from file
    sarra qr file config.json

    # With custom output
    sarra qr file data.txt -o data-qr.png

    # Large size with terminal preview
    sarra qr file settings.json -s 600 -t

Output management

    # Terminal preview (default behavior)
    sarra qr generate "Data"

    # Prompt for a save location
    sarra qr generate "Data" --save

    # Save directly to file (skips prompt)
    sarra qr generate "Data" -o qrcode.png

    # Legacy compatibility: save to the default location
    sarra qr generate "Data" -y

    # Custom paths with nested directories (auto-created)
    sarra qr generate "Data" -o ./output/codes/myqr.png
    sarra qr url https://site.com -o ~/Documents/qrcodes/site.png

INTERACTIVE MODE

QR generation previews in the terminal by default. Use `--save` to open the
save-location prompt:

    📁 Save Location
       Current directory: /home/user/projects
       Default file: qrcode.png
       Full path: /home/user/projects/qrcode.png

    Save to current location? (Y/n/path):

Options:
• Press Enter or type 'y' → Save to default location
• Type 'n' → Skip saving (terminal preview only if -t used)
• Type a path → Save to custom location

Output controls:
• Use --save to prompt for a location
• Use -o/--output to save directly to a file
• -y/--yes retains the legacy behavior of saving to the default location
• Use terminal command for preview-only (never saves)

ERROR CORRECTION LEVELS

L (Low) 7% data recovery
M (Medium) 15% data recovery [default]
Q (Quartile) 25% data recovery
H (High) 30% data recovery

Higher error correction allows QR codes to be scanned even if partially
damaged or obscured. Use H for important data or codes that may get dirty.

OPTIONS

Common options for generate, url, and file commands:

    -o, --output <file>       Output file path (skips prompt)
    --save                    Prompt for a save location
    -s, --size <pixels>       Image width in pixels (default: 300-400)
    -t, --terminal            Display ASCII representation in terminal
    --small                   Use compact ASCII characters (default)
    --no-small                Use full-size ASCII characters
    -y, --yes                 Save to default location (compatibility flag)

Additional options for generate command:

    -e, --error-correction    Error correction level: L, M, Q, H (default: M)
    --dark <color>            Dark color in hex (default: #000000)
    --light <color>           Light color in hex (default: #FFFFFF)

Options for terminal command:

    --small                   Use compact ASCII characters (default)
    --no-small                Use full-size ASCII characters

NOTES

• QR codes are saved as PNG images
• Without output flags, QR commands preview in the terminal
• The save-location prompt appears only with --save
• Use -t flag to preview QR code in terminal before/after saving
• Use terminal command for quick previews without saving files
• Directories are created automatically when using -o/--output
• Maximum recommended data: ~2953 characters (depends on error correction)
• URLs are validated before generating QR codes
• File content is read as UTF-8 text
• Higher error correction (H) makes QR codes more dense/complex
• Larger sizes (500-1000px) are recommended for printing
• Custom colors must be valid hex codes (e.g., #FF0000)

SIZE RECOMMENDATIONS

300px Screen display, mobile sharing
400px General purpose, web embedding
500-800px Printing on paper, posters
1000px+ Large format printing, banners

USE CASES

• Share WiFi credentials
• Link to websites or social media
• Embed contact information (vCard)
• Share configuration files
• Create product labels with data
• Generate event tickets
• Share API keys or tokens securely
