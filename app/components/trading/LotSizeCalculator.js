"use client";
import { useState } from 'react';
import { Button } from '../ui/Button';

export function LotSizeCalculator() {
  const [accountSize, setAccountSize] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [lotSize, setLotSize] = useState(null);

  const calculateLotSize = () => {
    // Account Risiko in Dollar
    const riskAmount = (accountSize * (riskPercentage / 100));
    
    // Differenz zwischen Entry und Stop Loss
    const priceDifference = Math.abs(entryPrice - stopLoss);
    
    // Lot Size Berechnung (1 Lot = 100,000 Einheiten)
    const calculatedLotSize = (riskAmount / priceDifference) / 100000;
    
    setLotSize(calculatedLotSize.toFixed(2));
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Position Size Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Account Size ($)</label>
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(parseFloat(e.target.value))}
            className="w-full bg-gray-700/50 rounded-lg px-3 py-2"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Risk pro Trade (%)</label>
          <input
            type="number"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            className="w-full bg-gray-700/50 rounded-lg px-3 py-2"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Entry Price</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
            className="w-full bg-gray-700/50 rounded-lg px-3 py-2"
            placeholder="1.2500"
            step="0.0001"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value))}
            className="w-full bg-gray-700/50 rounded-lg px-3 py-2"
            placeholder="1.2450"
            step="0.0001"
          />
        </div>

        <Button
          onClick={calculateLotSize}
          className="w-full"
          variant="primary"
        >
          Berechnen
        </Button>

        {lotSize && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
            <h3 className="text-lg font-semibold">Empfohlene Position Size:</h3>
            <p className="text-2xl font-bold text-blue-400">{lotSize} Lots</p>
            <p className="text-sm text-gray-400 mt-2">
              Risiko: ${(accountSize * (riskPercentage / 100)).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 