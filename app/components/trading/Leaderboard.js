"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  
  useEffect(() => {
    fetchLeaderboard();
    // Aktualisiere alle 5 Minuten
    const interval = setInterval(fetchLeaderboard, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaders(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-center">🏆 Weekly Leaderboard</h2>
      
      <div className="flex justify-center items-end gap-4 h-64">
        {/* 2. Platz */}
        {leaders[1] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '150px' }}
            className="w-24 bg-gray-700/50 rounded-t-lg relative"
          >
            <div className="absolute -top-8 w-full text-center">
              <div className="text-xl">🥈</div>
              <div className="text-sm font-bold">{leaders[1].username}</div>
              <div className="text-xs text-green-400">+${leaders[1].weeklyProfit}</div>
            </div>
          </motion.div>
        )}

        {/* 1. Platz */}
        {leaders[0] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '200px' }}
            className="w-24 bg-blue-600/50 rounded-t-lg relative"
          >
            <div className="absolute -top-8 w-full text-center">
              <div className="text-2xl">👑</div>
              <div className="text-sm font-bold">{leaders[0].username}</div>
              <div className="text-xs text-green-400">+${leaders[0].weeklyProfit}</div>
            </div>
          </motion.div>
        )}

        {/* 3. Platz */}
        {leaders[2] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100px' }}
            className="w-24 bg-gray-700/50 rounded-t-lg relative"
          >
            <div className="absolute -top-8 w-full text-center">
              <div className="text-xl">🥉</div>
              <div className="text-sm font-bold">{leaders[2].username}</div>
              <div className="text-xs text-green-400">+${leaders[2].weeklyProfit}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}