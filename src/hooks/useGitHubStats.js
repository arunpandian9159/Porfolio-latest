import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'github_stats_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Custom hook to fetch GitHub contribution statistics
 * @param {string} username - GitHub username
 * @returns {{ loading: boolean, error: Error | null, data: GitHubStats | null, refetch: () => void }}
 */
export const useGitHubStats = (username) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data: cachedData, cachedUsername } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        const isSameUser = cachedUsername === username;
        
        if (!isExpired && isSameUser) {
          return cachedData;
        }
      }
    } catch (e) {
      console.error('Error reading GitHub stats cache:', e);
    }
    return null;
  }, [username]);

  const setCachedData = useCallback((statsData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: statsData,
        cachedUsername: username
      }));
    } catch (e) {
      console.error('Error caching GitHub stats:', e);
    }
  }, [username]);

  const fetchGitHubStats = useCallback(async () => {
    if (!username) {
      setError(new Error('No username provided'));
      setLoading(false);
      return;
    }

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using github-contributions-api (a public API for contribution data)
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const contributionData = await response.json();
      
      // Process the contribution data
      const stats = processContributionData(contributionData);
      
      setData(stats);
      setCachedData(stats);
    } catch (err) {
      console.error('Error fetching GitHub stats:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [username, getCachedData, setCachedData]);

  useEffect(() => {
    fetchGitHubStats();
  }, [fetchGitHubStats]);

  return { loading, error, data, refetch: fetchGitHubStats };
};

/**
 * Process raw contribution data into usable stats
 * @param {Object} rawData - Raw data from GitHub contributions API
 * @returns {GitHubStats}
 */
function processContributionData(rawData) {
  const { contributions, total } = rawData;
  
  // Flatten contributions into a single array of days
  const allDays = [];
  
  if (contributions && typeof contributions === 'object') {
    // The API returns contributions grouped by year
    Object.values(contributions).forEach(yearData => {
      if (Array.isArray(yearData)) {
        yearData.forEach(day => {
          allDays.push({
            date: day.date,
            count: day.count || 0,
            level: day.level || 0
          });
        });
      }
    });
  }

  // Sort by date (newest first for streak calculation)
  allDays.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(allDays);

  // Get last 52 weeks of data (364 days)
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);

  const contributionData = allDays
    .filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= oneYearAgo && dayDate <= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate total for the displayed period
  const totalContributions = total?.lastYear || contributionData.reduce((sum, day) => sum + day.count, 0);

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    contributionData
  };
}

/**
 * Calculate current and longest contribution streaks
 * @param {Array} sortedDays - Days sorted by date (newest first)
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
function calculateStreaks(sortedDays) {
  if (!sortedDays.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let isCurrentStreakActive = true;

  // Sort by date ascending for streak calculation
  const chronologicalDays = [...sortedDays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = chronologicalDays.length - 1; i >= 0; i--) {
    const day = chronologicalDays[i];
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      
      if (isCurrentStreakActive) {
        // Check if this day is today or yesterday (for current streak)
        const diffDays = Math.floor((today - dayDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          currentStreak = tempStreak;
        }
      }
    } else {
      if (isCurrentStreakActive) {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - dayDate) / (1000 * 60 * 60 * 24));
        
        // If we hit a zero day that's not today, current streak ends
        if (diffDays > 0) {
          isCurrentStreakActive = false;
        }
      }
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

export default useGitHubStats;
