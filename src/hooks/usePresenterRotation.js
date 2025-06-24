import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mic-presenter-rotation';

export const usePresenterRotation = (allPresenters) => {
  const [availablePresenters, setAvailablePresenters] = useState([]);
  const [usedPresenters, setUsedPresenters] = useState([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { available, used } = JSON.parse(saved);
        setAvailablePresenters(available);
        setUsedPresenters(used);
      } catch (error) {
        console.error('Failed to load presenter rotation state:', error);
        resetToInitialState();
      }
    } else {
      resetToInitialState();
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      available: availablePresenters,
      used: usedPresenters
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [availablePresenters, usedPresenters]);

  const resetToInitialState = () => {
    setAvailablePresenters([...allPresenters]);
    setUsedPresenters([]);
  };

  const selectPresenter = () => {
    if (availablePresenters.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availablePresenters.length);
    const selectedPresenter = availablePresenters[randomIndex];
    
    setAvailablePresenters(prev => prev.filter((_, index) => index !== randomIndex));
    setUsedPresenters(prev => [...prev, selectedPresenter]);
    
    return selectedPresenter;
  };

  const skipPresenter = (presenter) => {
    if (availablePresenters.includes(presenter)) {
      setAvailablePresenters(prev => prev.filter(p => p !== presenter));
      setUsedPresenters(prev => [...prev, presenter]);
    }
  };

  const resetRotation = () => {
    resetToInitialState();
  };

  const isComplete = availablePresenters.length === 0 && usedPresenters.length > 0;

  return {
    availablePresenters,
    usedPresenters,
    selectPresenter,
    skipPresenter,
    resetRotation,
    isComplete
  };
};