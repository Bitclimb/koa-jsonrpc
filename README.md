# koa-jsonrpc
Json-RPC 2 middleware implementation on Koa v2

<a href="https://communityinviter.com/apps/koa-js/koajs" rel="KoaJs Slack Community">![KoaJs Slack](https://img.shields.io/badge/Koa.Js-Slack%20Channel-Slack.svg?longCache=true&style=for-the-badge)</a>

## Requirements
- Koa@2+
- Node@8+


## Installation
```js
npm install koa-jsonrpc --save
```

## Options

- limit[String] - sets the maximum size allowed for requests
- auth[Object] - requires requests to have a valid HMAC256 of the username and password as its authorization header

## Authorization
```js
//generating authorization header
const crypto = require('crypto');
const token = crypto.createHmac('sha256','mypass').update('myuser').digest('hex')
console.log(token) // will print out the token, and you can add this on the header of your request.
```

## Usage
```js
const Koa = require('koa');
const app = new Koa();
const koaJsonRpc = require('koa-jsonrpc');
const options = {
  limit: '20mb', // optional, defaults to 1mb
  auth: { // optional, will require authorization header
    username: 'myuser',
    password: 'mypass'
  }
}
const jrpc2 = koaJsonRpc(options);

// Add methods
jrpc2.use('user', async function user() {
  return 'root';
});

jrpc2.use('sum', async function sum(params) {
  return params.reduce((prev, curr) => prev + curr,
        0);
});

jrpc2.use('internal', async function internal() {
  throw new Error();
});

app.use(jrpc2.app());
```
