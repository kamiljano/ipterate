'use strict';

const IpRange = require('./lib/IpRange');

module.exports = {
  range: subnet => new IpRange(subnet)
};