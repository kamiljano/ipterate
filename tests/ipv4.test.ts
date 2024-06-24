import { iterateIpV4Addresses } from "../src/ipv4";

describe("iterateIpV4Addresses", () => {
  test("should iterate over all IPv4 addresses defined by the range as numbers", () => {
    const result: string[] = [];

    for (const ip of iterateIpV4Addresses({ from: 0, to: 2 })) {
      result.push(ip);
    }

    expect(result).toEqual(["0.0.0.0", "0.0.0.1", "0.0.0.2"]);
  });

  test("should iterate over all IPv4 addresses defined by the range as IP addresses", () => {
    const result: string[] = [];

    for (const ip of iterateIpV4Addresses({ from: "0.0.0.0", to: "0.0.0.2" })) {
      result.push(ip);
    }

    expect(result).toEqual(["0.0.0.0", "0.0.0.1", "0.0.0.2"]);
  });

  test("should iterate over all IPv4 addresses defined by the CIDR", () => {
    const result = [];
    for (const ip of iterateIpV4Addresses("10.0.1.0/29")) {
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
});
