import React from "react";
import { Pressable, Text } from "react-native";

type MyButtonProps = {
  title: string;
  onPress: () => void;
  className?: string; // <-- add this line
};

export default function MyButton({ title, onPress, className, }: MyButtonProps) {
  return (
    <Pressable className={className} onPress={onPress}>
      <Text className="text-white font-bold text-center bg-blue-500 p-4 rounded">{title}</Text>
    </Pressable>
  );
}