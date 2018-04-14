'use strict';

const SUBNET_V4_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;
const IP_V4_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

const flatten = arr => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

const toBinaryArray = ip => {
  const binaryParts = ip.map(part => part.toString(2).split().map(char => char * 1));
  return flatten(binaryParts).map(num => {
    let result = '' + num;
    while (result.length < 8) {
      result = '0' + result;
    }
    return result;
  }).join('').split('').map(bit => bit * 1);
};

const applicableMask = (ip, mask) => {
  const binaryIp = toBinaryArray(ip);
  for (let i = mask; i < 32; i++) {
    if (binaryIp[i] !== 0) {
      return false;
    }
  }
  return true;
};

const validIp = ip => {
  let arr;
  if (typeof ip === 'string') {
    const exp = ip.match(IP_V4_REGEX);
    if (!exp) {
      return false;
    }
    arr = [exp[1] * 1, exp[2] * 1, exp[3] * 1, exp[4] * 1];
  } else if (Array.isArray(ip)) {
    arr = ip;
  } else {
    return false;
  }

  return !arr.some(part => part >= 256);
};

const parse = subnet => {
  const exp = subnet.match(SUBNET_V4_REGEX);
  if (typeof subnet !== 'string' || !exp) {
    throw new Error(`The provided subnet is in a wrong format. It should be A.B.C.D/E, but was ${subnet}`);
  }
  const ip = [exp[1] * 1, exp[2] * 1, exp[3] * 1, exp[4] * 1];
  const mask = exp[5] * 1;
  if (ip.some(part => part >= 256)) {
    throw new Error(`The IP address cannot specify number grater than 255`);
  }
  if (mask > 32) {
    throw new Error('The IPv4 address contains only 32 bits. Your mask cannot contain more than this');
  }
  if (!applicableMask(ip, mask)) {
    throw new Error('The mask cannot be applied to the provided IP');
  }
  return {ip, mask};
};

const isValid = subnet => {
  try {
    parse(subnet);
  } catch (e) {
    return false;
  }
  return true;
};

const firstNBitsMatch = (ipA, ipB, n) => {
  ipA = toBinaryArray(ipA);
  ipB = toBinaryArray(ipB);
  for (let i = 0; i < n; i++) {
    if (ipA[i] !== ipB[i]) {
      return false;
    }
  }
  return true;
};

const incrementIp = (ip, index = 3) => {
  if (index < 0) {
    return null;
  }
  const newIp = ip.map(part => part);
  if (newIp[index] === 255) {
    newIp[index] = 0;
    return incrementIp(newIp, index - 1);
  } else {
    newIp[index] = newIp[index] + 1;
  }
  return newIp;
};

const ipStringToArray = ipStr => ipStr.split('.').map(part => part * 1);

const calculateIteration = (mask, ip) => {
  const binaryIp = toBinaryArray(ip);
  const binaryIteration = binaryIp.slice(mask, binaryIp.length);
  return parseInt(binaryIteration.join(''), 2) + 1;
};

class SubnetIpV4 {
  constructor(subnet) {
    const data = parse(subnet);
    this.ip = data.ip;
    this.mask = data.mask
  }

  nextIp(lastIp) {
    if(!lastIp) {
      return this.ip.join('.');
    }
    const incrementedIp = incrementIp(ipStringToArray(lastIp));
    if (!incrementedIp || !this.isWithinSubnet(incrementedIp)) {
      return null;
    }
    return incrementedIp.join('.');
  }

  buildProgressData(iteratedIp) {
    if (!this.isWithinSubnet(iteratedIp)) {
      throw new Error('The provided IP address does not match the subnet');
    }
    const ipArray = ipStringToArray(iteratedIp);
    const allIps = Math.pow(2, 32 - this.mask);
    const iteration = calculateIteration(this.mask, ipArray);
    const completionPercentage = Math.round(iteration / (allIps / 100));
    return {allIps, iteration, completionPercentage};
  }

  isWithinSubnet(ip) {
    if (!validIp(ip)) {
      return false;
    }
    let ipArray;
    if (typeof ip === 'string') {
      ipArray = ipStringToArray(ip);
    } else if (Array.isArray(ip)) {
      ipArray = ip;
    }
    return firstNBitsMatch(ipArray, this.ip, this.mask);
  }
}

module.exports = {
  isValid,
  SubnetIpV4
};