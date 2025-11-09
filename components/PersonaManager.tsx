
import React, { useState, useRef } from 'react';
import type { Persona } from '../types';
import { PlusIcon } from './icons';
import PersonaDetailView from './PersonaDetailView';

interface PersonaManagerProps {
  personas: Persona[];
  onAddPersona: (persona: Omit<Persona, 'id'>) => void;
  onAddPersonas: (personas: any[]) => void;
  onAddAttackTargets: (targets: string[]) => void;
  onBack: () => void;
}

const PersonaCard: React.FC<{ persona: Persona; onView: () => void; }> = ({ persona, onView }) => {
    return (
      <div onClick={onView} className="bg-brand-content-bg p-4 rounded-lg border border-gray-200 shadow-sm hover:border-brand-accent hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col">
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
      </div>
    );
};


const PersonaManager: React.FC<PersonaManagerProps> = ({ personas, onAddPersona, onAddPersonas, onAddAttackTargets, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const personaFileInputRef = useRef<HTMLInputElement>(null);
  const targetFileInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    name: '', role: '', voiceName: 'Zephyr', psychology: '', strengths: '', weaknesses: '', targetInfo: '', conversationStarters: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStartAddNew = () => {
    setFormData(initialFormState);
    setShowForm(true);
  };

  const handleCancelForm = () => {
      setShowForm(false);
      setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commonData = {
      ...formData,
      targetInfo: formData.targetInfo.split('\n').filter(Boolean),
      conversationStarters: formData.conversationStarters.split('\n').filter(Boolean),
    };

    onAddPersona(commonData);
    
    handleCancelForm();
  };
  
  const handleFileImport = (
    file: File,
    validationFn: (data: any) => boolean,
    onSuccess: (data: any) => void,
    errorMsg: string
  ) => {
      setImportError('');
      setImportSuccess('');
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result as string;
              if (!text) {
                  throw new Error("File is empty.");
              }
              const data = JSON.parse(text);
              if (validationFn(data)) {
                  onSuccess(data);
                  setImportSuccess(`${Array.isArray(data) ? data.length : 1} items imported successfully!`);
              } else {
                  throw new Error("Validation failed: Data does not match the required format.");
              }
          } catch (err: any) {
              setImportError(`${errorMsg} (${err.message})`);
              console.error(err);
          }
      };
      reader.onerror = () => {
          setImportError("Error reading file.");
      };
      reader.readAsText(file);
  };

  const handlePersonaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          handleFileImport(
              file,
              (data): data is any[] => Array.isArray(data) && data.every(p => typeof p === 'object' && p !== null && typeof p.name === 'string' && typeof p.role === 'string'),
              (data) => onAddPersonas(data),
              "Invalid persona file. Must be a JSON array of objects, each with at least 'name' and 'role' properties."
          );
      }
      if (e.target) e.target.value = ''; // Allow re-uploading the same file
  };

  const handleTargetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          handleFileImport(
              file,
              (data): data is string[] => Array.isArray(data) && data.every(t => typeof t === 'string'),
              (data) => onAddAttackTargets(data),
              "Invalid target file. Must be a JSON array of strings."
          );
      }
      if (e.target) e.target.value = ''; // Allow re-uploading the same file
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'input' },
    { name: 'role', label: 'Role', type: 'input' },
    { name: 'voiceName', label: 'Voice', type: 'select', options: ['Zephyr', 'Kore', 'Puck', 'Fenrir', 'Charon'] },
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Personas & Data</h2>
        <button onClick={onBack} className="border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg transition-colors">
          Back to Menu
        </button>
      </div>

      <div className="bg-brand-content-bg p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-brand-primary">Import Data</h3>
          <p className="text-brand-subtle mb-4 text-sm">
              Bulk upload your own personas or anti-elicitation targets. Files must be in JSON format.
          </p>
          <div className="my-4 p-3 bg-brand-secondary/50 rounded-lg text-sm text-brand-subtle">
             Don't have a file? Download an example to see the required format.
            <div className="flex gap-4 mt-2">
                <a href="/example-personas.json" download="example-personas.json" className="text-brand-accent font-semibold hover:underline">Download Persona Example</a>
                <a href="/example-targets.json" download="example-targets.json" className="text-brand-accent font-semibold hover:underline">Download Target Example</a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <button onClick={() => personaFileInputRef.current?.click()} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors">Import Personas</button>
                  <input type="file" ref={personaFileInputRef} onChange={handlePersonaFileChange} accept=".json,application/json" className="hidden" />
                  <p className="text-xs text-brand-subtle mt-1">Upload a JSON array of persona objects.</p>
              </div>
              <div>
                  <button onClick={() => targetFileInputRef.current?.click()} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors">Import Attack Targets</button>
                  <input type="file" ref={targetFileInputRef} onChange={handleTargetFileChange} accept=".json,application/json" className="hidden" />
                  <p className="text-xs text-brand-subtle mt-1">Upload a JSON array of strings.</p>
              </div>
          </div>
          {importError && <p className="text-red-500 text-center mt-4 text-sm">{importError}</p>}
          {importSuccess && <p className="text-green-600 text-center mt-4 text-sm">{importSuccess}</p>}
      </div>
      
      {!showForm && (
        <button onClick={handleStartAddNew} className="mb-6 w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-6 h-6" /> Add New Persona Manually
        </button>
      )}

      {showForm && (
        <div className="bg-brand-content-bg p-6 rounded-lg mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-brand-accent">Create a New Persona</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map(field => (
                        <div key={field.name} className={['textarea'].includes(field.type) ? 'md:col-span-2' : ''}>
                          <label htmlFor={field.name} className="block text-sm font-medium text-brand-subtle mb-1">{field.label}</label>
                          {field.type === 'input' ? (
                              <input type="text" id={field.name} name={field.name} value={formData[field.name as keyof typeof formData]} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                          ) : field.type === 'textarea' ? (
                              <textarea id={field.name} name={field.name} value={formData[field.name as keyof typeof formData]} onChange={handleChange} required rows={3} className="w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder={field.name === 'psychology' ? "Describe the persona's core motivations, beliefs, and typical emotional responses." : undefined}></textarea>
                          ) : (
                             <select id={field.name} name={field.name} value={formData.voiceName} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent appearance-none">
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={handleCancelForm} className="border border-brand-subtle text-brand-subtle font-semibold hover:bg-brand-secondary px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold px-4 py-2 rounded-lg">Save Persona</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map(p => <PersonaCard key={p.id} persona={p} onView={() => setSelectedPersona(p)} />)}
      </div>
    </div>
  );
};

export default PersonaManager;
