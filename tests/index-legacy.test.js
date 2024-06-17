"use strict";

const ipterate = require("../src/index");

describe("Testing with JS legacy API", () => {
  test("Testing with JS legacy API for the CIDR", () => {
    const result = [];

    ipterate.range("10.0.1.0/29").iterate((ip) => {
      result.push(ip);
    });

    expect(result).toEqual([
      "10.0.1.0",
      "10.0.1.1",
      "10.0.1.2",
      "10.0.1.3",
      "10.0.1.4",
      "10.0.1.5",
      "10.0.1.6",
      "10.0.1.7",
    ]);
  });

  test("Iterator test", () => {
    const result = [];
    for (let { ip } of ipterate.range("10.0.1.0/29").iterate()) {
      result.push(ip);
    }

    expect(result).toEqual([
      "10.0.1.0",
      "10.0.1.1",
      "10.0.1.2",
      "10.0.1.3",
      "10.0.1.4",
      "10.0.1.5",
      "10.0.1.6",
      "10.0.1.7",
    ]);
  });

  test("startWith", () => {
    const result = [];
    for (let { ip } of ipterate
      .range("10.0.1.0/29")
      .startWith("10.0.1.5")
      .iterate()) {
      result.push(ip);
    }

    expect(result).toEqual(["10.0.1.5", "10.0.1.6", "10.0.1.7"]);
  });
});
