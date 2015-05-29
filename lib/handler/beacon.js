/* global Image */

/**
 * Beacon log handler. Uses a configured beacon file to get logs to a remote logging location.
 *
 * @memberof Canadarm.Handler
 * @function beaconLogHandler
 *
 * @example
 *   Canadarm.addHandler(Canadarm.Handler.beaconLogHandler('http://example.com/to/beacon.gif'));
 *
 *   // If you use an access_combined log format for the beacon you will see something like:
 *   10.162.143.4 - - [21/Apr/2015:16:07:59 -0500] "GET ?characterSet=UTF-8%0A&columnNumber=%3F%0A&language=en-US...
 *
 * @param {string} beaconURL - The URL to send logs.
 *
 * @returns a function that takes an attribute object for logging.
 */
 function beaconLogHandler(beaconURL) {

  return function logHandler(logAttributes) {
    var logValues = [],
      imageLogger = new Image(), key;

    // Put attributes into a format that are easy to jam into a URL
    for(key in logAttributes) {
      if (!logAttributes.hasOwnProperty(key)){
        continue;
      }
      logValues.push(
        key + '=' + Canadarm.utils.fixedEncodeURIComponent(logAttributes[key] + '\n')
      );
    }

    // Sends logs off to the server
    imageLogger.src = beaconURL + '?' + logValues.join('&');
   };
}

Canadarm.Handler.beaconLogHandler = beaconLogHandler;
