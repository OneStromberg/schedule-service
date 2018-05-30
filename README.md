Schedule Service
=
To add new task client should:

1. Connect to the server with `web-sockets` such as [socket.io](https://socket.io/), pass **client** by query and listen to **task** channel

2. call POST request with query params:
- <`Integer`> client
- <`Integer`> date in seconds<b>!</b>
- <`String`> task

## Warning
To work correctly both `client` at POST-request and `client` at socket-connection`s query should be the equal!

---
```javascript
const ServerURI = 'https://stro-schedule-service.herokuapp.com'
const ClientId = 149521;
const TaskName = 'Aleshka';
const TaskDate = Date.now() / 1000 + 100;//Run task in 100 seconds after call;

const Tasks = {
  [TaskName]: () => console.log('Aleshka works');
};

const socket = io(`${ServerURI}`, { query: { client:ClientId }});

socket.on('connect', () => {
  socket.on('task', (taskId) => {
    Tasks[taskId]();
  });
});

axios.post(`${ServerURI}?client=${ClientId}&date=${TaskDate}&task=${TaskName}`);
```

---
useful tools
===
- [socket client simulation](http://amritb.github.io/socketio-client-tool/)
- curl -X POST 'https://stro-schedule-service.herokuapp.com/task?client=1&date=1527675196&task=12'

