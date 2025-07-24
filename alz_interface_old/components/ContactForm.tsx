import React from "react";
import { View, TextInput, Button, Switch, Text, Alert } from "react-native";
import { useData } from "./DataProvider";


export function ContactForm({ navigation }) {
  const { name, email, agree, setName, setEmail, setAgree } = useData();
  const canGoNext = name !== "" && email !== "";
  const handleNextPress = () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    // if (email === "") {
    //   setEmail(uuidv4()); // Set email to a unique ID if it's empty
    // }
    navigation.navigate("Welcome");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 16,
        }}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Name/Alias"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 16,
        }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email Address"
        keyboardType="email-address"
      />
      {/* <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <Switch
          value={agree}
          onValueChange={setAgree}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text> I agree to be contacted later.</Text>
      </View> */}
      <Button
        title="Next"
        onPress={handleNextPress}
      />
    </View>
  );
}
