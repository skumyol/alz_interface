export interface WebAudioRecording {
  start: () => Promise<void>;
  stop: () => Promise<Blob>;
  getURI: () => string | null;
  cleanup: () => void;
}

export class WebAudioRecorder implements WebAudioRecording {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingBlob: Blob | null = null;
  private recordingUrl: string | null = null;
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    try {
      // Request microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        }
      });

      // Create MediaRecorder
      const options: MediaRecorderOptions = {
        mimeType: this.getSupportedMimeType(),
        audioBitsPerSecond: 128000,
      };

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      
      // Reset chunks
      this.audioChunks = [];
      
      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        this.recordingBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        });
        this.recordingUrl = URL.createObjectURL(this.recordingBlob);
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second
      
    } catch (error) {
      console.error('Error starting web recording:', error);
      throw new Error('Failed to start recording. Please check microphone permissions.');
    }
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      // Set up stop handler
      this.mediaRecorder.onstop = () => {
        if (this.recordingBlob) {
          resolve(this.recordingBlob);
        } else {
          reject(new Error('Recording failed to generate blob'));
        }
      };

      // Stop recording
      this.mediaRecorder.stop();
      
      // Stop media stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    });
  }

  getURI(): string | null {
    return this.recordingUrl;
  }

  cleanup(): void {
    if (this.recordingUrl) {
      URL.revokeObjectURL(this.recordingUrl);
      this.recordingUrl = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.recordingBlob = null;
    this.audioChunks = [];
    this.mediaRecorder = null;
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback
    return 'audio/webm';
  }

  // Convert blob to File object for FormData compatibility
  toFile(filename: string = 'recording.webm'): File | null {
    if (!this.recordingBlob) return null;
    
    return new File([this.recordingBlob], filename, {
      type: this.recordingBlob.type,
      lastModified: Date.now(),
    });
  }

  // Get recording duration (approximate)
  getDuration(): number {
    if (!this.recordingBlob) return 0;
    // This is an approximation - actual duration would need audio analysis
    return this.audioChunks.length; // seconds (since we collect every second)
  }
}

// Check if web audio recording is supported
export const isWebAudioRecordingSupported = (): boolean => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder
  );
};

// Request microphone permission
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Stop immediately
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
};