import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { AcademicCapIcon, MagnifyingGlassIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';


const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-800 p-8">
            <div className="z-10 max-w-4xl mx-auto animation-fadeIn">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
                        About EduVerify
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Pioneering the future of academic integrity with cutting-edge technology.
                    </p>
                </div>

                <Card className="mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        At EduVerify, our mission is to empower educational institutions with a comprehensive, intuitive, and powerful platform to uphold academic honesty. We believe in fostering a fair learning environment where students' original work is valued and the educational process is transparent. By automating integrity checks and streamlining workflows, we free up educators to focus on what they do best: teaching and inspiring the next generation.
                    </p>
                </Card>

                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-indigo-500"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Automated Integrity Checks</h3>
                        <p className="text-gray-500">Leverage the power of Gemini AI to perform deep analysis for plagiarism and AI-generated content with exceptional accuracy.</p>
                    </div>
                     <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Streamlined Workflow</h3>
                        <p className="text-gray-500">From class creation and assignment submission to report generation and feedback, every step is integrated into one seamless platform.</p>
                    </div>
                     <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-emerald-500"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Insightful Reporting</h3>
                        <p className="text-gray-500">Receive detailed, easy-to-understand reports with visual data, helping both teachers and students understand the analysis results.</p>
                    </div>
                </div>

                <div className="text-center">
                     <p className="text-lg text-gray-600 mb-6">Ready to ensure academic integrity at your institution?</p>
                     <Link to="/signup" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Join EduVerify Today
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;