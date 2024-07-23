import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useData } from "./DataProvider";

class ConsentForm extends Component {
  scrollViewRef = React.createRef();

  state = {
    accepted: false,
    scrollViewHeight: 0,
    contentHeight: 0,
    uniqueValue: '',
  }

  componentDidMount() {
    // Check if the content fits the screen when the component mounts
    this.checkIfContentFitsScreen();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the content fits the screen when the state updates
    if (prevState.scrollViewHeight !== this.state.scrollViewHeight || prevState.contentHeight !== this.state.contentHeight) {
      this.checkIfContentFitsScreen();
    }
  }

  checkIfContentFitsScreen = () => {
    if (this.state.contentHeight <= this.state.scrollViewHeight) {
      this.setState({ accepted: true });
    }
  }
  handleAccept = () => {
    Alert.alert(
      "Confirmation",
      "Do you agree to be contacted later?",
      [
        {
          text: "No",
          onPress: () => this.setState({ uniqueValue: uuidv4() }, // Assign a unique value
          () => {this.props.navigation.navigate('Welcome')}),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.props.navigation.navigate('Contact') } // Navigate on "Yes"
      ]
    );
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>New Terms and Conditions</Text>
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
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              this.setState({
                accepted: true
              })
            }
          }}
        >
          <Text style={styles.tcP}>By using our services, you are agreeing to these terms. Please read them carefully.</Text>
          <Text style={styles.tcP}>We provide our services using a reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don’t promise about our services.</Text>
          <Text style={styles.tcL}>{'\u2022'} Other than as expressly set out in these terms or additional terms, neither we nor our suppliers or distributors make any specific promises about the services. For example, we don’t make any commitments about the content within the services, the specific functions of the services, or their reliability, availability, or ability to meet your needs. We provide the services “as is”.</Text>
          <Text style={styles.tcL}>{'\u2022'} Some jurisdictions provide for certain warranties, like the implied warranty of merchantability, fitness for a particular purpose and non-infringement. To the extent permitted by law, we exclude all warranties.</Text>
          <Text style={styles.tcP}>When permitted by law, we will not be responsible for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages.</Text>
        </ScrollView>

        <TouchableOpacity 
          disabled={!this.state.accepted} 
          onPress={this.handleAccept} // Updated onPress handler
          style={this.state.accepted ? styles.button : styles.buttonDisabled}
        >
          <Text style={styles.buttonLabel}>Accept</Text>
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

  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
  },
  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center'
  }

}

export default ConsentForm;