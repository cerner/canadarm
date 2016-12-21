# How to release

This project is hosted on NPM.  You can see it [here][npm-project].

Releasing the project requires these steps:

0. Set the version number in the code
1. `grunt build` (make sure it passes)
2. Use a GitHub [project release][github-release-url] to release the project and tag (be sure it follows [semver][semantic-versioning])
3. `npm publish` (make sure it's uploaded to [npm][npm-project])
4. Update [installation][installation-doc] documentation in README (jsdelivr link).
5. Update `master` to a new minor version

[npm-project]: https://www.npmjs.com/package/canadarm
[semantic-versioning]: http://semver.org/
[installation-doc]: https://github.com/cerner/canadarm#installing-canadarm
[github-release-url]: https://help.github.com/articles/creating-releases/
