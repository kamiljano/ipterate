'use strict';

const subnetIpV4 = require('./SubnetIpV4');

module.exports = class {
  constructor(subnet) {
    if (!subnetIpV4.isValid(subnet)) {
      throw new Error('The provided string is not a valid subnet representation');
    }
    this.subnet = new subnetIpV4.SubnetIpV4(subnet);
  }

  iterate(callback) {
    let lastIp;
    while (lastIp = this.subnet.nextIp(lastIp)) {
      callback(lastIp);
    }
  }

  async iterateAsync(callback) {
    let lastIp;
    while (lastIp = this.subnet.nextIp(lastIp)) {
      await callback(lastIp);
    }
  }
};