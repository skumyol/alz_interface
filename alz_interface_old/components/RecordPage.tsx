import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { useData } from "./DataProvider";


export function RecordPage({ navigation }) {
  const instructions = [
    "1. Hit the record button and verbally describe the image.",
    "2. Hit the same button when you are done with describing.",
    "1. 點擊開始, 簡單描述圖中影像.",
    "2. 重新點擊結束錄音.",
  ];
  const { name, email, agree, isDevMode } = useData();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isTimerRunning]);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access microphone is required!');
      }
    })();
  }, []);

  const startRecording = async () => {
    setIsTimerRunning(true);
    setTimer(0);
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (isDevMode) {
      setIsRecording(false);
      setIsTimerRunning(false);
      setIsProcessing(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setTimeout(() => {
        setIsProcessing(false);
        const result = ''; // Replace with actual result logic
        navigation.navigate('Report', { serverResponse: result });
      }, 2000);
    } else {
      try {
        console.log('Stopping recording..');
        setIsRecording(false);
        setIsTimerRunning(false);
        setIsProcessing(true);
        await recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();
        console.log('Recording stopped and stored at', uri);
        if (!uri) {
          throw new Error("No recording found. Please try again.");
        }
        console.log(name, email, agree, uri);
        await uploadAudio(uri);
      } catch (error) {
        console.error("Error stopping recording: ", error);
        setIsProcessing(false);
        setIsRecording(false);
      }
    }
  };

  const uploadAudio = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "audio/m4a",
      name: "test.m4a",
    });
    formData.append("name", name);
    formData.append("email", email);
    formData.append("agree", agree);
    formData.append("moca", "-1");
    console.log(formData);
    console.log(formData);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
      controller.abort();
      setIsProcessing(false);
      setIsRecording(false);
      Alert.alert("Error", "Server response timed out. Please try again.");
    }, 25000);

    const response = await fetch("http://ddbackup.lumilynx.co/predict", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const prediction = result.predicted_MMSE 
      console.log(prediction)
      console.log("Success:", result);
      setIsProcessing(false);
      navigation.navigate("Report", { serverResponse: prediction });
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
    <Image
            source={require('../assets/coookie.png')}
            style={styles.fullWidthImage}
            resizeMode="contain"
          />
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            key={isProcessing ? "processing" : "not-processing"}
          />
          <Text>Processing...</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
          
          <Image
            source={
              isRecording
                ? require("../assets/stop_button.png")
                : require("../assets/record_button.png")
            }
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      )}
      <View style={styles.instructionsContainer}>
      <Text style={[styles.timerText, { color: 'red', textAlign: 'center'  }]}>{`Timer:${timer}s`}</Text>
      {instructions.map((instruction, index) => (
        <Text key={index} style={styles.instructionText}>
          {instruction}
        </Text>
      ))}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  processingContainer: {
    alignItems: "center",
  },
  fullWidthImage: {
    width: '90%', // Set width to 90% of the screen width
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Adjust this value based on the image's aspect ratio
    alignSelf: 'auto', // Center the image horizontally
  },
  buttonImage: {
    width: 100,
    height: 100,
    marginTop: 0,
    padding: 0
  },
  instructionsContainer: {
    bottom: 20,
  },
  instructionText: {
    fontSize: 28,
    fontWeight: 'bold', // Corrected from 'fontbf' to 'fontWeight'
    marginVertical: 5,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 38,
    marginVertical: 10,
  },
});