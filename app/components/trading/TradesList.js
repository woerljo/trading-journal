"use client";
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TradeModal({ trade, onClose, type }) {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Vergrößertes Bild */}
      {isImageEnlarged && trade.image && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setIsImageEnlarged(false)}
        >
          <img 
            src={trade.image} 
            alt="Trade Screenshot"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
            onClick={() => setIsImageEnlarged(false)}
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Normales Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{trade.asset}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Datum</p>
              <p>{trade.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Trade Richtung</p>
              <p>{trade.tradeDirection === 'long' ? 'Long' : 'Short'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Entry</p>
              <p>{trade.entry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Exit</p>
              <p>{trade.exit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Stop Loss</p>
              <p>{trade.stopLoss}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Risk:Reward</p>
              <p>{trade.riskReward}R</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Profit/Loss</p>
              <p className={trade.profitType === 'profit' ? 'text-green-500' : 'text-red-500'}>
                {trade.profitType === 'profit' ? '+' : '-'}
                {parseFloat(trade.profitAmount).toFixed(2)}{type === 'realTime' ? '$' : '%'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Bias</p>
            <p>Weekly: {trade.weeklyBias} / Daily: {trade.dailyBias}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Confluences</p>
            <p>{trade.strategy.join(', ')}</p>
          </div>

          {trade.notes && (
            <div>
              <p className="text-sm text-gray-400">Notizen</p>
              <p className="text-gray-300">{trade.notes}</p>
            </div>
          )}

          {/* Bild mit Klick-Handler */}
          {trade.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Screenshot</p>
              <img 
                src={trade.image} 
                alt="Trade Screenshot"
                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageEnlarged(true);
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Neue Analyse-Modal Komponente
function AnalysisModal({ trades, onClose, type }) {
  const [analysisTimeRange, setAnalysisTimeRange] = useState('all');

  // Trades nach Zeitraum filtern
  const filteredTrades = trades.filter(trade => {
    if (analysisTimeRange === 'all') return true;
    
    // Bei Bar-Replay: createdAt verwenden
    // Bei Real-Time: trade.date verwenden
    const tradeDate = type === 'barReplay' 
      ? new Date(trade.createdAt)  // Wann wurde der Trade erstellt
      : new Date(trade.date);      // Wann war der Trade
    
    const now = new Date();
    
    switch (analysisTimeRange) {
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return tradeDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return tradeDate >= monthAgo;
      case 'threeMonths':
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        return tradeDate >= threeMonthsAgo;
      default:
        return true;
    }
  });

  // Stats basierend auf gefilterten Trades berechnen
  const stats = {
    totalTrades: filteredTrades.length,
    winningTrades: filteredTrades.filter(t => t.profitType === 'profit').length,
    losingTrades: filteredTrades.filter(t => t.profitType === 'loss').length,
    totalProfit: filteredTrades.reduce((sum, trade) => {
      const amount = parseFloat(trade.profitAmount);
      return sum + (trade.profitType === 'profit' ? amount : -amount);
    }, 0).toFixed(2),
    winRate: (filteredTrades.filter(t => t.profitType === 'profit').length / filteredTrades.length * 100).toFixed(1),
    
    // Häufigste Assets
    topAssets: Object.entries(
      filteredTrades.reduce((acc, trade) => {
        acc[trade.asset] = (acc[trade.asset] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 3),
    
    // Häufigste Strategien
    topStrategies: Object.entries(
      filteredTrades.flatMap(t => t.strategy).reduce((acc, strat) => {
        acc[strat] = (acc[strat] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 3),

    // Tageszeit-Analyse
    timeAnalysis: filteredTrades.reduce((acc, trade) => {
      const hour = parseInt(trade.tradeStartTime.split(':')[0]);
      const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      if (!acc[timeSlot]) acc[timeSlot] = { total: 0, wins: 0 };
      acc[timeSlot].total++;
      if (trade.profitType === 'profit') acc[timeSlot].wins++;
      return acc;
    }, {}),

    // Durchschnittliches R:R
    averageRR: filteredTrades.length ? (
      filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.riskReward || 0), 0) / filteredTrades.length
    ).toFixed(2) : '0.00',

    // Durchschnittliches R:R bei Gewinn-Trades
    averageWinningRR: filteredTrades.filter(t => t.profitType === 'profit').length ? (
      filteredTrades
        .filter(t => t.profitType === 'profit')
        .reduce((sum, trade) => sum + parseFloat(trade.riskReward || 0), 0) / 
      filteredTrades.filter(t => t.profitType === 'profit').length
    ).toFixed(2) : 0,

    // Durchschnittliches R:R bei Verlust-Trades
    averageLosingRR: filteredTrades.filter(t => t.profitType === 'loss').length ? (
      filteredTrades
        .filter(t => t.profitType === 'loss')
        .reduce((sum, trade) => sum + parseFloat(trade.riskReward || 0), 0) / 
      filteredTrades.filter(t => t.profitType === 'loss').length
    ).toFixed(2) : 0,

    // Durchschnittlicher Gewinn
    averageProfit: filteredTrades.filter(t => t.profitType === 'profit').length ? (
      filteredTrades
        .filter(t => t.profitType === 'profit')
        .reduce((sum, trade) => sum + parseFloat(trade.profitAmount), 0) / 
      filteredTrades.filter(t => t.profitType === 'profit').length
    ).toFixed(2) : 0,

    // Durchschnittlicher Verlust
    averageLoss: filteredTrades.filter(t => t.profitType === 'loss').length ? (
      filteredTrades
        .filter(t => t.profitType === 'loss')
        .reduce((sum, trade) => sum + parseFloat(trade.profitAmount), 0) / 
      filteredTrades.filter(t => t.profitType === 'loss').length
    ).toFixed(2) : 0,
  };

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
        className="bg-gray-800 rounded-xl max-w-4xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Trading Analyse
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <select 
            value={analysisTimeRange}
            onChange={(e) => setAnalysisTimeRange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              hover:bg-gray-700 transition-colors"
          >
            <option value="all">Alle Trades</option>
            <option value="week">Letzte Woche</option>
            <option value="month">Letzter Monat</option>
            <option value="threeMonths">Letzte 3 Monate</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Übersicht */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Gesamt Trades:</span>
                <span className="font-bold">{stats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gewonnene Trades:</span>
                <span className="text-green-500 font-bold">{stats.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verlorene Trades:</span>
                <span className="text-red-500 font-bold">{stats.losingTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate:</span>
                <span className="font-bold">{stats.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gesamt {type === 'realTime' ? 'Profit' : 'Performance'}:</span>
                <span className={`font-bold ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit}{type === 'realTime' ? '$' : '%'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Assets */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Meistgehandelte Assets</h3>
            <div className="space-y-3">
              {stats.topAssets.map(([asset, count], index) => (
                <div key={asset} className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {index + 1}. {asset}
                  </span>
                  <span className="font-bold">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Strategien */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Top Confluences</h3>
            <div className="space-y-3">
              {stats.topStrategies.map(([strategy, count], index) => (
                <div key={strategy} className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {index + 1}. {strategy}
                  </span>
                  <span className="font-bold">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tageszeit-Analyse */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Tageszeit-Performance</h3>
            <div className="space-y-3">
              {Object.entries(stats.timeAnalysis).map(([time, data]) => (
                <div key={time} className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {time === 'morning' ? 'Morgens (0-12)' : 
                     time === 'afternoon' ? 'Mittags (12-17)' : 
                     'Abends (17-24)'}:
                  </span>
                  <div className="text-right">
                    <span className="font-bold">{((data.wins / data.total) * 100).toFixed(1)}%</span>
                    <span className="text-gray-400 text-sm ml-2">({data.wins}/{data.total})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Durchschnittlicher Gewinn/Verlust Panel */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Durchschnittlicher Gewinn/Verlust</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ø Gewinn:</span>
                <span className="text-green-500 font-bold">
                  +{stats.averageProfit}{type === 'realTime' ? '$' : '%'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ø Verlust:</span>
                <span className="text-red-500 font-bold">
                  -{stats.averageLoss}{type === 'realTime' ? '$' : '%'}
                </span>
              </div>
            </div>
          </div>

          {/* Durchschnittliches Risk:Reward Panel */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Durchschnittliches Risk:Reward</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Gesamt:</span>
                <span className="font-bold">{stats.averageRR}R</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bei Gewinn-Trades:</span>
                <span className="text-green-500 font-bold">{stats.averageWinningRR}R</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bei Verlust-Trades:</span>
                <span className="text-red-500 font-bold">{stats.averageLosingRR}R</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Neue Komponente für den Sortier-Header
function SortHeader({ sortBy, setSortBy, sortDirection, setSortDirection }) {
  const SortButton = ({ label, value }) => (
    <button
      onClick={() => {
        if (sortBy === value) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(value);
          setSortDirection('desc');
        }
      }}
      className={`px-3 py-1.5 rounded-lg text-sm transition-colors
        ${sortBy === value 
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
          : 'hover:bg-gray-700/50 text-gray-400 border border-transparent'
        }`}
    >
      {label} {sortBy === value && (sortDirection === 'asc' ? '↑' : '↓')}
    </button>
  );

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <span className="text-sm text-gray-400 flex items-center">Sortieren nach:</span>
      <SortButton label="Datum" value="date" />
      <SortButton label="Asset" value="asset" />
      <SortButton label="Profit/Loss" value="profit" />
    </div>
  );
}

export function TradesList({ trades, onBack, onDeleteTrade, type }) {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [timeRange, setTimeRange] = useState('all');

  const sortedTrades = [...trades].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        if (type === 'barReplay') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          const dateA = new Date(a.date + 'T' + a.tradeStartTime);
          const dateB = new Date(b.date + 'T' + b.tradeStartTime);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
      case 'asset':
        return sortDirection === 'asc'
          ? a.asset.localeCompare(b.asset)
          : b.asset.localeCompare(a.asset);
      case 'profit':
        const profitA = a.profitType === 'profit' ? a.profitAmount : -a.profitAmount;
        const profitB = b.profitType === 'profit' ? b.profitAmount : -b.profitAmount;
        return sortDirection === 'asc'
          ? profitA - profitB
          : profitB - profitA;
      default:
        return 0;
    }
  });

  const filteredTrades = sortedTrades.filter(trade => {
    if (timeRange === 'all') return true;
    
    const tradeDate = type === 'barReplay' 
      ? new Date(trade.createdAt)
      : new Date(trade.date);
    
    const now = new Date();
    if (timeRange === 'week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return tradeDate >= weekAgo;
    }
    if (timeRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return tradeDate >= monthAgo;
    }
  });

  return (
    <PageContainer>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {type === 'realTime' ? 'Real-Time Trades' : 'Bar-Replay Trades'}
          </h1>
          <Button
            onClick={() => setShowAnalysis(true)}
            variant="primary"
            className="!px-4 !py-2 text-sm"
            disabled={trades.length === 0}
          >
            📊 Analyse
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              hover:bg-gray-700 transition-colors"
          >
            <option value="all">Alle Trades</option>
            <option value="week">Letzte Woche</option>
            <option value="month">Letzter Monat</option>
          </select>
        </div>

        {trades.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Noch keine Trades vorhanden</p>
        ) : (
          <>
            <SortHeader 
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTrades.map((trade) => (
                <motion.div
                  key={trade._id}
                  layoutId={`trade-${trade._id}`}
                  className="bg-gray-800/50 rounded-xl overflow-hidden group relative max-w-sm"
                >
                  {trade.image && (
                    <div 
                      className="h-32 w-full bg-gray-900 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      <img 
                        src={trade.image} 
                        alt="Trade Screenshot"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-sm">{trade.asset}</h3>
                        <p className="text-xs text-gray-400">{trade.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${trade.profitType === 'profit' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.profitType === 'profit' ? '+' : '-'}
                          {parseFloat(trade.profitAmount).toFixed(2)}{type === 'realTime' ? '$' : '%'}
                        </p>
                        <p className={`text-xs ${trade.tradeDirection === 'long' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.tradeDirection === 'long' ? 'Long' : 'Short'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedTrade(trade)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Details anzeigen →
                      </button>
                      <Button
                        onClick={() => setDeleteConfirm(trade._id)}
                        variant="danger"
                        className="opacity-0 group-hover:opacity-100 transition-opacity !px-2 !py-1 text-xs"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                  {deleteConfirm === trade._id && (
                    <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center">
                      <div className="text-center">
                        <p className="mb-4">Trade wirklich löschen?</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => {
                              onDeleteTrade(trade._id);
                              setDeleteConfirm(null);
                            }}
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
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedTrade && (
          <TradeModal 
            trade={selectedTrade} 
            onClose={() => setSelectedTrade(null)}
            type={type}
          />
        )}
        {showAnalysis && (
          <AnalysisModal
            trades={trades}
            onClose={() => setShowAnalysis(false)}
            type={type}
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
} 