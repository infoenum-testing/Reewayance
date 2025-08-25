import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import firebase from '@react-native-firebase/app';

function App() {
  useEffect(() => {
  if (firebase.apps.length === 0) {
    console.log("No Firebase app found");
  } else {
    console.log("Firebase initialized:", firebase.app().name);
  }
}, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.text}>
            🚀 Firebase is ready!
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill screen
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;
