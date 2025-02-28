"use client";
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // State zum Speichern des Wertes
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Beim ersten Render versuchen wir den Wert aus dem localStorage zu holen
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Wert im localStorage aktualisieren wenn sich der State ändert
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
} 