"use client";
import { useState, useEffect } from 'react';
import { useTradeApi } from '@/app/hooks/useTradeApi';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';

export function TradingCalendar({ onBack }) {
  const { fetchTrades, isLoading, error } = useTradeApi();
  const [trades, setTrades] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    if (trades.length > 0) {
      generateCalendarDays(trades);
    }
  }, [trades, currentMonth]);

  const loadTrades = async () => {
    try {
      const data = await fetchTrades();
      console.log('Geladene Trades:', data); // Debug
      setTrades(data);
    } catch (error) {
      console.error('Fehler beim Laden der Trades:', error);
    }
  };

  const generateCalendarDays = (tradesData) => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Erstelle ein Array für jeden Tag des Monats
    for (let day = 1; day <= daysInMonth; day++) {
      // Erstelle das Datum für den aktuellen Tag
      const date = new Date(year, month, day);
      // Formatiere das Datum im lokalen Format (YYYY-MM-DD)
      const dateString = date.toLocaleDateString('sv').split(' ')[0];

      // Finde alle Trades für diesen Tag
      const dayTrades = tradesData.filter(trade => {
        // Konvertiere das Trade-Datum in lokales Format
        const tradeDate = new Date(trade.date);
        const tradeDateString = tradeDate.toLocaleDateString('sv').split(' ')[0];
        return tradeDateString === dateString;
      });

      console.log(`Trades für ${dateString}:`, dayTrades); // Debug

      // Berechne den Gesamtprofit
      const profitSum = dayTrades.reduce((sum, trade) => {
        const amount = parseFloat(trade.profitAmount) || 0;
        return sum + (trade.profitType === 'profit' ? amount : -amount);
      }, 0);

      days.push({
        date: dateString,
        dayOfMonth: day,
        trades: dayTrades,
        profitSum: Number(profitSum.toFixed(2)),
        isProfit: profitSum > 0,
        hasRealTimeTrades: dayTrades.some(trade => trade.type === 'realTime'),
        hasBarReplayTrades: dayTrades.some(trade => trade.type === 'barReplay')
      });
    }

    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

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
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
            Trading Kalender
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Monatsnavigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigateMonth(-1)}
            variant="secondary"
            className="!px-4 !py-2"
          >
            ← Vorheriger Monat
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <Button
            onClick={() => navigateMonth(1)}
            variant="secondary"
            className="!px-4 !py-2"
          >
            Nächster Monat →
          </Button>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-400 p-2">
              {day}
            </div>
          ))}
          
          {/* Leere Zellen für Tage vor Monatsbeginn */}
          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() - 1 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="p-3" />
          ))}
          
          {/* Tage des aktuellen Monats */}
          {calendarDays.map((day) => (
            <div
              key={day.date}
              onClick={() => setSelectedDate(day)}
              className={`p-3 rounded-lg cursor-pointer transition-all
                ${day.trades.length > 0 
                  ? day.isProfit 
                    ? 'bg-green-500/20 hover:bg-green-500/30' 
                    : 'bg-red-500/20 hover:bg-red-500/30'
                  : 'bg-gray-700/30 hover:bg-gray-700/50'
                }
                ${selectedDate?.date === day.date ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{day.dayOfMonth}</span>
                <div className="flex gap-1">
                  {day.hasRealTimeTrades && (
                    <span className="w-2 h-2 rounded-full bg-blue-400" title="Real-Time Trades" />
                  )}
                  {day.hasBarReplayTrades && (
                    <span className="w-2 h-2 rounded-full bg-purple-400" title="Bar-Replay Trades" />
                  )}
                </div>
              </div>
              {day.trades.length > 0 && (
                <div className={`text-xs ${day.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                  {day.profitSum > 0 ? '+' : ''}{day.profitSum}$
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">
              Trades am {new Date(selectedDate.date).toLocaleDateString()}
            </h3>
            {selectedDate.trades.map((trade) => (
              <div key={trade._id} className="mb-2 p-2 bg-gray-800/50 rounded">
                <div className="flex justify-between">
                  <span>{trade.asset}</span>
                  <span className={trade.profitType === 'profit' ? 'text-green-400' : 'text-red-400'}>
                    {trade.profitType === 'profit' ? '+' : '-'}{trade.profitAmount}$
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {trade.tradeStartTime} - {trade.tradeEndTime}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}