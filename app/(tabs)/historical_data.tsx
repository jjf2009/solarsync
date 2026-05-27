import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { fetchHistoricalSensorData, LatestSensorResponse } from '@/services/api';
import { HeaderBar } from '@/components/HeaderBar';
import { useSensorStore } from '@/store/sensorStore';
import { ErrorState } from '@/components/ErrorState';

export default function HistoricalDataScreen() {
  const router = useRouter();
  const [data, setData] = useState<LatestSensorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We can still use the connection status from the store for the HeaderBar
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

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item }: { item: LatestSensorResponse }) => {
    const date = new Date(item.timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = date.toLocaleDateString();

    return (
      <View className="bg-[#1e1e1f] rounded-2xl p-4 mb-4 flex-col border border-[#2a2a2c]">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#849495] font-mono text-xs">{dateString} {timeString}</Text>
          <Text className="text-[#00dbe7] font-bold text-xs">{item.trackingDirection}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <View className="items-center">
            <Text className="text-[#849495] text-[10px] uppercase mb-1">Left LDR</Text>
            <Text className="text-[#e5e2e3] font-bold">{item.leftLDR}</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#849495] text-[10px] uppercase mb-1">Angle</Text>
            <Text className="text-[#e5e2e3] font-bold">{item.servoAngle}°</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#849495] text-[10px] uppercase mb-1">Right LDR</Text>
            <Text className="text-[#e5e2e3] font-bold">{item.rightLDR}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#131314]" edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <HeaderBar connectionStatus={connectionStatus} />

      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-bold tracking-widest text-[#00dbe7] font-mono uppercase">
            Data Logs
          </Text>
          <Text className="text-3xl font-extrabold text-[#e5e2e3] tracking-tight mt-1">
            History
          </Text>
        </View>
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
