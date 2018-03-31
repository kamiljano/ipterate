# About

IpTerate is a small library that helps you iterate through all available IPs within a specific subnet.

# Usage

    const ipterate = require('ipterate');
    
    ipterate.range('0.0.0.0/0').iterate(ip => {
        console.log(`IP: ${ip}`);
    });