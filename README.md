Schedule Service
=
To add new task client should:
>call POST request with query params:
* <`Integer`> client
* <`Integer`> date in <i>seconds
* <`String`> task
>Connect to the server with `web-sockets` such as [socket.io](https://socket.io/), pass **clientId** to it and listen to **task** channel
---
```javascript
const ServerURI = 'https://stro-schedule-service.herokuapp.com'
const ClientId = 149521;
const TaskName = 'Aleshka';
const TaskDate = Date.now() / 1000 + 100;//Run task in 100 seconds after call;

const Tasks = {
  [TaskName]: () => console.log('Aleshka works');
};

const socket = io(`${ServerURI}?clientId=${ClientId}`);

socket.on('connect', () => {
  socket.on('task', (taskId) => {
    Tasks[taskId]();
  });
});

axios.post(`${ServerURI}?client=${ClientId}&date=${TaskDate}&task=${TaskName}`);
```

