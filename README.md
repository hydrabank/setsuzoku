# Setsuzoku <img width="64" align="right" alt="setsuzoku logo" src="https://github.com/hydrabank/setsuzoku/blob/master/renderer/public/images/infinity.png?raw=true">

A simplistic SSH host manager for Windows. Built with Next.js, Electron, and powered by OpenSSH.

## Installation
A pre-built installer and unpacked versions are available on the [releases page](https://github.com/hydrabank/setsuzoku/releases). **Windows versions are only available at this time**, however Linux and macOS support is planned in the future. If you'd like to help out, please feel free to open a PR!

## Development
To run Setsuzoku in development mode, clone the repository and follow these steps:

1. Make sure that [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) are installed.
2. Install dependencies (`yarn install`)
3. Run the development server (`yarn dev`)
4. Wait for the Electron app to open and enjoy!

### Building Setsuzoku
To build Setsuzoku's webapp, simply run `yarn build` and output will be placed in the `renderer/out` directory. `yarn dist` will build the webapp and package it using Electron Builder.