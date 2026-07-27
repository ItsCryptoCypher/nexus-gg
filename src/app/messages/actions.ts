"use server";

import { revalidatePath } from "next/cache";
import { ensureDirectConversation } from "@/lib/messages/get-messages-page";
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

function revalidateMessages() {
  revalidatePath("/messages");
}

export async function openConversationWithFriend(friendId: string) {
  const result = await ensureDirectConversation(friendId);
  if (!result.ok) return result;
  revalidateMessages();
  return result;
}

export async function sendDirectMessage(conversationId: string, body: string) {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const trimmed = body.trim();
  if (!conversationId) {
    return { ok: false as const, error: "Conversation required." };
  }
  if (!trimmed) {
    return { ok: false as const, error: "Message can't be empty." };
  }
  if (trimmed.length > 4000) {
    return { ok: false as const, error: "Message is too long." };
  }

  const { data: conversation } = await supabase
    .from("direct_conversations")
    .select("id, user_low, user_high")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) {
    return { ok: false as const, error: "Conversation not found." };
  }
  if (
    conversation.user_low !== userId &&
    conversation.user_high !== userId
  ) {
    return { ok: false as const, error: "Not in this conversation." };
  }

  const { data: message, error } = await supabase
    .from("direct_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      body: trimmed,
    })
    .select("id, conversation_id, sender_id, body, created_at")
    .single();

  if (error || !message) {
    return {
      ok: false as const,
      error: error?.message ?? "Failed to send message.",
    };
  }

  revalidateMessages();
  return {
    ok: true as const,
    message: {
      id: message.id as string,
      conversationId: message.conversation_id as string,
      senderId: message.sender_id as string,
      body: message.body as string,
      createdAt: message.created_at as string,
      mine: true,
    },
  };
}

export async function markConversationRead(conversationId: string) {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required." };

  const { data: conversation } = await supabase
    .from("direct_conversations")
    .select("id, user_low, user_high")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) {
    return { ok: false as const, error: "Conversation not found." };
  }

  const now = new Date().toISOString();
  const patch =
    conversation.user_low === userId
      ? { user_low_last_read_at: now }
      : conversation.user_high === userId
        ? { user_high_last_read_at: now }
        : null;

  if (!patch) {
    return { ok: false as const, error: "Not in this conversation." };
  }

  const { error } = await supabase
    .from("direct_conversations")
    .update(patch)
    .eq("id", conversationId);

  if (error) return { ok: false as const, error: error.message };

  revalidateMessages();
  return { ok: true as const };
}
