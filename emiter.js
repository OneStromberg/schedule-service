class Emiter {
  constructor(server) {
    this.io = require('socket.io')(server);
    this.emit = this.emit.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.handshake = this.handshake.bind(this);

    this.io.use(this.handshake);
  }
  handshake(socket, next){
    var { client } = socket.handshake.query;
    if (client) {
      socket.on('disconnect', () => this.onDisconnect(socket, client));
      socket.join(client);
      next();
    }
  }
  onDisconnect(socket, client){
    socket.leave(client);
  }
  emit({clientId, taskId}){
    this.io.to(clientId).emit('task', taskId);
  }
}

module.exports = Emiter;