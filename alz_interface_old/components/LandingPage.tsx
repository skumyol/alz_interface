import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useData } from './DataProvider';
export function LandingPage({ navigation }) {
  const { isDevMode, setIsDevMode } = useData();
  const [mode, setMode] = useState('normal'); // Initialize mode state
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Mode 1', value: 'reset' },
    { label: 'Mode 2', value: 'alwayshealthy' },
    { label: 'Mode 3', value: 'alwaysmci' }
  ]);

  const handleToggleSwitch = () => setIsDevMode(previousState => !previousState);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    const url = `http://ddbackup.lumilynx.co/${newMode}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchCurrentMode = () => {
    const url = `http://ddbackup.lumilynx.co/mode`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMode(data.mode);
        console.log('Current mode fetched:', data.mode);
      })
      .catch(error => {
        console.error('Error fetching current mode:', error);
      });
  };

  useEffect(() => {
    fetchCurrentMode();
  }, []);

  
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.devModeContainer}>
          <Text style={styles.devModeText}>Dev Mode</Text>
          <Switch
            onValueChange={handleToggleSwitch}
            value={isDevMode}
            style={styles.switch}
          />
        </View>
        <View style={styles.modeSelectorContainer}>
          <Text style={styles.modeSelectorText}>Select Mode</Text>
          <DropDownPicker
            open={open}
            value={mode}
            items={items}
            setOpen={setOpen}
            setValue={setMode}
            setItems={setItems}
            onChangeValue={handleModeChange}
            style={styles.picker}
          />
        </View>
      </View>
      <Text style={styles.header}>
        Alzheimer's Disease Detection From Voice 
      </Text>
      <Text style={styles.header}>
        以語音模式作認知障礙初步評估
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Instructions')}>
        <Text style={styles.buttonText}>Start/開始</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 40,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeSelectorText: {
    fontSize: 18,
    marginRight: 10,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  devModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devModeText: {
    fontSize: 18,
    marginRight: 20,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  header: {
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 150
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
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Distance from the bottom of the screen
    left: '50%', // Center horizontally
    transform: [{ translateX: -100 }], // Adjust for the button's width to center it
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
  picker: {
    width: 150,
    marginLeft: 10
  },
});