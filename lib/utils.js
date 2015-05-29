/**
 * Fixes URI component encoding. All parameters to log are passed first
 * to this function.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent}
 *
 * @method fixedEncodeURIComponent
 *
 * @param {string} str - The string to encode
 */
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

Canadarm.utils.fixedEncodeURIComponent = fixedEncodeURIComponent;
