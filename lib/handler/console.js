/**
 * Console log handler. Outputs logs to console.
 *
 * @memberof Canadarm.Handler
 * @function consoleLogHandler
 *
 * @example
 *   Canadarm.addHandler(Canadarm.Handler.consoleLogHandler);
 *
 *   // In Chrome the output looks similar to:
 *   [ERROR]: two is not defined
 *   characterSet: "windows-1252"
 *   columnNumber: "17"
 *   language: "en-US"
 *   lineNumber: "17"
 *   logDate: "2015-04-22T21:35:40.389Z"
 *   msg: "[ERROR]: two is not defined"
 *   pageURL: "http://localhost:8000/html/"
 *   scriptURL: "http://localhost:8000/js/broken.js"
 *   stack: "ReferenceError: two is not defined↵
 *       at broken_watched_function (http://localhost:8000/js/broken.js:17:17)↵
 *       at wrapper (http://localhost:8000/js/canadarm.js:616:17)↵
 *       at http://localhost:8000/js/broken.js:60:40
 *   "type: "jserror"
 *
 * @param {object} logAttributes - the attributes to log, key/value pairs, no nesting.
 */
 function consoleLogHandler(logAttributes) {
  var logValues = '', key;

  if (console) {
    // detect IE
    if (window.attachEvent) {
      // Put attributes into a format that are easy for IE 8 to read.
      for (key in logAttributes) {
        if (!logAttributes.hasOwnProperty(key)) {
          continue;
        }
        logValues += key + '=' + logAttributes[key] + '\n';
      }

      console.error(logValues);
    } else if (typeof logAttributes.msg !== 'undefined') {
      console.error(logAttributes.msg, logAttributes);
    }
  }
}

Canadarm.Handler.consoleLogHandler = consoleLogHandler;
