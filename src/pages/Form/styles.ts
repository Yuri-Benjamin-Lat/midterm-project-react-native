import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  backBtn: {
    marginBottom: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  jobBanner: {
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 20,
    gap: 2,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  charCount: {
    fontSize: 12,
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 8,
    paddingVertical: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  okayBtn: {
    width: '100%',
    paddingVertical: 14,
  },
});

export default styles;