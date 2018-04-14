'use strict';

const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

const ipterate = require('../index');

describe('GIVEN an ipterate user', () => {

  let callback;

  beforeEach(() => {
    callback = chai.spy();
  });

  it('WHEN the user requests to iterate through 10.0.1.0/29 subnet with a callback method, THEN he succeeds', () => {
    ipterate.range('10.0.1.0/29').iterate(callback);
    expect(callback).to.have.been.called.exactly(8);
  });

  it('WHEN the user requests to iterate through 10.0.1.0/29 subnet with a for..of loop, THEN he succeeds', () => {
    for (let {ip} of ipterate.range('10.0.1.0/29').iterate()) {
      callback(ip);
    }
    expect(callback).to.have.been.called.exactly(8);
  });

});