"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/ui/PageContainer';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten');
      }

      // Nach erfolgreicher Registrierung zum Login weiterleiten
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
              Trading Journal Registrierung
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Benutzername
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 mt-1
                    border border-gray-700 bg-gray-900/50 placeholder-gray-400
                    text-white rounded-lg focus:outline-none focus:ring-blue-500
                    focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 mt-1
                    border border-gray-700 bg-gray-900/50 placeholder-gray-400
                    text-white rounded-lg focus:outline-none focus:ring-blue-500
                    focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 mt-1
                    border border-gray-700 bg-gray-900/50 placeholder-gray-400
                    text-white rounded-lg focus:outline-none focus:ring-blue-500
                    focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                  Passwort bestätigen
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 mt-1
                    border border-gray-700 bg-gray-900/50 placeholder-gray-400
                    text-white rounded-lg focus:outline-none focus:ring-blue-500
                    focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full !py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Lädt...' : 'Registrieren'}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm">
            <Link 
              href="/login" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Bereits ein Konto? Hier einloggen
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 