/**
* This file is used to catch errors that bubble up to the global window object.
*/

/**
 * Keep track of the original onerror event handler just in case it already
 * existed by the time Canadarm is loaded.  This allows Canadarm to be mostly
 * passive to existing onerror handlers.
 * @private
 */
var _oldOnError = window.onerror;

/**
 * Logs the errors that have occurred.  Its signature matches that of `window.onerror`.
 * Will replace the `window.onerror`.  It will still call the original `window.onerror`
 * as well if it existed.
 *
 * @function _onError
 * @private
 */
function _onError(errorMessage, url, lineNumber, columnNumber, exception) {
  var onErrorReturn;

  // Execute the original window.onerror handler, if any
  if (_oldOnError && typeof _oldOnError === 'function') {
    onErrorReturn = _oldOnError.apply(this, arguments);
  }

  Canadarm.fatal(errorMessage, exception, {
    url: url,
    lineNumber: lineNumber,
    columnNumber: columnNumber
  });

  return onErrorReturn;
}

/**
 * Sets up error handling at the window level.
 *
 * @function setUpOnErrorHandler
 * @private
 */
function setUpOnErrorHandler() {
  // Take over the default `window.onerror` so we log errors that occur
  // in the browser.
  window.onerror = _onError;
}

/**
 * Internal method used to setup window.onerror if set in settings.
 */
Canadarm.setUpOnErrorHandler = setUpOnErrorHandler;