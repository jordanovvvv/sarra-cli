# config

Manage sarra-cli configuration settings.

## Usage

```bash
sarra config <action> [options]
```

## Actions

- `get <key>` - Get a configuration value
- `set <key> <value>` - Set a configuration value
- `list` - List all configuration settings
- `reset` - Reset configuration to defaults

## Options

- `--global` - Apply configuration globally
- `--local` - Apply configuration to current project only
- `--help` - Display this help message

## Description

The `config` command allows you to view and modify sarra-cli configuration settings. Configuration can be set at global or project level.

## Examples

```bash
# List all configuration
sarra config list

# Get a specific value
sarra config get editor

# Set a value globally
sarra config set editor vim --global

# Reset to defaults
sarra config reset
```
