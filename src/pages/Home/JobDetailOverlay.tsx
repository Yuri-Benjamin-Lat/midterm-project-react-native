// pages/Home/JobDetailOverlay.tsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';

import { Job } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import { formatSalary } from '../../utils/formatSalary';
import { stripHtml } from '../../utils/stripHtml';
import styles from './styles';

interface Props {
  job: Job | null;
  isSaved: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
}

const JobDetailOverlay: React.FC<Props> = ({
  job,
  isSaved,
  onClose,
  onSave,
  onApply,
}) => {
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);

  return (
    <Modal
      visible={job !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* ── Dim backdrop — tap to close ─────────────────────────────────── */}
      <Pressable style={styles.modalBackdrop} onPress={onClose}>

        {/* ── Sheet panel — absorbs taps so backdrop doesn't close ────────── */}
        <Pressable
          style={[
            styles.detailSheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => {}}
        >
          {/* Drag handle */}
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

          {/* Close button */}
          <Pressable
            style={[styles.closeBtn, { backgroundColor: colors.tagBg }]}
            onPress={onClose}
            accessibilityLabel="Close details"
            hitSlop={8}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.closeBtnText,
                  { color: colors.text, opacity: pressed ? 0.5 : 1 },
                ]}
              >
                ✕
              </Text>
            )}
          </Pressable>

          {job && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailScroll}
            >
              {/* ── Title + Company ───────────────────────────────────────── */}
              <Text style={[shared.title, styles.detailTitle]}>{job.title}</Text>
              <Text style={[shared.subtitle, styles.detailCompany]}>
                🏢 {job.companyName}
              </Text>

              {/* ── Badges ───────────────────────────────────────────────── */}
              <View style={styles.badgeRow}>
                {job.remote !== undefined && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: job.remote
                          ? colors.accent
                          : colors.tagBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: job.remote
                            ? colors.accentText
                            : colors.tagText,
                        },
                      ]}
                    >
                      {job.remote ? '🌐 Remote' : '🏢 On-site'}
                    </Text>
                  </View>
                )}
                {job.jobType && (
                  <View style={[styles.badge, { backgroundColor: colors.tagBg }]}>
                    <Text style={[styles.badgeText, { color: colors.tagText }]}>
                      💼 {job.jobType}
                    </Text>
                  </View>
                )}
              </View>

              {/* ── Info box ─────────────────────────────────────────────── */}
              <View
                style={[
                  styles.infoBox,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Location
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {job.location || 'Not specified'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.infoRowDivider,
                    { backgroundColor: colors.border },
                  ]}
                />

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Salary
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: colors.accent, fontWeight: '700' },
                    ]}
                  >
                    {formatSalary(job)}
                  </Text>
                </View>

                {job.datePosted && (
                  <>
                    <View
                      style={[
                        styles.infoRowDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.subText }]}>
                        Posted
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {job.datePosted}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* ── Description ──────────────────────────────────────────── */}
              {job.description ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionHeading, { color: colors.text }]}>
                    About the Role
                  </Text>
                  <Text
                    style={[shared.bodyText, { color: colors.text, lineHeight: 22 }]}
                  >
                    {stripHtml(job.description)}
                  </Text>
                </View>
              ) : null}

              {/* ── Tags ─────────────────────────────────────────────────── */}
              {job.tags && job.tags.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionHeading, { color: colors.text }]}>
                    Skills & Tags
                  </Text>
                  <View style={shared.tagContainer}>
                    {job.tags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={[shared.tag, { backgroundColor: colors.tagBg }]}
                      >
                        <Text style={[shared.tagText, { color: colors.tagText }]}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* ── Action Buttons ────────────────────────────────────────── */}
              <View style={styles.detailActions}>
                <Pressable
                  style={({ pressed }) => [
                    isSaved
                      ? [styles.savedBtn, { borderColor: colors.border }]
                      : shared.outlineButton,
                    styles.detailActionBtn,
                    { opacity: pressed || isSaved ? 0.7 : 1 },
                  ]}
                  onPress={() => onSave(job)}
                  disabled={isSaved}
                  accessibilityLabel={isSaved ? 'Job saved' : 'Save job'}
                >
                  <Text
                    style={
                      isSaved
                        ? [styles.savedBtnText, { color: colors.subText }]
                        : [shared.outlineButtonText, { color: colors.accent }]
                    }
                  >
                    {isSaved ? '✓ Saved' : '🔖 Save'}
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    shared.accentButton,
                    styles.detailActionBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() => onApply(job)}
                  accessibilityLabel="Apply for this job"
                >
                  <Text style={shared.accentButtonText}>Apply Now</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default JobDetailOverlay;