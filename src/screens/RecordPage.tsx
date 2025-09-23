import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// Conditional import for expo-linear-gradient to prevent web build issues
let LinearGradient: any = View;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  console.warn('expo-linear-gradient not available, using View fallback:', e);
}
// Conditional import for expo-av to prevent web build issues
let Audio: any = null;
if (Platform.OS !== 'web') {
  try {
    Audio = require('expo-av').Audio;
  } catch (e) {
    console.warn('expo-av not available:', e);
  }
}
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { colors, typography, spacing, borderRadius, webMobileStyles, isMobileWeb } from '../theme';
import { 
  WebAudioRecorder, 
  isWebAudioRecordingSupported, 
  requestMicrophonePermission 
} from '../utils/webAudioRecorder';

export const RecordPage: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { name, email, agree, isDevMode } = useData();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<any>(null);
  const [webRecording, setWebRecording] = useState<WebAudioRecorder | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [webAudioSupported, setWebAudioSupported] = useState(false);

  const instructions = [
    t('recordInstruction1'),
    t('recordInstruction2'),
  ];

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
      if (Platform.OS === 'web') {
        // Check if web audio recording is supported
        const supported = isWebAudioRecordingSupported();
        setWebAudioSupported(supported);
        
        if (supported) {
          // Request permission preemptively
          await requestMicrophonePermission();
        }
      } else if (Audio) {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', t('micPermissionRequired'));
        }
      }
    })();
  }, []);

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      if (!webAudioSupported) {
        Alert.alert(
          'Recording Not Supported',
          'Your browser does not support audio recording. Please try using a modern browser like Chrome, Firefox, or Safari.',
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        const webRec = new WebAudioRecorder();
        setWebRecording(webRec);
        setIsTimerRunning(true);
        setTimer(0);
        await webRec.start();
        setIsRecording(true);
        console.log('Web recording started');
      } catch (error) {
        console.error('Failed to start web recording:', error);
        setIsTimerRunning(false);
        Alert.alert('Error', 'Failed to start recording. Please check microphone permissions and try again.');
      }
      return;
    }

    if (!Audio) {
      Alert.alert('Error', 'Audio recording not available on this platform.');
      return;
    }

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
      setIsTimerRunning(false);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (Platform.OS === 'web') {
      if (!webRecording) {
        console.error('No web recording in progress');
        return;
      }

      try {
        setIsRecording(false);
        setIsTimerRunning(false);
        setIsProcessing(true);
        
        console.log('Attempting to stop web recording...');
        const audioBlob = await webRecording.stop();
        console.log('Web recording stopped successfully, blob size:', audioBlob.size);
        
        if (isDevMode) {
          // In dev mode, just show a success message
          setTimeout(() => {
            setIsProcessing(false);
            const result = t('noAbnormality');
            navigation.navigate('Report' as never, { serverResponse: result });
          }, 2000);
        } else {
          // Upload the audio for processing
          await uploadWebAudio(audioBlob);
        }
        
        // Cleanup
        webRecording.cleanup();
        setWebRecording(null);
      } catch (error) {
        console.error('Error stopping web recording:', error);
        setIsProcessing(false);
        setIsRecording(false);
        setIsTimerRunning(false);
        
        // Try to cleanup anyway
        if (webRecording) {
          try {
            webRecording.cleanup();
          } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
          }
          setWebRecording(null);
        }
        
        // Show error to user and navigate to report with timeout
        Alert.alert(
          t('errorTitle') || 'Recording Error',
          t('recordingError') || 'Failed to process recording. Showing standard report.',
          [
            {
              text: t('ok') || 'OK',
              onPress: () => {
                navigation.navigate('Report' as never, { serverResponse: 'timeout' });
              }
            }
          ]
        );
        setIsProcessing(false);
        setIsRecording(false);
        Alert.alert('Error', 'Failed to stop recording. Please try again.');
      }
      return;
    }

    if (isDevMode) {
      setIsRecording(false);
      setIsTimerRunning(false);
      setIsProcessing(true);
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      setTimeout(() => {
        setIsProcessing(false);
        const result = t('noAbnormality');
        navigation.navigate('Report' as never, { serverResponse: result });
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
          throw new Error('No recording found. Please try again.');
        }
        console.log(name, email, agree, uri);
        await uploadAudio(uri);
      } catch (error) {
        console.error('Error stopping recording: ', error);
        setIsProcessing(false);
        setIsRecording(false);
        Alert.alert('Error', 'Failed to stop recording. Please try again.');
      }
    }
  };

  const uploadAudio = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'test.m4a',
    } as any);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('agree', agree.toString());
    formData.append('moca', '-1');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setIsProcessing(false);
        setIsRecording(false);
        console.log('Server timeout after 3 seconds, showing standard report');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      }, 3000);

      // Mock API call - replace with your actual API endpoint when available
      console.log('Mock prediction API call');
      clearTimeout(timeoutId);
      
      // Simulate API response
      const result = { 
        predicted_MMSE: Math.floor(Math.random() * 30) + 1, // Random score between 1-30
        status: 'success',
        message: 'Mock prediction completed'
      };
      const prediction = result.predicted_MMSE;
      console.log(prediction);
      console.log('Success:', result);
      setIsProcessing(false);
      navigation.navigate('Report' as never, { serverResponse: prediction });
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing(false);
      setIsRecording(false);
      
      // Check if it's a timeout/abort error
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        console.log('Request was aborted due to timeout, showing standard report');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      } else {
        console.log('Network error, showing standard report after 3 seconds');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      }
    }
  };

  const uploadWebAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    
    // Create a file from the blob with appropriate extension based on mime type
    const mimeType = audioBlob.type;
    let fileName = 'recording.webm';
    let fileType = 'audio/webm';
    
    if (mimeType.includes('wav')) {
      fileName = 'recording.wav';
      fileType = 'audio/wav';
    } else if (mimeType.includes('ogg')) {
      fileName = 'recording.ogg';
      fileType = 'audio/ogg';
    } else if (mimeType.includes('mp4')) {
      fileName = 'recording.mp4';
      fileType = 'audio/mp4';
    }
    
    const file = new File([audioBlob], fileName, { type: fileType });
    formData.append('file', file);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('agree', agree.toString());
    formData.append('moca', '-1');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setIsProcessing(false);
        setIsRecording(false);
        console.log('Server timeout after 3 seconds, showing standard report');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      }, 3000);

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const prediction = result.predicted_MMSE;
      console.log('Web recording prediction:', prediction);
      console.log('Success:', result);
      setIsProcessing(false);
      navigation.navigate('Report' as never, { serverResponse: prediction });
    } catch (error) {
      console.error('Error uploading web audio:', error);
      setIsProcessing(false);
      setIsRecording(false);
      
      // Check if it's a timeout/abort error
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        console.log('Request was aborted due to timeout, showing standard report');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      } else {
        console.log('Network error, showing standard report');
        navigation.navigate('Report' as never, { serverResponse: 'timeout' });
      }
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const renderRecordButton = () => {
    if (Platform.OS === 'web' && !webAudioSupported) {
      return (
        <View style={styles.webMessageContainer}>
          <View style={styles.webMessage}>
            <Text style={styles.webMessageTitle}>Browser Not Supported</Text>
            <Text style={styles.webMessageText}>
              Your browser does not support audio recording. Please try using Chrome, Firefox, or Safari for the best experience.
            </Text>
            <Text style={styles.webMessageTip}>
              💡 Tip: Make sure to allow microphone permissions when prompted.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.recordButton, styles.recordButtonDisabled]}
            disabled={true}
          >
            <Image
              source={require('../../assets/record_button.png')}
              style={[styles.recordButtonImage, styles.recordButtonImageDisabled]}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording && styles.recordButtonActive,
        ]}
        onPress={handleRecordPress}
        disabled={isProcessing}
      >
        <Image
          source={
            isRecording
              ? require('../../assets/stop_button.png')
              : require('../../assets/record_button.png')
          }
          style={styles.recordButtonImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={LinearGradient === View ? [colors.background] : [colors.background, colors.surfaceVariant]}
      style={[
        styles.container, 
        LinearGradient === View && { backgroundColor: colors.background },
        Platform.OS === 'web' && isMobileWeb && webMobileStyles.mobileContainer
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LanguageToggle />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/coookie.png')}
            style={styles.taskImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.controlsContainer}>
          {isProcessing ? (
            <LoadingSpinner text={t('processing')} />
          ) : (
            renderRecordButton()
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.timerText}>
            {t('timer')}: {timer}s
          </Text>
          {instructions.map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>
              {instruction}
            </Text>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    ...(Platform.OS === 'web' && isMobileWeb && {
      paddingBottom: 20, // Extra padding for mobile browsers
    }),
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  taskImage: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 400,
    maxHeight: 400,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: colors.recording,
  },
  recordButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  recordButtonImage: {
    width: 80,
    height: 80,
  },
  recordButtonImageDisabled: {
    opacity: 0.5,
  },
  webMessageContainer: {
    alignItems: 'center',
  },
  webMessage: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    maxWidth: width * 0.8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webMessageTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  webMessageText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.4,
    marginBottom: spacing.sm,
  },
  webMessageTip: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    ...(Platform.OS === 'web' && isMobileWeb && {
      paddingBottom: Math.max(spacing.xl, 30), // Ensure enough bottom padding
      marginTop: 'auto', // Push to bottom
    }),
  },
  timerText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.recording,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  instructionText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.lg * 1.3,
  },
});
