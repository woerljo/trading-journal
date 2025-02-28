"use client";
import { useState } from 'react';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../ui/Select';

const CATEGORIES = [
  'Psychologie',
  'Marktanalyse',
  'Strategie',
  'Fehleranalyse',
  'Sonstiges'
];

export function InsightsForm({ insights, onSave, onBack }) {
  const [newInsight, setNewInsight] = useState({
    title: '',
    text: '',
    category: '',
    image: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newInsight.title.trim() || !newInsight.text.trim() || !newInsight.category) return;

    const insight = {
      id: Date.now(),
      ...newInsight,
      date: new Date().toISOString().split('T')[0]
    };

    onSave([...insights, insight]);
    setNewInsight({ title: '', text: '', category: '', image: '' });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewInsight(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    onSave(insights.filter(insight => insight.id !== id));
    setDeleteConfirm(null);
  };

  function InsightModal({ insight, onClose }) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{insight.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{insight.date}</span>
              <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                {insight.category}
              </span>
            </div>

            <p className="text-gray-100 whitespace-pre-wrap">{insight.text}</p>

            {insight.image && (
              <div className="mt-4">
                <img
                  src={insight.image}
                  alt="Screenshot zur Erkenntnis"
                  className="rounded-lg w-full object-cover"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (showSaved) {
    return (
      <PageContainer>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              onClick={() => setShowSaved(false)}
              variant="primary"
              className="!px-4 !py-2 text-sm"
            >
              ← Zurück
            </Button>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Gespeicherte Erkenntnisse
            </h1>
            <div className="w-20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.length === 0 ? (
              <p className="text-center text-gray-400 py-8 col-span-full">Noch keine Erkenntnisse vorhanden</p>
            ) : (
              insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/50 rounded-xl p-4 group relative hover:bg-gray-800/80 
                    transition-colors cursor-pointer border border-gray-700/50 hover:border-blue-500/50"
                  onClick={() => setSelectedInsight(insight)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        {insight.category}
                      </span>
                      <span className="text-xs text-gray-400">{insight.date}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {insight.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">
                        {insight.image ? '📷 ' : ''}{insight.text.slice(0, 30)}...
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(insight.id);
                        }}
                        variant="danger"
                        className="opacity-0 group-hover:opacity-100 transition-opacity !px-2 !py-1 text-xs"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                  {deleteConfirm === insight.id && (
                    <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center rounded-xl">
                      <div className="text-center">
                        <p className="mb-4">Erkenntnis wirklich löschen?</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(insight.id);
                            }}
                            variant="danger"
                            className="!px-4 !py-1"
                          >
                            Ja
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(null);
                            }}
                            variant="secondary"
                            className="!px-4 !py-1"
                          >
                            Nein
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          <AnimatePresence>
            {selectedInsight && (
              <InsightModal 
                insight={selectedInsight} 
                onClose={() => setSelectedInsight(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Trading Erkenntnisse
          </h1>
          <Button
            onClick={() => setShowSaved(true)}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            📚 Gespeicherte
          </Button>
        </div>

        {saveSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Erkenntnis gespeichert! ✅
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg space-y-4">
            <input
              type="text"
              value={newInsight.title}
              onChange={(e) => setNewInsight(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titel der Erkenntnis..."
              className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />

            <Select
              value={newInsight.category}
              onChange={(e) => setNewInsight(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" className="bg-gray-900">Kategorie wählen</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
              ))}
            </Select>

            <textarea
              value={newInsight.text}
              onChange={(e) => setNewInsight(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Beschreibe deine Erkenntnis..."
              className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[120px]"
              required
            />

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Screenshot (optional)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30
                  cursor-pointer"
              />
            </div>

            <Button 
              type="submit"
              variant="success"
              className="w-full !py-3"
            >
              💡 Erkenntnis speichern
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
} 