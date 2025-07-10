import MyButton from "@/components/Button";
import { supabase } from "@/services/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, TextInput, View } from "react-native";
import todolistlogo from "../../assets/images/todolistlogo.png";

export default function registerScreen() {
  const [isHidden, setIsHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Registration Error", error.message);
      return;
    }

    if (data.user) {
      console.log("Registered user: ", data.user);

      Alert.alert(
        "Success",
        "Account created! Please check your email for confirmation."
      );
      router.push("/login");
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Image source={todolistlogo} className="w-32 h-32 p-16" />

      <TextInput
        className="border rounded w-full h-14 px-4 mb-4 text-base border-gray-300"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View className="flex-row items-center rounded w-full h-14 px-4 mb-4 bg-white border border-gray-300">
        <TextInput
          className="flex-1 text-base"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={() => setIsHidden(!isHidden)}>
          <Ionicons
            name={isHidden ? "eye-off" : "eye"}
            size={22}
            color="gray"
          />
        </Pressable>
      </View>

      <View className="w-full">
        <MyButton
          className="text-"
          title={loading ? "Creating Account..." : "Register"}
          onPress={handleRegister}
        />
      </View>

      <Link href="/login" className="p-4 font-bold">
        Login
      </Link>
    </View>
  );
}
