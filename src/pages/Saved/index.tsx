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
import SavedJobCard from './SavedJobCard';
import styles from './styles';

type SavedNav = NativeStackNavigationProp<RootStackParamList, 'Saved'>;

const SavedScreen: React.FC = () => {
  const navigation = useNavigation<SavedNav>();
  const { mode } = useTheme();
  const colors = getColors(mode);
  const shared = makeStyles(colors);
  const { savedJobs, removeJob } = useSavedJobs();

  // ── Handlers ──────────────────────────────────────────────────────────────
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
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            {({ pressed }) => (
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 16,
                  fontWeight: '600',
                  opacity: pressed ? 0.6 : 1,
                }}
              >
                ← Back
              </Text>
            )}
          </Pressable>
          <Text style={[shared.title, { fontSize: 22 }]}>Saved Jobs</Text>
          <Text style={shared.subtitle}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </Text>
        </View>
        <ThemeToggleButton />
      </View>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {savedJobs.length === 0 ? (
        <View style={shared.emptyContainer}>
          <Text style={{ fontSize: 52 }}>🔖</Text>
          <Text style={[shared.title, { marginTop: 12, textAlign: 'center' }]}>
            No Saved Jobs
          </Text>
          <Text style={shared.emptyText}>
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
          renderItem={({ item }) => (
            <SavedJobCard
              job={item}
              onRemove={handleRemove}
              onApply={handleApply}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

    </SafeAreaView>
  );
};

export default SavedScreen;