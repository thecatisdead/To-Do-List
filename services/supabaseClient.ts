// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wpuxkunohutgdqvboxut.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwdXhrdW5vaHV0Z2RxdmJveHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTI1ODksImV4cCI6MjA2NzEyODU4OX0.wCHWwNxj-KWV9TM8KwjEjsdIhI7gEpAfmD6-zpfVdl0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
