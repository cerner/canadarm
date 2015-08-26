  // Add navigator so when running in a node environment it exists.
  if (!window.navigator) {
    window.navigator = {};
  }

  // Added so we have access to window in tests.
  Canadarm._window = window;

  // Expose Canadarm
  if (typeof define === 'function' && define.amd) {
    // AMD
    window.Canadarm = Canadarm;
    define('canadarm', [], function() {
      return Canadarm;
    });
  } else if (typeof module === 'object') {
    // browserify
    module.exports = Canadarm;
  } else if (typeof exports === 'object') {
    // CommonJS
    exports = Canadarm;
  } else {
    // Everything else
    window.Canadarm = Canadarm;
  }
}(typeof window !== 'undefined' ? window : this));
