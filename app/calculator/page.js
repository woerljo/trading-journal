"use client";
import { LotSizeCalculator } from '../components/trading/LotSizeCalculator';
import { PageContainer } from '../components/ui/PageContainer';
import { Button } from '../components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CalculatorPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="p-6 max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => router.back()}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Position Size Calculator
          </h1>
          <div className="w-20"></div>
        </div>
        <LotSizeCalculator />
      </div>
    </PageContainer>
  );
} 