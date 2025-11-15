import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SignupPage from './pages/SignupPage';
import { Role } from './types';

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="bg-gray-50 text-gray-800 min-h-screen">
            <HashRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route 
                  path="/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </HashRouter>
          </div>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
