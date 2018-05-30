var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var Task = require('./../task');
var Queue = require('./../queue');
var Scheduler = require('./../scheduler');
var Hibernation = require('./../hibernation');
let nowSeconds = parseInt(Date.now() / 1000);

describe('Task', function() {
  let task;
  describe('creation task with wrong number of arguments', function() {
    it('should throw error', function() {
      expect(function(){
        new Task(0,1);
      }).to.throw('missing required field(s)');
    });
  });
  describe('creation task with clientId = 0, delay = 1, taskId = 2', function() {
    it('should return instance of Task', function() {
      let clientId = 0;
      let date = nowSeconds + 1;
      let taskId = 2;
      expect(task = new Task(clientId, date, taskId)).to.be.an.instanceof(Task);
      assert.equal(task.clientId, clientId);
      assert.equal(task.date, date);
      assert.equal(task.taskId, taskId);
    });
  });
  describe('custom toJSON method', function() {
    it(`should return "0,${nowSeconds + 1},2"`, function() {
      assert.equal(JSON.stringify(task), `"0,${nowSeconds + 1},2"`);
    });
  });
  describe('parse', function() {
    it('should return Array with 1 instance of Task', function() {
      let parsed;
      expect(parsed = Task.parse(`["10,${nowSeconds + 11},12"]`)).to.be.an.instanceof(Array);
      task = parsed[0];
      expect(task).to.be.an.instanceof(Task);
      assert.equal(task.clientId, 10);
      assert.equal(task.date, nowSeconds + 11);
      assert.equal(task.taskId, 12);
    });
  });
  describe('compare', function() {
    it('function should exists', function() {
      expect(Task.compare).to.be.a('function');
    });
  });
});

describe('Queue', function() {
  let queue;
  let task0 = new Task(0, nowSeconds + 10, 2);
  let task1 = new Task(10, nowSeconds + 1, 12);
  let task2 = new Task(101, nowSeconds + 100, 102);
  describe('create Queue with wrong arguments', function() {
    it('should throw error', function() {
      expect(function(){
        new Queue();
      }).to.throw('missing required field(s)');
    });
  });
  describe('create Queue with 3 tasts and Task.compare function', function() {
    it('should return instance', function() {
      expect(() => queue = new Queue([task0, task1, task2], Task.compare)).to.not.throw();
      expect(queue.size()).to.be.equal(3);
    });
    it('the closest task should be undertaken should be first in the queue', function() {
      expect(queue.peek()).to.be.equal(task1);
    });
  });
  describe('hibernate', function() {
    it('function shouldn`t throw error', function() {
      expect(queue.hibernate).to.be.a('function');
      expect(() => queue.hibernate()).to.not.throw();
    });
  });
});

describe('Scheduler', function() {
  let scheduler;
  let task0 = new Task(0, nowSeconds + 999, 2);
  let task1 = new Task(10, nowSeconds + 1, 12);
  let task2 = new Task(101, nowSeconds + 1000, 102);

  let hibernate = (data) => data;
  let queue = new Queue([task0, task1, task2], Task.compare, hibernate);
  let emiter = { emit: (data) => data };
  describe('create Scheduler with wrong arguments', function() {
    it('should throw error', function() {
      expect(function(){
        new Scheduler();
      }).to.throw('missing required field(s)');
    });
  });
  describe('create Scheduler with queue and mocked emiter', function() {
    it('should return instanceof Scheduler', function() {
      expect(scheduler = new Scheduler(queue, emiter)).to.be.instanceof(Scheduler);
    });
  });
  describe('starting scheduling', function(){
    it('start function exists', () => {
      expect(scheduler.start).to.be.a('function');
    });
    it('waiting for emiting task in 1 second', function(done) {
      expect(() => scheduler = new Scheduler(queue, { emit: (data) => {
        if (task1 == data) {
          done();
        } else {
          done(data);
        }
      }})).to.not.throw();
      expect(() => scheduler.start()).to.not.throw();
    });
    it('next task', () => {
      assert.equal(queue.peek(), task0);
    });
    it('stop function exists and works', () => {
      expect(() => scheduler.stop()).to.not.throw();
    });
  });
});
