const app = require('express')();
const server = require('http').Server(app);

const Scheduler = require('./scheduler');
const Emiter = require('./emiter');
const Queue = require('./queue');
const Task = require('./task');
const Hibernation = require('./hibernation');

const data = Hibernation.load();
let tasks = null;
if (data) {
  tasks = Task.parse(data);
}

const queue = new Queue(tasks || [], Task.compare, Hibernation.hibernate);
const emiter = new Emiter(server)
const scheduler = new Scheduler(queue, emiter);

server.listen(process.env.PORT || 8091);
scheduler.start();

app.get('/', (req, res) => {
  res.send(`There are ${queue.size()} tasks in the queue`).end();
})

app.post('/task', (req, res) => {
  const { client, date, task } = req.query;
  if (!client || !date || !task) {
    return res.send('missing or wrong required param', 503);
  }
  scheduler.addTask(client, date, task);
  res.sendStatus(200);
});