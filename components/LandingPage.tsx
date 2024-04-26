import {Button, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// Define your landing page
export function LandingPage({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Alzheimer's Disease Detection From Voice
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Consent')}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontSize: 60,
      fontWeight: 'bold',
      marginBottom: 50,
    },
    button: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#841584',
      // Add these lines to give the button a 3D effect
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 30,
    },
  });