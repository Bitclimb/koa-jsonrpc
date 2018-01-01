function isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isJson(x) {
  console.log('X', x);
  if (!x) return false;
  if (isObject(x)) return x;
  if (!isString(x)) return false;

  try {
    const t = JSON.parse(x);
    return t;
  } catch (err) {
    console.log('PARSE ERROR');
    return false;
  }
}

module.exports = isJson;
