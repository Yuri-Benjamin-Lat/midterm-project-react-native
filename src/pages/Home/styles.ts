import { StyleSheet } from 'react-native';

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
  clearSearchText: {
    fontSize: 18,
    paddingLeft: 4,
  },
  emptyTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  clearSearchLink: {
    fontWeight: '700',
    fontSize: 15,
    marginTop: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
});

export default styles;