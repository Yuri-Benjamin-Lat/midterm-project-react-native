// components/JobCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Job } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getColors, makeStyles } from '../context/theme';

interface Props {
  job: Job;
  isSaved: boolean;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
}

const formatSalary = (job: Job): string => {
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

const JobCard: React.FC<Props> = ({ job, isSaved, onSave, onApply }) => {
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);

  return (
    <View style={[shared.card, styles.cardExtra]}>
      {/* Header */}
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

      {/* Details */}
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

      {/* Tags */}
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

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            isSaved ? styles.savedBtn : [shared.outlineButton, styles.actionBtn],
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
        </TouchableOpacity>

        <TouchableOpacity
          style={[shared.accentButton, styles.actionBtn]}
          onPress={() => onApply(job)}
          accessibilityLabel="Apply for this job"
        >
          <Text style={shared.accentButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardExtra: {
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    paddingRight: 8,
  },
  jobTitle: {
    fontSize: 17,
    marginBottom: 2,
  },
  remoteBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  remoteBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 13,
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
  },
  savedBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#BBBBBB',
    backgroundColor: 'transparent',
  },
  savedBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default JobCard;
