// types/job.ts

/**
 * Normalized job shape used throughout the app.
 * The `id` field is a UUID assigned at fetch time since the API returns none.
 */
export interface Job {
  id: string;
  title: string;
  companyName: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryCurrency?: string;
  salaryPeriod?: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
  description?: string;
  applyUrl?: string;
  tags?: string[];
  datePosted?: string;
}

/**
 * Raw shape returned by the empllo API before normalization.
 * All fields are optional since the API makes no guarantees.
 */
export interface RawJob {
  title?: string;
  companyName?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryCurrency?: string;
  salaryPeriod?: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
  description?: string;
  applyUrl?: string;
  tags?: string[];
  datePosted?: string;
  [key: string]: unknown;
}