/**
 * Contains the log levels available.
 *
 * @namespace level
 * @memberof Canadarm
 *
 * @property FATAL {constant} - App crashed and there was no recovery attempt.
 * @property ERROR {constant} - App crashed and there may have been a recovery attempt.
 * @property WARN {constant}  - App crashed and was recovered.
 * @property INFO {constant}  - Information about something that happened.
 * @property DEBUG {constant} - Used for development testing.
 */
var level = {
  FATAL : 'FATAL',
  ERROR : 'ERROR',
  WARN  : 'WARN',
  INFO  : 'INFO',
  DEBUG : 'DEBUG'
};

Canadarm.level = level;
Canadarm.levelOrder = [
  level.DEBUG,
  level.INFO,
  level.WARN,
  level.ERROR,
  level.FATAL
];

// We may not have index of for Arrays.
// Add it if it does not exist.
// Implementation of the below code borrowed from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

// Ignore code conventions below to keep in tact with reference implementation linked above.
/* jshint ignore:start */
if (typeof Canadarm.levelOrder.indexOf === 'undefined') {
  Canadarm.levelOrder.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
/* jshint ignore:end */
