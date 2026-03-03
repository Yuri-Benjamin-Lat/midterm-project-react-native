// pages/Home/index.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, RawJob, RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import { useSavedJobs } from '../../context/SavedJobsContext';
import JobCard from '../../components/JobCard';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import styles from './styles';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const API_URL = 'https://empllo.com/api/v1';

const normalizeJob = (raw: RawJob): Job => ({
  id: uuid.v4() as string,
  title: typeof raw.title === 'string' ? raw.title : 'Untitled',
  companyName: typeof raw.companyName === 'string' ? raw.companyName : 'Unknown Company',
  minSalary: typeof raw.minSalary === 'number' ? raw.minSalary : null,
  maxSalary: typeof raw.maxSalary === 'number' ? raw.maxSalary : null,
  salaryCurrency: typeof raw.salaryCurrency === 'string' ? raw.salaryCurrency : '$',
  salaryPeriod: typeof raw.salaryPeriod === 'string' ? raw.salaryPeriod : undefined,
  jobType: typeof raw.jobType === 'string' ? raw.jobType : undefined,
  location: typeof raw.location === 'string' ? raw.location : undefined,
  remote: typeof raw.remote === 'boolean' ? raw.remote : undefined,
  description: typeof raw.description === 'string' ? raw.description : undefined,
  applyUrl: typeof raw.applyUrl === 'string' ? raw.applyUrl : undefined,
  tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
  datePosted: typeof raw.datePosted === 'string' ? raw.datePosted : undefined,
});

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);
  const { saveJob, isJobSaved } = useSavedJobs();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API did not return JSON. Please check the API endpoint.');
      }

      const data = await response.json();

      let rawJobs: RawJob[] = [];
      if (Array.isArray(data)) {
        rawJobs = data as RawJob[];
      } else if (data && Array.isArray(data.jobs)) {
        rawJobs = data.jobs as RawJob[];
      } else if (data && Array.isArray(data.data)) {
        rawJobs = data.data as RawJob[];
      } else {
        throw new Error('Unexpected API response format.');
      }

      if (rawJobs.length === 0) {
        throw new Error('No jobs were returned from the API.');
      }

      const normalized = rawJobs.map(normalizeJob);
      setJobs(normalized);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your connection and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs(true);
  };

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

  const handleSave = (job: Job) => {
    const result = saveJob(job);
    if (!result.success) {
      Alert.alert('Already Saved', result.message);
    }
  };

  const handleApply = (job: Job) => {
    navigation.navigate('Form', { job, fromSaved: false });
  };

  const handleGoToSaved = () => {
    navigation.navigate('Saved');
  };

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
          style={[shared.subtitle, { textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }]}
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

  return (
    <SafeAreaView style={[shared.screen]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[shared.title, { fontSize: 24 }]}>Job Finder</Text>
          <Text style={[shared.subtitle]}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
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
            onPress={handleGoToSaved}
            accessibilityLabel="Go to saved jobs"
          >
            <Text style={shared.accentButtonText}>🔖 Saved</Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[shared.searchContainer]}>
        <Text style={{ fontSize: 16, color: colors.subText }}>🔍</Text>
        <TextInput
          style={[shared.searchInput]}
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
            onPress={() => setSearchQuery('')}
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

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <View style={shared.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🔎</Text>
          <Text style={[shared.title, styles.emptyTitle]}>No Jobs Found</Text>
          <Text style={[shared.emptyText]}>
            No results match "{searchQuery}". Try a different keyword.
          </Text>
          <Pressable onPress={() => setSearchQuery('')}>
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
            <JobCard
              job={item}
              isSaved={isJobSaved(item.id)}
              onSave={handleSave}
              onApply={handleApply}
            />
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
    </SafeAreaView>
  );
};

export default HomeScreen;