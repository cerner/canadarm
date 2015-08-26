# How to release

This project is hosted on NPM.  You can see it [here][npm-project].

Releasing the project requires these steps:

0. Set the version number in the code
1. `grunt build` (make sure it passes)
2. `git tag -a NEW-TAG -m MESSAGE ABOUT RELEASE` (be sure it follows [semver][semantic-versioning])
3. `npm publish` (make sure it's uploaded to [npm][npm-project])
4. Update `master` to a new minor version

[npm-project]: https://www.npmjs.com/package/canadarm
[semantic-versioning]: http://semver.org/
