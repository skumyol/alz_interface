import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
// import AudioRecorderPlayer from "react-native-audio-recorder-player";
import AudioRecord from "react-native-audio-record";

import { useData } from "./DataProvider";
import { v4 as uuidv4 } from "uuid";
const options = {
  sampleRate: 44100, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only
  wavFile: "test.wav", // default 'audio.wav'
};
// const audioRecorderPlayer = new AudioRecorderPlayer();
AudioRecord.init(options);

const sendEmptyPostRequest = async () => {
  try {
    const response = await fetch("http://sabre.lumilynx.co:5000/mode", {
      method: "POST",
 
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const result = await response.json();
    console.log("Empty POST request result1:", result);
  } catch (error) {
    console.error("Error sending empty POST request1:", error);
  }
};

export function RecordPage({ navigation }) {
  const { name, email, agree } = useData();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  sendEmptyPostRequest();
  const startRecording = async () => {
    try {
      if (!AudioRecord) {
        throw new Error("AudioRecorderPlayer is not initialized.");
      }
      setIsRecording(true);
      AudioRecord.start();
    } catch (error) {
      console.error("Error starting recording: ", error);
      setIsRecording(false);
      // Optionally, show an alert or handle the error in another way
    }
  };

  const stopRecording = async () => {
    try {
      if (!AudioRecord) {
        throw new Error("AudioRecorderPlayer is not initialized.");
      }
      setIsRecording(false);
      setIsProcessing(true);
      const file = await AudioRecord.stop();
      if (!file) {
        throw new Error("No recording found. Please try again.");
      }
      console.log(name, email, agree, file);
      await uploadAudio(file);
    } catch (error) {
      console.error("Error stopping recording: ", error);
      setIsProcessing(false);
      setIsRecording(false);
    }
  };
  const uploadAudio = async (uri) => {
    const formData = new FormData();
    formData.append("files", {
      uri,
      type: "audio/wav",
      name: "test.wav",
    });
    formData.append("name", name);
    formData.append("email", email);
    formData.append("agree", agree);
    formData.append("moca", "30");

    console.log(formData);
    try {
      const fetchPromise = fetch("http://sabre.lumilynx.co:5000/predict", {
        method: "POST",
        body: formData,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          setIsProcessing(false);
          setIsRecording(false);
          Alert.alert("Error", "Server response timed out. Please try again.");
          reject(new Error("Timeout"));
        }, 5000)
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      setIsProcessing(false);
      navigation.navigate("RecordPage", { serverResponse: result });
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
      setIsRecording(false);
    }
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
