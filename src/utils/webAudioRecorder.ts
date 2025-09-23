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
  private startTime: number = 0;

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
      
      // Reset chunks and previous recordings
      this.audioChunks = [];
      this.recordingBlob = null;
      if (this.recordingUrl) {
        URL.revokeObjectURL(this.recordingUrl);
        this.recordingUrl = null;
      }
      
      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Audio chunk received:', event.data.size, 'bytes');
          this.audioChunks.push(event.data);
        }
      };

      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        console.log('Recording stopped, chunks:', this.audioChunks.length);
        if (this.audioChunks.length > 0) {
          this.recordingBlob = new Blob(this.audioChunks, { 
            type: this.getSupportedMimeType() 
          });
          this.recordingUrl = URL.createObjectURL(this.recordingBlob);
          console.log('Blob created successfully:', this.recordingBlob.size, 'bytes');
        } else {
          console.warn('No audio chunks available for blob creation');
        }
      };

      // Start recording with smaller timeslice for better data collection
      this.startTime = Date.now();
      this.mediaRecorder.start(100); // Collect data every 100ms instead of 1000ms
      
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

      if (this.mediaRecorder.state === 'inactive') {
        if (this.recordingBlob) {
          resolve(this.recordingBlob);
        } else {
          reject(new Error('Recording failed to generate blob'));
        }
        return;
      }

      // Check minimum recording duration (at least 1 second)
      const recordingDuration = Date.now() - this.startTime;
      if (recordingDuration < 1000) {
        console.warn('Recording duration too short:', recordingDuration, 'ms');
      }

      // Set up a one-time stop handler
      const handleStop = () => {
        // Give a small delay to ensure blob creation is complete
        setTimeout(() => {
          if (this.recordingBlob && this.recordingBlob.size > 0) {
            console.log('Successfully created blob with size:', this.recordingBlob.size);
            resolve(this.recordingBlob);
          } else {
            // Try to create blob from chunks if it doesn't exist
            if (this.audioChunks.length > 0) {
              console.log('Creating blob from', this.audioChunks.length, 'chunks');
              this.recordingBlob = new Blob(this.audioChunks, { 
                type: this.getSupportedMimeType() 
              });
              if (this.recordingBlob.size > 0) {
                this.recordingUrl = URL.createObjectURL(this.recordingBlob);
                console.log('Successfully created blob with size:', this.recordingBlob.size);
                resolve(this.recordingBlob);
              } else {
                reject(new Error('Recording failed to generate blob - blob size is 0'));
              }
            } else {
              reject(new Error('Recording failed to generate blob - no audio data'));
            }
          }
        }, 200); // Increased delay
      };

      // Remove any existing stop handler and add our new one
      this.mediaRecorder.onstop = handleStop;

      // Stop recording
      try {
        this.mediaRecorder.stop();
        
        // Stop media stream
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        reject(new Error('Failed to stop recording: ' + error));
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
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
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