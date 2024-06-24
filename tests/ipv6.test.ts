import { iterateIpV6Addresses } from "../src/ipv6";

describe("iterateIpV6Addresses", () => {
  test("should iterate over all IPv6 addresses defined by the range as numbers", () => {
    const result: string[] = [];

    for (const ip of iterateIpV6Addresses({ from: BigInt(0), to: BigInt(2) })) {
      result.push(ip);
    }

    expect(result).toEqual(["::", "::1", "::2"]);
  });

  test("should iterate over all IPv6 addresses defined by the range as IP addresses in short format", () => {
    const result: string[] = [];

    for (const ip of iterateIpV6Addresses({ from: "::0", to: "::2" })) {
      result.push(ip);
    }

    expect(result).toEqual(["::", "::1", "::2"]);
  });

  test("should iterate over all IPv6 addresses defined by the range as IP addresses in short format", () => {
    const result: string[] = [];

    for (const ip of iterateIpV6Addresses({
      from: "0000:0000:0000:0000:0000:0000:0000:0000",
      to: "0000:0000:0000:0000:0000:0000:0000:0002",
    })) {
      result.push(ip);
    }

    expect(result).toEqual(["::", "::1", "::2"]);
  });

  test("should iterate over all IPv6 addresses defined by the range as IP addresses in full format", () => {
    const result: string[] = [];

    for (const ip of iterateIpV6Addresses(
      {
        from: "0000:0000:0000:0000:0000:0000:0000:0000",
        to: "0000:0000:0000:0000:0000:0000:0000:0002",
      },
      { short: false },
    )) {
      result.push(ip);
    }

    expect(result).toEqual([
      "0000:0000:0000:0000:0000:0000:0000:0000",
      "0000:0000:0000:0000:0000:0000:0000:0001",
      "0000:0000:0000:0000:0000:0000:0000:0002",
    ]);
  });

  test("should iterate over all IPv6 addresses defined by the CIDR", () => {
    const result: string[] = [];

    for (const ip of iterateIpV6Addresses("2001:db8::/125")) {
      result.push(ip);
    }

    expect(result).toEqual([
      "::2001:db8::",
      "::2001:db8::1",
      "::2001:db8::2",
      "::2001:db8::3",
      "::2001:db8::4",
      "::2001:db8::5",
      "::2001:db8::6",
      "::2001:db8::7",
    ]);
  });
});
