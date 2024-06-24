[![Node version](https://img.shields.io/node/v/ipterate.svg?style=flat)](http://nodejs.org/download/)
[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/ipterate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kamiljano/ipterate?targetFile=package.json)
[![https://nodei.co/npm/ipterate.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/ipterate.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ipterate)

# About

IpTerate is a small library that helps you iterate through all available IPs within a specific subnet.

## V2
The tool has now been split into 2 separate libraries: this one and [toip](https://www.npmjs.com/package/toip),
which is responsible for actually doing the conversion between the integers and the IP strings.

`toip` forms the calculation in a far more performant fashion, allowing you to iterate through more IPs faster.

# Installation

```shell
npm install ipterate # if you're using npm 
yarn add ipterate # if you're using yarn
pnpm add ipterate # if you're using pnpm
bun install ipterate # if you're using bun
```

# Usage

1. Iterate over all IPv4s

```typescript
import { iterateIpV4Addresses } from "ipterate";

for (const ip of iterateIpV4Addresses({
  from: '0.0.0.0',
  to: '255.255.255.255',
})) {
  console.log(ip);
}
```

2. Iterate over a specific subnet

```typescript
import { iterateIpV4Addresses } from "ipterate";

for (const ip of iterateIpV4Addresses('10.0.1.0/29')) {
  console.log(ip);
}
```

prints out
```
    10.0.1.0
    10.0.1.1
    10.0.1.2
    10.0.1.3
    10.0.1.4
    10.0.1.5
    10.0.1.6
    10.0.1.7
```

3. Iterate over all IPv6s

```typescript
import { iterateIpV6Addresses } from "ipterate";

for (const ip of iterateIpV6Addresses({ from: "::0", to: "::2" })) {
  console.log(ip);
}
```

4. Iterate over all IPv6s

```typescript
import { iterateIpV6Addresses } from "ipterate";

for (const ip of iterateIpV6Addresses({ from: "::0", to: "::2" })) {
  console.log(ip);
}
```

4. Iterate over all IPv6s in a subnet

```typescript
import { iterateIpV6Addresses } from "ipterate";

for (const ip of iterateIpV6Addresses("2001:db8::/125")) {
  console.log(ip);
}
```

5. Iterate over IPv6 in their full form.

The IPv6 addresses by default are returned in their compressed form. So for instance `2001:0db8:0000:0000:0000:0000:0000:0001` will be returned as `2001:db8::1`. 
If you want to iterate over the full form of the IPv6 addresses, you can use the `short` option and set it to false

```typescript
import { iterateIpV6Addresses } from "ipterate";

for (const ip of iterateIpV6Addresses("2001:db8::/125"), { short: false }) {
  console.log(ip);
}
```

# Deprecated usage

The old interface has been temporarily backported for compatibility reasons, but it will no longer be maintained and will
be completely removed in the future. The old interface provides features that are anything but single-responsibility
oriented, providing various features that may or may not be useful, that have performance impact. Tracking your progress
for instance sounds like a great feature for some, but is useless for most considering that there are far better
ways of measuring your progress depending on your use case.

That being said, the library has been completely re-written in TypeScript. I did my best to maintain the backward
compatibility here, but I guarantee nothing. Over the past 6 years since the initial release, I have become wiser,
and I now understand that YAGNI is the king. 

## Usage with a callback

For instance the following code

    const ipterate = require('ipterate');
        
    ipterate.range('10.0.1.0/29').iterate(ip => {
        console.log(ip);
    });
    
prints out
```
    10.0.1.0
    10.0.1.1
    10.0.1.2
    10.0.1.3
    10.0.1.4
    10.0.1.5
    10.0.1.6
    10.0.1.7
```

and this one will traverse all IPs in existence:

    const ipterate = require('ipterate');
    
    ipterate.range('0.0.0.0/0').iterate(ip => {
        console.log(`IP: ${ip}`);
    });
    
If you want to perform an asynchronous action, make sure that your delegate returns a promise and call `iterateAsync`
instead. `iterateAsync` itself returns a promise and will wait for the resolution of the promise returned by 
your delegate, before it provides you with another IP.

    const ipterate = require('ipterate');
    const rp = require('request-promise');
        
    ipterate.range('0.0.0.0/0').iterateAsync(ip => {
        return rp.get(ip);
    });
    
## Iteration information

Iterating through large sets of IPs might take a while. For this reason you might want to track the progress of your iteration.
In the second parameter the `iterate` and `iterateAsync` provide itaration information to your delegate function. 

    ipterate.range('0.0.0.0/0').iterate((ip, data) => {
        console.log(`All IPs available in this subnet: ${data.allIps}`);
        console.log(`Current iteration: ${data.iteration}`); //starts from 1
        console.log(`Completion percentage: ${data.completionPercentage}`); // an integer number between 0 and 100
                                                                            // calculated based on allIps and iteration
    });
   
## Usage in a loop

Alternatively, instead of using callbacks, you can just iterate the IPs in a loop

    for (let {ip, progress} of ipterate.range('10.0.1.0/29').iterate()) {
      // your stuff
    }
    
## Starting from a saved point

If you're iterating through a large number of IPs, it is likely that you will want to save your progress at some point
and then continue from where you left off. For this purpose you can use the startWith() method.

    for (let {ip, progress} of ipterate.range('0.0.0.0/0').startWith('10.0.1.5').iterate()) {
      // your stuff
    }
