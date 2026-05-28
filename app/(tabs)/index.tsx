import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HeaderBar } from '@/components/HeaderBar';
import { SensorCard } from '@/components/SensorCard';
import { ServoIndicator } from '@/components/ServoIndicator';
import { StatusCard } from '@/components/StatusCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

import { useSensorData } from '@/hooks/useSensorData';
import { useSensorStore } from '@/store/sensorStore';

export default function HomeScreen() {
  // Start polling; returns the backend URL for error messages
  const backendUrl = useSensorData();

  // Read each field with individual selectors to minimise re-renders
  const leftLDR = useSensorStore((s) => s.leftLDR);
  const rightLDR = useSensorStore((s) => s.rightLDR);
  const servoAngle = useSensorStore((s) => s.servoAngle);
  const trackingDirection = useSensorStore((s) => s.trackingDirection);
  const connectionStatus = useSensorStore((s) => s.connectionStatus);
  const timestamp = useSensorStore((s) => s.timestamp);
  const loading = useSensorStore((s) => s.loading);
  const error = useSensorStore((s) => s.error);

  const isFirstLoad = loading;

  // Allow the user to manually trigger a re-fetch by resetting the store
  // The hook's interval will pick it up naturally; we just clear the error
  // so the UI stops showing the banner while it retries.
  const handleRetry = () => {
    // The polling hook retries automatically every 2 s.
    // Clearing the error gives instant visual feedback on press.
    useSensorStore.getState().setError(null);
  };

  // ─── First-load spinner ───────────────────────────────────────────────────

  if (isFirstLoad) {
    return <LoadingState />;
  }

  // ─── Main dashboard ───────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-[#131314]" edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Header telemetry status bar */}
      <HeaderBar connectionStatus={connectionStatus} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner for API Connection Error or Simulated Mode */}
        {error && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}


        {/* Dashboard Title & Quick Insights */}
        <View className="mb-6">
          <Text className="text-[10px] font-bold tracking-widest text-[#00dbe7] font-mono uppercase">
            LIVE SOLAR TELEMETRY DASHBOARD
          </Text>
          <Text className="text-3xl font-extrabold text-[#e5e2e3] tracking-tight mt-1">
            Tracking Station
          </Text>
        </View>

        {/* Row 1: Dual LDR Light Sensors */}
        <View className="flex-row gap-4 mb-6">
          <SensorCard
            label="Left Sensor (LDR)"
            value={leftLDR}
            isActive={leftLDR > rightLDR}
          />
          <SensorCard
            label="Right Sensor (LDR)"
            value={rightLDR}
            isActive={rightLDR > leftLDR}
          />
        </View>

        {/* Row 2: Servo Motor Angular Indicator */}
        <ServoIndicator
          servoAngle={servoAngle}
          trackingDirection={trackingDirection || 'Idle'}
        />

        {/* Row 3: Diagnostics & Network Telemetry Card */}
        <StatusCard
          backendOnline={!error}
          arduinoConnected={connectionStatus}
          timestamp={timestamp || null}
        />

        {/* Decorative branding footer */}
        <View className="py-8 items-center justify-center">
          <Text className="text-[9px] font-semibold text-[#849495] uppercase font-mono tracking-widest">
            SOLARSYNC CORE ENGINE v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
});
