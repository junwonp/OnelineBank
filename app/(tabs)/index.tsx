import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

async function fetchTransfer() {
  const response = await fetch('/api/transfer', {
    method: 'POST',
    body: JSON.stringify({
      dataBody: {
        WDR_ACNO: '1234567890',
        TRN_AM: 10000,
        RCV_BKCD: '002',
        RCV_ACNO: '1234567890',
        PTN_PBOK_PRNG_TXT: 'test',
      },
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export default function HomeScreen() {
  const apiKey = 'l7xxcD4QVD4iKSerVX01i3fuh4CyK7zQ0rDs';
  const apiUrl = 'https://openapi.wooribank.com:444';

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/oai/wb/v1/trans/executeWooriAcctToWooriAcct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appKey: apiKey,
        },
        body: JSON.stringify({
          dataHeader: {
            UTZPE_CNCT_IPAD: '10.0.0.1',
            UTZPE_CNCT_MCHR_UNQ_ID: '3B5E6E7B',
            UTZPE_CNCT_TEL_NO_TXT: '',
            UTZPE_CNCT_MCHR_IDF_SRNO: '',
            UTZ_MCHR_OS_DSCD: '',
            UTZ_MCHR_OS_VER_NM: '',
            UTZ_MCHR_MDL_NM: '',
            UTZ_MCHR_APP_VER_NM: '',
          },
          dataBody: {
            WDR_ACNO: '1234567890',
            TRN_AM: 10000,
            RCV_BKCD: '002',
            RCV_ACNO: '1234567890',
            PTN_PBOK_PRNG_TXT: 'test',
          },
        }),
      });
      const data = await response.json();
      console.log(data);
    };
    // fetchData();
    fetchTransfer();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>{`Tap the Explore tab to learn more about what's included in this starter app.`}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
