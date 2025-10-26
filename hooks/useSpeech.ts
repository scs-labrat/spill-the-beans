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
  const recognitionRef = useRef<any | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!speechRecognitionAvailable) {
      console.warn("Speech recognition not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
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
    if (!audioContextRef.current) {
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

  return { isListening, startListening, stopListening, speak, speechRecognitionAvailable };
};