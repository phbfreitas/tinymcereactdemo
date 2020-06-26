// plain-text string
const str = 'Base64 Encoding in Node.js';

// create a buffer
const buff = Buffer.from(str, 'utf-8');

// decode buffer as Base64
const base64 = buff.toString('base64');

// print Base64 string
console.log(base64);

// create a buffer
const buff2 = Buffer.from(base64, 'base64');

// decode buffer as UTF-8
const str2 = buff2.toString('utf-8');

// print normal string
console.log(str2);