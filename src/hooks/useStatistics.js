import { useState, useEffect } from 'react';

const STORAGE_KEY = 'presentation-statistics';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState({
    presentationCounts: {},
    skippedCounts: {},
    recentPresentations: [],
    totalPresentations: 0,
    lastPresentation: null,
    lastPresenter: null
  });
  const [loading, setLoading] = useState(true);

  // Load statistics from localStorage
  const loadStatistics = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedStats = JSON.parse(saved);
        setStatistics(parsedStats);
      }
    } catch (error) {
      console.error('Failed to load statistics from localStorage:', error);
      // Initialize with empty values if load fails
      setStatistics({
        presentationCounts: {},
        skippedCounts: {},
        recentPresentations: [],
        totalPresentations: 0,
        lastPresentation: null,
        lastPresenter: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Record a new presentation
  const recordPresentation = async (presenter, skipped = false, accepted = null, reason = '') => {
    try {
      const presentation = {
        id: Date.now().toString(), // Use timestamp as ID
        presenter,
        presented_at: new Date().toISOString(),
        skipped,
        accepted,
        acceptance_reason: reason
      };

      const currentStats = {
        ...statistics,
        presentationCounts: { ...statistics.presentationCounts },
        skippedCounts: { ...statistics.skippedCounts },
        recentPresentations: [...(statistics.recentPresentations || [])]
      };

      currentStats.recentPresentations = [presentation, ...currentStats.recentPresentations];

      if (skipped) {
        currentStats.skippedCounts[presenter] = (currentStats.skippedCounts[presenter] || 0) + 1;
        
        // If a reason was provided, store it with the presentation
        if (reason) {
          presentation.acceptance_reason = reason;
        }
      } else {
        currentStats.presentationCounts[presenter] = (currentStats.presentationCounts[presenter] || 0) + 1;
        currentStats.totalPresentations = (currentStats.totalPresentations || 0) + 1;
        currentStats.lastPresentation = presentation.presented_at;
        currentStats.lastPresenter = presenter;
      }

      setStatistics(currentStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats));
    } catch (error) {
      console.error('Failed to record presentation:', error);
    }
  };

  // Get skip reasons for a specific presenter
  const getSkipReasons = (presenter) => {
    if (!statistics.recentPresentations) return [];
    
    return statistics.recentPresentations
      .filter(p => p.presenter === presenter && p.skipped && p.acceptance_reason)
      .map(p => ({
        reason: p.acceptance_reason,
        date: p.presented_at
      }));
  };

  // Clear all statistics data
  const clearStatistics = () => {
    const emptyStats = {
      presentationCounts: {},
      skippedCounts: {},
      recentPresentations: [],
      totalPresentations: 0,
      lastPresentation: null,
      lastPresenter: null
    };
    
    setStatistics(emptyStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyStats));
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return {
    statistics,
    recordPresentation,
    getSkipReasons,
    clearStatistics,
    loading
  };
};