"use client";
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Force reload to clear any client-side state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout fehlgeschlagen:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="secondary"
      className="!px-4 !py-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm
                border border-gray-700/50 hover:border-gray-600/50
                transition-all duration-300 shadow-lg"
    >
      <span className="flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
        Logout
      </span>
    </Button>
  );
} 