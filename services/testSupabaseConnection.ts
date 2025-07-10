// lib/testSupabaseConnection.ts
import { supabase } from "./supabaseClient";

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("todos").select("*").limit(1);
    
    if (error) {
      console.error("❌ Supabase connection FAILED:", error.message);
    } else {
      console.log("✅ Supabase connection SUCCESSFUL");
      console.log("Sample data:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
};
