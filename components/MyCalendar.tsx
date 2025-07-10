import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type MyCalendarProps = {
  onDateChange?: (dateString: string) => void;
};

export default function MyCalendar({ onDateChange }: MyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    if (onDateChange) {
      onDateChange(day.dateString);
    }
  };

  const markedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: "#00B0FF",
        },
      }
    : {};

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
