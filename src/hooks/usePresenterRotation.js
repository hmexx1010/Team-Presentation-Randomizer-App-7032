import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mic-presenter-rotation';

export const usePresenterRotation = (allPresenters) => {
  const [availablePresenters, setAvailablePresenters] = useState([]);
  const [usedPresenters, setUsedPresenters] = useState([]);
  const [lastPresenter, setLastPresenter] = useState(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { available, used, last } = JSON.parse(saved);
        setAvailablePresenters(available);
        setUsedPresenters(used);
        setLastPresenter(last);
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
      used: usedPresenters,
      last: lastPresenter
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [availablePresenters, usedPresenters, lastPresenter]);

  const resetToInitialState = () => {
    setAvailablePresenters([...allPresenters]);
    setUsedPresenters([]);
    setLastPresenter(null);
  };

  const selectPresenter = () => {
    if (availablePresenters.length === 0) return null;
    
    // Filter out the last presenter to prevent consecutive presentations
    const eligiblePresenters = lastPresenter 
      ? availablePresenters.filter(presenter => presenter !== lastPresenter)
      : availablePresenters;
    
    // If all remaining presenters are the same as last presenter,
    // we have to allow them (happens when only one presenter is left)
    const selectFrom = eligiblePresenters.length > 0 ? eligiblePresenters : availablePresenters;
    
    const randomIndex = Math.floor(Math.random() * selectFrom.length);
    const selectedPresenter = selectFrom[randomIndex];
    
    // Remove from available and add to used
    setAvailablePresenters(prev => prev.filter(p => p !== selectedPresenter));
    setUsedPresenters(prev => [...prev, selectedPresenter]);
    setLastPresenter(selectedPresenter);
    
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
    lastPresenter,
    selectPresenter,
    skipPresenter,
    resetRotation,
    isComplete
  };
};