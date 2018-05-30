const { writeFileSync, readFileSync, existsSync } = require('fs');

const StateDir = process.env.HIBERNATE_PATH || "__hibernated__";
const StateFile = process.env.HIBERNATE_FILENAME || 'state.json';
const StatePath = `${StateDir}/${StateFile}`;

class Hibernation {
  static load() {
    if (existsSync(StatePath)) {
      return readFileSync(StatePath, 'utf8');
    }
    return null;
  }
  static save(data) {
    writeFileSync(StatePath, data, 'utf8');
  }
}

module.exports = Hibernation;