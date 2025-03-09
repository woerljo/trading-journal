"use client";
import { useState, useEffect } from 'react';
import { useInsightApi } from '@/app/hooks/useInsightApi';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

const CATEGORIES = [
  { value: 'Psychologie', label: 'Psychologie' },
  { value: 'Marktanalyse', label: 'Marktanalyse' },
  { value: 'Strategie', label: 'Strategie' },
  { value: 'Fehleranalyse', label: 'Fehleranalyse' },
  { value: 'Sonstiges', label: 'Sonstiges' }
];

export function InsightsForm({ onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    date: new Date().toISOString().split('T')[0],
    category: [],
    image: '',
    type: 'insight'
  });

  const { saveInsight, fetchInsights, deleteInsight, isLoading, error } = useInsightApi();
  const [insights, setInsights] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(['all']);

  const categories = [
    { value: 'all', label: 'Alle' },
    ...CATEGORIES
  ];

  useEffect(() => {
    if (showSaved) {
      loadInsights();
    }
  }, [showSaved]);

  const loadInsights = async () => {
    try {
      const data = await fetchInsights();
      setInsights(data);
    } catch (error) {
      console.error('Fehler beim Laden der Erkenntnisse:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveInsight(formData);
      setFormData({
        title: '',
        text: '',
        date: new Date().toISOString().split('T')[0],
        category: [],
        image: '',
        type: 'insight'
      });
      setSaveSuccess(true);
      loadInsights();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInsight(id);
      loadInsights();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
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
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">{insight.title}</h3>
            <p className="text-sm text-gray-400">{insight.date}</p>
            <div className="flex flex-wrap gap-2">
              {insight.category.map(cat => (
                <span 
                  key={cat}
                  className="px-2 py-1 rounded-lg text-sm
                    bg-blue-500/10 text-blue-400 border border-blue-500/30
                    shadow-sm shadow-blue-500/10"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
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

  const filteredInsights = insights.filter(insight => {
    if (selectedCategories.includes('all')) return true;
    return selectedCategories.includes(insight.category);
  });

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

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <label 
                key={cat.value}
                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors
                  ${selectedCategories.includes(cat.value) 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-transparent'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (cat.value === 'all') {
                        setSelectedCategories(['all']);
                      } else {
                        setSelectedCategories(prev => 
                          prev.filter(c => c !== 'all').concat(cat.value)
                        );
                      }
                    } else {
                      if (cat.value === 'all') {
                        setSelectedCategories([]);
                      } else {
                        setSelectedCategories(prev => 
                          prev.filter(c => c !== cat.value)
                        );
                      }
                    }
                  }}
                  className="sr-only"
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInsights.map((insight) => (
              <motion.div
                key={insight._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800/50 rounded-xl p-4 group relative hover:bg-gray-800/80 
                  transition-colors cursor-pointer border border-gray-700/50 hover:border-blue-500/50"
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 border-b border-gray-700/50 pb-2">
                    {insight.date}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {insight.category.map(cat => (
                      <span 
                        key={cat}
                        className="px-2 py-0.5 rounded-lg text-xs
                          bg-blue-500/10 text-blue-400 border border-blue-500/30
                          shadow-sm shadow-blue-500/10"
                      >
                        {cat}
                      </span>
                    ))}
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
                        setDeleteConfirm(insight._id);
                      }}
                      variant="danger"
                      className="opacity-0 group-hover:opacity-100 transition-opacity !px-2 !py-1 text-xs"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                {deleteConfirm === insight._id && (
                  <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center rounded-xl">
                    <div className="text-center" onClick={e => e.stopPropagation()}>
                      <p className="mb-4">Erkenntnis wirklich löschen?</p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleDelete(insight._id)}
                          variant="danger"
                          className="!px-4 !py-1"
                        >
                          Ja
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(null)}
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
            ))}
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
      <div className="p-6 max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
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

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-4">
            Erkenntnis erfolgreich gespeichert!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg space-y-4">
            <input
              type="text"
              value={formData.title}
              onChange={handleChange}
              name="title"
              placeholder="Titel der Erkenntnis..."
              className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={handleChange}
                name="date"
                className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Kategorien</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <label 
                      key={cat.value}
                      className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors
                        ${formData.category.includes(cat.value) 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-transparent'
                        }`}
                    >
                      <input
                        type="checkbox"
                        value={cat.value}
                        checked={formData.category.includes(cat.value)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            category: e.target.checked
                              ? [...prev.category, value]
                              : prev.category.filter(c => c !== value)
                          }));
                        }}
                        className="sr-only"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              value={formData.text}
              onChange={handleChange}
              name="text"
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