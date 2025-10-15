"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(error);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(data?.is_admin || false);
  }

  useEffect(() => {
    setMounted(true);
    // Check current user on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchProfile(user.id);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setIsAdmin(false); // user logged out
        }
      }
    );
  }, []);
  if (!mounted) return null;

  return (
    <header>
      <Link href="/">Home</Link>
      <Link href="/login">Log in</Link>
      <Link href="/account">Account</Link>
      {isAdmin && <Link href="/admin">Admin</Link>}
    </header>
  );
}
