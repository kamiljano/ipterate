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
    expectError(() => new SubnetIpV4('255.0.0.1/33'));
  });

  it('WHEN the mask is not applicable for the specified ip, THEN an error should be thrown', () => {
    expectError(() => new SubnetIpV4('255.0.0.1/0'));
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

  describe('WHEN the string is a valid subnet identifier AND the buildProgressData() is called', () => {

    it('with a valid IP, but one that does not match the subnet, THEN an error is thrown', () => {
      const subnet = new SubnetIpV4('255.255.255.0/24');
      expectError(() => subnet.buildProgressData('0.0.0.0'));
    });

    it('with a valid IP that matches the subnet, THEN a valid number of all IPs is returned', () => {
      const subnet = new SubnetIpV4('255.255.255.0/24');
      expect(subnet.buildProgressData('255.255.255.0').allIps).to.equal(256);
    });

    it('with a valid max IP that matches the subnet, THEN a valid number of all IPs is returned', () => {
      const subnet = new SubnetIpV4('0.0.0.0/0');
      expect(subnet.buildProgressData('255.255.255.255').allIps).to.equal(Math.pow(2, 32));
      expect(subnet.buildProgressData('255.255.255.255').iteration).to.equal(Math.pow(2, 32));
    });

    it('with a valid IP that matches the subnet, THEN a valid index is returned', () => {
      const subnet = new SubnetIpV4('255.255.0.0/16');
      expect(subnet.buildProgressData('255.255.1.0').iteration).to.equal(257);
    });

    it('with a valid IP that matches the subnet, THEN a valid completion percentage is returned', () => {
      const subnet = new SubnetIpV4('255.255.255.0/24');
      expect(subnet.buildProgressData('255.255.255.128').completionPercentage).to.equal(50);
    });

  });

  describe('WHEN the string is a valid subnet identifier AND the isWithingSubnet() is called', () => {

    it('with a valid ip string that matches the subnet, THEN true is returned', () => {
      expect(new SubnetIpV4('0.0.0.0/0').isWithinSubnet('1.1.1.1')).to.equal(true);
    });

    it('with a valid ip string that does not match the subnet, THEN false is returned', () => {
      expect(new SubnetIpV4('255.255.255.0/24').isWithinSubnet('1.1.1.1')).to.equal(false);
    });

    it('with a valid ip array that matches the subnet, THEN true is returned', () => {
      expect(new SubnetIpV4('0.0.0.0/0').isWithinSubnet([1, 1, 1, 1])).to.equal(true);
    });

    it('with a valid ip array that does not match the subnet, THEN false is returned', () => {
      expect(new SubnetIpV4('255.255.255.0/24').isWithinSubnet([1, 1, 1, 1])).to.equal(false);
    });

    it('with an invalid data type, THEN false is returned', () => {
      expect(new SubnetIpV4('255.255.255.0/24').isWithinSubnet({})).to.equal(false);
    });

    it('with an invalid string, THEN false is returned', () => {
      expect(new SubnetIpV4('255.255.255.0/24').isWithinSubnet('abcd')).to.equal(false);
    });
  })
});