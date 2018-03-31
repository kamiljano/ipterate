# About

IpTerate is a small library that helps you iterate through all available IPs within a specific subnet.

# Usage

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
    
# Installation

npm install --save ipterate