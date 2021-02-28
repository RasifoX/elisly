module.exports = (() => {
  const store = {};
  const result = {};

  result[Symbol.for("nodejs.util.inspect.custom")] = (() => {
    return store;
  });

  result.set = ((key, value) => {
    store[key] = value;
  });

  result.get = ((key) => {
    return store[key];
  });

  result.delete = ((key) => {
    delete store[key];
  });

  result.add = ((key, value) => {
    result.set(key, result.get(key) + value);
  });

  return result;
});
