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

  // Demo mode is active whenever there is an error (backend unreachable)
  const isDemoMode = error !== null;
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
    return (
      <SafeAreaView className="flex-1 bg-[#131314] items-center justify-center p-6">
        <StatusBar barStyle="light-content" />
        <View className="items-center">
          <View className="w-16 h-16 rounded-full border-4 border-[#00dbe7]/20 border-t-[#00dbe7] animate-spin items-center justify-center mb-6">
            <ActivityIndicator size="large" color="#00dbe7" />
          </View>
          <Text className="text-[#e5e2e3] font-bold text-lg tracking-wider mb-2 font-sans text-center">
            INITIALIZING SYSTEM TELEMETRY
          </Text>
          <Text className="text-[#849495] text-xs font-mono text-center max-w-[280px]">
            Attempting secure connection to Node.js backend port 5000...
          </Text>
        </View>
      </SafeAreaView>
    );
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
          <View className="mb-6 p-4 rounded-[20px] bg-[#ffdad6]/5 border border-[#ffb4ab]/20 flex-row justify-between items-center">
            <View className="flex-row items-center flex-1 mr-3">
              <Ionicons name="warning-outline" size={18} color="#ffb4ab" />
              <View className="ml-3 flex-1">
                <Text className="text-[11px] font-bold text-[#ffb4ab] uppercase font-mono tracking-wider">
                  Live Server Offline
                </Text>
                <Text className="text-[10px] text-[#ffb4ab]/80 font-mono mt-0.5 leading-4">
                  {error}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 px-3 py-1.5 rounded-full border border-[#ffb4ab]/30 flex-row items-center"
            >
              <Ionicons name="refresh" size={12} color="#ffb4ab" />
              <Text className="text-[9px] font-bold text-[#ffb4ab] font-mono ml-1 uppercase">
                RETRY
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dashboard Title & Quick Insights */}
        <View className="mb-6">
          <Text className="text-[10px] font-bold tracking-widest text-[#00dbe7] font-mono uppercase">
            {isDemoMode
              ? 'SIMULATED CONTROL STATION'
              : 'LIVE SOLAR TELEMETRY DASHBOARD'}
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
          backendOnline={!isDemoMode}
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
