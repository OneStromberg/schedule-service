const app = require('express')();
const server = require('http').Server(app);

const Scheduler = require('./scheduler');
const Emiter = require('./emiter');
const Queue = require('./queue');
const Task = require('./task');
const Hibernation = require('./hibernation');

process.on('uncaughtException', (error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason) => {
  console.error(`unhandledRejection ${reason}`);
});

let data;
try {
  data = Hibernation.load();
} catch(e) {
  console.error('Hibernation.load', e);
}

let tasks = null;
if (data) {
  try {
    tasks = Task.parse(data);
  } catch(e) {
    console.error('Task.parse', e);
  }
}
let emiter, queue, scheduler;
try {
  emiter = new Emiter(server)
  queue = new Queue(tasks || [], Task.compare, Hibernation.hibernate);
  scheduler = new Scheduler(queue, emiter);
} catch(e) {
  console.error('Initialization error', e);
}

try {
  scheduler.start();
} catch(e) {
  console.error('Scheduler.start error', e);
}

app.get('/', (req, res) => {
  if (queue) {
    try {
      return res.send(`There are ${queue.size()} tasks in the queue`).end();
    } catch(e) {
      return res.send('something goes wrong: ' + e, 520);
    }
  }

  return res.send('queue is missing', 520);
})

app.post('/task', (req, res) => {
  const { client, date, task } = req.query;
  if (!client || !date || !task) {
    return res.send('missing or wrong required param', 400).end();
  }
  try {
    scheduler.addTask(client, date, task);
  } catch(e) {
    return res.send('something goes wrong: ' + e, 520).end();
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8091;

server.listen(PORT, () => {
  console.warn(`Server running on port: ${PORT}`);
});