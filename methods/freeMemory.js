module.exports = (() => {
  delete require.main;
  delete require.cache;
  console.log("Gereksiz bellek temizlendi.");
});