module.exports = (() => {
  const cache = Object.keys(require.cache);

  for(let i = 0; i < cache.length; i++) {
    delete require.cache[require.resolve(cache[i])];
  }

  console.log("Gereksiz bellek temizlendi.");
});