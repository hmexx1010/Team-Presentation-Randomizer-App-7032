import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicrophoneIcon from './components/MicrophoneIcon';
import SpinWheel from './components/SpinWheel';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import Confetti from './components/Confetti';
import DarkModeToggle from './components/DarkModeToggle';
import { usePresenterRotation } from './hooks/usePresenterRotation';
import { useDarkMode } from './hooks/useDarkMode';
import { playDrumRoll, playSuccess } from './utils/sounds';

const TEAM_MEMBERS = [
  'Hasan', 'Iwan', 'Kazim', 'Isil', 'Michal', 
  'Hammad', 'Dimy', 'Tim', 'Reald'
];

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPresenter, setSelectedPresenter] = useState(null);
  const [micDropReason, setMicDropReason] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoadingReason, setIsLoadingReason] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    availablePresenters,
    usedPresenters,
    selectPresenter,
    skipPresenter,
    resetRotation,
    isComplete
  } = usePresenterRotation(TEAM_MEMBERS);

  const handleSpinClick = async () => {
    if (isSpinning || availablePresenters.length === 0) return;

    setIsSpinning(true);
    setSelectedPresenter(null);
    setMicDropReason('');
    
    // Play drum roll sound
    playDrumRoll();
    
    // Simulate spinning duration
    setTimeout(async () => {
      const presenter = selectPresenter();
      setSelectedPresenter(presenter);
      setIsSpinning(false);
      setShowConfetti(true);
      
      // Play success sound
      playSuccess();
      
      // Fetch AI-generated mic drop reason
      setIsLoadingReason(true);
      try {
        const response = await fetch('/api/mic-drop-reason', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ presenter }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setMicDropReason(data.reason);
        } else {
          setMicDropReason(`${presenter} is ready to drop some knowledge! 🎤`);
        }
      } catch (error) {
        console.error('Failed to fetch mic drop reason:', error);
        setMicDropReason(`${presenter} is ready to drop some knowledge! 🎤`);
      } finally {
        setIsLoadingReason(false);
      }
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }, 3000);
  };

  const handleReset = () => {
    resetRotation();
    setSelectedPresenter(null);
    setMicDropReason('');
    setShowConfetti(false);
  };

  const handleSkip = (presenter) => {
    skipPresenter(presenter);
    if (selectedPresenter === presenter) {
      setSelectedPresenter(null);
      setMicDropReason('');
    }
  };

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {showConfetti && <Confetti />}
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Who Gets the Mic?
            </motion.h1>
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fair presenter selection with AI-powered mic drops! 🎤
          </motion.p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Microphone and Spin Wheel */}
            <div className="lg:col-span-2 flex flex-col items-center space-y-8">
              <div className="relative">
                <MicrophoneIcon isSpinning={isSpinning} />
                {isSpinning && (
                  <SpinWheel 
                    presenters={availablePresenters} 
                    isSpinning={isSpinning}
                  />
                )}
              </div>

              <motion.button
                onClick={handleSpinClick}
                disabled={isSpinning || availablePresenters.length === 0}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isSpinning ? "Spinning the mic..." : "Spin the mic to select presenter"}
              >
                {isSpinning ? (
                  <span className="flex items-center">
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Spinning...
                  </span>
                ) : availablePresenters.length === 0 ? (
                  'All Done! Reset to Continue'
                ) : (
                  '🎤 Spin the Mic!'
                )}
              </motion.button>
            </div>

            {/* Control Panel */}
            <div className="space-y-6">
              <ControlPanel
                availablePresenters={availablePresenters}
                usedPresenters={usedPresenters}
                onReset={handleReset}
                onSkip={handleSkip}
                isComplete={isComplete}
              />
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {selectedPresenter && (
              <ResultDisplay
                presenter={selectedPresenter}
                reason={micDropReason}
                isLoadingReason={isLoadingReason}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;