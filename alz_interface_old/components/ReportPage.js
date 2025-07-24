import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useData } from './DataProvider'; // Assuming you have a DataProvider for context

export function ReportPage({ route, navigation }) {
  const { serverResponse } = route.params;
  const { resetValues, isDevMode } = useData(); // Assuming resetContext is a function in your context
  const [displayContent, setDisplayContent] = useState(null);
  const handleResetAndNavigate = () => {
    resetValues(); // Reset the context

    const url = `http://ddbackup.lumilynx.co/reset`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  
    navigation.navigate('Introduction'); // Navigate to the first page
  };
  const handleDisplayReport = () => {
    if (isDevMode) {
      setDisplayContent("No abnormality detected by our system 檢測沒有異常");
    } else {
      const responseNumber = Number(serverResponse); 
      if(responseNumber >= 25)
        setDisplayContent(`No abnormality detected by our system: \n 檢測沒有異常: \n`+ serverResponse);
      else{
        setDisplayContent("Please consult with your doctor \ 請諮詢醫療人員瞭解更多");
      }
    }
  };

  return (
    <View style={styles.container}>
      {displayContent && (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.displayContent}>{displayContent}</Text>
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleResetAndNavigate}>
          <Text style={styles.buttonText}>Restart/重新開始</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDisplayReport}>
          <Text style={styles.buttonText}>Display Report/展示報告</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 60, // Giant font size
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // Center text
  },
  text: {
    fontSize: 16,
    textAlign: 'center', // Center text
  },
  scrollView: {
    position: 'absolute',
    top: '40%',
    width: '80%',
    maxHeight: '30%',
  },
  displayContent: {
    fontSize: 18,
    textAlign: 'center', // Center text
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#841584',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    bottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    alignSelf: 'center',
  },
});