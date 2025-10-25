import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutUsModal from '../components/ui/AboutUsModal';

const FloatingThematicElements: React.FC = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '800px' }} aria-hidden="true">
    {/* Shape 1: Wireframe Cube (Structure, Data) */}
    <svg
      className="glowing-element text-blue-400"
      style={{
        width: '80px', height: '80px', top: '15%', left: '10%',
        animationDuration: '10s, 4s', animationDelay: '0s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25v9.75" />
    </svg>

    {/* Shape 2: Concentric Rings (Focus, Analysis) */}
    <svg
      className="glowing-element text-blue-300"
      style={{
        width: '100px', height: '100px', top: '65%', left: '80%',
        animationDuration: '12s, 5s', animationDelay: '1s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="11.5" />
    </svg>
    
    {/* Shape 3: Code Bracket (AI, Technology) */}
    <svg
      className="glowing-element text-blue-400"
      style={{
        width: '70px', height: '70px', top: '75%', left: '15%',
        animationDuration: '8s, 3.5s', animationDelay: '2s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5-4.5L7.5 12l2.25 2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
    
    {/* Shape 4: Transparent Cube (Verification, Integrity) */}
    <svg
      className="glowing-element text-blue-200"
      style={{
        width: '70px', height: '70px', top: '10%', left: '75%',
        animationDuration: '9s, 6s', animationDelay: '1.5s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v6M21 7.5l-8.25 4.75L3 7.5M3 7.5l2.25-1.313M3 7.5v6m0 0l8.25 4.75L21 13.5m0 0l-2.25 1.313M12 12.75l-8.25-4.75L12 3.25l8.25 4.75L12 12.75z" />
    </svg>
  </div>
);


const AnimatedBackground: React.FC = () => (
    <div className="background-shapes absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
        <span style={{ left: '10%', width: '40px', height: '40px', animationDelay: '0s', animationDuration: '18s' }}></span>
        <span style={{ left: '20%', width: '20px', height: '20px', animationDelay: '1s', animationDuration: '10s' }}></span>
        <span style={{ left: '35%', width: '100px', height: '100px', animationDelay: '3s', animationDuration: '15s' }}></span>
        <span style={{ left: '50%', width: '30px', height: '30px', animationDelay: '5s', animationDuration: '22s' }}></span>
        <span style={{ left: '65%', width: '50px', height: '50px', animationDelay: '2s', animationDuration: '14s' }}></span>
        <span style={{ left: '85%', width: '60px', height: '60px', animationDelay: '6s', animationDuration: '25s' }}></span>
    </div>
);


const LandingPage: React.FC = () => {
    const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);

    const headlineText = "EduVerify";

    return (
        <>
            <div className="relative min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center p-8 overflow-hidden">
                <AnimatedBackground />
                <FloatingThematicElements />

                <div className="text-center flex flex-col items-center z-10">
                    <div className="bg-blue-100 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-600 font-semibold mb-4 animation-popIn" style={{ animationDelay: '0.2s' }}>
                        Powered by Gemini AI
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gray-900">
                        {headlineText.split('').map((char, index) => (
                            <span key={index} className="headline-char" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 subtitle-animate" style={{ animationDelay: `${0.3 + headlineText.length * 0.05 + 0.2}s` }}>
                        The future of academic integrity. Seamlessly manage assignments, detect plagiarism, and verify AI-generated content with unparalleled accuracy.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 buttons-animate" style={{ animationDelay: `${0.3 + headlineText.length * 0.05 + 0.4}s` }}>
                        <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                            Get Started
                        </Link>
                        <Link to="/about" className="px-8 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300">
                            Learn More
                        </Link>
                         <button onClick={() => setIsAboutUsModalOpen(true)} className="px-8 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300">
                            About Us
                        </button>
                    </div>
                </div>
            </div>
            <AboutUsModal isOpen={isAboutUsModalOpen} onClose={() => setIsAboutUsModalOpen(false)} />
        </>
    );
};

export default LandingPage;