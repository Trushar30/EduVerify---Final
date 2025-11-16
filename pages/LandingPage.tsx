import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutUsModal from '../components/ui/AboutUsModal';
import { 
  ShieldCheckIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const FloatingThematicElements: React.FC = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '800px' }} aria-hidden="true">
    <svg
      className="glowing-element text-blue-400"
      style={{
        width: '80px', height: '80px', top: '15%', left: '10%',
        animationDuration: '10s, 4s', animationDelay: '0s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25v9.75" />
    </svg>

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
    
    <svg
      className="glowing-element text-blue-400"
      style={{
        width: '70px', height: '70px', top: '75%', left: '15%',
        animationDuration: '8s, 3.5s', animationDelay: '2s',
      }}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5-4.5L7.5 12l2.25 2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
    
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
            {/* Hero Section */}
            <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-gray-800 flex flex-col items-center justify-center p-8 overflow-hidden">
                <AnimatedBackground />
                <FloatingThematicElements />

                {/* Navigation */}
                <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">EduVerify</span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md">
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="text-center flex flex-col items-center z-10 mt-16">
                    <div className="bg-blue-100 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-600 font-semibold mb-6 animation-popIn inline-flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
                        <SparklesIcon className="w-4 h-4" />
                        Powered by Gemini AI
                    </div>
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 text-gray-900">
                        {headlineText.split('').map((char, index) => (
                            <span key={index} className="headline-char inline-block" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 subtitle-animate leading-relaxed" style={{ animationDelay: `${0.3 + headlineText.length * 0.05 + 0.2}s` }}>
                        The future of academic integrity. Seamlessly manage assignments, detect plagiarism, and verify AI-generated content with <span className="text-blue-600 font-semibold">unparalleled accuracy</span>.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 buttons-animate" style={{ animationDelay: `${0.3 + headlineText.length * 0.05 + 0.4}s` }}>
                        <Link to="/signup" className="group px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                            Get Started Free
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/about" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 font-bold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-sm">
                            Learn More
                        </Link>
                        <button onClick={() => setIsAboutUsModalOpen(true)} className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 font-bold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-sm">
                            About Us
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                    </div>
                </div>
            </div>


            {/* Features Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to maintain academic integrity in one comprehensive platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheckIcon className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Detection</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Leverage cutting-edge Gemini AI to detect plagiarism and AI-generated content with industry-leading accuracy.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Deep content analysis</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Multi-source verification</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Real-time processing</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                                <ChartBarIcon className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Analytics</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Get comprehensive insights with visual reports, similarity scores, and at-risk student identification.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Interactive dashboards</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Cohort analysis</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Export reports</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                <AcademicCapIcon className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Streamlined Workflow</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Manage classes, assignments, and submissions all in one intuitive platform designed for educators.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Easy class management</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Bulk submission uploads</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Automated notifications</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get started in minutes with our simple three-step process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <UserGroupIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-blue-600 font-bold text-lg mb-3">Step 1</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Class</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Set up your class in seconds. Add students and configure your assignment preferences.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <DocumentCheckIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-indigo-600 font-bold text-lg mb-3">Step 2</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Submissions</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Students submit their work directly or teachers upload assignments in bulk for analysis.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <ClockIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-emerald-600 font-bold text-lg mb-3">Step 3</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Instant Results</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Receive detailed analysis reports with similarity scores and AI detection in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
               <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-5xl font-extrabold  mb-6">
                        Ready to Elevate Academic Integrity?
                    </h2>
                    <p className="text-xl text-gray-800 mb-10 leading-relaxed">
                        Join thousands of educators who trust EduVerify to maintain the highest standards of academic honesty.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/signup" className="group px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                            Start Free Trial
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/about" className="px-10 py-4 bg-gray-100 text-gray-700 font-bold text-lg rounded-lg hover:bg-gray-200 transition-all duration-300">
                            Schedule Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
                                <span className="text-xl font-bold text-white">EduVerify</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Ensuring academic integrity with the power of AI.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-blue-400 transition-colors">Features</Link></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Roadmap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => setIsAboutUsModalOpen(true)} className="hover:text-blue-400 transition-colors">About Us</button></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">GDPR</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        <p>&copy; 2025 EduVerify. All rights reserved. Built with Gemini AI.</p>
                    </div>
                </div>
            </footer>

            <AboutUsModal isOpen={isAboutUsModalOpen} onClose={() => setIsAboutUsModalOpen(false)} />
        </>
    );
};

export default LandingPage;
