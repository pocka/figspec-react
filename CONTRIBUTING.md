# Contribution guidelines

## Issues

### Reporting bugs

Please write a clear and concise description with short title.
Codes to reproduce such as a sample repository or a link for an online playground (e.g. CodeSandbox) would be helpful.

### Requesting features

Instead of simply describing the feature, I recommend you to write down a problem you facing and/or use-cases.
These things help us discussing/implementing the feature and make your feature request more appealing.

## Pull Requests

### Submitting a Pull Request

Please keep a Pull Request simple. Don't mix many things into one PR.
We'll request you to break down your PR into small ones if required.

## Development guide

### Requirements

- Node.js >= Maintenance LTS (If you have an NVM, just do `nvm install` or `nvm use` at the root of the repository)
- Yarn

### Bootstraping

```sh
$ yarn

# or "yarn install" if you prefer...
```

### Build

You can build JS files with `build` script.
But you won't use the command so often because our development is basically done on Storybook.

```sh
# to build a package
$ yarn build

# to start Storybook
$ yarn storybook
```

## Release workflow

(WIP)
