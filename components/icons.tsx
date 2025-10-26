
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
