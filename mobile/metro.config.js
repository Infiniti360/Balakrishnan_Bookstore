// mobile/metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 1. Make sure PNG is treated as an asset
if (!config.resolver.assetExts.includes('png')) {
  config.resolver.assetExts.push('png');
}

// 2. Alias the missing module to our local file
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // whenever a module asks for the missing path, give it our copy
  'missing-asset-registry-path': path.resolve(
    __dirname,
    'assets/back-icon.png'
  ),
};

module.exports = config; 