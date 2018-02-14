const expect = require('chai').expect;
const app = require('./test_server');
const supertest = require('supertest');
const crypto = require('crypto');
const request = supertest.agent(app.callback());

const token = crypto.createHmac('sha256', 'mypass').update('myuser').digest('hex');

const parseError = {
  jsonrpc: '2.0',
  error: {
    code: -32700,
    message: 'Parse error'
  },
  id: null
};

const invalidJson = {
  firstName: 'John',
  lastName: 'Dow'
};

const invalidRequestError = {
  jsonrpc: '2.0',
  error: {
    code: -32600,
    message: 'Invalid Request'
  },
  id: null
};
const unauthorizedError = {
  jsonrpc: '2.0',
  error: {
    code: -32604,
    message: 'Unauthorized'
  },
  id: null
};
const invalidJsonId = {
  firstName: 'John',
  lastName: 'Dow',
  id: 8
};

const invalidRequestErrorId = {
  jsonrpc: '2.0',
  error: {
    code: -32600,
    message: 'Invalid Request'
  },
  id: 8
};

const otherQuery = {
  jsonrpc: '2.0',
  method: 'other',
  id: 1
};

const methodNotFoundError = {
  jsonrpc: '2.0',
  error: {
    code: -32601,
    message: 'Method not found'
  },
  id: 1
};

const userQuery = {
  jsonrpc: '2.0',
  method: 'user',
  id: 2
};

const userResponce = {
  jsonrpc: '2.0',
  result: 'root',
  id: 2
};

const sumQuery = {
  jsonrpc: '2.0',
  method: 'sum',
  params: [1, 2, 3],
  id: 3
};

const sumResponce = {
  jsonrpc: '2.0',
  result: 6,
  id: 3
};

const ctxQuery = {
  jsonrpc: '2.0',
  method: 'ctx',
  id: 12
};

const ctxResponce = {
  jsonrpc: '2.0',
  result: 'context string',
  id: 12
};

const internalQuery = {
  jsonrpc: '2.0',
  method: 'internal',
  id: 18
};

const internalResponce = {
  jsonrpc: '2.0',
  error: {
    code: -32603,
    message: 'Internal error'
  },
  id: 18
};

const checkParams1Query = {
  jsonrpc: '2.0',
  method: 'checkParams',
  params: {
    foo: 'bar'
  },
  id: 20
};

const checkParams1Responce = {
  jsonrpc: '2.0',
  result: 'bar',
  id: 20
};

const checkParams2Query = {
  jsonrpc: '2.0',
  method: 'checkParams',
  id: 21
};

const checkParams2Responce = {
  jsonrpc: '2.0',
  error: {
    code: -32602,
    message: 'Invalid params'
  },
  id: 21
};

const checkBigJsonQuery = {
  jsonrpc: '2.0',
  method: 'testBigJson',
  payload: [],
  id: 80
};

const checkBigJsonResponce = {
  jsonrpc: '2.0',
  result: 'Ok',
  id: 80
};

let i;
let j;
for (i = 0; i < 512; i += 1) {
  for (j = 0; j < 1024; j += 1) {
    checkBigJsonQuery.payload.push(j);
  }
}

describe('koa-json-rpc2', () => {
  it('return parse error on non-json call', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send('Malformed string')
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(parseError);
        done();
      });
  });
  it('return invalid request error with null id on not valid request', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(invalidJson)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(invalidRequestError);
        done();
      });
  });
  it('return unauthorized error with null id on missing authorization header', done => {
    request.post('/')
      .send(sumQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(unauthorizedError);
        done();
      });
  });
  it('return unauthorized error with null id on incorrect authorization header', done => {
    request.post('/')
      .set('Authorization', `Token incorrectToken`)
      .send(sumQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(unauthorizedError);
        done();
      });
  });
  it('return invalid request error with non-null id on not valid request', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(invalidJsonId)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(invalidRequestErrorId);
        done();
      });
  });
  it('return invalid request error with non-null id on invalid request method', done => {
    request.patch('/')
      .set('Authorization', `Token ${token}`)
      .send(invalidJsonId)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(invalidRequestErrorId);
        done();
      });
  });
  it('return method not found error on unknown method request', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(otherQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(methodNotFoundError);
        done();
      });
  });
  it('return result for call without arguments', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(userQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(userResponce);
        done();
      });
  });
  it('return result for call without arguments', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(sumQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(sumResponce);
        done();
      });
  });
  it('have access to koa context passed to rpc method', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(ctxQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(ctxResponce);
        done();
      });
  });
  it('have return internal error as result of throw inside RPC method', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(internalQuery)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(internalResponce);
        done();
      });
  });
  it('have return result for correct parameters', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(checkParams1Query)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(checkParams1Responce);
        done();
      });
  });
  it('have return invalid params error error as result of throw InvalidParamsError inside RPC method', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(checkParams2Query)
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.deep.equal(checkParams2Responce);
        done();
      });
  });
  it('should handle large sized JSONs', done => {
    request.post('/')
      .set('Authorization', `Token ${token}`)
      .send(checkBigJsonQuery)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(JSON.parse(res.text)).to.deep.equal(checkBigJsonResponce);
        done();
      });
  });
});
