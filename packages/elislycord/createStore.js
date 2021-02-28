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

  result.has = ((key) => {
    return store.hasOwnProperty(key);
  })

  result.delete = ((key) => {
    delete store[key];
  });

  result.add = ((key, value) => {
    result.set(key, result.get(key) + value);
  });

  result.size = (() => {
    return Object.keys(store).length;
  })

  return result;
});
