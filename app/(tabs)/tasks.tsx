import MyCalendar from "@/components/MyCalendar";
import { supabase } from "@/services/supabaseClient";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Todo } from "../../types/intefaces";

export default function taskScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodosForDate = async (date: string) => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      console.log("No logged in user");
      setTodos([]);
      setLoading(false);
      return;
    }

    const isoDateStart = `${date}T00:00:00Z`;
    const isoDateEnd = `${date}T23:59:59Z`;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .gte("due_at", isoDateStart)
      .lte("due_at", isoDateEnd)
      .order("due_at", { ascending: true });

    if (error) {
      console.error(error.message);
      setTodos([]);
    } else {
      setTodos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTodosForDate(selectedDate);
  }, [selectedDate]);

  return (
    <View className="flex-1 justify-start p-4">
      <Text>Tasks</Text>

      <MyCalendar
        onDateChange={(date) => {
          console.log("User selected date: ", date);
          setSelectedDate(date);
        }}
      />

      {loading && <Text>Loading...</Text>}

      {!loading && (
        <FlatList
          data={todos}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item: t }) => (
            <View className="p-8 mt-4 border -b border-gray-300">
              <Text
                className={`text-lg font-bold ${t.completed ? "text-gray-400" : "text-black"}`}
                style={
                  t.completed
                    ? { textDecorationLine: "line-through" }
                    : undefined
                }
              >
                {t.title}
              </Text>
              <Text>{t.description}</Text>
              <Text className="text-gray-300">
                Due:{" "}
                {t.due_at
                  ? new Date(t.due_at).toLocaleString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : " No date "}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center mt-4 text-gray-500">
              No tasks for this day.
            </Text>
          }

          
        />
        
      )}

      
    </View>
  );
}
