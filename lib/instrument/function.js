function _watchFn(fn, context, settings) {
  // Exit function early if it has already
  // been wrapped in a watch call.
  if (fn && fn._wrapper && typeof(fn._wrapper === 'function')) {
    return fn._wrapper;
  }

  var wrapper = function() {
    try {
      return fn.apply(context || this, arguments);
    } catch(error) {
      Canadarm.error(error.message, error, undefined, settings);
    }
  };

  fn._wrapper = wrapper;
  return wrapper;
}

/**
 * Return a wrapped function which when called, logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function watch
 *
 * @example
 *   Canadarm.watch(myFunction);
 *
 * @param {Function} fn - The function to wrap.
 * @param {Object} context - The context to execute the function in. Defaults to this.
 * @return A wrapped function with the original function a property of the wrapped function called _wrapped.
 */
Canadarm.watch = function(fn, context) {
  return _watchFn(fn, context);
};


/**
 * Execute the given function and logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function attempt
 *
 * @example
 *   Canadarm.attempt(myFunction); // immediately executed
 *
 * @param {function} fn - The function to wrap.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @param {} Additional arguments passed to the function.
 * @return The result of passed function fn.
 */
Canadarm.attempt = function(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return _watchFn(fn, context)(args);
};

/**
 * Return wrapped function which when called, logs any errors thrown.
 * Should only be used when needing to have custom, localized error
 * handling.
 *
 * @memberof Canadarm.Events
 * @function localWatch
 *
 * @example
 *   mySpecificFunction = Canadarm.localWatch(function realFunction() {
 *      // The parts that do the actual work of your application.
 *    },
 *    {
 *      appenders: [Canadarm.Appender.standardLogAppender],
 *      handlers: [Canadarm.Handler.beaconHandler('http://path-to-my-logger.somesite.com/more-path/')]
 *    }
 *  )
 *
 * @param {function} fn - The function to wrap
 * @param {object} settings - Override default Appenders and Handlers here, by default will do nothing if not passed.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @return A wrapped function with the original function a property of the wrapped function called _wrapped.
 */
Canadarm.localWatch = function(fn, settings, context) {
  return _watchFn(fn, context, settings);
};

/**
 * Execute the given function and logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function localAttempt
 *
 * @example
 *   Canadarm.localAttempt(myFunction, settingsHash); // immediately executed
 *
 * @param {function} fn - The function to wrap.
 * @param {object} settings - Override default Appenders and Handlers here, by default will do nothing if not passed.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @param {} Additional arguments passed to the function.
 * @return The result of passed function fn.
 */
Canadarm.localAttempt = function(fn, settings, context) {
  var args = Array.prototype.slice.call(arguments, 3);
  return _watchFn(fn, context, settings)(args);
};
