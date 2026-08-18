import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, display_name")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Failed to load profile", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    })();
  }, [user]);

  async function updateProfile(updates) {
    if (!user) return { error: "Not signed in" };
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (error) return { error: error.message };
    setProfile(data);
    return {};
  }

  return { profile, loading, updateProfile };
}
