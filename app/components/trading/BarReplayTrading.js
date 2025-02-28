"use client";
import { useTradeForm } from '@/app/hooks/useTradeForm';
import { useTradeApi } from '@/app/hooks/useTradeApi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PageContainer } from '../ui/PageContainer';
import { useState, useEffect } from 'react';
import { TradesList } from './TradesList';

const initialState = {
  date: "",
  tradeStartTime: "",
  tradeEndTime: "",
  asset: "",
  entry: "",
  exit: "",
  stopLoss: "",
  riskReward: "",
  profitType: "",
  profitAmount: "",
  strategy: [],
  notes: "",
  image: "",
  weeklyBias: "",
  dailyBias: "",
  type: "barReplay"
};

export function BarReplayTrading({ onBack }) {
  const {
    formData,
    handleChange,
    handleStrategyChange,
    handleImageUpload,
    resetForm
  } = useTradeForm(initialState);

  const { saveTrade, fetchTrades, deleteTrade, isLoading, error } = useTradeApi();
  const [trades, setTrades] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showTrades, setShowTrades] = useState(false);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const data = await fetchTrades();
      // Nur BarReplay Trades filtern
      setTrades(data.filter(trade => trade.type === 'barReplay'));
    } catch (error) {
      console.error('Fehler beim Laden der Trades:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveTrade(formData);
      resetForm();
      setSaveSuccess(true);
      loadTrades();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const handleDeleteTrade = async (id) => {
    try {
      await deleteTrade(id);
      loadTrades();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  if (showTrades) {
    return <TradesList 
      trades={trades} 
      onBack={() => setShowTrades(false)} 
      onDeleteTrade={handleDeleteTrade}
      type="barReplay" 
    />;
  }

  return (
    <PageContainer>
      <div className="p-6 max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Bar-Replay-Trading
          </h1>
          <div className="w-20"></div> {/* Spacer für symmetrisches Layout */}
        </div>

        {saveSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Trade erfolgreich gespeichert! ✅
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Datum"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Trade Start"
              type="time"
              name="tradeStartTime"
              value={formData.tradeStartTime}
              onChange={handleChange}
              required
            />
            <Input
              label="Trade Ende"
              type="time"
              name="tradeEndTime"
              value={formData.tradeEndTime}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Asset"
            type="text"
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            placeholder="z.B. EUR/USD"
            required
          />
          <Input
            label="Entry Preis"
            type="number"
            name="entry"
            value={formData.entry}
            onChange={handleChange}
            step="0.00001"
            required
          />
          <Input
            label="Exit Preis"
            type="number"
            name="exit"
            value={formData.exit}
            onChange={handleChange}
            step="0.00001"
            required
          />
          <Input
            label="Stop Loss"
            type="number"
            name="stopLoss"
            value={formData.stopLoss}
            onChange={handleChange}
            step="0.00001"
            required
          />
          <Input
            label="Risk:Reward"
            type="number"
            name="riskReward"
            value={formData.riskReward}
            onChange={handleChange}
            placeholder="z.B. 1.50"
            step="0.01"
            required
          />
          <Select
            label="Profit/Loss"
            name="profitType"
            value={formData.profitType}
            onChange={handleChange}
            required
          >
            <option value="">Bitte wählen</option>
            <option value="profit">Profit</option>
            <option value="loss">Loss</option>
          </Select>
          <Input
            label="Betrag in %"
            type="number"
            name="profitAmount"
            value={formData.profitAmount}
            onChange={handleChange}
            step="0.01"
            placeholder="z.B. 5 für 5%"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Weekly Bias"
              name="weeklyBias"
              value={formData.weeklyBias}
              onChange={handleChange}
              required
            >
              <option value="">Bitte wählen</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
            </Select>
            <Select
              label="Daily Bias"
              name="dailyBias"
              value={formData.dailyBias}
              onChange={handleChange}
              required
            >
              <option value="">Bitte wählen</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
            </Select>
          </div>
          
          <fieldset className="p-4 border border-gray-700 rounded-lg">
            <legend className="text-sm font-semibold px-2">Confluences</legend>
            <div className="grid grid-cols-2 gap-2">
              {['FVG', 'Orderblock', 'EQ', 'Liquidity', 'BOS'].map((strat) => (
                <label key={strat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={strat}
                    checked={formData.strategy.includes(strat)}
                    onChange={handleStrategyChange}
                    className="form-checkbox bg-gray-700 border-gray-600 rounded"
                  />
                  <span>{strat}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Zusätzliche Notizen"
            rows="4"
          />

          <Input
            label="Screenshot"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              type="submit" 
              variant="success" 
              className="flex-1 !py-3 hover:scale-105 transition-transform"
            >
              💾 Trade speichern
            </Button>
            <Button 
              type="button" 
              onClick={() => setShowTrades(true)} 
              className="flex-1 !py-3 hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700"
            >
              📊 Gespeicherte Trades
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
} 