import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type MyCalendarProps = {
  onDateChange?: (dateString: string) => void;
};

export default function MyCalendar({ onDateChange }: MyCalendarProps) {
  const [taskDates, setTaskDates] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);

    onDateChange?.(day.dateString);
  };

  const markedDates = taskDates.reduce(
    (acc, date) => {
      acc[date] = {
        marked: true,
        dotColor: "red",
      };
      return acc;
    },
    {} as Record<string, any>
  );

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: "#00B0FF",
    };
  }

  useEffect(() => {
    const fetchAllTaskDates = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      const { data, error } = await supabase
        .from("todos")
        .select("due_at")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const uniqueDates = [
          ...new Set(
            data
              .filter((item) => item.due_at != null)
              .map((item) => new Date(item.due_at).toISOString().split("T")[0])
          ),
        ];

        setTaskDates(uniqueDates);
      }
    };

    fetchAllTaskDates();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{ calendarBackground: "transparent" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  calendarContainer: {
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
