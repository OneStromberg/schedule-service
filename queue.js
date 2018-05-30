const { PriorityQueue } = require('buckets-js');

function toJSON(){
  return this.toArray();
}
class Queue extends PriorityQueue {
  constructor(data, compare, hibernate) {
    if (!data || !compare) {
      throw new Error('missing required field(s)');
    }
    super(compare);
    if (Array.isArray(data)) {
      data.forEach((item) => this.add(item));
    } else {
      this.add(data);
    }
    this.toJSON = toJSON.bind(this);
    this.hibernate = hibernate ? hibernate.bind(this) : () => {};
  }
}

module.exports = Queue;