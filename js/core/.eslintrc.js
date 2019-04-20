module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  env: {
      "browser": true,
      "jquery": true,
      "es6": true,
  },
  rules: {
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }]
  }
};