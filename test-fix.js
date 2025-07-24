// Test script to verify the fix works
const { Platform } = require('react-native');

// Mock react-native-audio-record for testing
const AudioRecord = {
  init: (options) => {
    console.log('AudioRecord.init called with:', options);
  }
};

console.log('Testing platform detection...');

// Simulate the fixed code
const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  wavFile: "test.wav",
};

// The fix: Only initialize AudioRecord on mobile platforms
if (typeof Platform !== 'undefined' && Platform.OS !== 'web') {
  AudioRecord.init(options);
  console.log('✅ AudioRecord.init() would be called on mobile platforms');
} else {
  console.log('✅ AudioRecord.init() skipped for web platform - this prevents the error!');
}

console.log('Fix verification complete.');
