import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View className="mb-6 p-4 rounded-[20px] bg-[#ffdad6]/5 border border-[#ffb4ab]/20 flex-row justify-between items-center">
      <View className="flex-row items-center flex-1 mr-3">
        <View className="w-8 h-8 rounded-full bg-[#ffb4ab]/10 items-center justify-center">
          <Ionicons name="warning-outline" size={18} color="#ffb4ab" />
        </View>
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
        onPress={onRetry}
        activeOpacity={0.7}
        className="bg-[#ffb4ab]/10 active:bg-[#ffb4ab]/20 px-3.5 py-2 rounded-full border border-[#ffb4ab]/20 flex-row items-center"
      >
        <Ionicons name="refresh" size={12} color="#ffb4ab" />
        <Text className="text-[9px] font-bold text-[#ffb4ab] font-mono ml-1.5 uppercase tracking-wider">
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}
