import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { classifyPanelOutput, PanelOutputLevel } from '@/types/sensor';

interface PanelOutputCardProps {
  panelOutput: number;
}

// ─── Classification config ────────────────────────────────────────────────────

interface LevelConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  barColor: string;
}

function getLevelConfig(level: PanelOutputLevel): LevelConfig {
  switch (level) {
    case 'High Generation':
      return {
        color: '#2ae500',
        bgColor: 'rgba(42,229,0,0.08)',
        borderColor: 'rgba(42,229,0,0.35)',
        icon: 'flash',
        barColor: '#2ae500',
      };
    case 'Medium Generation':
      return {
        color: '#00dbe7',
        bgColor: 'rgba(0,219,231,0.08)',
        borderColor: 'rgba(0,219,231,0.35)',
        icon: 'sunny',
        barColor: '#00dbe7',
      };
    case 'Low Generation':
      return {
        color: '#f59e0b',
        bgColor: 'rgba(245,158,11,0.08)',
        borderColor: 'rgba(245,158,11,0.35)',
        icon: 'partly-sunny',
        barColor: '#f59e0b',
      };
    default: // No Generation
      return {
        color: '#849495',
        bgColor: 'rgba(132,148,149,0.06)',
        borderColor: 'rgba(132,148,149,0.20)',
        icon: 'moon-outline',
        barColor: '#849495',
      };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PanelOutputCard({ panelOutput }: PanelOutputCardProps) {
  const safeValue  = Math.max(0, Math.min(1023, panelOutput));
  const percentage = Math.round((safeValue / 1023) * 100);
  const level      = classifyPanelOutput(safeValue);
  const cfg        = getLevelConfig(level);

  return (
    <View
      className="p-6 rounded-[24px] border border-white/10 bg-white/[0.03] w-full mb-6"
      style={styles.card}
    >
      {/* ── Header ── */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[11px] font-bold tracking-widest text-[#b9cacb] uppercase font-mono">
          SOLAR PANEL OUTPUT
        </Text>

        {/* Status badge */}
        <View
          style={{ backgroundColor: cfg.bgColor, borderColor: cfg.borderColor }}
          className="flex-row items-center px-2.5 py-1 rounded-full border"
        >
          <Ionicons name={cfg.icon} size={11} color={cfg.color} />
          <Text
            className="text-[9px] font-bold ml-1 font-mono uppercase"
            style={{ color: cfg.color }}
          >
            {level}
          </Text>
        </View>
      </View>

      {/* ── Main reading row ── */}
      <View className="flex-row items-end justify-between mb-5">

        {/* Raw ADC value */}
        <View>
          <Text className="text-[10px] font-bold text-[#849495] uppercase font-mono tracking-wider mb-1">
            RAW ADC
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-5xl font-extrabold text-[#e5e2e3] tracking-tighter">
              {safeValue}
            </Text>
            <Text className="text-[11px] font-bold text-[#849495] ml-1.5 uppercase font-mono">
              / 1023
            </Text>
          </View>
        </View>

        {/* Percentage ring */}
        <View className="items-center">
          <Text className="text-[10px] font-bold text-[#849495] uppercase font-mono tracking-wider mb-1">
            OUTPUT
          </Text>
          <View
            style={[styles.percentRing, { borderColor: cfg.color }]}
            className="w-16 h-16 rounded-full items-center justify-center"
          >
            <Text
              className="text-xl font-extrabold font-mono"
              style={{ color: cfg.color }}
            >
              {percentage}%
            </Text>
          </View>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <View
          style={{ width: `${percentage}%`, backgroundColor: cfg.barColor }}
          className="h-full rounded-full"
        />
      </View>

      {/* ── Range labels ── */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-[9px] font-bold text-[#849495] uppercase font-mono">0</Text>
        <Text className="text-[9px] font-bold text-[#849495] uppercase font-mono">
          INTENSITY SCALE
        </Text>
        <Text className="text-[9px] font-bold text-[#849495] uppercase font-mono">1023</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  percentRing: {
    borderWidth: 2.5,
  },
});
