const { PriorityQueue } = require('buckets-js');
const Hibernation = require('./hibernation');

function hibernate() {
  return new Promise((resolve, reject) => {
    var array = this.toArray();
    if (array && Array.isArray(array)) {
      Hibernation.save(JSON.stringify(array));
      resolve();
    } else {
      reject();
    }
  });
}

class Queue extends PriorityQueue {
  constructor(data, compare) {
    if (!data || !compare) {
      throw new Error('missing required field(s)');
    }
    super(compare);
    if (Array.isArray(data)) {
      data.forEach((item) => this.add(item));
    } else {
      this.add(data);
    }
    this.hibernate = hibernate.bind(this);
  }
}

module.exports = Queue;