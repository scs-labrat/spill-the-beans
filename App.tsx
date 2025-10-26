
import React, { useState, useCallback } from 'react';
import type { AppState, Persona, ConversationLogEntry } from './types';
import { INITIAL_PERSONAS } from './constants';
import { generatePersonaResponse } from './services/geminiService';
import Header from './components/Header';
import ConversationView from './components/ConversationView';
import PersonaManager from './components/PersonaManager';
import { BrainIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('menu');
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [targetInformation, setTargetInformation] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<ConversationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startNewSession = useCallback(() => {
    if (personas.length === 0) {
      alert("Please add a persona before starting a session.");
      setAppState('managingPersonas');
      return;
    }
    const persona = personas[Math.floor(Math.random() * personas.length)];
    const targetInfo = persona.targetInfo[Math.floor(Math.random() * persona.targetInfo.length)];
    const openingLine = persona.conversationStarters[Math.floor(Math.random() * persona.conversationStarters.length)];

    setCurrentPersona(persona);
    setTargetInformation(targetInfo);
    setConversationLog([{ speaker: 'Persona', text: openingLine }]);
    setAppState('inConversation');
  }, [personas]);
  
  const endSession = useCallback(() => {
    setAppState('menu');
    setCurrentPersona(null);
    setTargetInformation('');
    setConversationLog([]);
  }, []);

  const processUserTurn = useCallback(async (userInput: string) => {
    if (!currentPersona || !targetInformation) return;

    const newLog: ConversationLogEntry[] = [...conversationLog, { speaker: 'User', text: userInput }];
    setConversationLog(newLog);
    setIsLoading(true);

    const decision = await generatePersonaResponse(currentPersona, targetInformation, newLog);

    setConversationLog(prevLog => [...prevLog, { speaker: 'Persona', text: decision.response, reasoning: decision.reasoning }]);
    setIsLoading(false);
  }, [currentPersona, targetInformation, conversationLog]);

  const addPersona = (personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      ...personaData,
      id: `${personaData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    };
    setPersonas(prev => [...prev, newPersona]);
  };

  const renderContent = () => {
    switch (appState) {
      case 'inConversation':
        if (currentPersona) {
          return (
            <ConversationView
              persona={currentPersona}
              targetInfo={targetInformation}
              conversationLog={conversationLog}
              isLoading={isLoading}
              onUserSubmit={processUserTurn}
              onEndSession={endSession}
            />
          );
        }
        return null; // Should not happen
      case 'managingPersonas':
        return <PersonaManager personas={personas} onAddPersona={addPersona} onBack={() => setAppState('menu')} />;
      case 'menu':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <BrainIcon className="w-24 h-24 text-brand-accent mb-4"/>
            <h2 className="text-4xl font-bold mb-2">Welcome to the Simulator</h2>
            <p className="max-w-xl text-brand-subtle mb-8">
              Choose an option below to either begin a new training scenario against a random AI persona or to view and create new personas for your training sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={startNewSession} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                Start Random Session
              </button>
              <button onClick={() => setAppState('managingPersonas')} className="bg-brand-secondary hover:bg-brand-secondary/70 font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                Manage Personas
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <main className="flex-grow overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
