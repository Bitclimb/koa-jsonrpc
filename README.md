# koa-jsonrpc
Json-RPC 2 middleware implementation on Koa v2

## Requirements
- Koa@2+
- Node@8+


## Installation
```js
npm install koa-jsonrpc --save
```

## Usage
```js
const Koa = require('koa');
const app = new Koa();
const koaJsonRpc = require('koa-jsonrpc');
const jrpc2 = koaJsonRpc({ limit: '20mb' });

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
