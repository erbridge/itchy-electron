'use strict';

const path = require('path');

const shell = require('shelljs');

const utils = require('./utils');

const getTarget = function getTarget(targetName, buildName, config) {
  if (!config.itchTargets) {
    throw new Error('No targets configured');
  }

  const buildConfig = utils.getBuildTargetConfig(buildName);

  const target = {
    project: config.itchTargets[targetName],
    channel: `${buildName}-${buildConfig.arch}`,
  };

  if (!target.project) {
    throw new Error(`Undefined target: ${targetName}`);
  }

  return target;
};

const getBuildPath = function getBuildPath(buildName, config, appPackage) {
  const buildDir    = utils.getBuildDir(config);
  const name        = utils.getProductName(config, appPackage);
  const buildConfig = utils.getBuildTargetConfig(buildName);
  const build       = `${name}-${buildConfig.platform}-${buildConfig.arch}`;

  return path.join(buildDir, build);
};

module.exports = function publish(targetName, buildName, config, appPackage) {
  if (!shell.which('butler')) {
    throw new Error('butler needs to be installed and on the path');
  }

  let command = 'butler push --fix-permissions';

  const version = utils.getBuildVersion(config, appPackage);

  if (version) {
    command = `${command} --userversion=${version}`;
  }

  const target = getTarget(targetName, buildName, config);
  const buildPath = getBuildPath(buildName, config, appPackage);

  command = `${command} "${buildPath}" ${target.project}:${target.channel}`;

  shell.exec(command, { async: true });
};
