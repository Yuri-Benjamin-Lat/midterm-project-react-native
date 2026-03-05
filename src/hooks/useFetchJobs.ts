// hooks/useFetchJobs.ts
import { useState, useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';

import { Job, RawJob } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = 'https://empllo.com/api/v1';
const FETCH_TIMEOUT_MS = 15000;

// ─── Normalizer ───────────────────────────────────────────────────────────────

/**
 * Maps a raw API job object to our typed Job shape,
 * assigning a fresh UUID since the API returns no id field.
 */
const normalizeJob = (raw: RawJob): Job => ({
  id: uuid.v4() as string,
  title: typeof raw.title === 'string' ? raw.title : 'Untitled',
  companyName:
    typeof raw.companyName === 'string' ? raw.companyName : 'Unknown Company',
  minSalary: typeof raw.minSalary === 'number' ? raw.minSalary : null,
  maxSalary: typeof raw.maxSalary === 'number' ? raw.maxSalary : null,
  salaryCurrency:
    typeof raw.salaryCurrency === 'string' ? raw.salaryCurrency : '$',
  salaryPeriod:
    typeof raw.salaryPeriod === 'string' ? raw.salaryPeriod : undefined,
  jobType: typeof raw.jobType === 'string' ? raw.jobType : undefined,
  location: typeof raw.location === 'string' ? raw.location : undefined,
  remote: typeof raw.remote === 'boolean' ? raw.remote : undefined,
  description:
    typeof raw.description === 'string' ? raw.description : undefined,
  applyUrl: typeof raw.applyUrl === 'string' ? raw.applyUrl : undefined,
  tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
  datePosted:
    typeof raw.datePosted === 'string' ? raw.datePosted : undefined,
});

// ─── Response parser ──────────────────────────────────────────────────────────

/**
 * Handles the different possible shapes the empllo API may return:
 * a bare array, { jobs: [] }, or { data: [] }.
 */
const parseResponse = (data: unknown): RawJob[] => {
  if (Array.isArray(data)) return data as RawJob[];
  if (data && Array.isArray((data as Record<string, unknown>).jobs))
    return (data as { jobs: RawJob[] }).jobs;
  if (data && Array.isArray((data as Record<string, unknown>).data))
    return (data as { data: RawJob[] }).data;
  throw new Error('Unexpected API response format.');
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseFetchJobsResult {
  jobs: Job[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchJobs: (isRefresh?: boolean) => Promise<void>;
  onRefresh: () => void;
}

export const useFetchJobs = (): UseFetchJobsResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        FETCH_TIMEOUT_MS,
      );

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          'API did not return JSON. Please check the API endpoint.',
        );
      }

      const data: unknown = await response.json();
      const rawJobs = parseResponse(data);

      if (rawJobs.length === 0) {
        throw new Error('No jobs were returned from the API.');
      }

      setJobs(rawJobs.map(normalizeJob));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.name === 'AbortError'
            ? 'Request timed out. Please check your connection and try again.'
            : err.message,
        );
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs(true);
  }, [fetchJobs]);

  return { jobs, loading, refreshing, error, fetchJobs, onRefresh };
};