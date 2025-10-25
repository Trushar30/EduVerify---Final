import React from 'react';
import Modal from './Modal';

const teamMembers = [
    {
        name: "Trushar Patel",
        role: "Lead Visionary & Code Architect",
        description: "Trushar is the project's lead visionary, typing code so fast his keyboard occasionally requests a restraining order. He dreams in clean architecture and considers 'refactoring' a competitive sport.",
        imageUrl: "https://i.pravatar.cc/150?u=trushar"
    },
    {
        name: "Raj Patel",
        role: "UI/UX Strategist & Design Maestro",
        description: "Raj is our design maestro, a pixel whisperer who can spot a misaligned element from a hundred paces. He believes that a world without beautiful UI is a world not worth logging into.",
        imageUrl: "https://i.pravatar.cc/150?u=raj"
    },
    {
        name: "Rudra Patel",
        role: "Full-Stack Specialist & Logic Guru",
        description: "Rudra is the full-stack guru who holds the delicate balance between frontend and backend. He speaks fluent JavaScript, Python, and 'what-on-earth-is-this-bug-doing', often solving problems with a mix of logic and sheer willpower.",
        imageUrl: "https://i.pravatar.cc/150?u=rudra"
    }
];

const AboutUsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Meet the Team" maxWidth="max-w-4xl">
            <div className="space-y-12 p-4">
                {teamMembers.map((member, index) => (
                    <div
                        key={member.name}
                        className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-32 h-32 rounded-full shadow-lg object-cover flex-shrink-0 border-4 border-white"
                        />
                        <div className={`text-center md:text-left ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                            <h3 className="font-bold text-2xl text-gray-800">{member.name}</h3>
                            <p className="font-semibold text-blue-600 text-md mb-2">{member.role}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end border-t border-gray-200 pt-5">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default AboutUsModal;