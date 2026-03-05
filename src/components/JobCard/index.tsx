// components/JobCard/index.tsx
import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';

import { Job } from '../../types';
import { useAppStyles } from '../../hooks/useAppStyles';
import { formatSalary } from '../../utils/formatSalary';
import styles from './styles';

interface Props {
  job: Job;
  isSaved: boolean;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
}

/**
 * Pure card component — only re-renders when job data, isSaved,
 * or the action callbacks actually change.
 * Wrap parent handlers in useCallback to get the full benefit.
 */
const JobCard: React.FC<Props> = memo(({ job, isSaved, onSave, onApply }) => {
  const { colors, shared } = useAppStyles();

  return (
    <View style={[shared.card, styles.cardExtra]}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[shared.title, styles.jobTitle]} numberOfLines={2}>
            {job.title || 'Untitled Position'}
          </Text>
          <Text style={[shared.subtitle, { color: colors.subText }]}>
            {job.companyName || 'Unknown Company'}
          </Text>
        </View>
        {job.remote !== undefined && (
          <View
            style={[
              styles.remoteBadge,
              { backgroundColor: job.remote ? colors.accent : colors.tagBg },
            ]}
          >
            <Text
              style={[
                styles.remoteBadgeText,
                { color: job.remote ? colors.accentText : colors.tagText },
              ]}
            >
              {job.remote ? 'Remote' : 'On-site'}
            </Text>
          </View>
        )}
      </View>

      {/* ── Details ──────────────────────────────────────────────────────── */}
      <View style={styles.detailRow}>
        <Text style={[styles.detailItem, { color: colors.subText }]}>
          📍 {job.location || 'Location not specified'}
        </Text>
        {job.jobType ? (
          <Text style={[styles.detailItem, { color: colors.subText }]}>
            💼 {job.jobType}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.salary, { color: colors.accent }]}>
        💰 {formatSalary(job)}
      </Text>

      {/* ── Tags ─────────────────────────────────────────────────────────── */}
      {job.tags && job.tags.length > 0 && (
        <View style={shared.tagContainer}>
          {job.tags.slice(0, 4).map((tag, idx) => (
            <View key={idx} style={[shared.tag, { backgroundColor: colors.tagBg }]}>
              <Text style={[shared.tagText, { color: colors.tagText }]}>{tag}</Text>
            </View>
          ))}
          {job.tags.length > 4 && (
            <View style={[shared.tag, { backgroundColor: colors.tagBg }]}>
              <Text style={[shared.tagText, { color: colors.tagText }]}>
                +{job.tags.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={shared.divider} />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            isSaved ? styles.savedBtn : [shared.outlineButton, styles.actionBtn],
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
            styles.actionBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => onApply(job)}
          accessibilityLabel="Apply for this job"
        >
          <Text style={shared.accentButtonText}>Apply Now</Text>
        </Pressable>
      </View>

    </View>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;