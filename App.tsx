import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import fetchFonts from './loadFont';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/home/home.screen';
import DetailScreen from './components/detail/task.detail';
import { backgroundColor } from './colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await fetchFonts(); // Load fonts
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync(); // Hide the splash screen once resources are loaded
      }
    };
    loadResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const Stack = createNativeStackNavigator();
  
  return (
  <NavigationContainer>
    <SafeAreaView style={styles.safeArea} onTouchStart={() => Keyboard.dismiss()}>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
    </SafeAreaView>
    
  </NavigationContainer>
  );
}

const check = {
  // borderColor: 'red',
  // borderWidth: 4,
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
    ...check,
  }
})