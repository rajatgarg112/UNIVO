import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uv_club_memberships';

/**
 * Default initial membership state for realistic demonstration.
 * Pre-joins CodeCrafters so the user immediately sees a realistic portal state.
 */
const DEFAULT_MEMBERSHIPS = [
  {
    clubId: 'codecrafters',
    joinedAt: '2026-09-01T10:00:00.000Z',
    status: 'Member',
  },
];

/**
 * Custom Hook: useClubMemberships
 * Manages user's club memberships and synchronization with LocalStorage.
 *
 * Demonstrates:
 * - useState for reactive state
 * - useEffect for persistence and safe initialization
 * - useCallback for stable callback references
 * - Error handling for malformed localStorage data
 */
export function useClubMemberships() {
  const [memberships, setMemberships] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : DEFAULT_MEMBERSHIPS;
      }
    } catch (err) {
      console.error('Error reading club memberships from LocalStorage:', err);
    }
    return DEFAULT_MEMBERSHIPS;
  });

  // Synchronize state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memberships));
    } catch (err) {
      console.error('Error saving club memberships to LocalStorage:', err);
    }
  }, [memberships]);

  // Check if current student is a member of the given club
  const isMember = useCallback(
    (clubId) => {
      return memberships.some((m) => m.clubId === clubId);
    },
    [memberships]
  );

  // Get status string ('Member' | 'Not Joined')
  const getMembershipStatus = useCallback(
    (clubId) => {
      const record = memberships.find((m) => m.clubId === clubId);
      return record ? record.status : 'Not Joined';
    },
    [memberships]
  );

  // Join a club
  const joinClub = useCallback(
    (clubId, clubName = 'Club') => {
      if (isMember(clubId)) {
        return { success: false, message: `You are already a member of ${clubName}.` };
      }

      const newRecord = {
        clubId,
        joinedAt: new Date().toISOString(),
        status: 'Member',
      };

      setMemberships((prev) => [newRecord, ...prev]);
      return {
        success: true,
        message: `Welcome aboard! You have joined ${clubName}.`,
        record: newRecord,
      };
    },
    [isMember]
  );

  // Leave / Cancel membership
  const leaveClub = useCallback((clubId, clubName = 'Club') => {
    setMemberships((prev) => prev.filter((m) => m.clubId !== clubId));
    return {
      success: true,
      message: `You have left ${clubName}. Membership updated.`,
    };
  }, []);

  return {
    memberships,
    isMember,
    getMembershipStatus,
    joinClub,
    leaveClub,
    totalJoined: memberships.length,
  };
}

export default useClubMemberships;
