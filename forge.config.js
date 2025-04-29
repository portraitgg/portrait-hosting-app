require('dotenv').config();
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const pkg = require('./package.json');

module.exports = {
  packagerConfig: {
    osxSign: {},
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
    icon: './src/assets/appIcon/icon.icns',
    asar: true,
    // This makes sure that the app is not shown in the dock on macOS.
    extendInfo: {
      LSUIElement: true,
      CFBundleIdentifier: 'com.portrait.app',
      // Set the app name to Portrait
      CFBundleName: 'Portrait',
      // Set the app version to 0.0.6
      CFBundleShortVersionString: pkg.version,
      appVersion: pkg.version,
      // Set the app bundle identifier to com.portrait.app
      CFBundleVersion: 20240429,
    },
  },
  // mac: {
  //   target: {
  //     target: 'zip',
  //     arch: 'universal',
  //   },
  // },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033, // English
        manufacturer: 'Portrait Technology Inc.',
        exe: 'Portrait',
        icon: './src/assets/aboutIcon/logo_new.ico',
        ui: {
          chooseDirectory: true, // Allows users to pick an install location
        },
        name: 'Portrait', // Folder name in program files
        shortcutName: 'Portrait', // Custom name for the Start Menu & Desktop shortcut
      },
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
