class Emiter {
  constructor(server) {
    this.io = require('socket.io')(server);
    this.emit = this.emit.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.handshake = this.handshake.bind(this);

    this.io.use(this.handshake);
  }
  handshake(socket, next){
    var { clientId } = socket.handshake.query;
    if (clientId) {
      socket.on('disconnect', () => this.onDisconnect(socket, clientId));
      socket.join(clientId);
      next();
    }
  }
  onDisconnect(socket, clientId){
    socket.leave(clientId);
  }
  emit({clientId, taskId}){
    this.io.to(clientId).emit('task', taskId);
  }
}

module.exports = Emiter;