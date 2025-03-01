"use client";
import { PageContainer } from '../components/ui/PageContainer';
import { Leaderboard } from '../components/trading/Leaderboard';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => router.back()}
            variant="primary"
            className="!px-4 !py-2 text-sm"
          >
            ← Zurück
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
            Weekly Leaderboard
          </h1>
          <div className="w-20"></div>
        </div>

        <Leaderboard />
      </div>
    </PageContainer>
  );
} 