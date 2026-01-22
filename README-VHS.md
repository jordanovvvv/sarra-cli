# Creating Demo Video with VHS + Docker

## Quick Start (One Command)

```bash
docker run --rm -v $PWD:/vhs ghcr.io/charmbracelet/vhs sarra-cli-demo.tape
```

This will generate:
- `demo.gif` - Animated GIF for your README
- `demo.mp4` - High-quality video

## Step-by-Step Instructions

### 1. Save the tape file
Save the `sarra-cli-demo.tape` artifact in your project directory.

### 2. Run VHS with Docker

```bash
# From your project directory where sarra-cli-demo.tape is located
docker run --rm -v $PWD:/vhs ghcr.io/charmbracelet/vhs sarra-cli-demo.tape
```

### 3. Output files
After the command completes (takes ~2-3 minutes), you'll find:
- `demo.gif` - Ready to embed in README
- `demo.mp4` - Higher quality alternative

## What the Command Does

- `docker run` - Runs a Docker container
- `--rm` - Automatically removes the container when done
- `-v $PWD:/vhs` - Mounts your current directory to `/vhs` in the container
- `ghcr.io/charmbracelet/vhs` - Official VHS Docker image
- `sarra-cli-demo.tape` - Your tape file to execute

## Customizing the Demo

Edit `sarra-cli-demo.tape` to customize:

```tape
Set FontSize 16          # Text size
Set Width 1400           # Terminal width
Set Height 800           # Terminal height
Set TypingSpeed 50ms     # Typing animation speed
Set Theme "Dracula"      # Color theme
```

Popular themes:
- `Dracula` (dark, purple/pink)
- `Nord` (dark, blue/teal)
- `Monokai` (dark, vibrant)
- `GitHub Light` (light theme)
- `Catppuccin` (pastel dark)

## Embed in README

### GIF (Recommended for GitHub)
```markdown
## Demo

![Sarra CLI Demo](demo.gif)
```

### Video Link
```markdown
## Demo

[Watch demo video (MP4)](demo.mp4)
```

### Both
```markdown
## Demo

![Sarra CLI Demo](demo.gif)

*[Watch full HD video (MP4)](demo.mp4)*
```

## Troubleshooting

### Permission Issues (Linux/Mac)
```bash
# Make sure the current directory is writable
chmod 755 .

# Or run with your user ID
docker run --rm -v $PWD:/vhs -u $(id -u):$(id -g) ghcr.io/charmbracelet/vhs sarra-cli-demo.tape
```

### Windows PowerShell
```powershell
docker run --rm -v ${PWD}:/vhs ghcr.io/charmbracelet/vhs sarra-cli-demo.tape
```

### Windows CMD
```cmd
docker run --rm -v %cd%:/vhs ghcr.io/charmbracelet/vhs sarra-cli-demo.tape
```

## Tips

1. **Test first**: Run a shortened version of your tape to check layout
2. **File size**: GIFs can be large. Use `demo.mp4` for high quality
3. **GitHub preview**: GIFs auto-play on GitHub, making them perfect for READMEs
4. **Custom output**: Change `Output demo.gif` in the tape file for different names

## Alternative: Install VHS Locally

If you prefer not to use Docker:

```bash
# macOS
brew install vhs

# Linux (download latest release)
wget https://github.com/charmbracelet/vhs/releases/latest/download/vhs_Linux_x86_64.tar.gz
tar -xzf vhs_Linux_x86_64.tar.gz
sudo mv vhs /usr/local/bin/

# Then run directly
vhs sarra-cli-demo.tape
```

## Resources

- [VHS Documentation](https://github.com/charmbracelet/vhs)
- [VHS Docker Image](https://github.com/charmbracelet/vhs/pkgs/container/vhs)
- [Tape File Syntax](https://github.com/charmbracelet/vhs#vhs-command-reference)