'use client';
import { useState } from 'react';

export function useTradeApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveTrade = async (tradeData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) throw new Error('Fehler beim Speichern des Trades');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/trades');
      
      if (!response.ok) throw new Error('Fehler beim Laden der Trades');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrade = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Fehler beim Löschen des Trades');
      
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
    saveTrade,
    fetchTrades,
    deleteTrade,
    isLoading,
    error
  };
} 