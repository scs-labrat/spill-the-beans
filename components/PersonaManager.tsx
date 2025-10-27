
import React, { useState } from 'react';
import type { Persona } from '../types';
import { PlusIcon } from './icons';
import PersonaDetailView from './PersonaDetailView';
import { INITIAL_PERSONAS } from '../constants';

const initialPersonaIds = new Set(INITIAL_PERSONAS.map(p => p.id));

const sanitizeInput = (input: string): string => {
  if (!input) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  const reg = /[&<>"']/ig;
  return input.replace(reg, (match) => map[match]);
};

interface PersonaManagerProps {
  personas: Persona[];
  onAddPersona: (persona: Omit<Persona, 'id'>) => void;
  onUpdatePersona: (persona: Persona) => void;
  onBack: () => void;
}

const PersonaCard: React.FC<{ persona: Persona; onView: () => void; onEdit: () => void; isEditing?: boolean; }> = ({ persona, onView, onEdit, isEditing }) => {
    const isDefault = initialPersonaIds.has(persona.id);
    
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };
    
    return (
      <div 
        onClick={onView} 
        className={`p-4 rounded-lg border shadow-sm hover:border-brand-accent hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between ${isEditing ? 'bg-rose-50 border-brand-accent border-2' : 'bg-brand-content-bg border-gray-200'}`}
      >
        <div>
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
        {!isDefault && (
          <div className="mt-4 flex justify-end">
             <button onClick={handleEditClick} className="text-sm bg-brand-secondary hover:bg-gray-200 px-3 py-1 rounded-md transition-colors text-brand-primary">Edit</button>
          </div>
        )}
      </div>
    );
};


const PersonaManager: React.FC<PersonaManagerProps> = ({ personas, onAddPersona, onUpdatePersona, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const initialFormState = {
    name: '', role: '', psychology: '', strengths: '', weaknesses: '', targetInfo: '', conversationStarters: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStartAddNew = () => {
    setEditingPersona(null);
    setFormData(initialFormState);
    setShowForm(true);
  };

  const handleStartEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setFormData({
      ...persona,
      targetInfo: persona.targetInfo.join('\n'),
      conversationStarters: persona.conversationStarters.join('\n'),
    });
    setSelectedPersona(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
      setShowForm(false);
      setEditingPersona(null);
      setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commonData = {
      name: sanitizeInput(formData.name),
      role: sanitizeInput(formData.role),
      psychology: sanitizeInput(formData.psychology),
      strengths: sanitizeInput(formData.strengths),
      weaknesses: sanitizeInput(formData.weaknesses),
      targetInfo: formData.targetInfo.split('\n').filter(Boolean).map(sanitizeInput),
      conversationStarters: formData.conversationStarters.split('\n').filter(Boolean).map(sanitizeInput),
    };

    if (editingPersona) {
      onUpdatePersona({ ...commonData, id: editingPersona.id });
    } else {
      onAddPersona(commonData);
    }
    
    handleCancelForm();
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
    const isDefault = initialPersonaIds.has(selectedPersona.id);
    return <PersonaDetailView persona={selectedPersona} onBack={() => setSelectedPersona(null)} onEdit={!isDefault ? () => handleStartEdit(selectedPersona) : undefined} />;
  }


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Personas</h2>
        <button onClick={onBack} className="border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg transition-colors">
          Back to Menu
        </button>
      </div>
      
      {!showForm && (
        <button onClick={handleStartAddNew} className="mb-6 w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-6 h-6" /> Add New Persona
        </button>
      )}

      {showForm && (
        <div className="bg-brand-content-bg p-6 rounded-lg mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-brand-accent">{editingPersona ? `Editing: ${editingPersona.name}`: 'Create a New Persona'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map(field => (
                        <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-brand-subtle mb-1">{field.label}</label>
                        {field.type === 'input' ? (
                             <input type="text" id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                        ) : (
                            <textarea id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} required rows={3} className="w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder={field.name === 'psychology' ? "Describe the persona's core motivations, beliefs, and typical emotional responses." : undefined}></textarea>
                        )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={handleCancelForm} className="border border-brand-subtle text-brand-subtle font-semibold hover:bg-brand-secondary px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold px-4 py-2 rounded-lg">{editingPersona ? 'Save Changes' : 'Save Persona'}</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map(p => <PersonaCard key={p.id} persona={p} onView={() => setSelectedPersona(p)} onEdit={() => handleStartEdit(p)} isEditing={editingPersona?.id === p.id} />)}
      </div>
    </div>
  );
};

export default PersonaManager;
