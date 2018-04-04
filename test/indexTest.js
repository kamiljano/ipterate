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

  it('WHEN the user requests to iterate through 10.0.1.0/29 subnet, THEN he succeeds', () => {
    ipterate.range('10.0.1.0/29').iterate(callback);
    expect(callback).to.have.been.called.exactly(8);
  });

});