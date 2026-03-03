// pages/Saved/index.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import { useSavedJobs } from '../../context/SavedJobsContext';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import styles from './styles';

type SavedNav = NativeStackNavigationProp<RootStackParamList, 'Saved'>;

const formatSalary = (job: Job): string => {
  if (!job.minSalary && !job.maxSalary) return 'Salary not disclosed';
  const currency = job.salaryCurrency ?? '$';
  const period = job.salaryPeriod ? `/${job.salaryPeriod}` : '';
  if (job.minSalary && job.maxSalary)
    return `${currency}${job.minSalary.toLocaleString()} – ${currency}${job.maxSalary.toLocaleString()}${period}`;
  if (job.minSalary) return `From ${currency}${job.minSalary.toLocaleString()}${period}`;
  if (job.maxSalary) return `Up to ${currency}${job.maxSalary.toLocaleString()}${period}`;
  return 'Salary not disclosed';
};

const SavedScreen: React.FC = () => {
  const navigation = useNavigation<SavedNav>();
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);
  const { savedJobs, removeJob } = useSavedJobs();

  const handleRemove = (job: Job) => {
    Alert.alert(
      'Remove Job',
      `Remove "${job.title}" from saved jobs?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeJob(job.id),
        },
      ],
    );
  };

  const handleApply = (job: Job) => {
    navigation.navigate('Form', { job, fromSaved: true });
  };

  const renderItem = ({ item }: { item: Job }) => (
    <View style={[shared.card, styles.card]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={[shared.title, styles.jobTitle]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[shared.subtitle]}>{item.companyName}</Text>
        </View>
        {item.remote !== undefined && (
          <View
            style={[
              styles.remoteBadge,
              { backgroundColor: item.remote ? colors.accent : colors.tagBg },
            ]}
          >
            <Text
              style={[
                styles.remoteBadgeText,
                { color: item.remote ? colors.accentText : colors.tagText },
              ]}
            >
              {item.remote ? 'Remote' : 'On-site'}
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <Text style={[styles.location, { color: colors.subText }]}>
        📍 {item.location || 'Location not specified'}
      </Text>
      {item.jobType && (
        <Text style={[styles.location, { color: colors.subText }]}>
          💼 {item.jobType}
        </Text>
      )}
      <Text style={[styles.salary, { color: colors.accent }]}>
        💰 {formatSalary(item)}
      </Text>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <View style={shared.tagContainer}>
          {item.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={[shared.tag, { backgroundColor: colors.tagBg }]}>
              <Text style={[shared.tagText, { color: colors.tagText }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={shared.divider} />

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            shared.dangerButton,
            styles.actionBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => handleRemove(item)}
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
          onPress={() => handleApply(item)}
          accessibilityLabel="Apply for this job"
        >
          <Text style={shared.accentButtonText}>Apply Now</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={shared.screen} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            {({ pressed }) => (
              <Text
                style={{ color: colors.accent, fontSize: 16, fontWeight: '600', opacity: pressed ? 0.6 : 1 }}
              >
                ← Back
              </Text>
            )}
          </Pressable>
          <Text style={[shared.title, { fontSize: 22 }]}>Saved Jobs</Text>
          <Text style={[shared.subtitle]}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </Text>
        </View>
        <ThemeToggleButton />
      </View>

      {savedJobs.length === 0 ? (
        <View style={shared.emptyContainer}>
          <Text style={{ fontSize: 52 }}>🔖</Text>
          <Text style={[shared.title, { marginTop: 12, textAlign: 'center' }]}>
            No Saved Jobs
          </Text>
          <Text style={[shared.emptyText]}>
            Save jobs from the Job Finder to view them here.
          </Text>
          <Pressable
            style={({ pressed }) => [
              shared.accentButton,
              styles.browseButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={shared.accentButtonText}>Browse Jobs</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;