/* global Event,Element */
/**
 * Internal method for setting up event listening within this library.
 *
 * This works by overriding the default `addEventListener`/`attachEvent` and
 * the `removeEventListener`/`detachEvent`.  The default add and remove of events
 * is overridden and every function that is attached as a listener is wrapped in a
 * `Canadarm.watch` call.
 *
 * For removing of the event the internals of the `Canadarm.watch` call keep track
 * of the function made and always return a new function for watching or the one
 * that is already watched. This allows the code between attaching and removing
 * events to look nearly identical.  It also has the added bonus of not doing
 * extra work when accidentally watching an already watched function.
 *
 * @private
 * @memberof Canadarm.Events
 * @function setUpEventListening
 */
function setUpEventListening() {
  var addEventListener, removeEventListener,
    eventListeners = [];

  // Modern Browsers
  if (window.EventTarget) {
    addEventListener = window.EventTarget.prototype.addEventListener;
    removeEventListener = window.EventTarget.prototype.removeEventListener;

    window.EventTarget.prototype.addEventListener = function (event, callback, bubble) {
      return addEventListener.call(this, event, Canadarm.watch(callback), bubble);
    };

    window.EventTarget.prototype.removeEventListener = function (event, callback, bubble) {
      return removeEventListener.call(this, event, Canadarm.watch(callback), bubble);
    };

  // Internet Explorer < 9
  } else if (window.Element && window.Element.prototype && window.Element.prototype.attachEvent) {

    // Only shim addEventListener if it has not already been shimmed.
    if (window.Element.prototype.addEventListener === undefined) {

      // Shim adapted from:
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility
      //
      // Only doing a Canadarm.watch on standard watched events. No on onload event because
      // we do not need to watch that event.  If that fails the page will not work.
      if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault = function() {
          this.returnValue=false;
        };
      }
      if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation = function() {
          this.cancelBubble=true;
        };
      }
      if (!Element.prototype.addEventListener) {

        addEventListener = function(type, listener) {
          var self = this, e, wrapper2,
            wrapper = function(e) {
              e.target = e.srcElement;
              e.currentTarget = self;
              if (listener.handleEvent) {
                listener.handleEvent(e);
              } else {
                listener.call(self,e);
              }
            };

          if (type !== 'DOMContentLoaded') {
            this.attachEvent('on' + type, Canadarm.watch(wrapper));
            eventListeners.push({object:this, type:type, listener:listener, wrapper:wrapper});
          }
        };

        removeEventListener = function(type, listener) {
          var counter = 0, eventListener;

          while (counter < eventListeners.length) {
            eventListener = eventListeners[counter];

            if (eventListener.object == this && eventListener.type === type && eventListener.listener == listener) { /* jshint ignore:line */

              if (type !== 'DOMContentLoaded') {
                this.detachEvent('on' + type, Canadarm.watch(eventListener.wrapper));
              }

              eventListeners.splice(counter, 1);
              break;
            }
            ++counter;
          }
        };

        Element.prototype.addEventListener = addEventListener;
        Element.prototype.removeEventListener = removeEventListener;
      }
    }
  }
}

/**
 * Internal method used to setup automatic event error logging
 * when a consumer has opted in via settings.
 */
Canadarm.setUpEventListening = setUpEventListening;
