#!/usr/bin/env node
'use strict';

const execSync = require('node:child_process').execSync;
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
            const cmds = [];

            for (const item in argv) {
                if (validOptions.includes(item)) {
                    params.push(`--${item} ${argv[item]}`);
                } else if (positionals.includes(item)) {
                    params.push(argv[item]);
                }
            }
            if (params.length) {
                let action;
                let branch;
                let fetchParams = '';
                console.log(`MOCK-RUN: ⚡ ${argv['$0']} ${params.join(' ')}`);

                const param_directory = argv.directory ? ` into folder ${argv.directory}` : '';

                const param_depth = argv.depth
                    ? ` (truncating branch to last ${argv.depth} commits)`
                    : '';
                if (argv.depth) {
                    fetchParams += ` --depth=${argv.depth}`;
                }
                if (argv.verbose) {
                    fetchParams += ` -v --progress`;
                }
                if (argv.directory) {
                    cmds.push(`cd ${argv.directory}`);
                }
                if (argv.create) {
                    action = `Creating if needed & checking out branch ${argv.create}`;
                    branch = argv.create;
                } else if (argv.branch) {
                    action = `Checking out existing branch ${argv.branch}`;
                    branch = argv.branch;
                }
                cmds.push(
                    `git fetch origin ${branch}${fetchParams} || git checkout ${branch}` +
                        (argv.create ? ` || (git checkout -b ${branch})` : '')
                );
                console.log('MOCK-action: ' + action + param_directory + param_depth);
                console.log('⚡ ' + cmds.join(' && '));
                try {
                    execSync(cmds.join(' && '), { stdio: [0, 1, 2], stderr: 'inherit' });
                } catch {}
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
