const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure the dev server to run on port 5000
config.server = {
  port: 5000,
};

module.exports = config;
