import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

class InstructionPage extends Component {
  render() {
    const { navigation } = this.props;

    const instructions = [
      "1. Click to next.",
      "2. Hit the record button and verbally describe the image.",
      "3. Hit the stop button when you are done.",
      "1. 按掣繼續.",
      "2. 點擊開始, 簡單描述圖中影像.",
      "3. 重新點擊結束錄音.",
    ];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Instructions/操作說明</Text>
        <FlatList
          data={instructions}
          renderItem={({ item }) => (
            <Text style={styles.instructionItem}>{item}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.tcContainer}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Record')}>
          <Text style={styles.buttonText}>Next/繼續</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontSize: 33,
    alignSelf: 'center'
  },
  instructionItem: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22, // Increased font size for better readability
  },
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1, // Make the container fill the screen
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    flex: 1, // Make the FlatList grow to fill the available space
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
  },
  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center'
  }
});

export default InstructionPage;