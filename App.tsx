import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSecureStorage } from './lib/useSecureStorage';
import { useWalletStore } from './lib/walletStore';
import { derivateAddress } from './lib/walletUtils';


import { OnboardingScreen } from './screens/OnboardingScreen';
import { SeedDisplayScreen } from './screens/SeedDisplayScreen';
import { WalletScreen } from './screens/WalletScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Wallet'>('Onboarding');
  const { getMnemonic } = useSecureStorage();
  const { setMnemonic, setAddress, setInitialized } = useWalletStore();


  const bootstrapAsync = useCallback(async () => {
    try {
      const mnemonic = await getMnemonic();
      if (mnemonic) {
        setMnemonic(mnemonic);
        const address = derivateAddress(mnemonic);
        setAddress(address);
        setInitialized(true);
        setInitialRoute('Wallet');
      }
    } catch (e) {
      console.error('Failed to restore wallet', e);
    } finally {
      setIsLoading(false);
    }
  }, [getMnemonic, setMnemonic, setAddress, setInitialized]);

  useEffect(() => {
    bootstrapAsync();
  }, [bootstrapAsync]);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ 
          headerShown: false,
          animationEnabled: false, 
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SeedDisplay" component={SeedDisplayScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});