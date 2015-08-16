var assert = require('assert'),
  Canadarm = require('../../../build/canadarm.min').Canadarm,
  sinon = require('sinon'),
  errorObject = new Error(),
  generateError = function(){throw errorObject;};

describe('Canadarm', function (){
  var errorSpy = null;

  beforeEach(function(){
    errorSpy = sinon.spy(Canadarm, 'error');
  });

  afterEach(function(){
    errorSpy.restore();
  });

  describe('#attempt', function (){

    it('catches exception of passed function and calls Canadarm.error', function (){
      var attemptSpy = sinon.spy(generateError);

      Canadarm.attempt(attemptSpy);

      assert(errorSpy.calledOnce);
      assert(errorSpy.calledWith(
        errorObject.message,
        errorObject
      ));
      assert(attemptSpy.calledOnce);
    });
  });

  describe('#watch', function(){
    it('wraps passed function in an error handler', function(){
      var spy = sinon.spy(),
        wrappedFunction = Canadarm.watch(spy);

      assert(Canadarm.watch(spy) === wrappedFunction);
      assert(spy.notCalled);
      assert(errorSpy.notCalled);
    });

    it('catches exception of watched function and calls Canadarm.error', function (){
      var watchErrorSpy = sinon.spy(generateError),
        wrappedFunction = Canadarm.watch(watchErrorSpy);

      wrappedFunction();

      assert(Canadarm.watch(watchErrorSpy) === wrappedFunction);
      assert(watchErrorSpy.calledOnce);
      assert(errorSpy.calledOnce);
      assert(errorSpy.calledWith(
        errorObject.message,
        errorObject
      ));
    });
  });
});
