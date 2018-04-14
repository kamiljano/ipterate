'use strict';

const subnetIpV4 = require('./SubnetIpV4');

class IpIterator {

  constructor(range) {
    this.range = range;
  }

  [Symbol.iterator]() {
    let firstIteration = true;
    let lastIp;
    return {
      next: () => {
        if (firstIteration) {
          lastIp = this.range.startingIp || this.range.subnet.nextIp(lastIp);
          firstIteration = false;
        } else {
          lastIp = this.range.subnet.nextIp(lastIp);
        }
        return {
          value: {
            ip: lastIp,
            progress: lastIp === null ? undefined : this.range.subnet.buildProgressData(lastIp)
          },
          done: lastIp == null
        };
      }
    }
  }

}


class IpRange {
  constructor(subnet) {
    if (!subnetIpV4.isValid(subnet)) {
      throw new Error('The provided string is not a valid subnet representation');
    }
    this.subnet = new subnetIpV4.SubnetIpV4(subnet);
  }

  startWith(startingIp) {
    if (!this.subnet.isWithinSubnet(startingIp)) {
      throw new Error('The provided IP address does not match the subnet');
    }
    this.startingIp = startingIp;
    return this;
  }

  iterate(callback) {
    if (typeof callback === 'undefined') {
      return new IpIterator(this);
    }
    if (typeof callback !== 'function') {
      throw new Error('The provided callback has to be a function');
    }
    const iterator = new IpIterator(this);
    for (let {ip, progress} of iterator) {
      callback(ip, progress);
    }
  }

  async iterateAsync(callback) {
    if (typeof callback === 'undefined') {
      return new IpIterator(this);
    }
    if (typeof callback !== 'function') {
      throw new Error('The provided callback has to be a function');
    }
    const iterator = new IpIterator(this);
    for (let {ip, progress} of iterator) {
      await callback(ip, progress);
    }
  }
}

module.exports = IpRange;