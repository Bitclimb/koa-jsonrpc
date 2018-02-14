const Koa = require('koa');
const app = new Koa();

const koaJsonRpc = require('../index');

const jrpc2 = koaJsonRpc({ limit: '20mb', auth: { username: 'myuser', password: 'mypass' } });

jrpc2.use('user', async () => 'root');

jrpc2.use('sum', async params => params.reduce((prev, curr) => prev + curr,
  0));

jrpc2.use('internal', async () => {
  throw new Error();
});

app.context.some_string = 'context string';

jrpc2.use('ctx', async () => app.context.some_string);

jrpc2.use('checkParams', async params => {
  if (params && Object.prototype.hasOwnProperty.call(params, 'foo')) {
    return params.foo;
  }
  throw new koaJsonRpc.InvalidParamsError('Param foo omitted');
});

jrpc2.use('testBigJson', async () => 'Ok');

app.use(jrpc2.app());

module.exports = app;
