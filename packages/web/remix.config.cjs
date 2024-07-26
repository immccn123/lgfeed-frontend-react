/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  browserBuildDirectory: "./public/build",
  serverBuildPath: process.env.ARC ? "./backend/build/index.js" : undefined,
  publicPath: process.env.ARC ? "/_static/build/" : undefined,
  future: {},
};
