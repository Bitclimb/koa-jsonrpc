const jsonResp = require('./lib/RpcResponse');
const jsonError = require('./lib/RpcError');
const parse = require('co-body');
const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

class InvalidParamsError extends Error {
  constructor(message) {
    let caption;
    let stack;
    super();
    this.name = 'InvalidParamsError';
    this.message = message;
    stack = (new Error()).stack.split('\n');
    if (message) {
      caption = `${this.name}: ${message}`;
    } else {
      caption = this.name;
    }
    stack.splice(0, 2, caption);
    this.stack = stack.join('\n');
  }

  toString() {
    return this.stack;
  }
}

class koaJsonRpc {
  constructor(opts) {
    this.limit;
    this.registry = Object.create(null);
    if (opts) {
      this.limit = opts.limit;
    }
    if (!this.limit) {
      this.limit = '1mb';
    }
  }
  use(name, func) {
    this.registry[name] = func;
  }
  app() {
    return async (ctx, next) => {
      let body;
      let result;
      try {
        body = await parse.json(ctx, { limit: this.limit });
      } catch (err) {
        const errBody = jsonResp(null, jsonError.ParseError());
        ctx.body = errBody;
        return;
      }

      if (body.jsonrpc !== '2.0' || !hasOwnProperty(body, 'method') || !hasOwnProperty(body, 'id')) {
        ctx.body = jsonResp(body.id || null, jsonError.InvalidRequest());
        return;
      }
      if (!this.registry[body.method]) {
        ctx.body = jsonResp(body.id, jsonError.MethodNotFound());
        return;
      }
      try {
        result = await this.registry[body.method](body.params);
      } catch (e) {
        if (e instanceof InvalidParamsError) {
          ctx.body = jsonResp(body.id, jsonError.InvalidParams(e.message));
          return;
        }
        ctx.body = jsonResp(body.id, jsonError.InternalError(e.message));
        return;
      }
      ctx.body = jsonResp(body.id, null, result);
    };
  }
}
module.exports = (...args) => new koaJsonRpc(...args);

module.exports.InvalidParamsError = InvalidParamsError;
