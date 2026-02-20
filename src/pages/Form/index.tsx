// pages/Form/index.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ApplicationForm, ApplicationFormErrors, RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import ThemeToggleButton from '../../components/ThemeToggleButton';

type FormRoute = RouteProp<RootStackParamList, 'Form'>;
type FormNav = NativeStackNavigationProp<RootStackParamList, 'Form'>;

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

const validate = (form: ApplicationForm): ApplicationFormErrors => {
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
    errors.contactNumber = 'Enter a valid phone number (7–20 digits, may include +, spaces, dashes).';
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

const EMPTY_FORM: ApplicationForm = {
  name: '',
  email: '',
  contactNumber: '',
  whyHire: '',
};

// ─── Component ────────────────────────────────────────────────────────────────

const FormScreen: React.FC = () => {
  const navigation = useNavigation<FormNav>();
  const route = useRoute<FormRoute>();
  const { job, fromSaved } = route.params;

  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);

  const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof ApplicationForm, boolean>>({
    name: false,
    email: false,
    contactNumber: false,
    whyHire: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const updateField = useCallback(
    (field: keyof ApplicationForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Validate on change only if field has been touched
      if (touched[field]) {
        const next = { ...form, [field]: value };
        const e = validate(next);
        setErrors((prev) => ({ ...prev, [field]: e[field] }));
      }
    },
    [form, touched],
  );

  const onBlur = useCallback(
    (field: keyof ApplicationForm) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const e = validate(form);
      setErrors((prev) => ({ ...prev, [field]: e[field] }));
    },
    [form],
  );

  const handleSubmit = () => {
    // Mark all as touched
    setTouched({ name: true, email: true, contactNumber: true, whyHire: true });

    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    // Simulate async submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccessVisible(true);
    }, 800);
  };

  const handleSuccessOkay = () => {
    setSuccessVisible(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({ name: false, email: false, contactNumber: false, whyHire: false });

    if (fromSaved) {
      // Navigate back to Home (root of stack)
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  const hasErrors = Object.keys(validate(form)).length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[shared.title, { fontSize: 20 }]}>Apply for Job</Text>
          <Text style={[shared.subtitle]} numberOfLines={1}>
            {job.title} · {job.companyName}
          </Text>
        </View>
        <ThemeToggleButton />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Job Summary Banner */}
        <View
          style={[
            styles.jobBanner,
            { backgroundColor: colors.card, borderColor: colors.accent },
          ]}
        >
          <Text style={[shared.bodyText, { fontWeight: '700' }]}>📋 {job.title}</Text>
          <Text style={[shared.subtitle]}>🏢 {job.companyName}</Text>
          {job.location ? (
            <Text style={[shared.subtitle]}>📍 {job.location}</Text>
          ) : null}
        </View>

        {/* Form Title */}
        <Text style={[shared.title, styles.formTitle]}>Your Application</Text>
        <Text style={[shared.subtitle, { marginBottom: 20 }]}>
          All fields are required.
        </Text>

        {/* Full Name */}
        <View style={shared.inputContainer}>
          <Text style={shared.inputLabel}>
            Full Name <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <TextInput
            style={[
              shared.input,
              touched.name && errors.name ? shared.inputError : null,
            ]}
            placeholder="e.g. Juan dela Cruz"
            placeholderTextColor={colors.placeholder}
            value={form.name}
            onChangeText={(v) => updateField('name', v)}
            onBlur={() => onBlur('name')}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={101}
            returnKeyType="next"
            accessibilityLabel="Full name"
          />
          {touched.name && errors.name ? (
            <Text style={shared.errorText}>⚠ {errors.name}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View style={shared.inputContainer}>
          <Text style={shared.inputLabel}>
            Email Address <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <TextInput
            style={[
              shared.input,
              touched.email && errors.email ? shared.inputError : null,
            ]}
            placeholder="e.g. juan@email.com"
            placeholderTextColor={colors.placeholder}
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            onBlur={() => onBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={255}
            returnKeyType="next"
            accessibilityLabel="Email address"
          />
          {touched.email && errors.email ? (
            <Text style={shared.errorText}>⚠ {errors.email}</Text>
          ) : null}
        </View>

        {/* Contact Number */}
        <View style={shared.inputContainer}>
          <Text style={shared.inputLabel}>
            Contact Number <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <TextInput
            style={[
              shared.input,
              touched.contactNumber && errors.contactNumber ? shared.inputError : null,
            ]}
            placeholder="e.g. +63 912 345 6789"
            placeholderTextColor={colors.placeholder}
            value={form.contactNumber}
            onChangeText={(v) => updateField('contactNumber', v)}
            onBlur={() => onBlur('contactNumber')}
            keyboardType="phone-pad"
            autoCorrect={false}
            maxLength={21}
            returnKeyType="next"
            accessibilityLabel="Contact number"
          />
          {touched.contactNumber && errors.contactNumber ? (
            <Text style={shared.errorText}>⚠ {errors.contactNumber}</Text>
          ) : null}
        </View>

        {/* Why hire */}
        <View style={shared.inputContainer}>
          <Text style={shared.inputLabel}>
            Why should we hire you? <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <TextInput
            style={[
              shared.input,
              shared.textArea,
              touched.whyHire && errors.whyHire ? shared.inputError : null,
            ]}
            placeholder="Describe your skills, experience, and why you're the best fit for this role... (min. 20 characters)"
            placeholderTextColor={colors.placeholder}
            value={form.whyHire}
            onChangeText={(v) => updateField('whyHire', v)}
            onBlur={() => onBlur('whyHire')}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1001}
            accessibilityLabel="Why should we hire you"
          />
          <View style={styles.charCountRow}>
            {touched.whyHire && errors.whyHire ? (
              <Text style={shared.errorText}>⚠ {errors.whyHire}</Text>
            ) : (
              <View />
            )}
            <Text
              style={[
                styles.charCount,
                {
                  color:
                    form.whyHire.length > 950
                      ? colors.error
                      : colors.placeholder,
                },
              ]}
            >
              {form.whyHire.length}/1000
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            shared.accentButton,
            styles.submitBtn,
            submitting || hasErrors
              ? { opacity: 0.6 }
              : {},
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityLabel="Submit application"
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={colors.accentText} />
          ) : (
            <Text style={[shared.accentButtonText, { fontSize: 16 }]}>
              Submit Application
            </Text>
          )}
        </TouchableOpacity>

        {/* Hint */}
        {hasErrors && Object.values(touched).some(Boolean) && (
          <Text style={[shared.errorText, { textAlign: 'center', marginTop: 8 }]}>
            Please fix the errors above before submitting.
          </Text>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessOkay}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={[shared.title, { textAlign: 'center', marginBottom: 8 }]}>
              Application Submitted!
            </Text>
            <Text style={[shared.subtitle, { textAlign: 'center', marginBottom: 6 }]}>
              You applied for:
            </Text>
            <Text
              style={[
                shared.bodyText,
                { textAlign: 'center', fontWeight: '700', marginBottom: 4 },
              ]}
            >
              {job.title}
            </Text>
            <Text style={[shared.subtitle, { textAlign: 'center', marginBottom: 24 }]}>
              at {job.companyName}
            </Text>
            <Text
              style={[
                shared.bodyText,
                { textAlign: 'center', color: colors.subText, marginBottom: 28 },
              ]}
            >
              {fromSaved
                ? 'Good luck! Tapping Okay will bring you back to the Job Finder.'
                : 'Good luck with your application! We hope to hear great news soon.'}
            </Text>
            <TouchableOpacity
              style={[shared.accentButton, styles.okayBtn]}
              onPress={handleSuccessOkay}
              accessibilityLabel="Okay"
            >
              <Text style={[shared.accentButtonText, { fontSize: 16 }]}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  backBtn: {
    marginBottom: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  jobBanner: {
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 20,
    gap: 2,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  charCount: {
    fontSize: 12,
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 8,
    paddingVertical: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  okayBtn: {
    width: '100%',
    paddingVertical: 14,
  },
});

export default FormScreen;