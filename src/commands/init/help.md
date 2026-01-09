# init

Initialize a new project with sarra-cli configuration.

## Usage

```bash
sarra init [options]
```

## Options

- `--template <name>` - Use a specific project template
- `--force` - Overwrite existing configuration
- `--help` - Display this help message

## Description

The `init` command sets up a new project with sarra-cli tooling. It creates a configuration file and sets up the basic project structure based on your selections.

## Examples

```bash
# Initialize with default settings
sarra init

# Initialize with a specific template
sarra init --template nodejs

# Force initialization (overwrites existing config)
sarra init --force
```
