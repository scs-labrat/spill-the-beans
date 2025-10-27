
import React from 'react';
import type { Persona } from '../types';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-brand-subtle">{title}</h4>
    <div className="mt-1 text-brand-text/90">{children}</div>
  </div>
);


interface PersonaDetailViewProps {
  persona: Persona;
  onBack: () => void;
  onEdit?: () => void; // Make onEdit optional
}

const PersonaDetailView: React.FC<PersonaDetailViewProps> = ({ persona, onBack, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-brand-content-bg p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-brand-accent">{persona.name}</h2>
            <p className="text-xl text-brand-subtle -mt-1">{persona.role}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <button onClick={onEdit} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold px-4 py-2 rounded-lg transition-colors">
                  Edit
              </button>
            )}
            <button onClick={onBack} className="border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg transition-colors">
              &larr; Back to List
            </button>
          </div>
        </div>
        
        <div className="space-y-5">
          <DetailSection title="Psychology">
            <p>{persona.psychology}</p>
          </DetailSection>

          <DetailSection title="Strengths (Resistance)">
            <p>{persona.strengths}</p>
          </DetailSection>

          <DetailSection title="Weaknesses (Vulnerabilities)">
            <p>{persona.weaknesses}</p>
          </DetailSection>

          <DetailSection title="Target Information">
            <ul className="list-disc list-inside space-y-1">
              {persona.targetInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Conversation Starters">
             <ul className="list-disc list-inside space-y-1">
              {persona.conversationStarters.map((starter, index) => (
                <li key={index}>{starter}</li>
              ))}
            </ul>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailView;
