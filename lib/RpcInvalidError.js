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

module.exports = InvalidParamsError;
