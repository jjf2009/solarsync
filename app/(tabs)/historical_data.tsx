import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { fetchHistoricalSensorData, LatestSensorResponse } from '@/services/api';
import { HeaderBar }    from '@/components/HeaderBar';
import { ErrorState }   from '@/components/ErrorState';
import { useSensorStore } from '@/store/sensorStore';
import { classifyPanelOutput } from '@/types/sensor';

// ─── Level badge colours ──────────────────────────────────────────────────────

function panelColor(value: number): string {
  const level = classifyPanelOutput(value);
  switch (level) {
    case 'High Generation':   return '#2ae500';
    case 'Medium Generation': return '#00dbe7';
    case 'Low Generation':    return '#f59e0b';
    default:                  return '#849495';
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HistoricalDataScreen() {
  const [data, setData]       = useState<LatestSensorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const connectionStatus = useSensorStore((s) => s.connectionStatus);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHistoricalSensorData(100);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const renderItem = ({ item }: { item: LatestSensorResponse }) => {
    const date        = new Date(item.timestamp);
    const timeString  = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString  = date.toLocaleDateString();
    const panelValue  = item.panelOutput ?? 0;
    const panelPct    = Math.round((panelValue / 1023) * 100);
    const pColor      = panelColor(panelValue);
    const levelLabel  = classifyPanelOutput(panelValue);

    return (
      <View className="bg-[#1e1e1f] rounded-2xl p-4 mb-4 border border-[#2a2a2c]">

        {/* ── Top row: timestamp + direction ── */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[#849495] font-mono text-xs">
            {dateString}{'  '}{timeString}
          </Text>
          <Text className="text-[#00dbe7] font-bold text-xs font-mono">
            {item.trackingDirection}
          </Text>
        </View>

        {/* ── Sensor values row ── */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="items-center flex-1">
            <Text className="text-[#849495] text-[10px] uppercase font-mono mb-1">Left LDR</Text>
            <Text className="text-[#e5e2e3] font-bold text-base">{item.leftLDR}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-[#849495] text-[10px] uppercase font-mono mb-1">Angle</Text>
            <Text className="text-[#e5e2e3] font-bold text-base">{item.servoAngle}°</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-[#849495] text-[10px] uppercase font-mono mb-1">Right LDR</Text>
            <Text className="text-[#e5e2e3] font-bold text-base">{item.rightLDR}</Text>
          </View>
        </View>

        {/* ── Divider ── */}
        <View className="h-[1px] bg-white/[0.05] mb-3" />

        {/* ── Panel output row ── */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={13} color={pColor} />
            <Text className="text-[#849495] text-[10px] uppercase font-mono ml-1.5">
              Panel Output
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Mini bar */}
            <View className="w-24 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
              <View
                style={{ width: `${panelPct}%`, backgroundColor: pColor }}
                className="h-full rounded-full"
              />
            </View>

            {/* ADC value */}
            <Text
              className="text-[12px] font-bold font-mono w-10 text-right"
              style={{ color: pColor }}
            >
              {panelValue}
            </Text>

            {/* Level badge */}
            <View
              style={{ borderColor: pColor + '55', backgroundColor: pColor + '18' }}
              className="px-2 py-0.5 rounded-full border"
            >
              <Text
                className="text-[8px] font-bold font-mono uppercase"
                style={{ color: pColor }}
              >
                {levelLabel.replace(' Generation', '')}
              </Text>
            </View>
          </View>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#131314]" edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      <HeaderBar connectionStatus={connectionStatus} />

      <View className="px-6 pt-4 pb-2">
        <Text className="text-[10px] font-bold tracking-widest text-[#00dbe7] font-mono uppercase">
          Data Logs
        </Text>
        <Text className="text-3xl font-extrabold text-[#e5e2e3] tracking-tight mt-1">
          History
        </Text>
      </View>

      <View className="flex-1 px-6 pt-4">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#00dbe7" />
            <Text className="text-[#849495] mt-4 font-mono">Loading history...</Text>
          </View>
        ) : error ? (
          <ErrorState error={error} onRetry={loadHistory} />
        ) : data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="document-text-outline" size={48} color="#2a2a2c" />
            <Text className="text-[#849495] mt-4 font-mono">No historical data available.</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.timestamp}-${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
});
