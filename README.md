# Itchy Electron

> Package your [Electron](http://electron.atom.io/) games for [itch.io](https://itch.io/)


## About

This is a CLI app for building and publishing games and tools built using [Electron](http://electron.atom.io/) to [itch.io](https://itch.io/). It aims to handle everything from packaging your Electron app into distributables, to publishing it on itch.io. It wraps other tools into a single unified interface, with sensible defaults and simple commands that can easily be called manually or added as `package.json` scripts.

Bug reports, feature requests, and pull requests are welcome!


## Installation

Install into a project using `npm`:

```
$ npm install --save-dev itchy-electron
```

or globally:

```
$ npm install -g itchy-electron
```


## Usage

Once installed, *Itch Electron* is used through the CLI tool `itchy`.

Refer to the help for an up to date command reference:

```
$ itchy help
```


### Configuration

*Itchy Electron* uses configuration files over command line arguments. To configure it, either add an object to your `package.json` called `itchyElectron`, or create a JavaScript or JSON file called `.itchyelectronrc`, `.itchyelectron.js`, or `.itchyelectron.json` (whatever takes your preference).

The only "required" option is `electronVersion` (although it is inherited from the `package.json` if possible - see below for more details).

A minimal `package.json` configuration looks like this:

```json
{
  "name": "example",
  "version": "0.1.0",
  "itchyElectron": {
    "productName": "Example",
    "appDir": "./app"
  },
  "devDependencies": {
    "electron-prebuilt": "1.0.2",
    "itchy-electron": "^0.1.0"
  }
}
```

or `.itchyelectron.json`:

```json
{
  "productName": "Example",
  "appVersion": "0.1.0",
  "electronVersion": "1.0.2"
}
```


#### Options

##### `appDir`

The app source directory. Defaults to the current directory.


##### `appVersion`

The release version of the application. Maps to the `ProductVersion` metadata property on Windows, and `CFBundleShortVersionString` on OS X.


##### `buildDir`

The directory to save builds into. Defaults to `./build`.


##### `buildVersion`

The build version of the application. Maps to the `FileVersion` metadata property on Windows, and `CFBundleVersion` on OS X.


##### `electronVersion`

The version of Electron to build against. If omitted, the pinned version in the `package.json` dependencies will be used. If there is no locally pinned version number, the build will fail.

Accepted packages are:

 - `electron`
 - `electron-prebuilt`
 - `electron-prebuilt-compile`


##### `productName`

The application name. If omitted, `name` from the `package.json` will be used instead. If no name is present, it will default to `untitled`.


### Project Structure

It is suggested that you structure your app in the following way, so as to minimize the overheads caused by packaging the `devDependencies`.

```
project/

  app/
        The entire app source is contained within here.

    package.json
          A minimal package.json containing a reference to the
          app entry point in "main" along with the runtime
          dependencies in "dependencies". Other values are optional.

  build/

  dist/

  package.json
        A more complete package.json with the development dependencies
        and other values. This is where the "itchyElectron"
        configuration belongs, if using the package.json option.
```

Setting `appDir` to `./app` in this case will enable building packages with only the runtime dependencies. It also has the bonus effect of excluding the various configuration files often found in a project's root.
