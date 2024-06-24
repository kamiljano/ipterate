import { ipv6ToNumber, toIPv6 } from "toip";

const max128BitInteger = BigInt("340282366920938463463374607431768211455");
const bigZero = BigInt(0);

export type IpV6Cidr = string;

export interface IpV6Range {
  from?: bigint | string;
  to?: bigint | string;
}

export type IpV6IterationOptions = IpV6Cidr | IpV6Range;

interface IpV6NumberRange {
  from: bigint;
  to: bigint;
}

export interface IpV6Params {
  short: boolean;
}

const fromIPv6Cidr = (cidr: string): IpV6NumberRange => {
  const [ip, mask] = cidr.split("/");
  const maskNumber = BigInt(parseInt(mask, 10));
  const maskValue = (BigInt(1) << BigInt(BigInt(128) - maskNumber)) - BigInt(1);
  const ipNumber = ipv6ToNumber(ip);

  return {
    from: ipNumber & ~maskValue,
    to: ipNumber | maskValue,
  };
};

const prepareIpV6 = (
  ip: bigint | string | undefined,
  defaultValue: bigint,
): bigint => {
  if (typeof ip === "undefined") {
    return defaultValue;
  }
  if (typeof ip === "bigint") {
    return ip;
  }
  return ipv6ToNumber(ip);
};

const getIpV6Range = (opts: IpV6IterationOptions): IpV6NumberRange => {
  if (typeof opts === "string") {
    return fromIPv6Cidr(opts);
  }

  const result = {
    from: prepareIpV6(opts.from, bigZero),
    to: prepareIpV6(opts.to, max128BitInteger),
  };

  if (result.from > result.to) {
    throw new Error('"from" parameter must not be greater than "to"');
  }

  return result;
};

export function* iterateIpV6Addresses(
  opts: IpV6IterationOptions,
  params?: IpV6Params,
) {
  const { from, to } = getIpV6Range(opts);
  const shortRepresentation = params?.short ?? true;

  for (let i = from; i <= to; i++) {
    yield toIPv6(i, shortRepresentation);
  }
}
