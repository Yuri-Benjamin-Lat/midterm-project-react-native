// types/form.ts

/**
 * Shape of the job application form fields.
 */
export interface ApplicationForm {
  name: string;
  email: string;
  contactNumber: string;
  whyHire: string;
}

/**
 * Per-field validation error messages.
 * A missing key means that field has no error.
 */
export interface ApplicationFormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  whyHire?: string;
}