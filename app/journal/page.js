"use client";

import { useState, useEffect } from "react";
import { RealTimeTrading } from '../components/trading/RealTimeTrading';
import { BarReplayTrading } from '../components/trading/BarReplayTrading';
import { InsightsForm } from '../components/trading/InsightsForm';
import { QuoteDisplay } from '../components/ui/QuoteDisplay';
import { motion } from "framer-motion";
import { PageContainer } from "../components/ui/PageContainer";
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { GoalsForm } from '../components/trading/GoalsForm';

const quotes = [
  "The goal of a successful trader is to make the best trades. Money is secondary. — Alexander Elder",
  "In trading and investing, it's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong. — George Soros",
  "The market is a device for transferring money from the impatient to the patient. — Warren Buffett",
  "It's not whether you're winning or losing, it's whether you're learning or not. — Unknown",
  "Do not be embarrassed by your failures, learn from them and start again. — Richard Branson",
  "A trader's greatest asset is patience. — Unknown",
  "The best traders have no ego. — Mark Minervini",
  "Risk comes from not knowing what you're doing. — Warren Buffett",
  "The hardest thing in trading is to not overtrade. — Unknown",
  "Success in trading requires the ability to take losses without regret and make profits without elation. — Unknown",
  "It's not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change. — Charles Darwin",
  "You don't need to be a genius to succeed in trading; you just need a well-thought-out plan and the discipline to follow it. — Unknown",
  "Your biggest loss is not learning from your mistakes. — Unknown",
  "Trading is not about being right, it's about making money. — Unknown",
  "Patience is the key to success in trading. You don't have to be right every time, just right most of the time. — Unknown"
];

export default function TradingJournal() {
  const [view, setView] = useState('main');
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (view === 'main') {
    return (
      <PageContainer>
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[40%] -left-[40%] w-[100%] h-[100%] 
                rounded-full bg-blue-500/5 blur-3xl"
            />
            <motion.div 
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[40%] -right-[40%] w-[100%] h-[100%] 
                rounded-full bg-purple-500/5 blur-3xl"
            />
          </div>

          <div className="max-w-2xl mx-auto relative">
            {/* Einfacherer Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-6 text-white">
                Trading Journal
              </h1>
              <QuoteDisplay quote={randomQuote} />
            </motion.div>

            {/* Trading Buttons mit Hover-Effekten */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {[
                {
                  title: "Real-Time Trading",
                  description: "Dokumentiere deine Live-Trades",
                  icon: "🕒",
                  view: "realTime",
                  color: "from-blue-500/10 to-blue-600/10",
                  hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
                  borderColor: "border-blue-500/20"
                },
                {
                  title: "Bar-Replay Trading",
                  description: "Übe mit historischen Daten",
                  icon: "📊",
                  view: "barReplay",
                  color: "from-purple-500/10 to-purple-600/10",
                  hoverColor: "hover:from-purple-500/20 hover:to-purple-600/20",
                  borderColor: "border-purple-500/20"
                },
                {
                  title: "Trading Erkenntnisse",
                  description: "Dokumentiere deine Learnings",
                  icon: "💡",
                  view: "insights",
                  color: "from-amber-500/10 to-amber-600/10",
                  hoverColor: "hover:from-amber-500/20 hover:to-amber-600/20",
                  borderColor: "border-amber-500/20"
                },
                {
                  title: "Trading Kalender",
                  description: "Verfolge deine tägliche Performance",
                  icon: "📅",
                  href: "/calendar",
                  color: "from-emerald-500/10 to-emerald-600/10",
                  hoverColor: "hover:from-emerald-500/20 hover:to-emerald-600/20",
                  borderColor: "border-emerald-500/20"
                },
                {
                  title: "Trading Ziele",
                  description: "Setze und verfolge deine Ziele",
                  icon: "🎯",
                  view: "goals",
                  color: "from-pink-500/10 to-pink-600/10",
                  hoverColor: "hover:from-pink-500/20 hover:to-pink-600/20",
                  borderColor: "border-pink-500/20"
                }
              ].map((button, index) => (
                <motion.div
                  key={button.view || button.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${button.color} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                    rounded-xl blur`} 
                  />
                  {button.href ? (
                    <Link href={button.href}>
                      <Button
                        className={`relative w-full p-6 rounded-xl bg-gray-800/50 
                          backdrop-blur-sm border border-gray-700/50 text-white 
                          transition-all duration-300 group`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                            {button.icon}
                          </span>
                          <div className="text-left">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-opacity-90">
                              {button.title}
                            </h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                              {button.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => setView(button.view)}
                      className={`relative w-full p-6 rounded-xl bg-gray-800/50 
                        backdrop-blur-sm border border-gray-700/50 text-white 
                        transition-all duration-300 group`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {button.icon}
                        </span>
                        <div className="text-left">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-opacity-90">
                            {button.title}
                          </h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300">
                            {button.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Aktualisierte components mit korrekten Props
  const components = {
    realTime: <RealTimeTrading onBack={() => setView('main')} />,
    barReplay: <BarReplayTrading onBack={() => setView('main')} />,
    insights: <InsightsForm onBack={() => setView('main')} />,
    goals: <GoalsForm onBack={() => setView('main')} />
  };

  return components[view] || null;
}

function OptionButton({ onClick, title, description, icon, color = "blue" }) {
  const colors = {
    blue: {
      glow: "rgba(59,130,246,0.3)",
      border: "blue-500/50",
      gradient: "from-blue-500/10 to-blue-600/10",
      hover: "text-blue-400",
    },
    purple: {
      glow: "rgba(147,51,234,0.3)",
      border: "purple-500/50",
      gradient: "from-purple-500/10 to-purple-600/10",
      hover: "text-purple-400",
    },
    green: {
      glow: "rgba(34,197,94,0.3)",
      border: "green-500/50",
      gradient: "from-green-500/10 to-green-600/10",
      hover: "text-green-400",
    },
  };

  const colorConfig = colors[color];

  return (
    <motion.button
      variants={{
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1 }
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
        text-white shadow-lg transition-all duration-300
        hover:shadow-[0_0_20px_${colorConfig.glow}] hover:border-${colorConfig.border} hover:bg-gray-800/80
        transform hover:-translate-y-1 relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colorConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-center gap-4">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <div className="text-left">
          <h3 className={`text-xl font-bold mb-1 group-hover:${colorConfig.hover} transition-colors duration-300`}>{title}</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}
