
import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, TargetIcon, BrainIcon, TrophyIcon } from './icons';

interface SessionAnalysisViewProps {
    analysis: AnalysisResult | null;
    isLoading: boolean;
    onReturnToMenu: () => void;
    onSaveScore: (name: string, score: number) => void;
}

const LoadingView: React.FC = () => (
    <div className="text-center">
        <BrainIcon className="w-16 h-16 text-brand-accent mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold mt-4">Analyzing Your Performance...</h2>
        <p className="text-brand-subtle mt-2">Our AI coach is reviewing your conversation to provide detailed feedback.</p>
    </div>
);

const AnalysisCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-brand-content-bg p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
        </div>
        <div className="space-y-3 text-brand-text/90">
            {children}
        </div>
    </div>
);


const SessionAnalysisView: React.FC<SessionAnalysisViewProps> = ({ analysis, isLoading, onReturnToMenu, onSaveScore }) => {
    const [userName, setUserName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (analysis && analysis.score > 0) {
            onSaveScore(userName, analysis.score);
            setIsSubmitted(true);
        }
    };

    if (isLoading || !analysis) {
        return (
            <div className="flex items-center justify-center h-full p-4">
                <LoadingView />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="space-y-6">
                <div className={`p-6 rounded-lg text-white flex flex-col md:flex-row items-center gap-4 ${analysis.infoElicited ? 'bg-green-600' : 'bg-red-500'}`}>
                    <div className="flex-shrink-0">
                         {analysis.infoElicited ? <CheckCircleIcon className="w-12 h-12" /> : <XCircleIcon className="w-12 h-12" />}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-2xl font-bold">{analysis.infoElicited ? "Objective Achieved!" : "Objective Not Met"}</h2>
                        <p className="text-lg opacity-90">{analysis.summary}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg text-center">
                        <p className="text-sm font-bold opacity-80">FINAL SCORE</p>
                        <p className="text-4xl font-bold">{analysis.score}</p>
                    </div>
                </div>

                {analysis.successfulTechniques && analysis.successfulTechniques.length > 0 && (
                     <AnalysisCard title="Successful Techniques" icon={<TargetIcon className="w-6 h-6 text-brand-accent" />}>
                        {analysis.successfulTechniques.map((item, index) => (
                             <div key={index} className="p-3 bg-brand-secondary/50 rounded-md">
                                <p className="font-bold text-brand-text">{item.technique}</p>
                                <blockquote className="border-l-4 border-brand-accent/50 pl-3 my-1 italic text-brand-subtle">"{item.example}"</blockquote>
                                <p className="text-sm">{item.analysis}</p>
                            </div>
                        ))}
                    </AnalysisCard>
                )}

                {analysis.missedOpportunities && analysis.missedOpportunities.length > 0 && (
                    <AnalysisCard title="Missed Opportunities" icon={<LightbulbIcon className="w-6 h-6 text-yellow-500" />}>
                        {analysis.missedOpportunities.map((item, index) => (
                             <div key={index} className="p-3 bg-brand-secondary/50 rounded-md">
                                <p className="font-bold text-brand-text">Could have used: {item.technique}</p>
                                <p className="text-sm mt-1">{item.suggestion}</p>
                                <p className="mt-1 text-sm"><span className="font-semibold">Example:</span> <span className="italic text-brand-subtle">"{item.example}"</span></p>
                            </div>
                        ))}
                    </AnalysisCard>
                )}

                <AnalysisCard title="Coach's Final Word" icon={<BrainIcon className="w-6 h-6 text-brand-subtle" />}>
                    <p>{analysis.overallFeedback}</p>
                </AnalysisCard>
                
                {!isSubmitted && analysis.score > 0 && (
                    <div className="bg-brand-content-bg p-4 rounded-lg border border-yellow-400">
                         <h3 className="text-xl font-bold text-center text-yellow-600 mb-2">High Score!</h3>
                         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter your name for the leaderboard"
                                required
                                className="flex-grow w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button type="submit" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                <TrophyIcon className="w-5 h-5 inline-block mr-2" />
                                Submit Score
                            </button>
                         </form>
                    </div>
                )}

                {isSubmitted && (
                     <div className="p-4 rounded-lg bg-green-100 text-green-800 text-center font-semibold">
                        Your score has been saved to the leaderboard!
                     </div>
                )}


                <div className="text-center pt-4 pb-8">
                    <button onClick={onReturnToMenu} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                        Return to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionAnalysisView;
