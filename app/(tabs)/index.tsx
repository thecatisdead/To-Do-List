import TabSwitcher from "@/components/TabsSwitcher";
import { supabase } from "@/services/supabaseClient";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import Modal from "react-native-modal";
import { Todo } from "../../types/intefaces";

export default function Index() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Low");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentTask, setIsCurrentTask] = useState<string | null>(null);

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Today");

  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  let dateToCheck = new Date();

  if (selectedTab === "Tomorrow") {
    dateToCheck.setDate(dateToCheck.getDate() + 1);
  }

  const filteredTodos = todos.filter((todo) => {
    if (!todo.due_at) return false;
    const dueDate = new Date(todo.due_at);
    return isSameDay(dueDate, dateToCheck);
  });

  function openAddModal() {
    setIsEditing(false);
    setNewTitle("");
    setNewDescription("");
    setIsCurrentTask(null);
    setModalVisible(true);
    setNewPriority("Low");
  }

  function openEditModal(todos: Todo) {
    setIsEditing(true);
    setNewTitle(todos.title);
    setNewDescription(todos.description);
    setIsCurrentTask(todos.id);
    setModalVisible(true);
    setNewPriority(todos.priority);
    setDueDate(todos.due_at ? new Date(todos.due_at) : null);
  }

  function handleEditTodo() {
    setTodos((prevTasks) => {
      if (!prevTasks) return [];

      return prevTasks.map((task) => {
        if (task.id === isCurrentTask) {
          return {
            ...task,
            title: newTitle,
            description: newDescription,
            priority: newPriority,
          };
        } else {
          return task;
        }
      });
    });
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleMarkDone = async (id: string) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: true })
      .eq("id", id);

    if (error) {
      console.error("Error Updating To Do: ", error.message);
      return;
    }

    fetchTodos();
  };
  const handleTabChange = (tab: string) => {
    console.log("selected tab", tab);
  };

  const fetchTodos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("Fetch result:", { data, error });

    if (!error) {
      setTodos(data);
      setLoading(false);
    }
  };

  const getDefaultDueAt = () => {
    const now = new Date();
    now.setHours(23, 59, 0, 0);
    return now;
  };

  const handleAddTodo = async () => {
    let dueDateToSave: Date;

    if (selectedDateTime) {
      dueDateToSave = selectedDateTime;
    } else if (activeTab === "today") {
      dueDateToSave = getDefaultDueAt();
    } else {
      alert("Please Select a date and time for this task.");
      return;
    }

    if (!newTitle) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to get user: ", userError.message);
      return;
    }
    const user = userData.user;

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const { error: insertError } = await supabase.from("todos").insert([
      {
        user_id: user.id,
        title: newTitle,
        completed: false,
        description: newDescription,
        priority: newPriority,

        due_at: dueDateToSave.toISOString(),
      },
    ]);

    setSelectedDateTime(null);

    setNewTitle("");
    setNewDescription("");
    setNewPriority("");
    setDueDate(null);
    fetchTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    await supabase.from("todos").delete().eq("id", id);
    fetchTodos();
  };

  const handleConfirm = (date: Date) => {
    console.log("Picked date:", date);
    setDatePickerVisibility(false);
    setDueDate(date);
  };

  return (
    <View className="flex-1 p-6 w-full">
      {loading && <Text className="text-center text-gray-500">Loading...</Text>}

      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}
        onBackdropPress={() => setModalVisible(false)}
        className="items-center justify-center m-0"
      >
        <View className="bg-white p-6 rounded w-4/5 ">
          <Text className="text-lg font-bold mb-4">
            {isEditing ? "Edit Task" : "Add New Task"}
          </Text>
          <TextInput
            placeholder="New Task..."
            value={newTitle}
            onChangeText={setNewTitle}
            className="border rounded w-full h-14 px-4 mb-4 text-base"
          />
          <TextInput
            placeholder="Description"
            textAlignVertical="top"
            multiline
            scrollEnabled={true}
            value={newDescription}
            onChangeText={setNewDescription}
            className="border rounded w-full h-[88px] mb-10 px-4 text-base "
          />
          <Text className="mb-2">Priority</Text>
          <Picker
            selectedValue={newPriority}
            onValueChange={setNewPriority}
            className="border rounded h-14 mb-4"
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />

            <Picker.Item label="High" value="High" />
          </Picker>
          <Pressable
            onPress={() => setDatePickerVisibility(true)}
            className="border rounded w-full h-14 px-4 mb-4 justify-center"
          >
            <Text className="text-base text-gray-700">
              {dueDate
                ? dueDate.toLocaleDateString()
                : "Select due date & Time"}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            display="default"
            onConfirm={(date) => {
              console.log("Picked date: ", date);

              setSelectedDateTime(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => {
              console.log("Date Picker cancelled");
              setDatePickerVisibility(false);
            }}
          />

          <View className="flex-row justify-end space-x-2">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              <Text className="text-gray-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (isEditing) {
                  handleEditTodo();
                } else {
                  handleAddTodo();
                }
                setModalVisible(false);
              }}
              className="px-4 py-2 bg-blue-500 rounded"
            >
              <Text className="text-white">
                {isEditing ? "Save Changes" : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View className="flex-row justify-end items-end p-4">
        <Pressable
          onPress={() => openAddModal()}
          className="rounded p-4 bg-blue-400"
        >
          <Text className="text-white font-bold">Add Task</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-center items-center">
        <TabSwitcher
          tabs={["Today", "Tomorrow"]}
          onTabChange={(tab) => {
            console.log("selected tab: ", tab);
            setSelectedTab(tab);
          }}
        />
      </View>
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: t }) => (
          <View className="mt-2 border -b border-gray-300 rounded-xl bg-white">
            <Pressable onPress={() => openEditModal(t)}>
              <View className="flex-row justify-between">
                <Text
                  className={`pt-4 pr-4 pl-4 font-bold text-lg ${t.completed ? "text-gray-400" : "text-black"}`}
                  style={
                    t.completed
                      ? { textDecorationLine: "line-through" }
                      : undefined
                  }
                >
                  {t.title}
                </Text>
                {!t.completed && (
                  <Pressable onPress={() => handleMarkDone(t.id)}>
                    <Text className="p-4 text-green-600">Done</Text>
                  </Pressable>
                )}
              </View>
              {/* //cross out */}
              <View>
                <Text
                  className={`p-4 ${t.completed ? "text-gray-400" : "text-black"}`}
                  style={
                    t.completed
                      ? { textDecorationLine: "line-through" }
                      : undefined
                  }
                >
                  {t.description}
                </Text>
                <Text
                  className={`pl-4 font-bold ${
                    t.priority === "High"
                      ? "text-red-500"
                      : t.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {t.priority}
                </Text>
                <Text className="pl-4">
                  {t.due_at && (
                    <Text className="text-sm text-gray-500 ">
                      Due at:{" "}
                      {new Date(t.due_at).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  )}
                </Text>
              </View>
              <View className=" justify-end items-end p-8 rounded">
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Delete Task",
                      "Are you sure you want to delete this task?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => handleDeleteTodo(t.id),
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text className="text-red-500">Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center mt-4 text-gray-500">
            No tasks for this day.
          </Text>
        }
      />
    </View>
  );
}
