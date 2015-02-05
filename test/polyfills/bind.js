/*
 * PhantomJS doesn't provide an implementation of bind - this polyfill from:
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
 *
 * is an acceptable workaround when running tests.
 */

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    'use strict';
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      FNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}
