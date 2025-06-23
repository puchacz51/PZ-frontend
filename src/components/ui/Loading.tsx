import React from 'react';

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Ładowanie..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg className="animate-spin h-12 w-12 text-gray-200 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx={12} cy={12} r={10} />
        <path d="M4 12a8 8 0 1 1 16 0" />
      </svg>
      {text && <p className="text-gray-600 mt-2">{text}</p>}
    </div>
  );
};

export default Loading;