/**
 * This file contains the base code for hooking together the Canadarm code.
 */

// These comments are added for JSDoc. It defines the
// namespaces used across the various development files.
// Do not modify this section of comments unless you have
// good reason.
/**
  @namespace Canadarm
*/
/**
  @namespace Handler
  @memberof Canadarm
*/
/**
  @namespace Appender
  @memberof Canadarm
*/
/**
  pseudo namespace to help with documentation.
  @namespace Events
  @memberof Canadarm
*/

var errorAppenders = [],
    errorHandlers = [];

/**
 * Used to setup Canadarm for consumers. The properties below are for the settings
 * object passed to the init function.
 *
 * @example
 *  Canadarm.init({
 *    onError: true,  // Set to false if you do not want window.onerror set.
 *    wrapEvents: true, // Set to false if you do not want all event handlers to be logged for errors
 *    logLevel: Canadarm.level.WARN, // Will only send logs for level of WARN and above.
 *    appenders: [
 *      Canadarm.Appender.standardLogAppender
 *    ],
 *    handlers: [
 *      Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'),
 *      Canadarm.Handler.consoleLogHandler
 *    ]
 *  })
 *
 * @function init
 *
 * @param {object} settings - options for setting up canadarm.
 * @property settings[onError] {boolean}    - True, Canadarm will set onerror. Defaults to true.
 * @property settings[wrapEvents] {boolean} - True, Canadarm will wrap event binding. Defaults to true.
 * @property settings[appenders] {Array}    - Array of Appenders for Canadarm to use. Defaults to empty.
 * @property settings[handlers] {Array}     - Array of Handlers for Canadarm to use. Defaults to empty.
 * @property settings[logLevel] {String}    - The log level to log at. Defaults to Canadarm.level.DEBUG.
 */
function init(settings) {
  var opts = settings || {},
    i;

  if (opts.onError !== false) {
    Canadarm.setUpOnErrorHandler();
  }

  if (opts.wrapEvents !== false) {
    Canadarm.setUpEventListening();
  }

  if (opts.appenders) {
    for (i = 0; i < opts.appenders.length; i++) {
      Canadarm.addAppender(opts.appenders[i]);
    }
  }

  if (opts.handlers) {
    for (i = 0; i < opts.handlers.length; i++) {
      Canadarm.addHandler(opts.handlers[i]);
    }
  }

  if (opts.logLevel) {
    Canadarm.loggingLevel = opts.logLevel;
  }
}

/**
 * Adds the specified logAppender to existing appenders for logging.
 *
 * @example
 *  Canadarm.addAppender(Canadarm.Appender.standardLogAppender);
 *
 * @function addAppender
 *
 * @param {function} logAppender - Log appender for gather log data.
 */
function addAppender(logAppender) {
  errorAppenders.push(logAppender);
}

/**
 * Adds the specified logHandler to existing handlers for logging.
 *
 * @example
 *  Canadarm.addHandler(Canadarm.Handler.consoleLogHandler);
 *  Canadarm.addHandler(Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'));
 *
 * @function addHandler
 *
 * @param {function} logHandler - Log handler for logs.
 */
function addHandler(logHandler) {
  errorHandlers.push(logHandler);
}

/**
 * Used to gather the errors that have occurred.  This function loops over the existing
 * logAppenders and creates the attributes that will be logged to the errors. Returns
 * an object of errors to log.
 *
 * @function gatherErrors
 * @private
 *
 * @param {string} level      - Log level of the exception. (e.g. ERROR, FATAL)
 * @param {error}  exception  - JavaScript Error object.
 * @param {string} message    - Message of the error.
 * @param {object} data       - Key/Value pairing of additional properties to log.
 * @param {array} appenders   - If passed will override existing appenders and be used.
 */
function gatherErrors(level, exception, message, data, appenders) {
  var logAttributes = {},
    localAppenders = appenders || errorAppenders,
    errorAppender, attributeName, attributes, i, key;

  // Go over every log appender and add it's attributes so we can log them.
  for (i = 0; i < localAppenders.length; i++) {
    errorAppender = localAppenders[i];
    attributes = errorAppender(level, exception, message, data);

    for (key in attributes) {
      if (!attributes.hasOwnProperty(key)) {
        continue;
      }
      logAttributes[key] = attributes[key];
    }
  }

  return logAttributes;
}

/**
 * Sends the errors passed in `logAttributes` for each logHandler.
 *
 * @method pushErrors
 * @private
 *
 * @param {object} logAttributes -- A key/value pairing of the attributes to log.
 * @param {array} handlers   -- If passed will override existing handlers and be used.
 */
function pushErrors(logAttributes, handlers) {
  var localHandlers = handlers || errorHandlers,
    errorHandler, i;

  // Go over every log handler so we can actually create logs.
  for (i = 0; i < localHandlers.length; i++) {
    errorHandler = localHandlers[i];
    errorHandler(logAttributes);
  }
}


/**
 * Used to generate our custom loggers.
 *
 * @function customLogEvent
 * @private
 *
 * @param {string} level - The level to log the events.
 *
 * @returns a function that logs what is passed.  Signature is: message, exception, data, settings.
 */
function customLogEvent(level) {

  // options should contain the appenders and handlers to override the
  // global ones defined in errorAppenders, and errorHandlers.
  // Used by Canadarm.localWatch to wrap local appender calls.
  return function (message, exception, data, settings) {

    // If we are are below the current Canadarm.loggingLevel we
    // should not do anything with the passed information.  Return
    // as if nothing happened.
    if (Canadarm.levelOrder.indexOf(level) < Canadarm.levelOrder.indexOf(Canadarm.loggingLevel)) {
      return;
    }

    var options = settings || {},
      attrs = gatherErrors(level, exception, message, data, options.appenders);
    pushErrors(attrs, options.handlers);
  };
}

// Custom logging functions for when code is captured
Canadarm.debug = customLogEvent(Canadarm.level.DEBUG);
Canadarm.info = customLogEvent(Canadarm.level.INFO);
Canadarm.warn = customLogEvent(Canadarm.level.WARN);
Canadarm.error = customLogEvent(Canadarm.level.ERROR);
Canadarm.fatal = customLogEvent(Canadarm.level.FATAL);

// Add logHandler and logAppender functions so Canadarm will work
Canadarm.addHandler = addHandler;
Canadarm.addAppender = addAppender;

// Add init so Canadarm can be setup easily.
Canadarm.init = init;

// Set default loggingLevel
Canadarm.loggingLevel = Canadarm.level.DEBUG;
