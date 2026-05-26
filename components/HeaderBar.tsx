import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderBarProps {
  connectionStatus: boolean;
}

export function HeaderBar({ connectionStatus }: HeaderBarProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (connectionStatus) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0.5);
    }
  }, [connectionStatus, pulseAnim]);

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className="px-6 pb-4 border-b border-[#ffffff0c] bg-[#131314]/90 flex-row justify-between items-center"
    >
      <View className="flex-row items-center space-x-2">
        <View className="w-2.5 h-2.5 rounded-full bg-[#00dbe7] mr-2" style={styles.cyanGlow} />
        <Text className="text-xl font-bold tracking-widest text-[#e5e2e3] font-sans">
          SOLAR<Text className="text-[#00dbe7]">SYNC</Text>
        </Text>
      </View>

      <View
        className={`flex-row items-center px-3 py-1.5 rounded-full border ${
          connectionStatus
            ? 'bg-[#2ae500]/10 border-[#2ae500]/30'
            : 'bg-[#ffdad6]/5 border-[#ffb4ab]/20'
        }`}
      >
        <Animated.View
          style={{ opacity: pulseAnim }}
          className={`w-2 h-2 rounded-full mr-2 ${
            connectionStatus ? 'bg-[#2ae500]' : 'bg-[#ffb4ab]'
          }`}
        />
        <Text
          className={`text-[10px] font-bold tracking-wider font-mono uppercase ${
            connectionStatus ? 'text-[#2ae500]' : 'text-[#ffb4ab]'
          }`}
        >
          {connectionStatus ? 'Online' : 'Offline'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cyanGlow: {
    shadowColor: '#00dbe7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});
