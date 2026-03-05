// pages/Saved/SavedJobCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Job } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import { formatSalary } from '../../utils/formatSalary';
import styles from './styles';

interface Props {
  job: Job;
  onRemove: (job: Job) => void;
  onApply: (job: Job) => void;
}

const SavedJobCard: React.FC<Props> = ({ job, onRemove, onApply }) => {
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);

  return (
    <View style={[shared.card, styles.card]}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={[shared.title, styles.jobTitle]} numberOfLines={2}>
            {job.title}
          </Text>
          <Text style={shared.subtitle}>{job.companyName}</Text>
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

      {/* ── Info ─────────────────────────────────────────────────────────── */}
      <Text style={[styles.location, { color: colors.subText }]}>
        📍 {job.location || 'Location not specified'}
      </Text>
      {job.jobType && (
        <Text style={[styles.location, { color: colors.subText }]}>
          💼 {job.jobType}
        </Text>
      )}
      <Text style={[styles.salary, { color: colors.accent }]}>
        💰 {formatSalary(job)}
      </Text>

      {/* ── Tags ─────────────────────────────────────────────────────────── */}
      {job.tags && job.tags.length > 0 && (
        <View style={shared.tagContainer}>
          {job.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={[shared.tag, { backgroundColor: colors.tagBg }]}>
              <Text style={[shared.tagText, { color: colors.tagText }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={shared.divider} />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            shared.dangerButton,
            styles.actionBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => onRemove(job)}
          accessibilityLabel="Remove from saved jobs"
        >
          <Text style={shared.dangerButtonText}>🗑 Remove</Text>
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
};

export default SavedJobCard;