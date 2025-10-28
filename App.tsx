
import React, { useState, useCallback } from 'react';
import type { AppState, Persona, ConversationLogEntry, AnalysisResult } from './types';
import { INITIAL_PERSONAS } from './constants';
import { generatePersonaResponse, analyzeConversation } from './services/geminiService';
import Header from './components/Header';
import ConversationView from './components/ConversationView';
import PersonaManager from './components/PersonaManager';
import SessionAnalysisView from './components/SessionAnalysisView';
import { BrainIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('menu');
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [targetInformation, setTargetInformation] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<ConversationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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
  
  const endSessionAndAnalyze = useCallback(async () => {
    if (!currentPersona || !targetInformation || conversationLog.length <= 1) {
        setAppState('menu');
        return;
    };

    setAppState('sessionAnalysis');
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeConversation(currentPersona, targetInformation, conversationLog);
    
    setAnalysisResult(result);
    setIsLoading(false);
  }, [currentPersona, targetInformation, conversationLog]);

  const returnToMenu = useCallback(() => {
    setAppState('menu');
    setCurrentPersona(null);
    setTargetInformation('');
    setConversationLog([]);
    setAnalysisResult(null);
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
              onEndSession={endSessionAndAnalyze}
            />
          );
        }
        return null;
      case 'managingPersonas':
        return <PersonaManager personas={personas} onAddPersona={addPersona} onBack={() => setAppState('menu')} />;
      case 'sessionAnalysis':
        return <SessionAnalysisView analysis={analysisResult} isLoading={isLoading} onReturnToMenu={returnToMenu} />;
      case 'menu':
      default:
        return (
          <div className="flex items-center justify-center h-full p-8 relative overflow-hidden">
            <div className="grid md:grid-cols-2 items-center gap-16 max-w-6xl w-full">
                {/* Left Column: Text & CTAs */}
                <div className="z-10">
                    <h2 className="text-5xl md:text-6xl font-bold text-brand-primary leading-tight mb-4">
                        Elicitation Training Emulator
                    </h2>
                    <p className="text-brand-subtle mb-8 text-lg">
                        Tune your written and improvised elicitations against multiple personas, in randomly chosen scenarios
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={startNewSession} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            Start Random Session
                        </button>
                        <button onClick={() => setAppState('managingPersonas')} className="bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            Manage Personas
                        </button>
                    </div>
                </div>

                {/* Right Column: Visual Element */}
                <div className="relative h-96 hidden md:flex items-center justify-center">
                    <div className="absolute w-80 h-80 bg-brand-accent rounded-full"></div>
                    <BrainIcon className="w-64 h-64 text-brand-primary/80 relative z-10" />
                    <div className="absolute top-1/2 -right-16 -translate-y-1/2 text-[200px] font-bold text-brand-primary/10 select-none z-0">
                        01
                    </div>
                </div>
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