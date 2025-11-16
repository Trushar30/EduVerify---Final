import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">EduVerify</span>
                </Link>
                <div className="flex gap-4">
                    <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors">
                        Sign In
                    </Link>
                    <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md">
                        Get Started
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20 animation-fadeIn">
                    <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-600 font-semibold mb-6">
                        <SparklesIcon className="w-4 h-4" />
                        About EduVerify
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900">
                        Pioneering Academic Integrity
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        We're on a mission to transform how educational institutions maintain academic honesty using cutting-edge artificial intelligence.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="mb-20">
                    <Card className="shadow-2xl border-2 border-blue-100">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Our Mission
                                </h2>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    At EduVerify, our mission is to empower educational institutions with a comprehensive, intuitive, and powerful platform to uphold academic honesty.
                                </p>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    We believe in fostering a fair learning environment where students' original work is valued and the educational process is transparent. By automating integrity checks and streamlining workflows, we free up educators to focus on what they do best: teaching and inspiring the next generation.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl shadow-2xl flex items-center justify-center">
                                    <ShieldCheckIcon className="w-48 h-48 text-white opacity-20" />
                                </div>
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                    <SparklesIcon className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Key Features */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Why Choose EduVerify?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive features designed for modern educational needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                <ShieldCheckIcon className="w-10 h-10 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Automated Integrity Checks</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Leverage the power of Gemini AI to perform deep analysis for plagiarism and AI-generated content with exceptional accuracy. Our advanced algorithms detect even the most subtle attempts at academic dishonesty.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                <AcademicCapIcon className="w-10 h-10 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Streamlined Workflow</h3>
                            <p className="text-gray-600 leading-relaxed">
                                From class creation and assignment submission to report generation and feedback, every step is integrated into one seamless platform. Save time and focus on teaching, not administration.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                <MagnifyingGlassIcon className="w-10 h-10 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Insightful Reporting</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Receive detailed, easy-to-understand reports with visual data, helping both teachers and students understand the analysis results. Make data-driven decisions about academic integrity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Features Grid */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                            <BoltIcon className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                            <h4 className="font-bold text-gray-800 mb-2">Lightning Fast</h4>
                            <p className="text-sm text-gray-600">Results in seconds, not hours</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                            <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                            <h4 className="font-bold text-gray-800 mb-2">Rich Analytics</h4>
                            <p className="text-sm text-gray-600">Visual insights at your fingertips</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                            <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-indigo-500" />
                            <h4 className="font-bold text-gray-800 mb-2">Collaborative</h4>
                            <p className="text-sm text-gray-600">Built for teams of any size</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                            <ClockIcon className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                            <h4 className="font-bold text-gray-800 mb-2">24/7 Support</h4>
                            <p className="text-sm text-gray-600">We're always here to help</p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-extrabold mb-4">Our Core Values</h2>
                            <p className="text-xl text-blue-100">The principles that guide everything we do</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheckIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Integrity First</h3>
                                <p className="text-blue-100">
                                    We believe academic honesty is the foundation of quality education and personal growth.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SparklesIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Innovation</h3>
                                <p className="text-blue-100">
                                    We continuously push boundaries to deliver the most advanced detection technology available.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AcademicCapIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Education</h3>
                                <p className="text-blue-100">
                                    We're passionate about supporting educators and empowering students to do their best work.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>


                {/* CTA Section */}
                <div className="text-center">
                    <Card className="shadow-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-blue-100">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Ready to Ensure Academic Integrity?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of educators who trust EduVerify to maintain the highest standards of academic honesty at their institutions.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                                Join EduVerify Today
                            </Link>
                            <Link to="/" className="px-10 py-4 bg-white text-gray-700 border-2 border-gray-300 font-bold text-lg rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                                Back to Home
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
                        <span className="text-xl font-bold text-white">EduVerify</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; 2025 EduVerify. All rights reserved. Built with Gemini AI.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
