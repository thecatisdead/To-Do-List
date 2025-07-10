import { Text, View, } from "react-native";

import React from "react-native";

import { Link } from "expo-router";




export default function profileScreen(){


    return(
        <View>

        <View>
            <Text> Hellow Bitch </Text>
        </View>
        
        <Link href="/(auth)/login" className="p-4 text-blue-600 font-bold">
             Logout
        </Link>

        </View>
    )
}