import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";

class ConsentForm extends Component {
  scrollViewRef = React.createRef();

  state = {
    accepted: false,
    scrollViewHeight: 0,
    contentHeight: 0,
    uniqueValue: "",
  };

  componentDidMount() {
    this.checkIfContentFitsScreen();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.scrollViewHeight !== this.state.scrollViewHeight ||
      prevState.contentHeight !== this.state.contentHeight
    ) {
      this.checkIfContentFitsScreen();
    }
  }

  checkIfContentFitsScreen = () => {
    if (this.state.contentHeight <= this.state.scrollViewHeight) {
      this.setState({ accepted: true });
    }
  };

  handleAccept = () => {
    Alert.alert("Confirmation / 確認", "Do you agree to be contacted later? \n 你同意與我們保持聯絡嗎?", [
      {
        text: "No",
        onPress: () =>
          this.setState({ uniqueValue: 1 }, () => {
            this.props.navigation.navigate("Welcome");
          }),
        style: "cancel",
      },
      { text: "Yes", onPress: () => this.props.navigation.navigate("Contact") },
    ]);
  };

  render() {
    const { navigation } = this.props;
    const screenWidth = Dimensions.get("window").width;

    return (
      <View style={styles.container}>
        <View style={styles.imageRow}>
          <Image
            source={require("../assets/hkust_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require("../assets/centerofaging_logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to the dementia detection app</Text>
        <Text style={styles.title}>歡迎試用認知評估小程式
</Text>
        <ScrollView
          ref={this.scrollViewRef}
          style={styles.tcContainer}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.setState({ contentHeight });
          }}
          onLayout={({ nativeEvent }) => {
            this.setState({ scrollViewHeight: nativeEvent.layout.height });
          }}
        >
          <Text style={[styles.tcP, { color: 'red', textAlign: 'center'  }]}>Please proceed by hitting continue./點擊.</Text>

        </ScrollView>
        
        <TouchableOpacity
          disabled={!this.state.accepted}
          onPress={this.handleAccept}
          style={this.state.accepted ? styles.button : styles.buttonDisabled}
        >
        
          <Text style={styles.buttonText}>Continue/繼續</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: 300,
    backgroundColor: 'transparent',
    marginLeft: 0,
  },
  logo: {
    height: 200,
    width: 400,
    backgroundColor: 'transparent',
    marginRight: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  tcContainer: {
    flex: 1,
    width: '100%',
  },
  tcP: {
    fontSize: 16,
    margin: 10,
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
    fontSize: 18,
  },
  buttonDisabled: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#d3d3d3',
    marginBottom: 20,
  },
});

export default ConsentForm;