# Mock for Copado command

[![view on npm](https://badgen.net/github/release/JoernBerkefeld/copado-git-get-mock)](https://www.npmjs.org/package/copado-git-get-mock)
[![view on npm](https://badgen.net/npm/node/copado-git-get-mock)](https://www.npmjs.org/package/copado-git-get-mock)
[![license](https://badgen.net/npm/license/copado-git-get-mock)](https://www.npmjs.org/package/copado-git-get-mock)
[![npm module downloads](https://badgen.net/npm/dt/copado-git-get-mock)](https://www.npmjs.org/package/copado-git-get-mock)
[![GitHub closed issues](https://badgen.net/github/closed-issues/JoernBerkefeld/copado-git-get-mock)](https://github.com/JoernBerkefeld/copado-git-get-mock/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub releases](https://badgen.net/github/releases/JoernBerkefeld/copado-git-get-mock)](https://github.com/JoernBerkefeld/copado-git-get-mock/releases)

This very simple mock-version of `copado-git-get` seeks to allow developers local testing without the need of uploading their code to Copado functions online.

Currently, the functionality is limited to checking if parameters are correct via `console.log` as well as running:

- cd _directory_
- git fetch orgin _branch name_ (optionally limited by _depth_)
- git checkout _branch name_ (optionally creates the branch with _-c_)

The [original](original.py) also sets up the git origin itself.

## Install

```bash
npm install -g copado-git-get-mock
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
