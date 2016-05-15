'use strict';

module.exports = {
  getProductName(config, appPackage) {
    return config.productName || appPackage.name || 'untitled';
  },

  getAppVersion(config, appPackage) {
    return config.appVersion || appPackage.version;
  },

  getBuildVersion(config, appPackage) {
    return config.buildVersion || this.getAppVersion(config, appPackage);
  },

  getBuildDir(config) {
    return config.buildDir || './build';
  },

  getBuildTargetConfig(buildTarget) {
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
  },
};
