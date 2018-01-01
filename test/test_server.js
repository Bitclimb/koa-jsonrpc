const Koa = require('koa');
const app = new Koa();

const koaJsonRpc = require('../index');

const jrpc2 = koaJsonRpc({ limit: '20mb' });

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

app.context.some_string = 'context string';

jrpc2.use('ctx', async function ctx() {
  return app.context.some_string;
});

jrpc2.use('checkParams', async function checkParams(params) {
  if (params && Object.prototype.hasOwnProperty.call(params, 'foo')) {
    return params.foo;
  }
  throw new koaJsonRpc.InvalidParamsError('Param foo omitted');
});

jrpc2.use('testBigJson', async function testBigJson() {
  return 'Ok';
});

app.use(jrpc2.app());

module.exports = app;
