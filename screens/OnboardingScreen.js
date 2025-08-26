import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MenImage from '../assets/images/menImage.png'
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../helper/routes';

const OnboardingScreen = () => {

   const navigation = useNavigation();

   const handleGetStarted = () => {
    navigation.navigate(ROUTES.Login_SCREEN);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Define{'\n'}yourself in{'\n'}your unique{'\n'}way.
          </Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={MenImage}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    zIndex: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    lineHeight: 48,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: -90,
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
