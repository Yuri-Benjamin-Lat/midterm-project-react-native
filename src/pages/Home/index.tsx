// pages/Home/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, RootStackParamList } from '../../types';
import { useAppStyles } from '../../hooks/useAppStyles';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useFetchJobs } from '../../hooks/useFetchJobs';
import JobCard from '../../components/JobCard';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import JobDetailOverlay from './JobDetailOverlay';
import styles from './styles';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const { colors, shared } = useAppStyles();
  const { saveJob, isJobSaved } = useSavedJobs();
  const { jobs, loading, refreshing, error, fetchJobs, onRefresh } = useFetchJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        (job.location ?? '').toLowerCase().includes(q) ||
        (job.jobType ?? '').toLowerCase().includes(q) ||
        (job.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [jobs, searchQuery]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = useCallback((job: Job) => {
    const result = saveJob(job);
    if (!result.success) Alert.alert('Already Saved', result.message);
  }, [saveJob]);

  const handleApply = useCallback((job: Job) => {
    setSelectedJob(null);
    navigation.navigate('Form', { job, fromSaved: false });
  }, [navigation]);

  const handleCardPress = useCallback((job: Job) => {
    setSelectedJob(job);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setSelectedJob(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView
        style={[shared.centered, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[shared.subtitle, { marginTop: 12 }]}>Loading jobs...</Text>
      </SafeAreaView>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView
        style={[shared.centered, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <Text style={{ fontSize: 40 }}>⚠️</Text>
        <Text style={[shared.title, { marginTop: 12, textAlign: 'center' }]}>
          Failed to Load Jobs
        </Text>
        <Text
          style={[
            shared.subtitle,
            { textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
          ]}
        >
          {error}
        </Text>
        <Pressable
          style={({ pressed }) => [
            shared.accentButton,
            styles.retryButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => fetchJobs()}
          accessibilityLabel="Try again"
        >
          <Text style={shared.accentButtonText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={shared.screen} edges={['top', 'left', 'right']}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[shared.title, { fontSize: 24 }]}>Job Finder</Text>
          <Text style={shared.subtitle}>
            {filteredJobs.length}{' '}
            {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </Text>
        </View>
        <View style={styles.headerRight}>
          <ThemeToggleButton />
          <Pressable
            style={({ pressed }) => [
              shared.accentButton,
              styles.savedButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => navigation.navigate('Saved')}
            accessibilityLabel="Go to saved jobs"
          >
            <Text style={shared.accentButtonText}>🔖 Saved</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Search Bar ───────────────────────────────────────────────────── */}
      <View style={shared.searchContainer}>
        <Text style={{ fontSize: 16, color: colors.subText }}>🔍</Text>
        <TextInput
          style={shared.searchInput}
          placeholder="Search jobs, companies, skills..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search jobs"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={handleClearSearch}
            accessibilityLabel="Clear search"
            hitSlop={8}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.clearSearchText,
                  { color: colors.subText, opacity: pressed ? 0.5 : 1 },
                ]}
              >
                ✕
              </Text>
            )}
          </Pressable>
        )}
      </View>

      {/* ── Job List / Empty state ────────────────────────────────────────── */}
      {filteredJobs.length === 0 ? (
        <View style={shared.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🔎</Text>
          <Text style={[shared.title, styles.emptyTitle]}>No Jobs Found</Text>
          <Text style={shared.emptyText}>
            No results match "{searchQuery}". Try a different keyword.
          </Text>
          <Pressable onPress={handleClearSearch}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.clearSearchLink,
                  { color: colors.accent, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                Clear Search
              </Text>
            )}
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCardPress(item)}
              accessibilityLabel={`View details for ${item.title}`}
              accessibilityRole="button"
            >
              <JobCard
                job={item}
                isSaved={isJobSaved(item.id)}
                onSave={handleSave}
                onApply={handleApply}
              />
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
        />
      )}

      {/* ── Job Detail Overlay ────────────────────────────────────────────── */}
      <JobDetailOverlay
        job={selectedJob}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
        onClose={handleCloseOverlay}
        onSave={handleSave}
        onApply={handleApply}
      />

    </SafeAreaView>
  );
};

export default HomeScreen;