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
    bundleIdentifier: 'com.junwon.onelinebank',
    icon: 'assets/app.icon',
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
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
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    package: 'com.junwon.onelinebank',
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/crashlytics',
    [
      'expo-build-properties',
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
        ios: {
          ccacheEnabled: true,
          forceStaticLinking: ['RNFBApp', 'RNFBAuth'],
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-dev-client',
      {
        addGeneratedScheme: !!IS_DEV,
      },
    ],
    [
      'expo-font',
      {
        fonts: ['assets/fonts'],
        android: {
          fonts: [
            {
              fontFamily: 'Pretendard',
              fontDefinitions: [
                {
                  path: 'assets/fonts/Pretendard-Thin.otf',
                  weight: 100,
                },
                {
                  path: 'assets/fonts/Pretendard-ExtraLight.otf',
                  weight: 200,
                },
                {
                  path: 'assets/fonts/Pretendard-Light.otf',
                  weight: 300,
                },
                {
                  path: 'assets/fonts/Pretendard-Regular.otf',
                  weight: 400,
                },
                {
                  path: 'assets/fonts/Pretendard-Medium.otf',
                  weight: 500,
                },
                {
                  path: 'assets/fonts/Pretendard-SemiBold.otf',
                  weight: 600,
                },
                {
                  path: 'assets/fonts/Pretendard-Bold.otf',
                  weight: 700,
                },
                {
                  path: 'assets/fonts/Pretendard-ExtraBold.otf',
                  weight: 800,
                },
                {
                  path: 'assets/fonts/Pretendard-Black.otf',
                  weight: 900,
                },
              ],
            },
          ],
        },
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
