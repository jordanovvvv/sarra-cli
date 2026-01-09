# run

Execute development tasks and scripts.

## Usage

```bash
sarra run <task> [options]
```

## Options

- `--watch` - Watch for changes and re-run automatically
- `--verbose` - Show detailed output
- `--env <environment>` - Specify the environment (dev, prod, test)
- `--help` - Display this help message

## Description

The `run` command executes predefined tasks and scripts in your project. It provides a unified interface for common development workflows.

## Examples

```bash
# Run a specific task
sarra run build

# Run with watch mode
sarra run dev --watch

# Run with verbose output
sarra run test --verbose

# Run in production environment
sarra run deploy --env prod
```

## Available Tasks

Tasks are defined in your project's configuration file. Common tasks include:
- `build` - Build the project
- `test` - Run tests
- `dev` - Start development server
- `deploy` - Deploy the application
