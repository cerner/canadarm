/* global Canadarm: true */

var assert = require('assert'),
  Canadarm = require('../../../build/canadarm.min'),
  sinon = require('sinon');

describe('Canadarm', function (){
  describe('consoleLogHandler', function (){
    var consoleLogSpy = sinon.spy(console, 'error');

    afterEach(function() {
      consoleLogSpy.reset();
    });

    it('logs the attributes expected to the console with an = separator', function (){
      var fakeLog = {one: 'one', two: 'two', msg: 'msg'};

      Canadarm.Handler.consoleLogHandler(fakeLog);

      assert(consoleLogSpy.calledOnce);
      assert(consoleLogSpy.calledWith(fakeLog.msg, fakeLog));
    });

    it('logs the attributes expected when the key "msg" is undefined', function() {
      var fakeLog = {one: 'one', two: 'two'};

      Canadarm.Handler.consoleLogHandler(fakeLog);

      assert(consoleLogSpy.calledOnce);
      assert(consoleLogSpy.calledWith(fakeLog));
    });
  });
});