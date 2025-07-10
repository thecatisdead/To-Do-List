import MyButton from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { supabase } from "@/services/supabaseClient";
import todolistlogo from "../../assets/images/todolistlogo.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hasError = errorMessage !== "";

  const validate = () => {
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be 6 characters.");
      return false;
    }
    setErrorMessage(" ");
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.push("/(tabs)/profile");
    console.log("Login Success");
    console.log({setEmail})

  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Image source={todolistlogo} className="w-32 h-32 p-16" />

        <TextInput
          className={`border rounded w-full h-14 px-4 mb-4 text-base ${hasError ? "border-red-500" : isEmailFocused ? "border-blue-500" : "border-gray-300"}`}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />

        {/* Password input with icon inside */}
        <View
          className={`flex-row items-center rounded w-full h-14 px-4 mb-4 bg-white border ${hasError ? "border-red-500" : isPasswordFocused ? "border-blue-500" : "border-gray-300"}`}
        >
          <TextInput
            className="flex-1 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isHidden}
            style={{ paddingRight: 36 }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />

          <Pressable onPress={() => setIsHidden(!isHidden)}>
            <Ionicons
              name={isHidden ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </Pressable>
        </View>

        {errorMessage !== "" && (
          <Text className="text-red-500 mb-4">{errorMessage}</Text>
        )}
        <View className="w-full mb-4">
          <Text className="text-left text-base text-blue-400">
            Forgot Password?
          </Text>
        </View>

        {/* Your custom button */}
        <View className="w-full">
          <MyButton className="text-" title="Login" onPress={handleLogin} />
        </View>
        <View>
          <Animated.View entering={FadeIn.duration(100)}>
            <Link href="/register" className="p-4 text-blue-600 font-bold">
              Sign Up
            </Link>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
}
