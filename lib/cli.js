#!/usr/bin/env node
'use strict';

/**
 * CLI entry for SFMC DevTools
 */

const yargs = require('yargs');
const git = require('simple-git')();

const copadoOptions = {
    create: {
        alias: 'c',
        describe:
            'fetch/create & checkout. if BRANCH does not exist, create it locally instead of throwing an error',
        type: 'string',
        demand: false,
        nargs: 1,
    },
    directory: {
        alias: 'd',
        describe: 'root directory of the repository. Defaults to the current directory',
        type: 'string',
        demand: false,
        nargs: 1,
    },
    verbose: {
        alias: 'v',
        describe: 'enable git verbose / progress output',
        type: 'string',
        demand: false,
        nargs: 1,
    },
    depth: {
        describe: 'git DEPTH for shallow cloning. Default is no shallow cloning',
        type: 'string',
        demand: false,
        nargs: 1,
    },
};

yargs
    .scriptName('copado-git-get')
    .usage('$0 <command> [options]')
    .command({
        command: '$0 [branch]',
        desc: 'checkout BRANCH',
        builder: (yargs) => {
            yargs.positional('branch', {
                type: 'string',
                describe: 'branch',
            });
        },
        handler: async (argv) => {
            const params = [];
            const validOptions = Object.keys(copadoOptions);
            const positionals = ['branch'];
            let branch;
            for (const item in argv) {
                if (validOptions.includes(item)) {
                    params.push(`--${item} ${argv[item]}`);
                } else if (positionals.includes(item)) {
                    params.push(argv[item]);
                }
            }
            if (argv['create']) {
                branch = argv['create'];
            } else if (argv['branch']) {
                branch = argv['branch'];
            }
            // if(process.env.GIT_SSH_COMMAND) {
            //     await git.clone(process.env.repo_url, './');

            // } else {

            //     await git.clone(process.env.repo_url, './');
            // }
            console.log('MOCK-RUN: ⚡ ' + argv['$0'] + ' ' + params.join(' '));
        },
    })
    .options(copadoOptions)
    .strict()
    .recommendCommands()
    .wrap(yargs.terminalWidth())
    .epilog('Copyright 2022. Jörn Berkefeld.')
    .help().argv;
