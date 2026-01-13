import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "github_stats_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Custom hook to fetch GitHub contribution statistics using the github-contributions-api.deno.dev
 * @param {string} username - GitHub username
 * @returns {{ loading: boolean, error: Error | null, data: GitHubStats | null, refetch: () => void }}
 */
export const useGitHubStats = (username = "arunpandian9159") => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const {
          timestamp,
          data: cachedData,
          cachedUsername,
        } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        const isSameUser = cachedUsername === username;

        if (!isExpired && isSameUser) {
          return cachedData;
        }
      }
    } catch (e) {
      console.error("Error reading GitHub stats cache:", e);
    }
    return null;
  }, [username]);

  const setCachedData = useCallback(
    (statsData) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: statsData,
            cachedUsername: username,
          }),
        );
      } catch (e) {
        console.error("Error caching GitHub stats:", e);
      }
    },
    [username],
  );

  const fetchGitHubStats = useCallback(async () => {
    if (!username) {
      setError(new Error("No username provided"));
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
      // Use the API suggested by the user
      const response = await fetch(
        `https://github-contributions-api.deno.dev/arunpandian9159.json?flat=true`,
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.contributions) {
        throw new Error("Could not get contribution data for this user");
      }

      console.log("--- Processing GitHub Data ---");
      // Process the contribution data
      const stats = processContributionData(result);

      // Log stats as requested in the snippet
      console.log(
        `%c GitHub Stats for ${username} `,
        "background: #222; color: #bada55",
        {
          total: stats.totalContributions,
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
        },
      );

      setData(stats);
      setCachedData(stats);
    } catch (err) {
      console.error("Error fetching GitHub stats:", err);
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
 * Process API contribution data into usable stats
 * @param {Object} rawData - Response from github-contributions-api.deno.dev
 * @returns {GitHubStats}
 */
function processContributionData(rawData) {
  const { contributions, totalContributions } = rawData;

  // Map days to our internal format
  const allDays = contributions.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: mapLevel(day.contributionLevel),
  }));

  // Sort by date (newest first for streak calculation)
  allDays.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(allDays);

  // Get last 52 weeks of data (364 days) for the visualization grid
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);

  const contributionData = [...allDays]
    .filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate >= oneYearAgo && dayDate <= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    contributionData,
  };
}

/**
 * Map GitHub's contribution levels (strings) to numbers used by the UI
 */
function mapLevel(level) {
  const levels = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return levels[level] || 0;
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

  // Sort by date ascending for streak calculation
  const chronologicalDays = [...sortedDays].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // First, find the latest day with contributions
  let latestActivityDay = null;
  for (let i = chronologicalDays.length - 1; i >= 0; i--) {
    if (chronologicalDays[i].count > 0) {
      latestActivityDay = new Date(chronologicalDays[i].date);
      latestActivityDay.setHours(0, 0, 0, 0);
      break;
    }
  }

  // Calculate streaks
  for (let i = 0; i < chronologicalDays.length; i++) {
    const day = chronologicalDays[i];
    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Current streak is the streak ending at the latest activity day,
  // but only if that activity was today or yesterday.
  if (latestActivityDay) {
    const diffToToday = Math.floor(
      (today - latestActivityDay) / (1000 * 60 * 60 * 24),
    );

    if (diffToToday <= 1) {
      // Find the last streak
      let lastStreak = 0;
      for (let i = chronologicalDays.length - 1; i >= 0; i--) {
        if (chronologicalDays[i].count > 0) {
          lastStreak++;
        } else {
          // If we hit a 0 before reaching the latestActivityDay's index,
          // we need to make sure we've actually passed the latestActivityDay.
          // But since we are iterating backwards from the end, the first non-zero
          // sequence we hit IS the last streak.
          if (lastStreak > 0) break;
        }
      }
      currentStreak = lastStreak;
    }
  }

  return { currentStreak, longestStreak };
}

export default useGitHubStats;
