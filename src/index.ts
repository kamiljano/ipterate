import {
  getIpV4Range,
  IpV4Cidr,
  IpV4IterationOptions,
  iterateIpV4Addresses,
  max32BitInteger,
  NumberRange,
} from "./ipv4";
import { IterationProgress } from "./progress";

export * from "toip";

export {
  iterateIpV4Addresses,
  IpV4Range,
  IpV4IterationOptions,
  max32BitInteger,
  IpV4Cidr,
} from "./ipv4";

export * from "./progress";

const getProgress = (range: NumberRange, i: number): IterationProgress => {
  const allIps = range.to - range.from + 1;
  return {
    allIps,
    iteration: i,
    completionPercentage: (i / allIps) * 100,
  };
};

const iterate = (
  opts: IpV4IterationOptions,
  startWith: string | undefined,
  callback?: (ip: string, progress: IterationProgress) => void,
) => {
  if (callback) {
    let i = 0;
    for (const ip of iterateIpV4Addresses(normalizeOptions(opts, startWith))) {
      callback(ip, getProgress(getIpV4Range(opts), i++));
    }
    return;
  }
  return (function* () {
    let i = 0;
    for (const ip of iterateIpV4Addresses(normalizeOptions(opts, startWith))) {
      yield { ip, progress: getProgress(getIpV4Range(opts), i++) };
    }
  })();
};

const normalizeOptions = (
  opts: IpV4IterationOptions,
  startWith: string | undefined,
): IpV4IterationOptions => {
  if (!startWith) {
    return opts;
  }

  return {
    from: startWith,
    to: getIpV4Range(opts).to,
  };
};

const iterateAsync = async (
  opts: IpV4IterationOptions,
  startWith: string | undefined,
  callback?: (ip: string, progress: IterationProgress) => Promise<void>,
) => {
  if (callback) {
    let i = 0;
    for (const ip of iterateIpV4Addresses(normalizeOptions(opts, startWith))) {
      await callback(ip, getProgress(getIpV4Range(opts), i++));
    }
    return;
  }
  return (function* () {
    let i = 0;
    for (const ip of iterateIpV4Addresses(normalizeOptions(opts, startWith))) {
      yield { ip, progress: getProgress(getIpV4Range(opts), i++) };
    }
  })();
};

const _range = (opts: IpV4IterationOptions, startWith?: string) => {
  return {
    startWith(start: string) {
      return _range(opts, start);
    },

    /**
     * @deprecated Use {@link iterateIpV4Addresses} instead
     */
    iterate(callback?: (ip: string, progress: IterationProgress) => void) {
      return iterate(opts, startWith, callback);
    },

    /**
     * @deprecated Use {@link iterateIpV4Addresses} instead
     */
    async iterateAsync(
      callback?: (ip: string, progress: IterationProgress) => Promise<void>,
    ) {
      return iterateAsync(opts, startWith, callback);
    },

    //todo: map()
  };
};

/**
 * Legacy interface for backward compatibility with v1.1.1
 * If the range is not specified, it will iterate over all IPv4 addresses.
 *
 * @param opts - The CIDR notation like 0.0.0.0/0, or an object like {from: '0.0.0.0', to: '255.255.255.255'} or {from: 0, to: 4294967295}
 *
 */
export const range = (
  opts: IpV4IterationOptions = { from: 0, to: max32BitInteger },
) => {
  return _range(opts);
};
