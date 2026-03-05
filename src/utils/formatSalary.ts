// utils/formatSalary.ts
import { Job } from '../types';

/**
 * Formats a job's salary range into a human-readable string.
 * Used by JobCard, Home (detail overlay), and Saved screen.
 */
export const formatSalary = (job: Job): string => {
  if (!job.minSalary && !job.maxSalary) return 'Salary not disclosed';

  const currency = job.salaryCurrency ?? '$';
  const period = job.salaryPeriod ? `/${job.salaryPeriod}` : '';

  if (job.minSalary && job.maxSalary) {
    return `${currency}${job.minSalary.toLocaleString()} – ${currency}${job.maxSalary.toLocaleString()}${period}`;
  }
  if (job.minSalary) return `From ${currency}${job.minSalary.toLocaleString()}${period}`;
  if (job.maxSalary) return `Up to ${currency}${job.maxSalary.toLocaleString()}${period}`;

  return 'Salary not disclosed';
};