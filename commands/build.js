'use strict';

const chalk       = require('chalk');
const packager    = require('electron-packager');
const semverRegex = require('semver-regex');
const winston     = require('winston');

const utils = require('./utils');

const getElectronVersion = function getElectronVersion(config, appPackage) {
  let electronVersion = config.electronVersion;

  if (!electronVersion) {
    const devDependencies = appPackage.devDependencies || {};
    const dependencies = appPackage.dependencies || {};

    const electronPackageNames = [
      'electron',
      'electron-prebuilt',
      'electron-prebuilt-compile',
    ];

    electronPackageNames.find(function getVersion(name) {
      electronVersion = devDependencies[name];

      if (!electronVersion) {
        electronVersion = dependencies[name];
      }

      return electronVersion;
    });

    if (electronVersion) {
      const v = semverRegex().exec(electronVersion);

      if (v) {
        electronVersion = v[0];
      }
    }
  }

  return electronVersion;
};

const getAppDir = function getAppDir(config) {
  return config.appDir || '.';
};

module.exports = function build(buildTarget, config, appPackage) {
  const electronVersion = getElectronVersion(config, appPackage);

  if (!electronVersion) {
    throw new Error('The electron version to use is missing');
  }

  if (!buildTarget) {
    throw new Error('A build target must be specified');
  }

  const buildTargetConfig = utils.getBuildTargetConfig(buildTarget);

  const packagerConfig = {
    dir:      getAppDir(config),
    platform: buildTargetConfig.platform,
    arch:     buildTargetConfig.arch,

    name:            utils.getProductName(config, appPackage),
    'app-version':   utils.getAppVersion(config, appPackage),
    'build-version': utils.getBuildVersion(config, appPackage),

    out: utils.getBuildDir(config),

    // TODO: Make these command flags.
    asar:      true,
    overwrite: true,
    prune:     true,
  };

  packager(
    packagerConfig,
    function done(err, appPaths) {
      if (err) {
        throw err;
      }

      if (appPaths.length) {
        winston.info('Built the following packages:');

        appPaths.forEach(function log(appPath) {
          winston.info('\t', chalk.yellow(appPath));
        });
      } else {
        winston.info('Build complete');
      }
    }
  );
};
