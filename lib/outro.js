 window.Canadarm = Canadarm;

 // Add navigator so when running in a node environment it exists.
 if (!window.navigator) {
   window.navigator = {};
 }

 // Added so we have access to window in tests.
 Canadarm._window = window;
}(this));