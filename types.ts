export interface Persona {
  id: string;
  name: string;
  role: string;
  voiceName?: string;
  psychology: string;
  strengths: string;
  weaknesses: string;
  targetInfo: string[];
  conversationStarters: string[];
}

export interface ConversationLogEntry {
  speaker: 'User' | 'Persona' | 'System';
  text: string;
  reasoning?: string;
}

export interface AnalysisTechnique {
  technique: string;
  example: string;
  analysis: string;
}

export interface AnalysisOpportunity {
    technique: string;
    suggestion: string;
    example: string;
}

export interface AnalysisResult {
    summary: string;
    infoElicited: boolean;
    successfulTechniques: AnalysisTechnique[];
    missedOpportunities: AnalysisOpportunity[];
    overallFeedback: string;
}

export type AppState = 'menu' | 'inConversation' | 'managingPersonas' | 'sessionAnalysis';

export type GameMode = 'elicit' | 'resist';