"use client";
import { useState, useEffect } from 'react';
import { useTradeApi } from '@/app/hooks/useTradeApi';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';

export function Calendar({ onBack }) {
  const [trades, setTrades] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { fetchTrades } = useTradeApi();

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const data = await fetchTrades();
      // Nur Real-Time Trades filtern - SEHR strenge Filterung
      const realTimeTrades = data.filter(trade => {
        // Prüfe explizit auf 'realTime' und schließe alles andere aus
        return trade.type === 'realTime' && 
               trade.type !== 'barReplay' && 
               !trade.isDemo;
      });
      setTrades(realTimeTrades);
    } catch (error) {
      console.error('Fehler beim Laden der Trades:', error);
    }
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Füge leere Tage für den Monatsanfang hinzu
    const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push({ type: 'padding' });
    }

    // Füge die Tage des Monats hinzu
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTrades = trades.filter(trade => trade.date === date);
      
      const profit = dayTrades.reduce((sum, trade) => {
        return sum + (trade.profitType === 'profit' ? 
          parseFloat(trade.profitAmount) : 
          -parseFloat(trade.profitAmount));
      }, 0);

      days.push({
        type: 'day',
        day,
        date,
        trades: dayTrades,
        profit
      });
    }

    return days;
  };

  const monthProfit = trades
    .filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() === currentDate.getMonth() &&
             tradeDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, trade) => {
      return sum + (trade.profitType === 'profit' ? 
        parseFloat(trade.profitAmount) : 
        -parseFloat(trade.profitAmount));
    }, 0);

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
            Trading Kalender
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Vorheriger Monat
            </button>
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              <span className={`ml-4 text-lg ${monthProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthProfit > 0 ? '+' : ''}{monthProfit.toFixed(2)}$
              </span>
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Nächster Monat →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-sm text-gray-400 py-2">
                {day}
              </div>
            ))}

            {getCalendarDays().map((day, index) => (
              <motion.div
                key={day.type === 'padding' ? `padding-${index}` : day.date}
                className={`aspect-square p-2 rounded-xl relative group
                  ${day.type === 'padding' ? '' : 
                    day.profit !== 0 ? 'bg-gray-700/30' : 'bg-gray-800/30'}
                  ${day.type === 'day' ? 'hover:bg-gray-700/50' : ''}
                  transition-colors`}
                whileHover={day.type === 'day' ? { scale: 1.05 } : {}}
              >
                {day.type === 'day' && (
                  <>
                    <div className="absolute top-1 left-2 text-sm">{day.day}</div>
                    {day.profit !== 0 && (
                      <div className={`absolute bottom-1 right-2 text-sm font-medium
                        ${day.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {day.profit > 0 ? '+' : ''}{day.profit.toFixed(2)}$
                      </div>
                    )}
                    {day.trades.length > 0 && (
                      <div className="absolute top-1 right-2 text-xs text-gray-400">
                        {day.trades.length}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 