import React from 'react';

const AnalysisLoading: React.FC<{ fileName: string }> = ({ fileName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="relative w-24 h-24">
         <svg className="animate-spin h-24 w-24 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold mt-12 mb-2 text-gray-800">Analyzing Document...</h2>
      <p className="text-lg text-gray-500 mb-2">{fileName}</p>
      <p className="text-sm text-blue-600 font-semibold">Powered by Gemini AI</p>
    </div>
  );
};

export default AnalysisLoading;