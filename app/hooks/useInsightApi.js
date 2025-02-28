'use client';
import { useState } from 'react';

export function useInsightApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveInsight = async (insightData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insightData),
      });

      if (!response.ok) throw new Error('Fehler beim Speichern der Erkenntnis');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/insights');
      
      if (!response.ok) throw new Error('Fehler beim Laden der Erkenntnisse');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInsight = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/insights/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Fehler beim Löschen der Erkenntnis');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveInsight,
    fetchInsights,
    deleteInsight,
    isLoading,
    error
  };
} 