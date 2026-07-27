"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeNext(path: string | undefined) {
  if (!path || !path.startsWith("/")) return "/play";
  return path;
}

export async function confirmActivityStatus() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    redirect("/login");
  }

  await supabase
    .from("profiles")
    .update({ activity_status_confirmed: true })
    .eq("id", userId);

  revalidatePath("/setup");
}

export async function dismissSetup(formData: FormData) {
  const next = safeNext(String(formData.get("next") ?? "/play"));
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    redirect("/login");
  }

  await supabase
    .from("profiles")
    .update({ setup_dismissed_at: new Date().toISOString() })
    .eq("id", userId);

  redirect(next);
}

export async function finishSetup(formData: FormData) {
  const next = safeNext(String(formData.get("next") ?? "/play"));
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    redirect("/login");
  }

  await supabase
    .from("profiles")
    .update({
      activity_status_confirmed: true,
      setup_dismissed_at: new Date().toISOString(),
    })
    .eq("id", userId);

  redirect(next);
}
