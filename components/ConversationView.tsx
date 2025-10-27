
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Persona, ConversationLogEntry, InputMode } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { getVoiceForPersona } from '../services/geminiService';
import { MicIcon, BrainIcon } from './icons';

interface ConversationViewProps {
  persona: Persona;
  targetInfo: string;
  conversationLog: ConversationLogEntry[];
  isLoading: boolean;
  onUserSubmit: (text: string) => void;
  onEndSession: () => void;
  inputMode: InputMode;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  persona,
  targetInfo,
  conversationLog,
  isLoading,
  onUserSubmit,
  onEndSession,
  inputMode,
}) => {
  const [inputText, setInputText] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const handleTranscript = useCallback((transcript: string) => {
    if (inputMode === 'speech') {
      onUserSubmit(transcript);
    } else {
      setInputText(transcript);
    }
  }, [inputMode, onUserSubmit]);

  const { isListening, startListening, stopListening, speak, speechRecognitionAvailable, speechError } = useSpeech(handleTranscript);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }

    const lastEntry = conversationLog[conversationLog.length - 1];
    if (lastEntry && lastEntry.speaker === 'Persona') {
      const voiceName = getVoiceForPersona(persona);
      const onSpeechEnd = () => {
          if (inputMode === 'speech' && !isLoading) {
              startListening();
          }
      };
      speak(lastEntry.text, voiceName, onSpeechEnd);
    }
  }, [conversationLog, speak, persona, inputMode, isLoading, startListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onUserSubmit(inputText);
      setInputText('');
    }
  };

  const renderInputArea = () => {
      if (inputMode === 'text') {
          return (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type your response or use the mic"}
                    className="flex-grow bg-brand-content-bg border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    disabled={isLoading}
                />
                {speechRecognitionAvailable && (
                    <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        className={`p-3 rounded-lg transition-colors duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-accent text-white hover:bg-brand-accent/80'}`}
                        disabled={isLoading}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        <MicIcon className="w-6 h-6" />
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-brand-accent text-white p-3 rounded-lg font-semibold hover:bg-brand-accent/80 transition-colors duration-200 disabled:opacity-50"
                    disabled={isLoading || !inputText.trim()}
                >
                    Send
                </button>
            </form>
          );
      }

      // Speech mode UI
      if (inputMode === 'speech') {
          if (!speechRecognitionAvailable) {
            return <p className="text-center text-red-500">Speech recognition is not available in this browser.</p>
          }
          return (
            <div className="flex flex-col items-center justify-center h-20">
                {isListening ? (
                    <div className="flex items-center gap-4">
                        <span className="text-brand-subtle italic text-lg animate-pulse">Listening...</span>
                        <button 
                            onClick={stopListening}
                            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Done Speaking
                        </button>
                    </div>
                ) : (
                    <span className="text-brand-subtle">{isLoading ? 'Persona is thinking...' : 'Waiting for persona to finish...'}</span>
                )}
            </div>
          );
      }
      return null;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-brand-content-bg p-4 rounded-lg mb-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-brand-accent">Engaging: {persona.name} ({persona.role})</h2>
        <p className="text-sm text-brand-subtle mt-1">
          <span className="font-semibold text-brand-text">Your Mission:</span> Subtly elicit the following information: 
          <span className="italic text-brand-accent/90"> "{targetInfo}"</span>
        </p>
      </div>

      <div ref={logContainerRef} className="flex-grow rounded-lg p-4 overflow-y-auto mb-4">
        {conversationLog.map((entry, index) => (
          <div key={index} className={`mb-4 flex flex-col ${entry.speaker === 'User' ? 'items-end' : 'items-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-md shadow-sm ${entry.speaker === 'User' ? 'bg-brand-accent text-white' : 'bg-brand-content-bg text-brand-text'}`}>
              <p className="font-bold text-sm mb-1">{entry.speaker === 'Persona' ? persona.name : 'You'}</p>
              <p className="text-base">{entry.text}</p>
              {entry.speaker === 'Persona' && entry.reasoning && (
                 <div className="mt-2 p-2 bg-brand-secondary rounded text-xs italic text-brand-subtle flex items-center gap-2">
                    <BrainIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{entry.reasoning}</span>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && conversationLog[conversationLog.length - 1]?.speaker === 'User' && (
            <div className="mb-4 flex flex-col items-start">
                <div className="rounded-lg px-4 py-2 max-w-md bg-brand-content-bg animate-pulse">
                    <p className="font-bold text-sm mb-1">{persona.name}</p>
                    <div className="h-3 bg-brand-secondary rounded w-24"></div>
                </div>
            </div>
        )}
      </div>

      <div className="flex-shrink-0">
         {renderInputArea()}
         <div className="h-6 mt-1 flex items-center justify-center">
            {speechError && (
              <p className="text-red-500 text-sm">{speechError}</p>
            )}
         </div>
         <button
            onClick={onEndSession}
            className="w-full mt-1 text-center text-sm text-brand-subtle hover:text-brand-text"
            >
            End Session
        </button>
      </div>
    </div>
  );
};

export default ConversationView;
