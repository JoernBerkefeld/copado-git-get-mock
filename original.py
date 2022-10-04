#!/usr/bin/env python3
import re
import sys
import os
import logging
import argparse
import subprocess
import socket
import shlex
import urllib
import json
import urllib.parse


HOME_DIR = f"{os.getenv('HOME')}/"


def ssh_key_registry(git_json):
    logging.info('Current home directory =%s', HOME_DIR)
    if git_json.get('privateKey'):
        git_key = HOME_DIR + '.ssh/git_key'
        git_config = HOME_DIR + '.ssh/config'
        os.makedirs(HOME_DIR + '.ssh', exist_ok=True)
        with open(git_key, 'w') as file_certification:
            file_certification.write(git_json['privateKey'])
        with open(git_config, 'w') as file_certification:
            file_certification.writelines(
                [
                    f'IdentityFile {git_key}\n',
                    "Host *\n",
                    "\tHostkeyAlgorithms +ssh-rsa\n",
                    "\tPubkeyAcceptedKeyTypes +ssh-rsa\n"
                ]
            )
        os.chmod(git_key, 0o600)
        os.chmod(git_config, mode=0o600)
        git_host = git_json["url"].split(":")[0]
        git_hosts_command = f'ssh -T -o "StrictHostKeyChecking no" {git_host} '
        subprocess.run(git_hosts_command, shell=True, check=False, executable='/bin/bash')


def prepare_http_url(git_json):
    git_http_url = git_json['url']
    git_username = urllib.parse.quote(git_json.get("username") or '', safe='')
    git_password = urllib.parse.quote(git_json.get("password") or '', safe='')
    if git_username or git_password:
        git_http_url = urllib.parse.urlparse(git_http_url)
        up = f'{git_username}{git_password and ":" + git_password}@'
        git_http_url = list(git_http_url)
        git_http_url[1] = up + git_http_url[1]
        git_http_url = urllib.parse.urlunparse(git_http_url)
    return git_http_url


def do_git_get(branch, git_json, directory=None, depth=None, verbose=False, create=False):
    logging.info(f'fetching/checking-out branch {branch!r} in directory {directory!r}')

    url = git_json['url']
    if git_json.get('type') == 'ssh':
        ssh_key_registry(git_json)
    else:
        url = prepare_http_url(git_json)
    # TODO: needs validation and a clear error message
    url = shlex.quote(url)
    verbose_option = verbose and "-v --progress" or ""
    depth_option = depth and f"--depth={depth}" or ""

    # TODO: git protocol (ssh) handling, and options (?)
    # TODO: extra headers http handling
    # TODO: shallow cloning handling? (besides depth
    # TODO: additional git configuration handling??
    cmd_branch = shlex.quote(branch)
    init_cmd = f'''
        git init . --quiet
        git config --local user.email copado@functions.com
        git config --local user.name copado
        git config --local http.postBuffer "${{GIT_HTTP_POSTBUFFER:=1048576000}}"
        git config --local http.maxRequestBuffer "${{GIT_HTTP_MAXREQUESTBUFFER:=100M}}"
        git config --local init.defaultBranch "{cmd_branch}"
        git config --local diff.renames false
        git config --local merge.renames false
        git config --local status.renames false
        export GIT_HTTP_LOW_SPEED_LIMIT=1000 GIT_HTTP_LOW_SPEED_TIME=600
        git remote add origin "{url}"
    '''
    all_headers = (git_json.get('extraheaders') or '') + '\n' + (git_json.get('encryptedheaders') or '')
    if all_headers.strip():
        for line in re.split(r'\r?\n', all_headers):
            if line:
                init_cmd += f'git config --local --add http.extraHeader {shlex.quote(line)}\n'
    cmd = f'set -euo pipefail; (test -d .git || ({init_cmd})) &&'
    cmd += f'(git fetch {verbose_option} origin {cmd_branch} {depth_option} && git checkout {cmd_branch})'
    if create:
        cmd += f'|| (git checkout -b {cmd_branch})'

    completed_process = subprocess.run(cmd, cwd=directory, shell=True, check=False, executable='/bin/bash')
    logging.debug('completedProcess=%s', completed_process)

    if completed_process.returncode:
        sys.exit(completed_process.returncode)


def parse_cli_arguments():
    parser = argparse.ArgumentParser()
    options = parser.add_argument_group('')
    parser.add_argument('branch', metavar='BRANCH', type=str, nargs=1)
    options.add_argument('-d', '--directory', type=str, default='.')
    options.add_argument('--depth', type=int, default=0)
    options.add_argument('-v', '--verbose', action='store_true')
    options.add_argument('-c', '--create', action='store_true')
    args = parser.parse_args()
    return args, parser


def main():
    socket.setdefaulttimeout(120)
    logging.basicConfig(level=logging.INFO, format='CopadoFunction %(levelname)s %(message)s')

    args, parser = parse_cli_arguments()

    # TODO: validate the details of git_json, and present error messages
    git_json = json.loads(os.environ['git_json'])
    do_git_get(args.branch[0], git_json, args.directory, args.depth, args.verbose, args.create)


if __name__ == '__main__':
    main()
