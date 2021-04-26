const isObject = function (item, options) {
  if (typeof item === 'object' && item !== null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

module.exports = { isObject };
