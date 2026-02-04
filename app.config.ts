import { ExpoConfig } from 'expo/config';
import { withXcodeProject } from 'expo/config-plugins';
import 'tsx/cjs';

const IS_DEV = process.env.APP_VARIANT === 'development';

const expoConfig: ExpoConfig = {
  name: 'OnelineBank',
  slug: 'OnelineBank',
  owner: 'junwon',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'onelinebank',
  userInterfaceStyle: 'automatic',
  buildCacheProvider: 'eas',
  newArchEnabled: true,
  locales: {
    en: {
      ios: {
        CFBundleDisplayName: IS_DEV ? 'OnelineBank Dev' : 'OnelineBank',
      },
      android: {
        app_name: IS_DEV ? 'OnelineBank Dev' : 'OnelineBank',
      },
    },
    ko: {
      ios: {
        CFBundleDisplayName: IS_DEV ? '한줄은행 Dev' : '한줄은행',
      },
      android: {
        app_name: IS_DEV ? '한줄은행 Dev' : '한줄은행',
      },
    },
  },
  ios: {
    bundleIdentifier: IS_DEV ? 'com.junwon.onelinebank.dev' : 'com.junwon.onelinebank',
    icon: 'assets/app.icon',
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      UIViewControllerBasedStatusBarAppearance: false,
    },
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    package: IS_DEV ? 'com.junwon.onelinebank.dev' : 'com.junwon.onelinebank',
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-dev-client',
      {
        addGeneratedScheme: !!IS_DEV,
      },
    ],
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/android-icon-foreground.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#53BDEB',
        dark: {
          backgroundColor: '#1277CB',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default withXcodeProject(expoConfig, async (nativeConfig) => {
  const xcodeProject = nativeConfig.modResults;
  xcodeProject.debugInformationFormat = 'dwarf-with-dsym';
  return nativeConfig;
});
