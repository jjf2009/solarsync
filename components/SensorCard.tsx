import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SensorCardProps {
  label: string;
  value: number;
  isActive: boolean;
}

export function SensorCard({ label, value, isActive }: SensorCardProps) {
  // LDR value ranges from 0 to 1023 (10-bit ADC)
  const percentage = Math.min(Math.max((value / 1023) * 100, 0), 100);

  return (
    <View
      className={`p-6 rounded-[24px] border bg-white/[0.03] ${
        isActive ? 'border-[#00dbe7]' : 'border-white/10'
      } flex-1`}
      style={isActive ? styles.activeGlow : undefined}
    >
      {/* Header Row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[11px] font-bold tracking-widest text-[#b9cacb] uppercase font-mono">
          {label}
        </Text>
        <Ionicons
          name={isActive ? "sunny" : "sunny-outline"}
          size={18}
          color={isActive ? "#00dbe7" : "#849495"}
        />
      </View>

      {/* Numerical Value */}
      <View className="flex-row items-baseline mb-4">
        <Text className="text-3xl font-extrabold text-[#e5e2e3] tracking-tighter">
          {value}
        </Text>
        <Text className="text-[10px] font-bold text-[#849495] ml-1 uppercase font-mono">
          ADC
        </Text>
      </View>

      {/* Progress Track */}
      <View className="w-full h-1.5 bg-[#ffffff0c] rounded-full overflow-hidden">
        <View
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${
            isActive ? 'bg-[#00dbe7]' : 'bg-[#d1bcff]'
          }`}
        />
      </View>

      {/* Percentage Readout */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-[9px] font-bold text-[#849495] uppercase font-mono">
          INTENSITY
        </Text>
        <Text className="text-[9px] font-bold text-[#e5e2e3] font-mono">
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeGlow: {
    // 15px outer glow with 20% opacity of #00dbe7
    shadowColor: '#00dbe7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});
