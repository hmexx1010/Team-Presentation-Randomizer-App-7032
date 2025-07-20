import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicrophoneIcon from './components/MicrophoneIcon';
import SpinWheel from './components/SpinWheel';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import StatsDashboard from './components/StatsDashboard';
import Confetti from './components/Confetti';
import DarkModeToggle from './components/DarkModeToggle';
import TabNavigation from './components/TabNavigation';
import AcceptanceDialog from './components/AcceptanceDialog';
import { usePresenterRotation } from './hooks/usePresenterRotation';
import { useDarkMode } from './hooks/useDarkMode';
import { useStatistics } from './hooks/useStatistics';
import { playDrumRoll, playSuccess, playConfettiSound } from './utils/sounds';
import './App.css';

// Update TEAM_MEMBERS array with correct spelling
const TEAM_MEMBERS = [
  'Hasan', 'Iwan', 'Kazim', 'Isil', 'Michael', 'Hammad', 'Dimi', 'Tim', 'Reald'
];

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPresenter, setSelectedPresenter] = useState(null);
  const [micDropReason, setMicDropReason] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoadingReason, setIsLoadingReason] = useState(false);
  const [activeTab, setActiveTab] = useState('selector');
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [pendingPresenter, setPendingPresenter] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0); // 0: spinning, 1: celebration, 2: dialog

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    availablePresenters,
    usedPresenters,
    lastPresenter,
    selectPresenter,
    skipPresenter,
    resetRotation,
    isComplete
  } = usePresenterRotation(TEAM_MEMBERS);
  const {
    recordPresentation,
    statistics,
    clearStatistics,
    loading: statsLoading
  } = useStatistics();

  // Sync the last presenter between hooks when statistics load
  useEffect(() => {
    if (!statsLoading && statistics.lastPresenter) {
      // This ensures the last presenter from statistics is considered in the rotation
      localStorage.setItem('mic-presenter-rotation', JSON.stringify({
        available: availablePresenters,
        used: usedPresenters,
        last: statistics.lastPresenter
      }));
    }
  }, [statsLoading, statistics.lastPresenter]);

  const handleSpinClick = async () => {
    if (isSpinning || availablePresenters.length === 0) return;

    setIsSpinning(true);
    setSelectedPresenter(null);
    setMicDropReason('');
    setCelebrationStep(0);
    playDrumRoll();

    setTimeout(async () => {
      const presenter = selectPresenter();
      setPendingPresenter(presenter);
      setSelectedPresenter(presenter);
      setIsSpinning(false);
      setCelebrationStep(1);
      setShowCelebration(true);
      setShowConfetti(true);
      
      // Play the confetti sound when the presenter is selected
      playConfettiSound();

      // Start loading reason
      setIsLoadingReason(true);

      // Fetch AI-generated mic drop reason during celebration
      try {
        const response = await fetch('/api/mic-drop-reason', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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

      // Show celebration for 4 seconds, then show acceptance dialog
      setTimeout(() => {
        setShowCelebration(false);
        setShowConfetti(false);
        setCelebrationStep(2);
        setShowAcceptanceDialog(true);
      }, 4000);
    }, 3000);
  };

  const handleAcceptPresentation = async (accepted, reason = '') => {
    setShowAcceptanceDialog(false);
    setCelebrationStep(0);

    if (accepted) {
      playSuccess();
      // Record the presentation with acceptance
      await recordPresentation(pendingPresenter, false, true, reason);
    } else {
      // Record as declined with reason
      await recordPresentation(pendingPresenter, true, false, reason);
      setSelectedPresenter(null);
      setMicDropReason('');
    }
    
    setPendingPresenter(null);
  };

  const handleReset = () => {
    resetRotation();
    setSelectedPresenter(null);
    setMicDropReason('');
    setShowConfetti(false);
    setShowCelebration(false);
    setCelebrationStep(0);
  };

  const handleSkip = async (presenter) => {
    skipPresenter(presenter);
    await recordPresentation(presenter, true);
    if (selectedPresenter === presenter) {
      setSelectedPresenter(null);
      setMicDropReason('');
    }
  };

  const handleClearStatistics = () => {
    clearStatistics();
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {showConfetti && <Confetti />}

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl md:text-9xl mb-6"
              >
                🎉
              </motion.div>

              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl"
              >
                {selectedPresenter}
              </motion.h2>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl md:text-4xl text-yellow-300 font-semibold drop-shadow-lg"
              >
                You're the chosen one! 🎤
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 300 }}
                className="mt-8 text-2xl text-white opacity-75"
              >
                Get ready to rock! 🤘
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acceptance Dialog */}
      <AnimatePresence>
        {showAcceptanceDialog && (
          <AcceptanceDialog
            presenter={pendingPresenter}
            onAccept={(reason) => handleAcceptPresentation(true, reason)}
            onDecline={(reason) => handleAcceptPresentation(false, reason)}
            micDropReason={micDropReason}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Who Gets the Mic?
            </motion.h1>
            <div className="flex items-center space-x-4">
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
            </div>
          </div>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fair presenter selection with AI-powered mic drops! 🎤✨
          </motion.p>
        </header>

        <main className="max-w-6xl mx-auto">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === 'selector' && (
              <motion.div
                key="selector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
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
                      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isSpinning ? "Spinning the mic..." : "Spin the mic to select presenter"}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={isSpinning ? { x: [-100, 300] } : { x: -100 }}
                        transition={{ duration: 1.5, repeat: isSpinning ? Infinity : 0 }}
                      />
                      {isSpinning ? (
                        <span className="flex items-center relative z-10">
                          <motion.div
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Spinning the Magic...
                        </span>
                      ) : availablePresenters.length === 0 ? (
                        <span className="relative z-10">All Done! Reset to Continue 🔄</span>
                      ) : (
                        <span className="relative z-10">🎤 Spin the Mic! ✨</span>
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

                {/* Result Display - Only show after acceptance */}
                <AnimatePresence>
                  {selectedPresenter && !showCelebration && !showAcceptanceDialog && (
                    <ResultDisplay
                      presenter={selectedPresenter}
                      reason={micDropReason}
                      isLoadingReason={isLoadingReason}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'statistics' && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StatsDashboard
                  statistics={statistics}
                  loading={statsLoading}
                  teamMembers={TEAM_MEMBERS}
                  onClearStatistics={handleClearStatistics}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;