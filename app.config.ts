import { ExpoConfig } from 'expo/config';
import { withXcodeProject } from 'expo/config-plugins';
import 'tsx/cjs';

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
        CFBundleDisplayName: 'OnelineBank',
      },
      android: {
        app_name: 'OnelineBank',
      },
    },
    ko: {
      ios: {
        CFBundleDisplayName: '한줄은행',
      },
      android: {
        app_name: '한줄은행',
      },
    },
  },
  ios: {
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
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
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
