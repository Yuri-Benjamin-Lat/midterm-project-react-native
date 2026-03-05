import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ─── Header ────────────────────────────────────────────────────────────────
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

  // ─── Search ────────────────────────────────────────────────────────────────
  clearSearchText: {
    fontSize: 18,
    paddingLeft: 4,
  },

  // ─── Empty state ───────────────────────────────────────────────────────────
  emptyTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  clearSearchLink: {
    fontWeight: '700',
    fontSize: 15,
    marginTop: 16,
  },

  // ─── List ──────────────────────────────────────────────────────────────────
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
  },

  // ─── Detail overlay ────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '88%',
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  detailTitle: {
    fontSize: 22,
    marginBottom: 4,
    paddingRight: 36,
  },
  detailCompany: {
    fontSize: 15,
    marginBottom: 12,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Info box
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  infoRowDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },

  // Detail action buttons
  detailActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  detailActionBtn: {
    flex: 1,
    paddingVertical: 12,
  },
  savedBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  savedBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default styles;