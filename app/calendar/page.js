"use client";
import { Calendar } from '../components/trading/Calendar';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  return <Calendar onBack={() => router.back()} />;
} 