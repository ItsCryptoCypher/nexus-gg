"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId || typeof userId !== "string") {
    return { supabase, userId: null as string | null };
  }
  return { supabase, userId };
}

function revalidateFriends() {
  revalidatePath("/friends");
  revalidatePath("/play");
}

export async function sendFriendRequest(addresseeId: string) {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in to add friends." };
  if (!addresseeId || addresseeId === userId) {
    return { ok: false as const, error: "Invalid friend request." };
  }

  const { error } = await supabase.from("friendships").insert({
    requester_id: userId,
    addressee_id: addresseeId,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "Friend request already exists." };
    }
    return { ok: false as const, error: error.message };
  }

  revalidateFriends();
  return { ok: true as const };
}

export async function acceptFriendRequest(friendshipId: string) {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { data: row, error: fetchError } = await supabase
    .from("friendships")
    .select("id, addressee_id, status")
    .eq("id", friendshipId)
    .maybeSingle();

  if (fetchError || !row) {
    return { ok: false as const, error: "Request not found." };
  }
  if (row.addressee_id !== userId || row.status !== "pending") {
    return { ok: false as const, error: "You can't accept this request." };
  }

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", friendshipId)
    .eq("addressee_id", userId)
    .eq("status", "pending");

  if (error) return { ok: false as const, error: error.message };

  revalidateFriends();
  return { ok: true as const };
}

export async function declineFriendRequest(friendshipId: string) {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId)
    .eq("addressee_id", userId)
    .eq("status", "pending");

  if (error) return { ok: false as const, error: error.message };

  revalidateFriends();
  return { ok: true as const };
}
