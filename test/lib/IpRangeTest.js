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

  it('WHEN triggering the iterate(), THEN all IPs within the subnet are properly processed', () => {
    new IpRange('255.255.255.0/24').iterate(callback);
    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0');
    expect(callback).to.have.been.called.with('255.255.255.255');
  });

  it('WHEN triggering the iterateAsync(), THEN all IPs within the subnet are properly processed', async () => {
    await new IpRange('255.255.255.0/24').iterateAsync(async ip => {
      callback(ip);
    });
    expect(callback).to.have.been.called.exactly(256);
    expect(callback).to.have.been.called.with('255.255.255.0');
    expect(callback).to.have.been.called.with('255.255.255.255');
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