// hooks/useJobForm.ts
import { useState, useCallback } from 'react';
import { ApplicationForm, ApplicationFormErrors } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMPTY_FORM: ApplicationForm = {
  name: '',
  email: '',
  contactNumber: '',
  whyHire: '',
};

const EMPTY_TOUCHED: Record<keyof ApplicationForm, boolean> = {
  name: false,
  email: false,
  contactNumber: false,
  whyHire: false,
};

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

export const validate = (form: ApplicationForm): ApplicationFormErrors => {
  const errors: ApplicationFormErrors = {};

  // Name
  if (!form.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  } else if (!/^[a-zA-Z\s'-]+$/.test(form.name.trim())) {
    errors.name = 'Name may only contain letters, spaces, hyphens, and apostrophes.';
  }

  // Email
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. user@email.com).';
  } else if (form.email.trim().length > 254) {
    errors.email = 'Email address is too long.';
  }

  // Contact number
  if (!form.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!PHONE_REGEX.test(form.contactNumber.trim())) {
    errors.contactNumber =
      'Enter a valid phone number (7–20 digits, may include +, spaces, dashes).';
  }

  // Why hire
  if (!form.whyHire.trim()) {
    errors.whyHire = 'Please tell us why we should hire you.';
  } else if (form.whyHire.trim().length < 20) {
    errors.whyHire = 'Please elaborate — minimum 20 characters.';
  } else if (form.whyHire.trim().length > 1000) {
    errors.whyHire = 'Response must be 1000 characters or fewer.';
  }

  return errors;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseJobFormResult {
  form: ApplicationForm;
  errors: ApplicationFormErrors;
  touched: Record<keyof ApplicationForm, boolean>;
  submitting: boolean;
  successVisible: boolean;
  hasErrors: boolean;
  updateField: (field: keyof ApplicationForm, value: string) => void;
  onBlur: (field: keyof ApplicationForm) => void;
  handleSubmit: () => void;
  handleSuccessOkay: (onDone: () => void) => void;
}

export const useJobForm = (): UseJobFormResult => {
  const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof ApplicationForm, boolean>>(
    EMPTY_TOUCHED,
  );
  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // Validates a single field and merges into errors state
  const validateField = useCallback(
    (field: keyof ApplicationForm, currentForm: ApplicationForm) => {
      const e = validate(currentForm);
      setErrors((prev) => ({ ...prev, [field]: e[field] }));
    },
    [],
  );

  const updateField = useCallback(
    (field: keyof ApplicationForm, value: string) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        // Only re-validate if the field has already been touched
        if (touched[field]) validateField(field, next);
        return next;
      });
    },
    [touched, validateField],
  );

  const onBlur = useCallback(
    (field: keyof ApplicationForm) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setForm((current) => {
        validateField(field, current);
        return current;
      });
    },
    [validateField],
  );

  const handleSubmit = useCallback(() => {
    // Mark every field as touched so all errors show
    setTouched({ name: true, email: true, contactNumber: true, whyHire: true });

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    // Simulate async submission delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccessVisible(true);
    }, 800);
  }, [form]);

  /**
   * Called when the user taps "Okay" on the success modal.
   * Resets the form, then calls `onDone` so the screen can navigate.
   */
  const handleSuccessOkay = useCallback(
    (onDone: () => void) => {
      setSuccessVisible(false);
      setForm(EMPTY_FORM);
      setErrors({});
      setTouched(EMPTY_TOUCHED);
      onDone();
    },
    [],
  );

  const hasErrors = Object.keys(validate(form)).length > 0;

  return {
    form,
    errors,
    touched,
    submitting,
    successVisible,
    hasErrors,
    updateField,
    onBlur,
    handleSubmit,
    handleSuccessOkay,
  };
};