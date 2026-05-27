import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/constants/config';

export function LoadingState() {
  return (
    <SafeAreaView className="flex-1 bg-[#131314] items-center justify-center p-6">
      <StatusBar barStyle="light-content" />
      <View className="items-center">
        {/* Animated outer ring using glassmorphic glowing borders */}
        <View className="w-20 h-20 rounded-full border-2 border-[#00dbe7]/15 border-t-[#00dbe7] items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,219,231,0.2)]">
          <ActivityIndicator size="large" color="#00dbe7" />
        </View>
        
        <Text className="text-[#e5e2e3] font-bold text-lg tracking-wider mb-2 font-sans text-center uppercase">
          Initializing System Telemetry
        </Text>
        
        <Text className="text-[#849495] text-xs font-mono text-center max-w-[290px] leading-5">
          Connecting to control station at{'\n'}
          <Text className="text-[#00dbe7]/90">{API_BASE_URL}</Text>...
        </Text>
      </View>
    </SafeAreaView>
  );
}
