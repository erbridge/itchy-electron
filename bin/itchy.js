#!/usr/bin/env node

'use strict';

const path = require('path');

const chalk          = require('chalk');
const Liftoff        = require('liftoff');
const meow           = require('meow');
const shell          = require('shelljs');
const updateNotifier = require('update-notifier');
const winston        = require('winston');

const commands = require('../commands');
const pkg      = require('../package');

updateNotifier({ pkg }).notify();

winston.cli();

const cli = meow(
  `
  Usage:

    ${chalk.cyan('itchy')} ${chalk.green('<command>')} [${chalk.magenta('<args>')}] [${chalk.yellow('<options>')}]

  Commands:

    ${chalk.green('build')} ${chalk.magenta('<target-os>')}                 Create a build for the target operating system

        ${chalk.magenta('<target-os>')}                   Valid targets are ${chalk.bold('linux')}, ${chalk.bold('osx')}, or ${chalk.bold('win32')}

    ${chalk.green('help')}                              Display this help message

    ${chalk.green('publish')} ${chalk.magenta('<target>')} ${chalk.magenta('<build>')}          Publish a build to itch.io

        ${chalk.magenta('<target>')}                      One of the targets specified in the config
        ${chalk.magenta('<build>')}                       Valid targets are ${chalk.bold('linux')}, ${chalk.bold('osx')}, or ${chalk.bold('win32')}

  Options:

    ${chalk.yellow('--config=<path/to/config/file>')}    Specify the config file to use
    ${chalk.yellow('--cwd=<path/to/app/dir>')}           Specify the working directory
    ${chalk.yellow('--help')}                            Display this help message
  `,
  {}
);

const ItchyElectron = new Liftoff({
  moduleName:   'itchy-electron',
  configName:   '.itchyelectron',
  processTitle: 'itchy-electron',
  extensions:   {
    rc:      null,
    '.json': null,
    '.js':   null,
  },
});

ItchyElectron.launch(
  {
    cwd:         cli.flags.cwd,
    configPath:  cli.flags.config,
    completion:  cli.flags.completion,
  },
  function invoke(env) {
    if (shell.pwd() !== env.cwd) {
      shell.cd(env.cwd);
    }

    let appPackage;
    let config;

    try {
      appPackage = require(path.join(env.cwd, 'package'));  // eslint-disable-line global-require
    } catch (err) {
      appPackage = {};
    }

    if (env.configPath) {
      config = require(env.configPath);  // eslint-disable-line global-require
    } else {
      config = appPackage.itchyElectron || {};
    }

    try {
      switch (cli.input[0]) {
        case 'build':
          commands.build(cli.input[1], config, appPackage);
          break;
        case 'help':
          cli.showHelp();
          break;
        case 'publish':
          commands.publish(cli.input[1], cli.input[2], config, appPackage);
          break;
        default:
          throw new Error('Unrecognized command');
      }
    } catch (e) {
      // TODO: Show the help.
      winston.error(e.message);

      cli.showHelp(1);
    }
  }
);
