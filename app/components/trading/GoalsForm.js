"use client";
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';
import { motion } from 'framer-motion';

export function GoalsForm({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ text: '', deadline: '' });

  // Ziel hinzufügen
  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoal.text) return;
    
    setGoals([...goals, {
      id: Date.now(),
      text: newGoal.text,
      deadline: newGoal.deadline,
      status: 'pending', // pending, completed, failed
      createdAt: new Date().toISOString()
    }]);
    setNewGoal({ text: '', deadline: '' });
  };

  // Ziel-Status ändern
  const updateGoalStatus = (id, status) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, status } : goal
    ));
  };

  return (
    <PageContainer>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="primary">← Zurück</Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Trading Ziele
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Neues Ziel Form */}
        <form onSubmit={addGoal} className="mb-8 bg-gray-800/50 rounded-xl p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newGoal.text}
              onChange={(e) => setNewGoal({ ...newGoal, text: e.target.value })}
              placeholder="Neues Ziel eingeben..."
              className="flex-1 bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700"
            />
            <Button type="submit">Hinzufügen</Button>
          </div>
        </form>

        {/* Ziele Liste */}
        <div className="space-y-4">
          {goals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className={goal.status === 'completed' ? 'line-through text-gray-400' : ''}>
                  {goal.text}
                </p>
                {goal.deadline && (
                  <p className="text-sm text-gray-400">Deadline: {goal.deadline}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => updateGoalStatus(goal.id, 'completed')}
                  variant="success"
                  className={`!p-2 ${goal.status === 'completed' ? 'opacity-50' : ''}`}
                >
                  ✓
                </Button>
                <Button
                  onClick={() => updateGoalStatus(goal.id, 'failed')}
                  variant="danger"
                  className={`!p-2 ${goal.status === 'failed' ? 'opacity-50' : ''}`}
                >
                  ✕
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
} 