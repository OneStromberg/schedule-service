const Task = require('./task');

function shouldExecute(task) {
  return task.date <= (Date.now() / 1000);
}

var intervalId = null;

class Scheduler {
  constructor(queue, emmiter){
    this.queue = queue;
    this.dirty = true;
    this.emmiter = emmiter;
    this.currentTask = queue.peek();

    this.addTask = this.addTask.bind(this);
    this.tick = this.tick.bind(this);
  }
  tick(){
    if (this.dirty) {
      this.currentTask = this.queue.peek();
      if (this.currentTask) {
        this.dirty = false;
      }
    }

    if (this.currentTask) {
      if (shouldExecute(this.currentTask)){
        this.emmiter.emit(this.currentTask);
        this.takeNextTask();
      }
    }
  }
  takeNextTask(){
    this.queue.dequeue();
    this.queueChanged();
  }
  addTask(clientId, date, taskId){
    if (clientId && date && taskId) {
      this.queue.add(new Task(clientId, date, taskId));
      this.queueChanged();
    }
  }
  queueChanged(){
    this.dirty = true;
    this.queue.hibernate();
  }
  start(){
    intervalId = setInterval(this.tick, 1000);
  }
  stop(){
    clearInterval(intervalId);
  }
}

module.exports = Scheduler;