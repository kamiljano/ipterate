[![Build Status](https://travis-ci.org/kamiljano/ipterate.svg?branch=master)](https://travis-ci.org/kamiljano/ipterate)
[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/ipterate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kamiljano/ipterate?targetFile=package.json)
[![Coverage Status](https://coveralls.io/repos/github/kamiljano/ipterate/badge.svg?branch=master)](https://coveralls.io/github/kamiljano/ipterate?branch=master)

# About

IpTerate is a small library that helps you iterate through all available IPs within a specific subnet.

# Usage

## Basic usage

For instance the following code

    const ipterate = require('ipterate');
        
    ipterate.range('10.0.1.0/29').iterate(ip => {
        console.log(`IP: ${ip}`);
    });
    
prints out

    10.0.1.0
    10.0.1.1
    10.0.1.2
    10.0.1.3
    10.0.1.4
    10.0.1.5
    10.0.1.6
    10.0.1.7
    
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

# Installation

npm install --save ipterate