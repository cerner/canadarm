/* global Canadarm: true */

var assert = require('assert'),
  Canadarm = require('../../../build/canadarm.min'),
  sinon = require('sinon');

describe('Canadarm', function (){
  describe('consoleLogHandler', function (){
    it('logs the attributes expected to the console with an = separator', function (){
      var consoleLogSpy = sinon.spy(console, 'error'),
        fakeLog = {one: 'one', two: 'two', msg: 'msg'},
        logValues = '', key;

      Canadarm.Handler.consoleLogHandler(fakeLog);

      assert(consoleLogSpy.calledOnce);
      assert(consoleLogSpy.calledWith(fakeLog.msg, fakeLog));
    });
  });
});
