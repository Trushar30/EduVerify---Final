import React from 'react';
import Modal from './Modal';

const teamMembers = [
    {
        name: "Trushar Patel",
        role: "Lead Visionary & Code Architect",
        description: "Trushar is the project's lead visionary, typing code so fast his keyboard occasionally requests a restraining order. He dreams in clean architecture and considers 'refactoring' a competitive sport.",
        // imageUrl: "https://i.pravatar.cc/150?u=trushar"
    },
    {
        name: "Raj Patel",
        role: "UI/UX Strategist & Design Maestro",
        description: "Raj is our design maestro, a pixel whisperer who can spot a misaligned element from a hundred paces. He believes that a world without beautiful UI is a world not worth logging into.",
        // imageUrl: "https://i.pravatar.cc/150?u=raj"
    },
    {
        name: "Rudra Patel",
        role: "Full-Stack Specialist & Logic Guru",
        description: "Rudra is the full-stack guru who holds the delicate balance between frontend and backend. He speaks fluent JavaScript, Python, and 'what-on-earth-is-this-bug-doing', often solving problems with a mix of logic and sheer willpower.",
        // imageUrl: "https://i.pravatar.cc/150?u=rudra"
    }
];

const AboutUsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Meet the Team" maxWidth="max-w-4xl">
            <div className="mb-20">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl">
                    <div className="text-center mb-6">
                        <h2 className="text-5xl font-bold text-gray-900 mb-2" style={{fontFamily: "'Agrandir', sans-serif"}}>Meet the Team</h2>
                        <div className="w-48 h-0.5 bg-gray-400 mx-auto my-4" />
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{fontFamily: "'Agrandir', sans-serif"}}>A small crew of passionate builders behind EduVerify</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top-left card */}
                        <div className="team-card bg-white border-2 border-black rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center gap-6 transition-all duration-300 cursor-pointer">
                            <div className="relative w-40 h-40 flex-shrink-0">
                                <div className="absolute -left-6 -top-8 w-56 h-56 rounded-lg "></div>
                                <img src="/data/About/Trushar.png" alt="Trushar" className="team-image relative z-10 w-40 h-40 object-cover rounded-md drop-shadow-lg transition-transform" />
                                <svg className="absolute -bottom-4 left-0 w-full z-20" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0,30 C80,0 320,60 400,30 L400,40 L0,40 Z" fill="#1E90FF"/></svg>
                            </div>
                            <div className="flex-1 text-center">
                                <h3 className="text-3xl font-bold text-gray-900" style={{fontFamily: "'Agrandir', sans-serif"}}>Trushar Patel</h3>
                                <div className="text-sm text-gray-600 mb-4" style={{fontFamily: "'Agrandir', sans-serif"}}>23DIT054</div>
                                <p className="text-gray-700 text-lg" style={{fontFamily: "'Agrandir', sans-serif"}}>Lead Visionary & Code Architect</p>
                            </div>
                        </div>

                        {/* Top-right card */}
                        <div className="team-card bg-white border-2 border-black rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center gap-6 justify-end transition-all duration-300 cursor-pointer">
                            <div className="flex-1 text-center">
                                <h3 className="text-3xl font-bold text-gray-900" style={{fontFamily: "'Agrandir', sans-serif"}}>Raj Patel</h3>
                                <div className="text-sm text-gray-600 mb-4" style={{fontFamily: "'Agrandir', sans-serif"}}>23DIT050</div>
                                <p className="text-gray-700 text-lg" style={{fontFamily: "'Agrandir', sans-serif"}}>UI/UX Strategist & Design Maestro</p>
                            </div>
                            <div className="relative w-40 h-40 flex-shrink-0">
                                <div className="absolute -right-6 -top-8 w-56 h-56 rounded-lg"></div>
                                <img src="/data/About/Raj.png" alt="Raj" className="team-image relative z-10 w-40 h-40 object-cover rounded-md drop-shadow-lg transition-transform" />
                                <svg className="absolute -bottom-4 right-0 w-full z-20" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0,30 C80,0 320,60 400,30 L400,40 L0,40 Z" fill="#1E90FF"/></svg>
                            </div>
                        </div>

                        {/* Bottom centered card (spans two columns) */}
                        <div className="md:col-span-2 flex justify-center">
                            <div className="team-card w-full md:w-3/5 bg-white border-2 border-black rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center gap-6 transition-all duration-300 cursor-pointer">
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <div className="absolute -left-10 -top-6 w-72 h-56 rounded-lg "></div>
                                    <img src="/data/About/Rudra.png" alt="Rudra" className="team-image relative z-10 w-40 h-41 object-cover rounded-md drop-shadow-lg transition-transform" />
                                    {/* <svg className="absolute -bottom-4 left-0 w-full z-20" viewBox="0 0 600 40" preserveAspectRatio="none"><path d="M0,30 C120,0 480,60 600,30 L600,40 L0,40 Z" fill="#1E90FF"/></svg> */}
                                </div>
                                <div className="flex-1 text-center">
                                    <h3 className="text-3xl font-bold text-gray-900" style={{fontFamily: "'Agrandir', sans-serif"}}>Rudra Patel</h3>
                                    <div className="text-sm text-gray-600 mb-4" style={{fontFamily: "'Agrandir', sans-serif"}}>23DIT051</div>
                                    <p className="text-gray-700 text-lg" style={{fontFamily: "'Agrandir', sans-serif"}}>Full-Stack Specialist & Logic Guru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AboutUsModal;