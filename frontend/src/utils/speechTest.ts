export class SpeechRecognitionTest {
  private recognition: SpeechRecognition | null = null;
  private supported: boolean;

  constructor() {
    this.supported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (this.supported) {
      const SpeechRecognitionCtor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionCtor) {
        this.recognition = new SpeechRecognitionCtor();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onerror = (event: Event) => {
      const err = event as unknown as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error', err.error, err.message);
    };
  }

  public start(): boolean {
    if (!this.supported || !this.recognition) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop errors if already stopped
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.supported;
  }

  public async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }
}

// Export a simple test function
export const testSpeechRecognition = () => {
  const test = new SpeechRecognitionTest();

  if (!test.isSpeechRecognitionSupported()) {
    return;
  }

  test.start();

  // Stop after 10 seconds
  setTimeout(() => {
    test.stop();
  }, 10000);
};
