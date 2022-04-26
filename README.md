# Mock for Copado command

This very simple mock-version of `copado-git-get` seeks to allow developers local testing without the need of uploading their code to Copado functions online.

Currently the functionality is limited to checking if parameters are correct without actually implementing anything but a `console.log` for each correct command.

## Install

```bash
npm install -g JoernBerkefeld/copado-git-get-mock
```

## Supported options

- `"branch name"`
- `--create "branch name"` or `-c "branch name"`
- `--directory "my/new/git/folder"` or `-d "my/new/git/folder""`
- `--depth 100` (replace 100 with shallow cloning depth of your choice)
- `--verbose` or `-v`

## Examples

```bash
copado-git-get develop
copado-git-get --create "feature/1234"
copado-git-get --create "feature/1234" --directory "my/new/git/folder" --depth 40
copado-git-get "feature/1234" --directory "my/new/git/folder" --depth 40 --verbose
```
