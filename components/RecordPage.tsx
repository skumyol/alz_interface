import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
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

// Only initialize AudioRecord on mobile platforms
if (Platform.OS !== 'web') {
  AudioRecord.init(options);
}

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
      if (Platform.OS === 'web') {
        Alert.alert(
          "Web Platform",
          "Audio recording is not supported on web browsers. Please use the mobile app for recording functionality.",
          [{ text: "OK" }]
        );
        return;
      }
      
      if (!AudioRecord) {
        throw new Error("AudioRecord is not initialized.");
      }
      setIsRecording(true);
      AudioRecord.start();
    } catch (error) {
      console.error("Error starting recording: ", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert(
          "Web Platform",
          "Audio recording is not supported on web browsers. Please use the mobile app for recording functionality.",
          [{ text: "OK" }]
        );
        return;
      }
      
      if (!AudioRecord) {
        throw new Error("AudioRecord is not initialized.");
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
      {Platform.OS === 'web' && (
        <View style={{ padding: 20, marginBottom: 20, backgroundColor: '#fff3cd', borderRadius: 5 }}>
          <Text style={{ textAlign: 'center', color: '#856404' }}>
            Audio recording is not available on web browsers.{'\n'}
            Please use the mobile app for full functionality.
          </Text>
        </View>
      )}
      
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
          style={{ opacity: Platform.OS === 'web' ? 0.5 : 1 }}
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
