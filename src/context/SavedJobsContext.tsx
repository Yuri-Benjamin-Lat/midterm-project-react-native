// context/SavedJobsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import { Job } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SaveResult {
  success: boolean;
  message: string;
}

interface SavedJobsContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => SaveResult;
  removeJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
  undefined,
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  /**
   * Adds a job to the saved list.
   * Returns { success: false } if the job is already saved so the caller
   * can show an appropriate message without duplicating that logic here.
   */
  const saveJob = useCallback((job: Job): SaveResult => {
    let alreadyExists = false;

    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) {
        alreadyExists = true;
        return prev; // return unchanged — no re-render triggered
      }
      return [job, ...prev];
    });

    if (alreadyExists) {
      return { success: false, message: 'Job already saved.' };
    }
    return { success: true, message: 'Job saved successfully!' };
  }, []);

  /**
   * Removes a job by ID.
   */
  const removeJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  /**
   * Returns true if a job with the given ID is in the saved list.
   * Stable reference — safe to use in useCallback dependency arrays.
   */
  const isJobSaved = useCallback(
    (jobId: string): boolean => savedJobs.some((j) => j.id === jobId),
    [savedJobs],
  );

  return (
    <SavedJobsContext.Provider
      value={{ savedJobs, saveJob, removeJob, isJobSaved }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSavedJobs = (): SavedJobsContextType => {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) {
    throw new Error('useSavedJobs must be used within SavedJobsProvider');
  }
  return ctx;
};