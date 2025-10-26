
import React, { useState } from 'react';
import type { Persona } from '../types';
import { PlusIcon } from './icons';
import PersonaDetailView from './PersonaDetailView';

interface PersonaManagerProps {
  personas: Persona[];
  onAddPersona: (persona: Omit<Persona, 'id'>) => void;
  onBack: () => void;
}

const PersonaCard: React.FC<{ persona: Persona; onClick: () => void }> = ({ persona, onClick }) => (
  <div onClick={onClick} className="bg-brand-secondary p-4 rounded-lg border border-brand-accent/20 shadow-md hover:border-brand-accent/50 hover:shadow-xl transition-all duration-200 cursor-pointer">
    <h3 className="text-xl font-bold text-brand-accent">{persona.name} - <span className="text-lg font-normal text-brand-text">{persona.role}</span></h3>
    <div className="mt-3 space-y-2 text-sm">
      <p><strong className="text-brand-subtle">Psychology:</strong> {persona.psychology}</p>
      <p><strong className="text-brand-subtle">Strengths:</strong> {persona.strengths}</p>
      <p><strong className="text-brand-subtle">Weaknesses:</strong> {persona.weaknesses}</p>
      <div>
        <strong className="text-brand-subtle">Target Info Samples:</strong>
        <ul className="list-disc list-inside ml-2 text-brand-text/80">
          {persona.targetInfo.slice(0, 2).map((info, i) => <li key={i}>{info}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

const PersonaManager: React.FC<PersonaManagerProps> = ({ personas, onAddPersona, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [newPersona, setNewPersona] = useState({
    name: '', role: '', psychology: '', strengths: '', weaknesses: '', targetInfo: '', conversationStarters: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPersona(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const personaToAdd = {
      ...newPersona,
      targetInfo: newPersona.targetInfo.split('\n').filter(Boolean),
      conversationStarters: newPersona.conversationStarters.split('\n').filter(Boolean),
    };
    onAddPersona(personaToAdd);
    setNewPersona({ name: '', role: '', psychology: '', strengths: '', weaknesses: '', targetInfo: '', conversationStarters: '' });
    setShowForm(false);
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'input' },
    { name: 'role', label: 'Role', type: 'input' },
    { name: 'psychology', label: 'Psychology', type: 'textarea' },
    { name: 'strengths', label: 'Strengths (Resistance)', type: 'textarea' },
    { name: 'weaknesses', label: 'Weaknesses (Vulnerabilities to elicitation techniques)', type: 'textarea' },
    { name: 'targetInfo', label: 'Target Information (one per line)', type: 'textarea' },
    { name: 'conversationStarters', label: 'Conversation Starters (one per line)', type: 'textarea' },
  ] as const;

  if (selectedPersona) {
    return <PersonaDetailView persona={selectedPersona} onBack={() => setSelectedPersona(null)} />;
  }


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Personas</h2>
        <button onClick={onBack} className="bg-brand-secondary hover:bg-brand-accent/20 px-4 py-2 rounded-lg transition-colors">
          Back to Menu
        </button>
      </div>
      
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="mb-6 w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-6 h-6" /> Add New Persona
        </button>
      )}

      {showForm && (
        <div className="bg-brand-secondary p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4 text-brand-accent">Create a New Persona</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map(field => (
                        <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-brand-subtle mb-1">{field.label}</label>
                        {field.type === 'input' ? (
                             <input type="text" id={field.name} name={field.name} value={newPersona[field.name]} onChange={handleChange} required className="w-full bg-brand-primary p-2 rounded-md border border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                        ) : (
                            <textarea id={field.name} name={field.name} value={newPersona[field.name]} onChange={handleChange} required rows={3} className="w-full bg-brand-primary p-2 rounded-md border border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder={field.name === 'psychology' ? "Describe the persona's core motivations, beliefs, and typical emotional responses." : undefined}></textarea>
                        )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setShowForm(false)} className="bg-brand-primary hover:bg-brand-primary/70 px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold px-4 py-2 rounded-lg">Save Persona</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map(p => <PersonaCard key={p.id} persona={p} onClick={() => setSelectedPersona(p)} />)}
      </div>
    </div>
  );
};

export default PersonaManager;
