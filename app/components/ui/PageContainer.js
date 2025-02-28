"use client";
import { LogoutButton } from './LogoutButton';

export function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Navigation Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 mb-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
            Trading Journal
          </h1>
          <LogoutButton />
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent" />
        <div className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
} 