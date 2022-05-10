#!/usr/bin/env node
'use strict';

/**
 * CLI entry for SFMC DevTools
 */

const yargs = require('yargs');

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
        nargs: 0,
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
                describe: 'name of branch you want to checkout',
            });
        },
        handler: async (argv) => {
            const params = [];
            const validOptions = Object.keys(copadoOptions);
            const positionals = ['branch'];

            for (const item in argv) {
                if (validOptions.includes(item)) {
                    params.push(`--${item} ${argv[item]}`);
                } else if (positionals.includes(item)) {
                    params.push(argv[item]);
                }
            }
            // if(process.env.GIT_SSH_COMMAND) {
            //     await git.clone(process.env.repo_url, './');
            // } else {
            //     await git.clone(process.env.repo_url, './');
            // }
            if (params.length) {
                console.log(`MOCK-RUN: ⚡ ${argv['$0']} ${params.join(' ')}`);
                const param_directory = argv.directory ? ` into folder ${argv.directory}` : '';
                const param_depth = argv.depth
                    ? ` (truncating branch to last ${argv.depth} commits)`
                    : '';
                let action;
                if (argv['create']) {
                    action = `Creating & checking out branch ${argv['create']}`;
                } else if (argv['branch']) {
                    action = `Checking out existing branch ${argv['branch']}`;
                }
                console.log('MOCK-action: ' + action + param_directory + param_depth);
            } else {
                yargs.showHelp();
                return;
            }
        },
    })
    .options(copadoOptions)
    .strict()
    .recommendCommands()
    .wrap(yargs.terminalWidth())
    .epilog('Copyright 2022. Jörn Berkefeld.')
    .help().argv;
