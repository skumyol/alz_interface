import React, { Component } from 'react';
import { View, Button, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';


class InstructionPage extends Component {

  render() {
    const { navigation } = this.props;

    const instructions = [
      "By using our services, you are agreeing to these terms. Please read them carefully.",
      "We provide our services using a reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don’t promise about our services.",
      "Other than as expressly set out in these terms or additional terms, neither we nor our suppliers or distributors make any specific promises about the services. For example, we don’t make any commitments about the content within the services, the specific functions of the services, or their reliability, availability, or ability to meet your needs. We provide the services “as is”.",
      "Some jurisdictions provide for certain warranties, like the implied warranty of merchantability, fitness for a particular purpose and non-infringement. To the extent permitted by law, we exclude all warranties.",
      "When permitted by law, we will not be responsible for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages."
    ];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Instructions</Text>
        <ScrollView
          ref={this.scrollViewRef}
          style={styles.tcContainer}
          onContentSizeChange={(contentWidth, contentHeight) => {
            // Update the content height when it changes
            this.setState({ contentHeight });
          }}
          onLayout={({ nativeEvent }) => {
            // Update the ScrollView height when it changes
            this.setState({ scrollViewHeight: nativeEvent.layout.height });
          }}
        >
          {instructions.map((instruction, index) => (
            <Text key={index} style={styles.tcP}>{'\u2022'} {instruction}</Text>
          ))}
        </ScrollView>

        <TouchableOpacity 
        >
          <Button
        title="Next"
        onPress={() => navigation.navigate('Record')}
      />
        </TouchableOpacity>
      </View>
    );
  }

}

const { width, height } = Dimensions.get('window');

const styles = {
  title: {
    fontSize: 22,
    alignSelf: 'center'
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  },
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1, // Make the container fill the screen
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    flex: 1, // Make the ScrollView grow to fill the available space
  },

  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10
  },

  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center'
  }

}

export default InstructionPage;