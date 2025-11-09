
import React, { useState, useCallback } from 'react';
import type { AppState, Persona, ConversationLogEntry, AnalysisResult, GameMode } from './types';
import { INITIAL_PERSONAS, ATTACK_MODE_TARGETS } from './constants';
import { generatePersonaResponse, analyzeConversation } from './services/geminiService';
import Header from './components/Header';
import ConversationView from './components/ConversationView';
import PersonaManager from './components/PersonaManager';
import SessionAnalysisView from './components/SessionAnalysisView';
import LandingPage from './components/LandingPage';
import { BrainIcon } from './components/icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>('menu');
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [attackModeTargets, setAttackModeTargets] = useState<string[]>(ATTACK_MODE_TARGETS);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [targetInformation, setTargetInformation] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<ConversationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('elicit');

  // --- Auth Handlers ---
  const handleLogin = useCallback(() => {
    // In a real app, you'd verify credentials here
    setIsAuthenticated(true);
  }, []);

  const handleRegister = useCallback(() => {
    // In a real app, you'd create a user here
    setIsAuthenticated(true);
  }, []);
  
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    // Reset app state on logout
    setAppState('menu');
    setCurrentPersona(null);
    setTargetInformation('');
    setConversationLog([]);
    setAnalysisResult(null);
  }, []);

  // --- Game Flow Handlers ---
  const startElicitationPractice = useCallback(() => {
    if (personas.length === 0) {
      alert("Please add a persona before starting a session.");
      setAppState('managingPersonas');
      return;
    }
    setGameMode('elicit');
    const persona = personas[Math.floor(Math.random() * personas.length)];
    const targetInfo = persona.targetInfo[Math.floor(Math.random() * persona.targetInfo.length)];
    const openingLine = persona.conversationStarters[Math.floor(Math.random() * persona.conversationStarters.length)];

    setCurrentPersona(persona);
    setTargetInformation(targetInfo);
    setConversationLog([{ speaker: 'Persona', text: openingLine, reasoning: "This is my opening line to set the scene." }]);
    setAppState('inConversation');
  }, [personas]);

  const startAntiElicitationPractice = useCallback(() => {
    if (personas.length === 0) {
      alert("Please add a persona before starting a session.");
      setAppState('managingPersonas');
      return;
    }
    setGameMode('resist');
    const persona = personas[Math.floor(Math.random() * personas.length)];
    const targetInfo = attackModeTargets[Math.floor(Math.random() * attackModeTargets.length)];
    const openingLine = persona.conversationStarters[Math.floor(Math.random() * persona.conversationStarters.length)];

    setCurrentPersona(persona);
    setTargetInformation(targetInfo);
    setConversationLog([{ speaker: 'Persona', text: openingLine, reasoning: "This is my opening line to try and build rapport before I begin my elicitation attempt." }]);
    setAppState('inConversation');
  }, [personas, attackModeTargets]);
  
  const endSessionAndAnalyze = useCallback(async () => {
    if (!currentPersona || !targetInformation || conversationLog.length <= 1) {
        setAppState('menu');
        return;
    };

    setAppState('sessionAnalysis');
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeConversation(currentPersona, targetInformation, conversationLog, gameMode);
    
    setAnalysisResult(result);
    setIsLoading(false);
  }, [currentPersona, targetInformation, conversationLog, gameMode]);

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

    const decision = await generatePersonaResponse(currentPersona, targetInformation, newLog, gameMode);

    setConversationLog(prevLog => [...prevLog, { speaker: 'Persona', text: decision.response, reasoning: decision.reasoning }]);
    setIsLoading(false);
  }, [currentPersona, targetInformation, conversationLog, gameMode]);

  // --- Data Management Handlers ---
  const addPersona = (personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      ...personaData,
      id: `${personaData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    };
    setPersonas(prev => [...prev, newPersona]);
  };

  const addPersonas = (personaData: any[]) => {
    const newPersonas: Persona[] = personaData.map((p, index) => ({
      name: p.name,
      role: p.role,
      psychology: p.psychology || 'No psychology provided.',
      strengths: p.strengths || 'No strengths provided.',
      weaknesses: p.weaknesses || 'No weaknesses provided.',
      targetInfo: Array.isArray(p.targetInfo) ? p.targetInfo : [],
      conversationStarters: Array.isArray(p.conversationStarters) ? p.conversationStarters : [],
      voiceName: p.voiceName || 'Zephyr',
      id: `${p.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`
    }));
    setPersonas(prev => [...prev, ...newPersonas]);
  };

  const addAttackTargets = (targets: string[]) => {
    setAttackModeTargets(prev => [...new Set([...prev, ...targets])]);
  };

  const renderMainApp = () => {
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
              gameMode={gameMode}
            />
          );
        }
        return null;
      case 'managingPersonas':
        return <PersonaManager 
                    personas={personas} 
                    onAddPersona={addPersona} 
                    onAddPersonas={addPersonas}
                    onAddAttackTargets={addAttackTargets}
                    onBack={() => setAppState('menu')} 
                />;
      case 'sessionAnalysis':
        return <SessionAnalysisView analysis={analysisResult} isLoading={isLoading} onReturnToMenu={returnToMenu} gameMode={gameMode} targetInfo={targetInformation} />;
      case 'menu':
      default:
        return (
          <div className="flex items-center justify-center h-full p-8 relative overflow-hidden">
            <div className="grid md:grid-cols-2 items-center gap-16 max-w-6xl w-full">
                {/* Left Column: Text & CTAs */}
                <div className="z-10">
                    <h2 className="text-5xl md:text-6xl font-bold text-brand-primary leading-tight mb-4">
                        Elicitation & <br/>Anti-Elicitation <br/>Training Simulator
                    </h2>
                    <p className="text-brand-subtle mb-8 text-lg">
                        Practice extracting information (Elicitation) or protecting it (Anti-Elicitation) against adaptive AI personas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={startElicitationPractice} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            Practice Elicitation
                        </button>
                        <button onClick={startAntiElicitationPractice} className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            Practice Anti-Elicitation
                        </button>
                    </div>
                     <div className="mt-8">
                         <button onClick={() => setAppState('managingPersonas')} className="bg-transparent border-2 border-brand-subtle text-brand-subtle hover:bg-brand-subtle hover:text-white font-bold py-2 px-4 rounded-lg transition-colors text-md">
                            Manage Personas & Data
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
    <div className="flex flex-col h-screen font-sans bg-brand-secondary">
      {isAuthenticated ? (
        <>
          <Header onLogout={handleLogout} />
          <main className="flex-grow overflow-hidden">
            {renderMainApp()}
          </main>
        </>
      ) : (
        <LandingPage onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
};

export default App;
