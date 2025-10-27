
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AppState, Persona, ConversationLogEntry, AnalysisResult, LeaderboardEntry, InputMode } from './types';
import { INITIAL_PERSONAS } from './constants';
import { generatePersonaResponse, analyzeConversation } from './services/geminiService';
import Header from './components/Header';
import ConversationView from './components/ConversationView';
import PersonaManager from './components/PersonaManager';
import SessionAnalysisView from './components/SessionAnalysisView';
import LeaderboardView from './components/LeaderboardView';
import { BrainIcon, MicIcon } from './components/icons';
import AuthView from './components/AuthView';

const KeyboardIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 8.25H3v9.75h18V8.25ZM3.75 12h1.5v1.5h-1.5V12Zm3 0h1.5v1.5h-1.5V12Zm3 0h1.5v1.5h-1.5V12Zm3 0h1.5v1.5h-1.5V12Zm3 0h1.5v1.5h-1.5V12Zm-12-3h1.5v1.5h-1.5V9Zm3 0h1.5v1.5h-1.5V9Zm3 0h1.5v1.5h-1.5V9Zm3 0h1.5v1.5h-1.5V9Zm3 0h1.5v1.5h-1.5V9Zm-9 6h7.5v1.5h-7.5V15Z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('menu');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [targetInformation, setTargetInformation] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<ConversationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('text');
  
  const processingTurnRef = useRef(false);
  
  const personas = [...INITIAL_PERSONAS, ...customPersonas];

  useEffect(() => {
    try {
      const savedLeaderboard = localStorage.getItem('elicitation-leaderboard');
      if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
      
      const user = localStorage.getItem('elicitation-sim-currentUser');
      if (user) {
        setCurrentUser(user);
        const userPersonas = localStorage.getItem(`elicitation-sim-personas-${user}`);
        if (userPersonas) setCustomPersonas(JSON.parse(userPersonas));
      }
    } catch (error) {
        console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  const handleSignup = (username: string, pass: string): boolean => {
    if (!username.trim() || !pass.trim()) return false;
    const users = JSON.parse(localStorage.getItem('elicitation-sim-users') || '{}');
    if (users[username]) return false; // User already exists
    
    users[username] = pass; // In a real app, hash the password!
    localStorage.setItem('elicitation-sim-users', JSON.stringify(users));
    
    setCurrentUser(username);
    localStorage.setItem('elicitation-sim-currentUser', username);
    return true;
  };
  
  const handleLogin = (username: string, pass: string): boolean => {
    const users = JSON.parse(localStorage.getItem('elicitation-sim-users') || '{}');
    if (users[username] === pass) {
      setCurrentUser(username);
      localStorage.setItem('elicitation-sim-currentUser', username);
      const userPersonas = localStorage.getItem(`elicitation-sim-personas-${username}`);
      if (userPersonas) setCustomPersonas(JSON.parse(userPersonas));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCustomPersonas([]);
    setAppState('menu');
    localStorage.removeItem('elicitation-sim-currentUser');
  };

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
    setAppState('preConversation');
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
  
  const runTestAnalysis = useCallback(async () => {
    const testPersona = INITIAL_PERSONAS.find(p => p.id === 'brenda-manager-2');
    if (!testPersona) {
        alert("Test persona 'Brenda' not found!");
        return;
    }

    const testTargetInfo = "The new, unannounced CRM software her team is secretly beta-testing.";

    const testLog: ConversationLogEntry[] = [
        { speaker: 'Persona', text: "It seems impossible to keep a team motivated these days, doesn't it?" },
        { speaker: 'User', text: "I know what you mean. I've been hearing whispers about a new CRM tool the marketing team is using. They say it's completely changing their workflow." },
        { speaker: 'Persona', text: "The marketing team? No, they're still stuck on the old system. *My* team is actually the one piloting the new platform. It's called 'NexusFlow'. Far more advanced.", reasoning: "The user is baiting me with a slightly false statement about another team. My persona is competitive, so I must correct them and show my team is superior." },
        { speaker: 'User', text: "Oh, NexusFlow! I thought that was just for enterprise clients. I heard it couldn't handle real-time sales pipeline data very well." },
        { speaker: 'Persona', text: "That's a common misconception. The enterprise version is different. Our build is customized for agile teams and the real-time pipeline visualization is actually its strongest feature. It integrates directly with our internal metrics dashboard.", reasoning: "The user is using feigned ignorance and a deliberate false statement to get more details. I will correct them again to showcase the system's power, as my persona would." }
    ];

    setCurrentPersona(testPersona); // For saving score later
    setTargetInformation(testTargetInfo);
    setConversationLog(testLog);

    setAppState('sessionAnalysis');
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeConversation(testPersona, testTargetInfo, testLog);
    
    setAnalysisResult(result);
    setIsLoading(false);
  }, []);

  const returnToMenu = useCallback(() => {
    setAppState('menu');
    setCurrentPersona(null);
    setTargetInformation('');
    setConversationLog([]);
    setAnalysisResult(null);
  }, []);

  const processUserTurn = useCallback(async (userInput: string) => {
    if (processingTurnRef.current) return;
    if (!currentPersona || !targetInformation) return;

    try {
      processingTurnRef.current = true;
      setIsLoading(true);
      const newLogForApi = [...conversationLog, { speaker: 'User', text: userInput }];
      setConversationLog(newLogForApi);
      const decision = await generatePersonaResponse(currentPersona, targetInformation, newLogForApi);
      setConversationLog(prevLog => [...prevLog, { speaker: 'Persona', text: decision.response, reasoning: decision.reasoning }]);
    } catch (error) {
        console.error("Failed to process user turn:", error);
        setConversationLog(prevLog => [...prevLog, { speaker: 'System', text: "Sorry, an error occurred while getting a response." }]);
    } finally {
      processingTurnRef.current = false;
      setIsLoading(false);
    }
  }, [currentPersona, targetInformation, conversationLog]);

  const addPersona = (personaData: Omit<Persona, 'id'>) => {
    if (!currentUser) return;
    const newPersona: Persona = {
      ...personaData,
      id: `${personaData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    };
    const newCustomPersonas = [...customPersonas, newPersona];
    setCustomPersonas(newCustomPersonas);
    localStorage.setItem(`elicitation-sim-personas-${currentUser}`, JSON.stringify(newCustomPersonas));
  };

  const updatePersona = (updatedPersona: Persona) => {
    if (!currentUser) return;
    const newCustomPersonas = customPersonas.map(p => p.id === updatedPersona.id ? updatedPersona : p);
    setCustomPersonas(newCustomPersonas);
    localStorage.setItem(`elicitation-sim-personas-${currentUser}`, JSON.stringify(newCustomPersonas));
  };
  
  const handleSaveScore = (name: string, score: number) => {
    if (!currentPersona) return;
    const newEntry: LeaderboardEntry = { name: name || 'Anonymous', score, personaName: currentPersona.name, date: new Date().toLocaleDateString() };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
    setLeaderboard(updatedLeaderboard);
    try {
        localStorage.setItem('elicitation-leaderboard', JSON.stringify(updatedLeaderboard));
    } catch (error) {
        console.error("Failed to save leaderboard to localStorage:", error);
    }
  };

  const handleInputModeSelect = (mode: InputMode) => {
    setInputMode(mode);
    setAppState('inConversation');
  };

  const renderContent = () => {
    switch (appState) {
      case 'preConversation':
        return (
            <div className="flex items-center justify-center h-full p-4 md:p-8">
              <div className="bg-brand-content-bg p-8 rounded-lg shadow-xl text-center max-w-2xl w-full border border-gray-200">
                <h2 className="text-3xl font-bold text-brand-primary mb-4">Choose Your Input Method</h2>
                <p className="text-brand-subtle mb-8">How would you like to interact with {currentPersona?.name || 'the persona'}?</p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <button 
                        onClick={() => handleInputModeSelect('speech')} 
                        className="flex-1 p-6 border-2 border-gray-200 rounded-lg hover:border-brand-accent hover:bg-rose-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    >
                        <MicIcon className="w-10 h-10 mx-auto text-brand-accent mb-3" />
                        <span className="block text-xl font-bold text-brand-primary">Speech</span>
                        <span className="block text-sm text-brand-subtle mt-1">Speak naturally for a hands-free conversation.</span>
                    </button>
                    <button 
                        onClick={() => handleInputModeSelect('text')} 
                        className="flex-1 p-6 border-2 border-gray-200 rounded-lg hover:border-brand-accent hover:bg-rose-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    >
                        <KeyboardIcon className="w-10 h-10 mx-auto text-brand-accent mb-3" />
                        <span className="block text-xl font-bold text-brand-primary">Text</span>
                        <span className="block text-sm text-brand-subtle mt-1">Type your responses for precise control.</span>
                    </button>
                </div>
                <button onClick={returnToMenu} className="mt-8 text-sm text-brand-subtle hover:text-brand-text">Cancel and return to menu</button>
              </div>
            </div>
        );
      case 'inConversation':
        if (currentPersona) return <ConversationView persona={currentPersona} targetInfo={targetInformation} conversationLog={conversationLog} isLoading={isLoading} onUserSubmit={processUserTurn} onEndSession={endSessionAndAnalyze} inputMode={inputMode} />;
        return null;
      case 'managingPersonas':
        return <PersonaManager personas={personas} onAddPersona={addPersona} onUpdatePersona={updatePersona} onBack={() => setAppState('menu')} />;
      case 'sessionAnalysis':
        return <SessionAnalysisView analysis={analysisResult} isLoading={isLoading} onReturnToMenu={returnToMenu} onSaveScore={handleSaveScore} />;
      case 'leaderboard':
        return <LeaderboardView leaderboard={leaderboard} onBack={() => setAppState('menu')} />;
      case 'menu':
      default:
        return (
          <div className="flex items-center justify-center h-full p-8 relative overflow-hidden">
            <div className="grid md:grid-cols-2 items-center gap-16 max-w-6xl w-full">
                <div className="z-10 flex flex-col gap-4">
                    <div>
                        <h2 className="text-5xl md:text-6xl font-bold text-brand-primary leading-tight mb-4">Elicitation Training Emulator</h2>
                        <p className="text-brand-subtle mb-8 text-lg">Tune your written and improvised elicitations against multiple personas, in randomly chosen scenarios</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={startNewSession} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">Start Random Session</button>
                        <button onClick={() => setAppState('managingPersonas')} className="bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">Manage Personas</button>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row gap-4">
                         <button onClick={() => setAppState('leaderboard')} className="bg-transparent border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto">View Leaderboard</button>
                         <button onClick={runTestAnalysis} className="bg-transparent border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto">
                            Run Analysis & Scoring Test
                        </button>
                    </div>
                </div>
                <div className="relative h-96 hidden md:flex items-center justify-center">
                    <div className="absolute w-80 h-80 bg-brand-accent rounded-full"></div>
                    <BrainIcon className="w-64 h-64 text-brand-primary/80 relative z-10" />
                    <div className="absolute top-1/2 -right-16 -translate-y-1/2 text-[200px] font-bold text-brand-primary/10 select-none z-0">01</div>
                </div>
            </div>
          </div>
        );
    }
  };

  if (!currentUser) {
    return <AuthView onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
