// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = require.resolve('metro-minify-esbuild');
config.transformer.minifierConfig = {
  drop: ['console'],
};

module.exports = withNativewind(config);
