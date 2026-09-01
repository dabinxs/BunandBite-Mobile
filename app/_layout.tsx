import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from '@/lib/store';
import colors from '@/constants/colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
      <Stack screenOptions={{ headerBackTitle: 'Back', contentStyle: { backgroundColor: colors.light.background }, headerStyle: { backgroundColor: colors.light.background }, headerTintColor: colors.light.foreground, headerTitleStyle: { fontFamily: 'Inter_700Bold' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Build your bite', presentation: 'card' }} />
        <Stack.Screen name="cart" options={{ title: 'Your cart' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="order-confirmation" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="auth" options={{ title: 'Account', presentation: 'modal' }} />
        <Stack.Screen name="address" options={{ title: 'Delivery address', presentation: 'modal' }} />
      <Stack.Screen name="deals" options={{ title: 'Deals' }} />
      <Stack.Screen name="pickup" options={{ title: 'Pick up' }} />
      <Stack.Screen name="shops" options={{ title: 'Shops' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <StoreProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </StoreProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
