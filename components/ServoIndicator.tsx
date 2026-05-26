import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServoIndicatorProps {
  servoAngle: number;
  trackingDirection: string;
}

export function ServoIndicator({ servoAngle, trackingDirection }: ServoIndicatorProps) {
  // Rotate the solar panel visual based on the servo angle.
  // Standard servo rotation maps 90 deg as Centered (upward).
  const rotationAngle = servoAngle - 90;

  // Choose colors/indicators based on tracking status
  const getDirectionDetails = (dir: string) => {
    switch (dir?.toLowerCase()) {
      case 'left':
        return {
          label: 'TRACKING LEFT',
          color: '#00dbe7',
          icon: 'chevron-back-circle-outline' as const,
        };
      case 'right':
        return {
          label: 'TRACKING RIGHT',
          color: '#00dbe7',
          icon: 'chevron-forward-circle-outline' as const,
        };
      case 'centered':
        return {
          label: 'CENTERED',
          color: '#2ae500',
          icon: 'radio-button-on-outline' as const,
        };
      default:
        return {
          label: 'SYSTEM IDLE',
          color: '#849495',
          icon: 'pause-circle-outline' as const,
        };
    }
  };

  const details = getDirectionDetails(trackingDirection);

  return (
    <View
      className="p-6 rounded-[24px] border border-white/10 bg-white/[0.03] w-full mb-6"
    >
      {/* Header Info */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-[11px] font-bold tracking-widest text-[#b9cacb] uppercase font-mono">
          SERVO POSITION CONTROL
        </Text>
        <View className="flex-row items-center bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/5">
          <Ionicons name={details.icon} size={12} color={details.color} className="mr-1" />
          <Text
            className="text-[9px] font-bold ml-1 font-mono uppercase"
            style={{ color: details.color }}
          >
            {details.label}
          </Text>
        </View>
      </View>

      {/* Main Dial & Gauge Row */}
      <View className="flex-row justify-around items-center py-4">
        {/* Left Side: Angle Value */}
        <View className="items-start">
          <Text className="text-[10px] font-bold text-[#849495] uppercase font-mono tracking-wider">
            ROTATION ANGLE
          </Text>
          <View className="flex-row items-baseline mt-1">
            <Text className="text-6xl font-extrabold text-[#e5e2e3] tracking-tighter font-sans">
              {servoAngle}
            </Text>
            <Text className="text-3xl font-bold text-[#00dbe7]">°</Text>
          </View>
          <Text className="text-[10px] font-medium text-[#b9cacb] mt-1 font-mono">
            {servoAngle < 90 ? 'Oriented East' : servoAngle > 90 ? 'Oriented West' : 'Zenith Alignment'}
          </Text>
        </View>

        {/* Right Side: Visual Servo Rotating Panel */}
        <View className="items-center justify-center">
          {/* Semicircular Scale representation */}
          <View className="w-[140px] h-[140px] rounded-full border-2 border-dashed border-[#ffffff0f] items-center justify-center relative">
            {/* Degree ticks */}
            <Text className="absolute top-1 text-[8px] font-bold text-[#849495] font-mono">90°</Text>
            <Text className="absolute left-1 text-[8px] font-bold text-[#849495] font-mono">0°</Text>
            <Text className="absolute right-1 text-[8px] font-bold text-[#849495] font-mono">180°</Text>

            {/* Central Rotating Solar Panel Graphic */}
            <View
              style={[
                styles.panelContainer,
                { transform: [{ rotate: `${rotationAngle}deg` }] },
              ]}
              className="w-20 h-10 bg-[#0f1d24] border border-[#00dbe7] rounded-[6px] items-center justify-center"
            >
              {/* Solar cell grid overlay */}
              <View className="w-full h-full flex-row justify-around p-1">
                <View className="w-[22%] h-full bg-[#1b3d4f]/60 rounded-[2px]" />
                <View className="w-[22%] h-full bg-[#1b3d4f]/60 rounded-[2px]" />
                <View className="w-[22%] h-full bg-[#1b3d4f]/60 rounded-[2px]" />
                <View className="w-[22%] h-full bg-[#1b3d4f]/60 rounded-[2px]" />
              </View>
            </View>

            {/* Pivot Point dot */}
            <View className="w-2.5 h-2.5 rounded-full bg-[#00dbe7] absolute z-10" style={styles.pivotPoint} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    shadowColor: '#00dbe7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  pivotPoint: {
    shadowColor: '#00dbe7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
});
