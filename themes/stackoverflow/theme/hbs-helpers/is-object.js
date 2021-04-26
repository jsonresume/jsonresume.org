const isObject = (conditional, options) => {
  if (typeof conditional === 'object' && conditional !== null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

module.exports = { isObject };
