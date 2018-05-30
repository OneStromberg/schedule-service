class Task {
  static parse(data) {
    return JSON.parse(data, function (key, value) {
      if (key) {
        return new Task(...value.split(','));
      }
      return value;
    });
  }
  static compare(a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
  constructor(clientId = null, date = null, taskId = null) {
    if (clientId == null || date == null || taskId == null) {
      throw new Error('missing required field(s)');
    }
    if (date < (Date.now() / 1000)) {
      throw new Error('task should be undertaken in the future');
    }
    this.clientId = clientId;
    this.date = date;
    this.taskId = taskId;
  }
  toJSON() {
    return `${this.clientId},${this.date},${this.taskId}`;
  }
}

module.exports = Task;