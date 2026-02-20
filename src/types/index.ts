// ─── Job Types ───────────────────────────────────────────────────────────────

export interface Job {
  id: string; // uuid assigned on fetch
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

// Raw shape returned by empllo API (no id field)
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

// ─── Application Form Types ───────────────────────────────────────────────────

export interface ApplicationForm {
  name: string;
  email: string;
  contactNumber: string;
  whyHire: string;
}

export interface ApplicationFormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  whyHire?: string;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Home: undefined;
  Saved: undefined;
  Form: {
    job: Job;
    fromSaved: boolean;
  };
};