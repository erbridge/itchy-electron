'use strict';

const chalk       = require('chalk');
const packager    = require('electron-packager');
const semverRegex = require('semver-regex');
const winston     = require('winston');

const getProductName = function getProductName(config, appPackage) {
  return config.productName || appPackage.name || 'untitled';
};

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

const getAppVersion = function getAppVersion(config, appPackage) {
  return config.appVersion || appPackage.version;
};

const getBuildVersion = function getBuildVersion(config, appPackage) {
  return config.buildVersion || getAppVersion(config, appPackage);
};

const getAppDir = function getAppDir(config) {
  return config.appDir || '.';
};

const getBuildDir = function getBuildDir(config) {
  return config.buildDir || './build';
};

const getBuildTargetConfig = function getBuildTargetConfig(buildTarget) {
  const buildTargets = {
    linux: {
      platform: 'linux',
      arch:     'x64',
    },
    osx: {
      platform: 'darwin',
      arch:     'x64',
    },
    win32: {
      platform: 'win32',
      arch:     'ia32',
    },
  };

  return buildTargets[buildTarget];
};

module.exports = function build(buildTarget, config, appPackage) {
  const electronVersion = getElectronVersion(config, appPackage);

  if (!electronVersion) {
    throw new Error('The electron version to use is missing');
  }

  if (!buildTarget) {
    throw new Error('A build target must be specified');
  }

  const buildTargetConfig = getBuildTargetConfig(buildTarget);

  const packagerConfig = {
    dir:      getAppDir(config),
    platform: buildTargetConfig.platform,
    arch:     buildTargetConfig.arch,

    name:            getProductName(config, appPackage),
    'app-version':   getAppVersion(config, appPackage),
    'build-version': getBuildVersion(config, appPackage),

    out: getBuildDir(config),

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
