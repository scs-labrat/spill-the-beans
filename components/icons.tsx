
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

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
    </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 2a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2h-4ZM8 6h8v2H8V6Z" />
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.75a.75.75 0 0 1 1.06 0L12 9.56l.66-1.06a.75.75 0 1 1 1.22.872l-.66 1.06.66 1.06a.75.75 0 1 1-1.22.872l-.66-1.06-.66 1.06a.75.75 0 0 1-1.22-.872l.66-1.06-.66-1.06a.75.75 0 0 1 0-1.06ZM12 15a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V15.75A.75.75 0 0 1 12 15Z" clipRule="evenodd" />
  </svg>
);
