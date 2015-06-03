# canadarm

[![Build Status](https://api.travis-ci.org/cerner/canadarm.svg)][travis]
[![Code Climate](http://img.shields.io/codeclimate/github/cerner/canadarm.svg)][codeclimate]

[travis]: https://travis-ci.org/cerner/canadarm
[codeclimate]: https://codeclimate.com/github/cerner/canadarm

Canadarm makes JavaScript logging easy and seamless, helping you figure out what went wrong with your scripts.
Named for the [Canadarm](http://en.wikipedia.org/wiki/Canadarm) we hope this too helps you piece together
log information to figure out what went wrong with your scripts.

# Installing Canadarm

Install Canadarm by using one of the files located in the [build][build-dir] folder. Alternatively,
you may also use `npm install canadarm`.

# Using canadarm

Interaction with canadarm is via the `Canadarm` object.  Log appenders in `Canadarm.Appender` are
used to gather the log information.  Log handlers in `Canadarm.Handler` are used to send the log
information.  **Note**, IE 8 and above are the only IE versions this library actively supports.
Use jQuery in IE 8 for automatic event handling.  This library shims addEventListener so events
are automatically wrapped. For more information on IE 8 see the bottom of this [readme](#internet-explorer-8).

## Suggested Configuration

In general you should be able to use the following configuration for normal web applications.
If your JavaScript executes in an environment that is not under its control it is recommended
to make use of the `Canadarm.localWatch` and `Canadarm.localAttempt`.

```js
Canadarm.init({
  onError: true,  // Set to false if you do not want window.onerror set.
  wrapEvents: true, // Set to false if you do not want all event handlers to be logged for errors
  logLevel: Canadarm.level.WARN, // Will only send logs for level of WARN and above.
  appenders: [
    Canadarm.Appender.standardLogAppender
  ],
  handlers: [
    Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'),
    Canadarm.Handler.consoleLogHandler
  ]
});
```

There are some scenarios where you will want to watch a specific function differently than the rest.
For example, let's say you want to use a different `Handler` or `Appender` for one special function.
You should use the `Canadarm.localWatch` function to modify how the special function is monitored.

### Settings

These are passed to `Canadarm.init` and may be passed to the custom logging mentioned below.  Settings
_must_ be passed into the `Canadarm.init` call. There are no default values.

| Field      | Meaning                                                                                                                                    |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| onError    | Set to true if the `window.onerror` should be overridden.  If a `window.onerror` is already defined it will be called as well as canadarm. |
| wrapEvents | Set to true to wrap all event bound functions.                                                                                             |
| logLevel   | The log level to stop sending logs for.  It will send logs for the level passed and above. If not defined will log everything.             |
| appenders  | A list of appenders to use.  See the Appenders section.                                                                                    |
| handlers   | A list of handlers to use. See the Handlers section.                                                                                       |

### Local Usage

You do have the option of using `Canadarm.localWatch`.  This method is useful if you have a specific function you want to
check on and have special configuration for.  For example, if you are one of many libraries on a page (and want to use this library)
using the `Canadarm.localWatch` helps you play nice with your neighbors.  Here is an example of this should be used in conjunction
with other libraries (note, you will impact them with the call to `Canadarm.init`).

```js
// Canadarm.init call (for all libraries/parts of the page)
Canadarm.init({
  onError: false,
  wrapEvents: false,
  logLevel: Canadarm.level.WARN // Will only send logs for level of WARN and above.
})
```

Then when you want to watch _your_ specific function you can do something similar according to the code below.
Here is the method signature for `Canadarm.localWatch` and `Canadarm.localAttempt`:

| Parameter | Description                                                                                                             |
|-----------|-------------------------------------------------------------------------------------------------------------------------|
| fn        | The function to watch for errors                                                                                        |
| settings  | A settings object that overrides the `appenders` and/or `handlers` that are provided to `Canadarm.init` when passed in  |
| context   | The context to execute at, defaults to `this`.  You normally will not set this value                                    |

```js
mySpecificFunction = Canadarm.localWatch(function () {
    // The parts that do the actual work of your application.
  },
  {
    appenders: [Canadarm.Appender.standardLogAppender],
    handlers: [Canadarm.Handler.beaconHandler('http://example.com/more-path/')]
  }
)
```

Below are the available local usage functions within Canadarm.  `Canadarm.watch` and `Canadarm.attempt` are dependent
on _all_ settings passed to `Canadarm.init`.  The `local` versions `Canadarm.localWatch` and `Canadarm.localAttempt` allow
for more fine grained control.  See section above.

| Function                | Usage                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------|
| `Canadarm.watch`        | All future calls to this function will be logged if an error occurs                         |
| `Canadarm.attempt`      | Use this to immediately invoke the function and log an error                                |
| `Canadarm.localWatch`   | Same as `Canadarm.watch`, but allows passing `settings` and `context`as defined above.      |
| `Canadarm.localAttempt` | Same as `Canadarm.attempt`, but allows passing `settings` and `context` as defined above.   |

## Appender

Appenders are functions that return a dictionary of log information.  This information is then passed
to the Handlers.  For example below is a possible platform.js:

```js
function platformLogAppender() {
  var platform = window.navigator.platform || Canadarm.constant.UNKNOWN_LOG,
    language = window.navigator.language || Canadarm.constant.UNKNOWN_LOG,
    vendor = window.navigator.vendor || Canadarm.constant.UNKNOWN_LOG;

  return {
    platform : platform,
    language : language,
    vendor   : vendor
  };
}
```

The signature passed to an appender is: `level, exception, message, data`.

There are some default appenders: `Canadarm.Appender.standardLogAppender`.
For now see their method signatures in the `lib/appender` folder for what they log.

To add an appender do the following:

```js
Canadarm.addAppender(Canadarm.Appender.standardLogAppender);
```

### standardLogAppender

The standard log appender returns the following:  (all values default to '?' when they cannot be determined)

| Field        | Meaning                                            |
|--------------|----------------------------------------------------|
| characterSet | Encoding used to read the page                     |
| columnNumber | Column number of error                             |
| language     | The language set on the page                       |
| lineNumber   | Line number of the error                           |
| logDate      | Date of the log for what the browser thinks is UTC |
| msg          | The message of the error                           |
| pageURL      | URL the error occurred at                          |
| stack        | stack trace for the error                          |
| type         | Right now will always be 'jserror'                 |
| scriptURL    | URL of the script that threw the error             |

## Handler

Handlers are functions that handle logs. Canadarm provides two built-in handlers:

* `Canadarm.Handler.beaconLogHandler`: Sends the log to a configured URL endpoint.
* `Canadarm.Handler.consoleLogHandler`: Sends the log to the JavaScript console.

A handler takes a single object for its signature: `logAttributes` which is a standard JavaScript object with
key value pairs.

To add a handler do the following:

```js
Canadarm.addHandler(Canadarm.Handler.consoleLogHandler);
Canadarm.addHandler(Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'));
```

### [Console Log Handler][consolelog-handler]

This handler will output all calls to the console.  It simply makes a call to `console.error`.

### [Beacon Log Handler][beaconlog-handler]

This handler will make a `GET` call to the provided URL.  We recommend the end point given use
an `access_combined` log format.

## Custom Error Logging

If you need to log an error for information yourself you can do this using each of the following:

* `Canadarm.debug`
* `Canadarm.info`
* `Canadarm.warn`
* `Canadarm.error`
* `Canadarm.fatal`

The signature for custom logging: `(message, exception, data, settings)`

| Parameters | Meaning                                                                                                                                                                          |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| message    | This will be the message of your custom error                                                                                                                                    |
| exception  | This _must_ be an `Error` [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), likely gotten from a `try/catch`                     |
| data       | This is an object you can pass extra data for your log.  If you wanted to add color you could pass `{color: 'red'}` and it would be added to the log the same as Appenders work. |
| settings   | These settings allow you to pass in different `handlers` and `appenders`. This can be useful if you do not want to use the globally defined settings passed to `Canadarm.init`   |

# Development

When developing against this repository it may be worth looking at the `docs` folder.  You can see the
auto generated documentation by running a simple file server in the `docs` folder. For example
if you have Python 2.7.x you can run `python -m SimpleHTTPServer` and see the documentation served. You will see
the documentation running at `http://localhost:8000/` by default.

## Running the project

There is an `example` directory that contains code to functionally validate any changes.  To see these files
follow the steps below.

1. `git clone `
1. `cd canadarm`
1. `npm install`
1. `cd example`
1. `python -m SimpleHTTPServer`  Assumes Python 2.7.x  use `python -m http.server` for Python 3.x.y
1. Go to your `localhost:8000/html`

Once you're at the `localhost:8000/html` open the console and you'll see the current attempt at parsing out log info.

There are two pages.  The `index.html` which shows up by default and the `local.html`.
`index.html` had the default recommended setup of canadarm.  The `local.html` does not do any of the automatic
event watching. This is helpful for making sure changes still work with the `Canadarm.localWatch` and
`Canadarm.localAttempt` functions.

## Testing

Canadarm uses the [mocha](http://mochajs.org/#running-mochas-tests) testing framework.  To run the tests
just run: `grunt build` while in the root directory of the application. This will run all of our tests.  Example:

`grunt build`

```sh
Running "jshint:all" (jshint) task
>> 10 files lint free.

Running "jshint:concat" (jshint) task
>> 1 file lint free.

Running "concat:canadarm" (concat) task
File "build/canadarm.js" created.
File "example/js/canadarm.js" created.

Running "jshint:concat" (jshint) task
>> 1 file lint free.

Running "uglify:candarm" (uglify) task
File "build/canadarm.min.js" created.

Running "mochaTest:test" (mochaTest) task
[ 'one=one\n', 'two=two\n' ]
 14  -_-_-_-_-_-_-_-_,------,
 0   -_-_-_-_-_-_-_-_|   /\_/\
 0   -_-_-_-_-_-_-_-^|__( ^ .^)
     -_-_-_-_-_-_-_-  ""  ""

  14 passing (28ms)


Done, without errors.
```

## Helpers

There are a few grunt tasks that do things to help out with development.

`grunt jshint` -- this lints the project showing any errors that have occurred

`grunt build` -- this will lint the project and create the build file.  It also puts the built file into the example project.


## Internet Explorer 8

### Event handling

If you set `wrapEvents` to `true`, in Internet Explorer 8 only events that are added via
`addEventListener` will be automatically watched. Meaning if a call is directly made to
`attachEvent` you _must_ wrap the event handler in a `Canadarm.watch` to have the errors
managed by canadarm. jQuery uses addEventListener if it exists on the object when an
event is bound. Canadarm will shim `addEventListener` and `removeEventListener` by
following the shim found [here](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility).
This means that events will **_only_** be automatically monitored if canadarm is initialized before _all_ other
JavaScript event binding occurs.  For this reason you may need to include the Canadarm init call
in your `<head>` or the very first thing in your JavaScript that's loaded after your DOM is ready.

This is all necessary because there is a defect in IE 8 around how attachEvent works for XML
defined nodes of the form `<foo:bar>`.  These nodes _do not_ honor the prototype chain properly
for `Element.prototype.attachEvent`.  Therefore, we cannot simply wrap `Element.prototype.attachEvent` like
we do for `EventTarget.prototype.addEventListener` for modern browsers.

### `onerror`

* Seems to work for IE if script debugging is turned off. See this confusing [post](https://social.msdn.microsoft.com/Forums/ie/en-US/3721e97d-3f9a-4006-b4a9-c96b27eae160/error-handling-in-ie9#4b2cd7a6-e43b-478c-975c-af14842e2abb) for more insight. It's not easy to parse.
* We may not support IE in a developer mode for sending logs since it takes over the `onerror` event handler.
* All the Logger.* functions work just fine.

:frowning: IE does not properly propagate the `onerror` window event.  Specifically if the user is running IE there are [some versions](https://social.msdn.microsoft.com/Forums/ie/en-US/3721e97d-3f9a-4006-b4a9-c96b27eae160/error-handling-in-ie9?forum=iewebdevelopment) and [scenarios](http://stackoverflow.com/questions/1915812/window-onerror-does-not-work) that cause `onerror` not to fire.

### Console Logging

As stated above when the console handler is used it makes a `console.error` call.  In IE 8 console is not defined until
the developer tools window is opened. Because of this you will not see any logs until you open the developer tools when
using IE 8. There is a check to suppress the call attempt if `console` is not defined; you do not need to worry about
erroneous errors.

## Helpful links:

Good info on client logging:
* opera, https://dev.opera.com/articles/client-side-error-logging/
* opera, onerror, https://dev.opera.com/articles/better-error-handling-with-window-onerror/

Blink Logging signature:
* https://mikewest.org/2013/08/debugging-runtime-errors-with-window-onerror

window.onerror:
* mdn, https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror
* chrome console, http://stackoverflow.com/questions/16192464/window-onerror-not-working-in-chrome


Some [existing options](http://ajaxpatterns.org/Javascript_Logging_Frameworks) on the market that are either too bulky or require too much work on the end user.

## Issues

Please browse our [existing issues](https://github.com/cerner/canadarm/issues) before logging new issues.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Copyright 2015 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.


[consolelog-handler]: lib/handler/console.js
[beaconlog-handler]: lib/handler/beacon.js
[build-dir]: build/
