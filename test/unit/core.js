var assert = require('assert'),
  Canadarm = require('../../build/canadarm.min').Canadarm,
  sinon = require('sinon'),
  errorObject = new Error(),
  generateError = function(){throw errorObject;};

describe('Canadarm', function (){
  describe('#addAppender', function(){

    it('uses the added appender when an error occurs', function(){
      var appenderSpy = sinon.spy();

      Canadarm.addAppender(appenderSpy);

      Canadarm.attempt(generateError);

      assert(appenderSpy.calledOnce);
      assert(appenderSpy.calledWith(
        Canadarm.level.ERROR,
        errorObject,
        errorObject.message,
        undefined
      ));
    });
  });

  describe('#addHandler', function(){

    it('uses the added handler when an error occurs', function(){
      var handlerSpy = sinon.spy();

      Canadarm.addHandler(handlerSpy);

      Canadarm.attempt(generateError);

      assert(handlerSpy.calledOnce);
      assert(handlerSpy.calledWith({}));
    });
  });

  describe('#debug', function() {
    it('generates an error at the DEBUG level', function () {
      var debugAppenderSpy = sinon.spy(),
        message = 'fake message',
        exception = errorObject,
        extraData = {fake: 'thing'};

      Canadarm.addAppender(debugAppenderSpy);

      Canadarm.debug(message, exception, extraData);

      assert(debugAppenderSpy.calledOnce);
      assert(debugAppenderSpy.calledWith(
        Canadarm.level.DEBUG,
        errorObject,
        message,
        extraData
      ));
    });
  });

  describe('#info', function() {
    it('generates an error at the INFO level', function () {
      var infoAppenderSpy = sinon.spy(),
        message = 'fake info message',
        exception = errorObject,
        extraData = {fake: 'datas'};

      Canadarm.addAppender(infoAppenderSpy);

      Canadarm.info(message, exception, extraData);

      assert(infoAppenderSpy.calledOnce);
      assert(infoAppenderSpy.calledWith(
        Canadarm.level.INFO,
        errorObject,
        message,
        extraData
      ));
    });
  });

  describe('#warn', function() {
    it('generates an error at the WARN level', function () {
      var warnAppenderSpy = sinon.spy(),
        message = 'fake warn message',
        exception = errorObject,
        extraData = {fake_key: 'fake key thing'};

      Canadarm.addAppender(warnAppenderSpy);

      Canadarm.warn(message, exception, extraData);

      assert(warnAppenderSpy.calledOnce);
      assert(warnAppenderSpy.calledWith(
        Canadarm.level.WARN,
        errorObject,
        message,
        extraData
      ));
    });
  });

  describe('#error', function() {
    it('generates an error at the ERROR level', function () {
      var errorAppenderSpy = sinon.spy(),
        message = 'fake error message',
        exception = errorObject,
        extraData = {fake_stuff: 'my added data'};

      Canadarm.addAppender(errorAppenderSpy);

      Canadarm.error(message, exception, extraData);

      assert(errorAppenderSpy.calledOnce);
      assert(errorAppenderSpy.calledWith(
        Canadarm.level.ERROR,
        errorObject,
        message,
        extraData
      ));
    });
  });

  describe('#fatal', function() {
    it('generates an error at the FATAL level', function () {
      var fatalAppenderSpy = sinon.spy(),
        message = 'fake fatal message',
        exception = errorObject,
        extraData = {not_real: 'data in here'};

      Canadarm.addAppender(fatalAppenderSpy);

      Canadarm.fatal(message, exception, extraData);

      assert(fatalAppenderSpy.calledOnce);
      assert(fatalAppenderSpy.calledWith(
        Canadarm.level.FATAL,
        errorObject,
        message,
        extraData
      ));
    });
  });
});