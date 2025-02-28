"use client";
import { useState } from 'react';
import { Button } from '../ui/Button';
import { PageContainer } from '../ui/PageContainer';
import { motion } from 'framer-motion';

export function TradingCalendar({ trades, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Gruppiere Trades nach Datum und berechne Tagessummen
  const dailyProfits = trades.reduce((acc, trade) => {
    if (!acc[trade.date]) {
      acc[trade.date] = 0;
    }
    const amount = parseFloat(trade.profitAmount);
    acc[trade.date] += trade.profitType === 'profit' ? amount : -amount;
    return acc;
  }, {});

  // Kalenderfunktionen
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null); // Leere Tage am Anfang
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const formatDate = (day) => {
    const d = day.toString().padStart(2, '0');
    const m = (month + 1).toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const formatProfit = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <PageContainer>
      <div className="p-6 max-w-5xl mx-auto">
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

        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg">
          {/* Monatsnavigation */}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              variant="secondary"
              className="!px-4 !py-2"
            >
              ←
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <Button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              variant="secondary"
              className="!px-4 !py-2"
            >
              →
            </Button>
          </div>

          {/* Kalender Grid */}
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
              <div key={day} className="font-semibold text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = formatDate(day);
              const profit = dailyProfits[dateStr] || 0;
              const hasProfit = profit !== 0;

              return (
                <motion.div
                  key={dateStr}
                  className={`aspect-square rounded-lg p-2 flex flex-col justify-between
                    ${hasProfit ? 'bg-gray-900/50' : 'bg-gray-900/20'}
                    ${profit > 0 ? 'border border-green-500/30' : profit < 0 ? 'border border-red-500/30' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-sm">{day}</span>
                  {hasProfit && (
                    <span className={`text-xs font-semibold
                      ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {formatProfit(profit)}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 