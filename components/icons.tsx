
import React from 'react';

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 5a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V5Z" />
    <path d="M12 18.5a5.5 5.5 0 0 1-5.5-5.5H5a7 7 0 0 0 6 6.93V22h2v-2.07a7 7 0 0 0 6-6.93h-1.5a5.5 5.5 0 0 1-5.5 5.5Z" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v8h-2z"/>
    </svg>
);


export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1-7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm12.5 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-1 2a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-1-7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"/>
    <path fillRule="evenodd" d="M12 3a9 9 0 0 0-7.85 4.88c-.68 1.45-.68 3.77 0 5.24A9 9 0 0 0 12 21a9 9 0 0 0 7.85-7.88c.68-1.47.68-3.79 0-5.24A9 9 0 0 0 12 3ZM9.5 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-1-2.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-3 3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-3-3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm1.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-3-1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd"/>
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
);

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 0 1 .75.75v.518c.985.22 1.87.688 2.613 1.332a.75.75 0 0 1-.95 1.164 5.998 5.998 0 0 0-4.826 0 .75.75 0 0 1-.95-1.164A6.96 6.96 0 0 1 11.25 3.52V3a.75.75 0 0 1 .75-.75Zm-3.023 7.238a.75.75 0 0 1 .634 1.363A4.498 4.498 0 0 0 12 15a4.498 4.498 0 0 0 2.389-6.149.75.75 0 1 1 1.268.726A5.997 5.997 0 0 1 12 16.5a5.997 5.997 0 0 1-3.657-9.988.75.75 0 0 1 .634.354ZM15.75 18a.75.75 0 0 1 .75.75v.008c0 .858-.692 1.55-1.55 1.55h-6.4c-.858 0-1.55-.692-1.55-1.55v-.008a.75.75 0 0 1 1.5 0v.008a.05.05 0 0 0 .05.05h6.4a.05.05 0 0 0 .05-.05v-.008a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

export const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M17.5 3A2.5 2.5 0 0 0 15 5.5V6H9V5.5A2.5 2.5 0 0 0 6.5 3H3v2.5A2.5 2.5 0 0 0 5.5 8H6v1.172a4 4 0 0 0 .618 2.036-3.001 3.001 0 0 0-2.036 3.618 3 3 0 0 0 3.618 2.036 4 4 0 0 0 6.592 0 3 3 0 0 0 3.618-2.036 3.001 3.001 0 0 0-2.036-3.618A4 4 0 0 0 18 9.172V8h.5A2.5 2.5 0 0 0 21 5.5V3h-3.5ZM9 8h6v1.08a6.002 6.002 0 0 1-5.372 5.372L9 15.08V8Zm-1.5-1A1.5 1.5 0 0 1 9 5.5V4h6v1.5a1.5 1.5 0 0 1-1.5 1.5H7.5Z" clipRule="evenodd" />
    </svg>
);