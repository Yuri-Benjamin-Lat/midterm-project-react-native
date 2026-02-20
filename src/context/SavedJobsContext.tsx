// context/SavedJobsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '../types';

interface SavedJobsContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => { success: boolean; message: string };
  removeJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job): { success: boolean; message: string } => {
    const exists = savedJobs.some((j) => j.id === job.id);
    if (exists) {
      return { success: false, message: 'Job already saved.' };
    }
    setSavedJobs((prev) => [job, ...prev]);
    return { success: true, message: 'Job saved successfully!' };
  };

  const removeJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const isJobSaved = (jobId: string): boolean =>
    savedJobs.some((j) => j.id === jobId);

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, removeJob, isJobSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = (): SavedJobsContextType => {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error('useSavedJobs must be used within SavedJobsProvider');
  return ctx;
};
