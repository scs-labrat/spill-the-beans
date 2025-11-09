
import React, { useState, useEffect, useRef } from 'react';
import type { Persona, ConversationLogEntry, GameMode } from '../types';
import { BrainIcon, MicIcon, StopIcon } from './icons';
import { useSpeech } from '../hooks/useSpeech';

interface ConversationViewProps {
  persona: Persona;
  targetInfo: string;
  conversationLog: ConversationLogEntry[];
  isLoading: boolean;
  onUserSubmit: (text: string) => void;
  onEndSession: () => void;
  gameMode: GameMode;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  persona,
  targetInfo,
  conversationLog,
  isLoading,
  onUserSubmit,
  onEndSession,
  gameMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPersonaSpeaking, setIsPersonaSpeaking] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const prevLogLengthRef = useRef(conversationLog.length);

  const { isListening, startListening, stopListening, speak, speechRecognitionAvailable, speechError } = useSpeech(
    (transcript) => {
      setInputText(transcript);
    }
  );

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }

    if (conversationLog.length > prevLogLengthRef.current) {
        const lastEntry = conversationLog[conversationLog.length - 1];
        if (lastEntry && lastEntry.speaker === 'Persona') {
            setIsPersonaSpeaking(true);
            speak(lastEntry.text, persona.voiceName || 'Zephyr', () => {
                setIsPersonaSpeaking(false);
                // Automatically start listening after persona speaks
                if (speechRecognitionAvailable && !isListening) {
                    startListening();
                }
            });
        }
    }
    prevLogLengthRef.current = conversationLog.length;

  }, [conversationLog, isListening, persona.voiceName, speak, speechRecognitionAvailable, startListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading && !isPersonaSpeaking) {
      if (isListening) {
        stopListening();
      }
      onUserSubmit(inputText);
      setInputText('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isInputDisabled = isLoading || isPersonaSpeaking;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-brand-content-bg p-4 rounded-lg mb-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-brand-accent">Engaging: {persona.name} ({persona.role})</h2>
        <p className="text-sm text-brand-subtle mt-1">
          {gameMode === 'elicit' ? (
            <>
              <span className="font-semibold text-brand-text">Your Mission:</span> Subtly elicit the following information: 
              <span className="italic text-brand-accent/90"> "{targetInfo}"</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-brand-text">Your Mission:</span> Defend yourself! {persona.name} will try to subtly elicit information. Your goal is to be friendly but protect sensitive details. The secret target will be revealed in the final analysis.
            </>
          )}
        </p>
      </div>

      <div ref={logContainerRef} className="flex-grow rounded-lg p-4 overflow-y-auto mb-4">
        {conversationLog.map((entry, index) => (
          <div key={index} className={`mb-4 flex flex-col ${entry.speaker === 'User' ? 'items-end' : 'items-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-md shadow-sm ${entry.speaker === 'User' ? 'bg-brand-accent text-white' : 'bg-brand-content-bg text-brand-text'}`}>
              <p className="font-bold text-sm mb-1">{entry.speaker === 'Persona' ? persona.name : 'You'}</p>
              <p className="text-base">{entry.text}</p>
              {gameMode === 'elicit' && entry.speaker === 'Persona' && entry.reasoning && (
                 <div className="mt-2 p-2 bg-brand-secondary rounded text-xs italic text-brand-subtle flex items-center gap-2">
                    <BrainIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{entry.reasoning}</span>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="mb-4 flex flex-col items-start">
                <div className="rounded-lg px-4 py-2 max-w-md bg-brand-content-bg animate-pulse">
                    <p className="font-bold text-sm mb-1">{persona.name}</p>
                    <div className="h-3 bg-brand-secondary rounded w-24"></div>
                </div>
            </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {speechRecognitionAvailable && (
            <button
                type="button"
                onClick={handleMicClick}
                disabled={isInputDisabled}
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-50 ${isListening ? 'bg-red-500 text-white' : 'bg-brand-secondary text-brand-subtle hover:bg-gray-300'}`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
                {isListening ? <StopIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
            </button>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response or use the microphone"
            className="flex-grow bg-brand-content-bg border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:bg-gray-100"
            disabled={isInputDisabled}
          />
          <button
            type="submit"
            className="bg-brand-accent text-white p-3 rounded-lg font-semibold hover:bg-brand-accent/80 transition-colors duration-200 disabled:opacity-50"
            disabled={isInputDisabled || !inputText.trim()}
          >
            Send
          </button>
        </form>
         {speechError && <p className="text-red-500 text-sm text-center mt-2">{speechError}</p>}
         <div className="h-6 mt-1"></div>
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
