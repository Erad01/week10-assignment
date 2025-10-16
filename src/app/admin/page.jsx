"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function AdminPage() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Fetched session:", session);

      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, is_admin")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        setProfile(null);
      } else {
        console.log("Fetched profile:", data);
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!profile?.is_admin) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You don’t have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {profile.username}</p>
    </div>
  );
}
