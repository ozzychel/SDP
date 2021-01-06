module.exports = {
  apps : [{
    name: "calendar1",
    script: "./server/index.js",
    env: {
      "NODE_ENV": "production",
    }
  }]
}