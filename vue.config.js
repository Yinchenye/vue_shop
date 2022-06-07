const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  devServer: {
    host: "127.0.0.1",
    port: 3000,
    open: true,
  },
});
