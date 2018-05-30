const app = require('express')();
const server = require('http').Server(app);
const Scheduler = require('./scheduler');
const Emmiter = require('./emmiter');
const Queue = require('./queue');
const Task = require('./task');
const Hibernation = require('./hibernation');

const data = Hibernation.load();
let tasks = null;
if (data) {
  tasks = Task.parse(data);
}

const queue = new Queue(tasks, Task.compare);
const emmiter = new Emmiter(server)
const scheduler = new Scheduler(queue, emmiter);

server.listen(process.env.PORT || 8091);
scheduler.start();

app.post('/task', (req, res) => {
  const { client, date, task } = req.query;
  scheduler.addTask(client, date, task);
  res.send(200);
});