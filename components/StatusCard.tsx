import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusCardProps {
  backendOnline: boolean;
  arduinoConnected: boolean;
  timestamp: string | null;
}

export function StatusCard({ backendOnline, arduinoConnected, timestamp }: StatusCardProps) {
  // Format timestamp nicely
  const formatTime = (ts: string | null) => {
    if (!ts) return '--:--:--';
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return ts; // if already formatted
      return date.toLocaleTimeString([], { hour12: false });
    } catch {
      return '--:--:--';
    }
  };

  const formatDate = (ts: string | null) => {
    if (!ts) return 'NO PACKET RECEIVED';
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return 'LIVE TELEMETRY STREAM';
      return date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return 'STREAMING';
    }
  };

  return (
    <View
      className="p-6 rounded-[24px] border border-white/10 bg-white/[0.03] w-full"
    >
      <View className="mb-4">
        <Text className="text-[11px] font-bold tracking-widest text-[#b9cacb] uppercase font-mono">
          SYSTEM TELEMETRY & DIAGNOSTICS
        </Text>
      </View>

      {/* Grid of Diagnostics */}
      <View className="space-y-4">
        {/* Row 1: Node.js Backend API */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <Ionicons
              name="server-outline"
              size={18}
              color={backendOnline ? "#00dbe7" : "#849495"}
            />
            <View className="ml-3">
              <Text className="text-[13px] font-semibold text-[#e5e2e3]">Node.js Backend</Text>
              <Text className="text-[10px] text-[#849495] font-mono">REST API Service</Text>
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-full border ${
              backendOnline
                ? 'bg-[#2ae500]/10 border-[#2ae500]/30'
                : 'bg-[#ffdad6]/5 border-[#ffb4ab]/20'
            }`}
          >
            <Text
              className={`text-[9px] font-bold font-mono tracking-wider uppercase ${
                backendOnline ? 'text-[#2ae500]' : 'text-[#ffb4ab]'
              }`}
            >
              {backendOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-white/[0.05]" />

        {/* Row 2: Arduino Connection */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <Ionicons
              name="hardware-chip-outline"
              size={18}
              color={arduinoConnected ? "#00dbe7" : "#849495"}
            />
            <View className="ml-3">
              <Text className="text-[13px] font-semibold text-[#e5e2e3]">Arduino Uno R3</Text>
              <Text className="text-[10px] text-[#849495] font-mono">USB Serial Link</Text>
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-full border ${
              arduinoConnected
                ? 'bg-[#2ae500]/10 border-[#2ae500]/30'
                : 'bg-[#ffdad6]/5 border-[#ffb4ab]/20'
            }`}
          >
            <Text
              className={`text-[9px] font-bold font-mono tracking-wider uppercase ${
                arduinoConnected ? 'text-[#2ae500]' : 'text-[#ffb4ab]'
              }`}
            >
              {arduinoConnected ? 'Active' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-white/[0.05]" />

        {/* Row 3: Timestamp Info */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#d1bcff" />
            <View className="ml-3">
              <Text className="text-[13px] font-semibold text-[#e5e2e3]">Last Telemetry Packet</Text>
              <Text className="text-[10px] text-[#849495] font-mono">
                {formatDate(timestamp)}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-[14px] font-extrabold text-[#d1bcff] font-mono tracking-tight">
              {formatTime(timestamp)}
            </Text>
            {timestamp && (
              <Text className="text-[8px] text-[#849495] font-mono uppercase">UTC TIMESTAMP</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
