import React, { useState, useEffect, useRef } from 'react';
import type { Persona, ConversationLogEntry } from '../types';
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
}

const ConversationView: React.FC<ConversationViewProps> = ({
  persona,
  targetInfo,
  conversationLog,
  isLoading,
  onUserSubmit,
  onEndSession,
}) => {
  const [inputText, setInputText] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const handleTranscript = (transcript: string) => {
    setInputText(transcript);
    onUserSubmit(transcript);
  };

  const { isListening, startListening, stopListening, speak, speechRecognitionAvailable } = useSpeech(handleTranscript);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }

    const lastEntry = conversationLog[conversationLog.length - 1];
    if (lastEntry && lastEntry.speaker === 'Persona') {
      const voiceName = getVoiceForPersona(persona);
      speak(lastEntry.text, voiceName);
    }
  }, [conversationLog, speak, persona]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onUserSubmit(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-brand-secondary p-4 rounded-lg mb-4 shadow-lg border border-brand-accent/30">
        <h2 className="text-lg font-bold text-brand-accent">Engaging: {persona.name} ({persona.role})</h2>
        <p className="text-sm text-brand-subtle mt-1">
          <span className="font-semibold text-brand-text">Your Mission:</span> Subtly elicit the following information: 
          <span className="italic text-brand-accent/90"> "{targetInfo}"</span>
        </p>
      </div>

      <div ref={logContainerRef} className="flex-grow bg-brand-secondary/50 rounded-lg p-4 overflow-y-auto mb-4 shadow-inner">
        {conversationLog.map((entry, index) => (
          <div key={index} className={`mb-4 flex flex-col ${entry.speaker === 'User' ? 'items-end' : 'items-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-md ${entry.speaker === 'User' ? 'bg-brand-accent text-white' : 'bg-brand-secondary'}`}>
              <p className="font-bold text-sm mb-1">{entry.speaker === 'Persona' ? persona.name : 'You'}</p>
              <p className="text-base">{entry.text}</p>
              {entry.speaker === 'Persona' && entry.reasoning && (
                 <div className="mt-2 p-2 bg-black/20 rounded text-xs italic text-brand-subtle flex items-center gap-2">
                    <BrainIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{entry.reasoning}</span>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="mb-4 flex flex-col items-start">
                <div className="rounded-lg px-4 py-2 max-w-md bg-brand-secondary animate-pulse">
                    <p className="font-bold text-sm mb-1">{persona.name}</p>
                    <div className="h-3 bg-brand-primary/50 rounded w-24"></div>
                </div>
            </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your response or use the mic"}
            className="flex-grow bg-brand-secondary border border-brand-accent/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            disabled={isLoading}
          />
          {speechRecognitionAvailable && (
             <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-lg transition-colors duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-accent text-white hover:bg-brand-accent/80'}`}
                disabled={isLoading}
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
         <button
            onClick={onEndSession}
            className="w-full mt-3 text-center text-sm text-brand-subtle hover:text-brand-text"
            >
            End Session
        </button>
      </div>
    </div>
  );
};

export default ConversationView;