"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export async function logout() {
  await (await supabaseServer()).auth.signOut();
  redirect("/");
}
