// components/JobCard/styles.ts
import { StyleSheet } from 'react-native';

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

export default styles;