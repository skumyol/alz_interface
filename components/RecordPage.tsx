import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useData } from "./DataProvider";
import { v4 as uuidv4 } from "uuid";

const audioRecorderPlayer = new AudioRecorderPlayer();

export function RecordPage({ navigation }) {
  const { name, email, agree } = useData();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      if (!audioRecorderPlayer) {
        throw new Error('AudioRecorderPlayer is not initialized.');
      }
      setIsRecording(true);
      await audioRecorderPlayer.startRecorder();
    } catch (error) {
      console.error('Error starting recording: ', error);
      setIsRecording(false);
      // Optionally, show an alert or handle the error in another way
    }
  };

  const stopRecording = async () => {
    
    try {
      if (!audioRecorderPlayer) {
        throw new Error('AudioRecorderPlayer is not initialized.');
      }
      setIsRecording(false);
      setIsProcessing(true);
      const path = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      if (!path) {
        throw new Error('No recording found. Please try again.');
      }
      // Process the recording path as needed
    } catch (error) {
      console.error('Error stopping recording: ', error);
      setIsProcessing(false);
      setIsRecording(false);
      // Optionally, show an alert or handle the error in another way
    }
    
    let data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("email", email || uuidv4());
    data.append("agree", agree.toString());
    data.append("file", {
      name: "test.wav",
      uri: path,
      type: "audio/wav",
    });

    const fetchPromise = fetch("http://sabre.lumilynx.co:5000/predict", {
      method: "POST",
      body: data,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        setIsProcessing(false);
        setIsRecording(false);
        Alert.alert("Error", "Server response timed out. Please try again.");
        reject(new Error("Timeout"));
      }, 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Success:", result);
        setIsProcessing(false);
        navigation.navigate("NextPage", { serverResponse: result });
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsProcessing(false);
        setIsRecording(false);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isProcessing ? (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            key={isProcessing ? "processing" : "not-processing"}
          />
          <Text>Processing...</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Image
            source={
              isRecording
                ? require("../assets/stop_button.png")
                : require("../assets/record_button.png")
            }
            style={{ width: 100, height: 100 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
