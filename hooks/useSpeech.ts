
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateSpeech } from '../services/geminiService';

// Polyfill for browsers that use webkit prefix
// FIX: Cast window to any to access non-standard properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const speechRecognitionAvailable = !!SpeechRecognition;

// --- Audio Decoding Helper Functions ---

/**
 * Decodes a base64 string into a Uint8Array.
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * The Gemini TTS API returns audio at a 24000 sample rate with 1 channel.
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000;
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const useSpeech = (onTranscript: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (!speechRecognitionAvailable) {
      console.warn("Speech recognition not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      onTranscriptRef.current(finalTranscriptRef.current + interimTranscript);
      setSpeechError(null); // Clear error on success
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech') {
        setSpeechError("Sorry, I didn't catch that. Please try again.");
      } else if (event.error === 'audio-capture') {
        setSpeechError("Audio capture error. Check your microphone connection.");
      } else if (event.error === 'not-allowed') {
        setSpeechError("Microphone access denied. Please allow microphone permissions in your browser settings.");
      } else {
        setSpeechError("A speech recognition error occurred. Please try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setSpeechError(null); // Clear previous errors
        finalTranscriptRef.current = '';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        // This can happen if recognition is already running.
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          console.warn("Speech recognition already started.");
        } else {
          console.error("Error starting speech recognition:", error);
          setSpeechError("Could not start listening. Check microphone permissions.");
          setIsListening(false);
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback(async (text: string, voiceName: string, onEnd?: () => void) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      try {
        // Use a 24000 sample rate to match the API output
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        onEnd?.();
        return;
      }
    }
    const audioContext = audioContextRef.current;
    
    try {
        const base64Audio = await generateSpeech(text, voiceName);
        if (!base64Audio) {
            console.error("Failed to generate speech audio.");
            onEnd?.(); // Ensure callback is fired even on failure
            return;
        }

        const audioBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, audioContext);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        if (onEnd) {
            source.addEventListener('ended', onEnd, { once: true });
        }
        source.start();

    } catch (error) {
        console.error("Error speaking text:", error);
        onEnd?.();
    }
  }, []);

  return { isListening, startListening, stopListening, speak, speechRecognitionAvailable, speechError };
};
