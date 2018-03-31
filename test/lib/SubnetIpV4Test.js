'use strict';

const expect = require('chai').expect;
const SubnetIpV4 = require('../../lib/SubnetIpV4').SubnetIpV4;

describe('GIVEN a string', () => {

  const expectError = runnable => {
    let error;
    try {
      runnable()
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.undefined;
  };

  it('WHEN the string is empty, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4(''));
  });

  it('WHEN the string does not represent an IP subnet, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4('asdf'));
  });

  it('WHEN the string does represent an IP subnet, THEN the object should be properly initialized', () => {
    const subnet = new SubnetIpV4('255.255.255.255/32');
    expect(subnet.ip).to.deep.equal([255, 255, 255, 255]);
    expect(subnet.mask).to.equal(32);
  });

  it('WHEN the string contains too high numbers in the IP address, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4('256.0.0.1/16'));
  });

  it('WHEN the string contains too high number as the IP mask, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4('256.0.0.1/33'));
  });

  it('WHEN the string contains the mask does not match the IP address, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4('255.255.0.0/15'));
  });

  describe('WHEN the string is a valid subnet identifier AND the nextIp() is called', () => {

    it('AND this is the first iteration THEN the IP is the same as the subnet', () => {
      const subnet = new SubnetIpV4('255.255.0.0/16');
      expect(subnet.nextIp()).to.equal('255.255.0.0');
    });

    it('AND this is the second iteration THEN the IP is correctly incremented', () => {
      const subnet = new SubnetIpV4('255.255.0.0/16');
      expect(subnet.nextIp('255.255.0.0')).to.equal('255.255.0.1');
    });

    it('AND this is the last iteration of the last part THEN the IP is correctly incremented', () => {
      const subnet = new SubnetIpV4('255.255.0.0/16');
      expect(subnet.nextIp('255.255.0.255')).to.equal('255.255.1.0');
    });

    it('AND you cannot iterate any more, THEN the result is null', () => {
      const subnet = new SubnetIpV4('255.255.0.0/16');
      expect(subnet.nextIp('255.255.255.255')).to.be.null;
    });

    it('AND you end up incrementing a part that is a part of the mask, THEN the result is null', () => {
      const subnet = new SubnetIpV4('255.255.0.0/24');
      expect(subnet.nextIp('255.255.0.255')).to.be.null;
    });

  });
});