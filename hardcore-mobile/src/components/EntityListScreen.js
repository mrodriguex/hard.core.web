import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { normalizeApiError } from '../services/apiClient';

export default function EntityListScreen({
  title,
  fetchItems,
  getPrimaryText,
  getSecondaryText,
  getStatus,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterActivo, setFilterActivo] = useState(undefined);
  const [error, setError] = useState('');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError('');
    try {
      const data = await fetchItems({ activo: filterActivo, pageIndex: 1, pageSize: 50 });
      const nextItems = Array.isArray(data) ? data : data?.items ?? [];
      setItems(nextItems);
    } catch (e) {
      setError(normalizeApiError(e, `Error al cargar ${title.toLowerCase()}.`));
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [fetchItems, filterActivo, title]);

  useEffect(() => {
    load(false);
  }, [load]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.filterRow}>
          <FilterButton
            label="Todos"
            active={filterActivo === undefined}
            onPress={() => setFilterActivo(undefined)}
          />
          <FilterButton
            label="Activos"
            active={filterActivo === true}
            onPress={() => setFilterActivo(true)}
          />
          <FilterButton
            label="Inactivos"
            active={filterActivo === false}
            onPress={() => setFilterActivo(false)}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    ),
    [title, filterActivo, error]
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={items}
      keyExtractor={(item, index) => String(item?.id ?? index)}
      ListHeaderComponent={listHeader}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load(true)}
          tintColor="#1d4ed8"
        />
      }
      renderItem={({ item }) => {
        const primary = getPrimaryText?.(item) ?? item?.nombre ?? 'Sin nombre';
        const secondary = getSecondaryText?.(item) ?? '';
        const status = getStatus?.(item) ?? (item?.activo ? 'Activo' : 'Inactivo');

        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{primary}</Text>
              <View style={[styles.badge, item?.activo ? styles.badgeSuccess : styles.badgeDanger]}>
                <Text style={[styles.badgeText, item?.activo ? styles.badgeTextSuccess : styles.badgeTextDanger]}>
                  {status}
                </Text>
              </View>
            </View>

            {secondary ? <Text style={styles.cardSubtitle}>{secondary}</Text> : null}

            <Text style={styles.cardMeta}>ID: {item?.id ?? '—'}</Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Sin registros</Text>
        </View>
      }
    />
  );
}

function FilterButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, active ? styles.filterButtonActive : null]}
    >
      <Text style={[styles.filterButtonText, active ? styles.filterButtonTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  headerWrap: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  filterButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextSuccess: {
    color: '#166534',
  },
  badgeTextDanger: {
    color: '#991b1b',
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#6b7280',
  },
});
