// pages/Home/index.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, RawJob, RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors, makeStyles } from '../../context/theme';
import { useSavedJobs } from '../../context/SavedJobsContext';
import JobCard from '../../components/JobCard';
import ThemeToggleButton from '../../components/ThemeToggleButton';

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

      // Handle different response shapes
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
      <View style={[shared.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[shared.subtitle, { marginTop: 12 }]}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[shared.centered, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 40 }}>⚠️</Text>
        <Text style={[shared.title, { marginTop: 12, textAlign: 'center' }]}>
          Failed to Load Jobs
        </Text>
        <Text style={[shared.subtitle, { textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[shared.accentButton, { marginTop: 24, paddingHorizontal: 32 }]}
          onPress={() => fetchJobs()}
        >
          <Text style={shared.accentButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[shared.screen]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[shared.title, { fontSize: 24 }]}>Job Finder</Text>
          <Text style={[shared.subtitle]}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </Text>
        </View>
        <View style={styles.headerRight}>
          <ThemeToggleButton />
          <TouchableOpacity
            style={[shared.accentButton, styles.savedButton]}
            onPress={handleGoToSaved}
            accessibilityLabel="Go to saved jobs"
          >
            <Text style={shared.accentButtonText}>🔖 Saved</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
            <Text style={{ fontSize: 18, color: colors.subText, paddingLeft: 4 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <View style={shared.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🔎</Text>
          <Text style={[shared.title, { marginTop: 12, textAlign: 'center' }]}>No Jobs Found</Text>
          <Text style={[shared.emptyText]}>
            No results match "{searchQuery}". Try a different keyword.
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 15 }}>Clear Search</Text>
          </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
});

export default HomeScreen;