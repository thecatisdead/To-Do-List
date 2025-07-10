import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TabSwitchProps = {
  tabs: string[];
  onTabChange?: (tab: string) => void;
};

export default function TabSwitcher({ tabs, onTabChange }: TabSwitchProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handlePress = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  return (
    <View className="flex-row border-b border-gray-300">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => handlePress(tab)}
            className="flex-1 items-center pb-2"
          >
            <Text
              className={`text-md p-4 font-bold ${isActive ? "text-blue-600" : "text-gray-500"}`}
            >
              {tab}
            </Text>
            {isActive && (
              <View className="h-1 w-full bg-blue-600 rounded-full mt-1" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
