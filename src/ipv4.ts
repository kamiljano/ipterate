import { toIPv4, ipv4ToNumber } from "toip";

export const max32BitInteger = 4294967295;

export interface IpV4Range {
  /**
   * The starting IP address (inclusive)
   *
   * @default 0.0.0.0
   */
  from?: number | string;

  /**
   * The final IP address (inclusive)
   *
   * @default 255.255.255.255
   */
  to?: number | string;
}

export interface NumberRange {
  from: number;
  to: number;
}

export type IpV4Cidr = string;

export type IpV4IterationOptions = IpV4Range | IpV4Cidr;

const prepareIpV4 = (
  ip: number | string | undefined,
  defaultValue: number,
): number => {
  if (typeof ip === "undefined") {
    return defaultValue;
  }
  if (typeof ip === "number") {
    return ip;
  }
  return ipv4ToNumber(ip);
};

const fromIPv4Cidr = (cidr: string): NumberRange => {
  const [ip, mask] = cidr.split("/");
  const maskNumber = parseInt(mask, 10);
  const maskValue = (1 << (32 - maskNumber)) - 1;
  const ipNumber = ipv4ToNumber(ip);

  return {
    from: ipNumber & ~maskValue,
    to: ipNumber | maskValue,
  };
};

/**
 * @internal This function is exported only for the sake of maintaining the backward compatibility. Don't call it directly
 */
export const getIpV4Range = (opts: IpV4IterationOptions): NumberRange => {
  if (typeof opts === "string") {
    return fromIPv4Cidr(opts);
  }

  const result = {
    from: prepareIpV4(opts.from, 0),
    to: prepareIpV4(opts.to, max32BitInteger),
  };

  if (result.from > result.to) {
    throw new Error('"from" parameter must not be greater than "to"');
  }

  return result;
};

/**
 * Iterates over all IPv4 addresses defined by the range.
 * If the range is not specified, it will iterate over all IPv4 addresses.
 * @param opts - The CIDR notation like 0.0.0.0/0, or an object like {from: '0.0.0.0', to: '255.255.255.255'} or {from: 0, to: 4294967295}
 */
export function* iterateIpV4Addresses(
  opts: IpV4IterationOptions = { from: 0, to: max32BitInteger },
) {
  const { from, to } = getIpV4Range(opts);
  for (let i = from; i <= to; i++) {
    yield toIPv4(i);
  }
}
