'use strict';

const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

const IpRange = require('../../lib/IpRange');

describe('GIVEN the IpRange object is created with a valid IPv4 subnet', () => {

  let callback;

  beforeEach(() => {
    callback = chai.spy();
  });

  it('WHEN specifying the starting ip, but the provided IP does not match the subnet, THEN an error should be thrown', () => {
    let e;
    try {
      new IpRange('255.255.255.0/24').startWith('255.255.0.1');
    } catch (err) {
      e = err;
    }
    expect(e).not.to.be.undefined;
  });

  it('WHEN specifying the starting ip, but the provided IP is not a valid IP at all, THEN an error should be thrown', () => {
    let e;
    try {
      new IpRange('255.255.255.0/24').startWith('255.255.255.256');
    } catch (err) {
      e = err;
    }
    expect(e).not.to.be.undefined;
  });

  it('WHEN triggering the iterate() withouth any callback, THEN all IPs within the subnet are properly processed', () => {
    for (let {ip, progress} of new IpRange('255.255.255.0/24').iterate()) {
      callback(ip, progress);
    }

    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0', {
      allIps: 256,
      iteration: 1,
      completionPercentage: 0
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

  it('WHEN triggering the iterate() with a callback, THEN all IPs within the subnet are properly processed', () => {
    new IpRange('255.255.255.0/24').iterate(callback);
    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0', {
      allIps: 256,
      iteration: 1,
      completionPercentage: 0
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

  it('WHEN triggering the iterate() with a callback of a wrong type, THEN all an error should be throw', () => {
    let e;
    try {
      new IpRange('255.255.255.0/24').iterate('abcd');
    } catch (err) {
      e = err;
    }
    expect(e).not.to.be.undefined;
  });

  it('WHEN triggering the iterateAsync() with a callback of a wrong type, THEN all an error should be throw', async () => {
    let e;
    try {
      await new IpRange('255.255.255.0/24').iterateAsync('abcd');
    } catch (err) {
      e = err;
    }
    expect(e).not.to.be.undefined;
  });


  it('WHEN specifying the starting ip within the subnet range and triggering the iterate(), THEN all IPs within the subnet are properly processed', () => {
    new IpRange('255.255.255.0/24').startWith('255.255.255.1').iterate(callback);
    expect(callback).to.have.been.called.exactly(255);
    expect(callback).to.have.been.called.with('255.255.255.1', {
      allIps: 256,
      iteration: 2,
      completionPercentage: 1
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

  it('WHEN triggering the iterateAsync() with a callback, THEN all IPs within the subnet are properly processed', async () => {
    await new IpRange('255.255.255.0/24').iterateAsync(async (ip, data) => {
      callback(ip, data);
    });
    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0', {
      allIps: 256,
      iteration: 1,
      completionPercentage: 0
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

  it('WHEN triggering the iterateAsync() without any callback, THEN all IPs within the subnet are properly processed', async () => {
    for (let {ip, progress} of await new IpRange('255.255.255.0/24').iterateAsync()) {
      callback(ip, progress);
    }
    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0', {
      allIps: 256,
      iteration: 1,
      completionPercentage: 0
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

  it('WHEN specifying the starting ip within the subnet range and triggering the iterateAsync(), THEN all IPs within the subnet are properly processed', async () => {
    await new IpRange('255.255.255.0/24').startWith('255.255.255.1').iterateAsync(async (ip, data) => {
      callback(ip, data);
    });
    expect(callback).to.have.been.called.exactly(255);
    expect(callback).to.have.been.called.with('255.255.255.1', {
      allIps: 256,
      iteration: 2,
      completionPercentage: 1
    });
    expect(callback).to.have.been.called.with('255.255.255.255', {
      allIps: 256,
      iteration: 256,
      completionPercentage: 100
    });
  });

});

describe('GIVEN the IpRange object is created with an invalid address', () => {

  it('THEN an error should be thrown', () => {
    let err;
    try {
      new IpRange('');
    } catch(e) {
      err = e;
    }
    expect(err).to.not.be.undefined;
  });

});