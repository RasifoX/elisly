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

  result.some = ((cb) => {
    return Object.values(store).some(cb);
  });

  result.find = ((cb) => {
    return Object.values(store).find(cb);
  });

  result.findKey = ((cb) => {
    return Object.keys(store)[Object.values(store).indexOf(result.find(cb))];
  });

  result.add = ((key, value) => {
    result.set(key, result.get(key) + value);
  });

  result.size = (() => {
    return Object.keys(store).length;
  });

  result.byIndex = ((index) => {
    return Object.values(store)[index];
  });

  result.getAsObject = (() => {
    return store;
  });

  result.keys = (() => {
    return Object.keys(store);
  });

  result.values = (() => {
    return Object.values(store);
  });

  return result;
});
