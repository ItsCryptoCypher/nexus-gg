import type {
  ActiveConversation,
  ChatMessage,
  ConversationListItem,
  MessageFriendOption,
} from "@/lib/messages/types";
import { createClient } from "@/lib/supabase/server";

type ConversationRow = {
  id: string;
  user_low: string;
  user_high: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  user_low_last_read_at: string;
  user_high_last_read_at: string;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

const FALLBACK_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

function pairIds(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function toFriend(profile: ProfileRow | undefined, id: string): MessageFriendOption {
  return {
    id,
    username: profile?.display_name || "Friend",
    avatarUrl: profile?.avatar_url || FALLBACK_AVATAR,
  };
}

function isUnread(row: ConversationRow, me: string): boolean {
  if (!row.last_message_at) return false;
  const myRead =
    me === row.user_low ? row.user_low_last_read_at : row.user_high_last_read_at;
  return new Date(row.last_message_at) > new Date(myRead);
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const me = claims?.claims?.sub;
  if (!me || typeof me !== "string") return 0;

  const { data: rows } = await supabase
    .from("direct_conversations")
    .select(
      "user_low, user_high, last_message_at, user_low_last_read_at, user_high_last_read_at",
    )
    .or(`user_low.eq.${me},user_high.eq.${me}`)
    .not("last_message_at", "is", null);

  if (!rows?.length) return 0;

  return rows.filter((row) =>
    isUnread(
      {
        id: "",
        user_low: row.user_low as string,
        user_high: row.user_high as string,
        last_message_at: row.last_message_at as string | null,
        last_message_preview: null,
        user_low_last_read_at: row.user_low_last_read_at as string,
        user_high_last_read_at: row.user_high_last_read_at as string,
      },
      me,
    ),
  ).length;
}

async function loadAcceptedFriends(
  supabase: Awaited<ReturnType<typeof createClient>>,
  me: string,
): Promise<MessageFriendOption[]> {
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${me},addressee_id.eq.${me}`);

  const friendIds = (friendships ?? []).map((row) =>
    row.requester_id === me
      ? (row.addressee_id as string)
      : (row.requester_id as string),
  );

  if (!friendIds.length) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", friendIds);

  const byId = new Map(
    (profiles as ProfileRow[] | null)?.map((p) => [p.id, p]) ?? [],
  );

  return friendIds
    .map((id) => toFriend(byId.get(id), id))
    .sort((a, b) => a.username.localeCompare(b.username));
}

export async function ensureDirectConversation(
  friendId: string,
): Promise<{ ok: true; conversationId: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const me = claims?.claims?.sub;
  if (!me || typeof me !== "string") {
    return { ok: false, error: "Sign in required." };
  }
  if (!friendId || friendId === me) {
    return { ok: false, error: "Invalid conversation." };
  }

  const { data: friends } = await supabase.rpc("are_accepted_friends", {
    a: me,
    b: friendId,
  });
  if (!friends) {
    return { ok: false, error: "You can only message accepted friends." };
  }

  const [userLow, userHigh] = pairIds(me, friendId);

  const { data: existing } = await supabase
    .from("direct_conversations")
    .select("id")
    .eq("user_low", userLow)
    .eq("user_high", userHigh)
    .maybeSingle();

  if (existing?.id) {
    return { ok: true, conversationId: existing.id as string };
  }

  const { data: created, error } = await supabase
    .from("direct_conversations")
    .insert({ user_low: userLow, user_high: userHigh })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: raced } = await supabase
        .from("direct_conversations")
        .select("id")
        .eq("user_low", userLow)
        .eq("user_high", userHigh)
        .maybeSingle();
      if (raced?.id) {
        return { ok: true, conversationId: raced.id as string };
      }
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, conversationId: created.id as string };
}

export type MessagesPageData = {
  meId: string;
  conversations: ConversationListItem[];
  friends: MessageFriendOption[];
  active: ActiveConversation | null;
  unreadCount: number;
};

export async function getMessagesPageData(options?: {
  withFriendId?: string | null;
  conversationId?: string | null;
}): Promise<MessagesPageData | null> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const me = claims?.claims?.sub;
  if (!me || typeof me !== "string") return null;

  let activeConversationId = options?.conversationId ?? null;

  if (!activeConversationId && options?.withFriendId) {
    const ensured = await ensureDirectConversation(options.withFriendId);
    if (ensured.ok) activeConversationId = ensured.conversationId;
  }

  const [friends, { data: conversationRows }] = await Promise.all([
    loadAcceptedFriends(supabase, me),
    supabase
      .from("direct_conversations")
      .select(
        "id, user_low, user_high, last_message_at, last_message_preview, user_low_last_read_at, user_high_last_read_at",
      )
      .or(`user_low.eq.${me},user_high.eq.${me}`)
      .order("last_message_at", { ascending: false, nullsFirst: false }),
  ]);

  const rows = (conversationRows as ConversationRow[] | null) ?? [];
  const otherIds = rows.map((row) =>
    row.user_low === me ? row.user_high : row.user_low,
  );

  const profileIds = Array.from(
    new Set([...otherIds, ...(activeConversationId ? [] : [])]),
  );

  const { data: profiles } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", profileIds)
    : { data: [] as ProfileRow[] };

  const profileById = new Map(
    ((profiles as ProfileRow[] | null) ?? []).map((p) => [p.id, p]),
  );

  const conversations: ConversationListItem[] = rows.map((row) => {
    const friendId = row.user_low === me ? row.user_high : row.user_low;
    return {
      id: row.id,
      friend: toFriend(profileById.get(friendId), friendId),
      lastMessagePreview: row.last_message_preview,
      lastMessageAt: row.last_message_at,
      unread: isUnread(row, me),
    };
  });

  let active: ActiveConversation | null = null;

  if (activeConversationId) {
    const row = rows.find((r) => r.id === activeConversationId);
    if (row) {
      const friendId = row.user_low === me ? row.user_high : row.user_low;
      let friendProfile = profileById.get(friendId);
      if (!friendProfile) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", friendId)
          .maybeSingle();
        friendProfile = profile as ProfileRow | undefined;
      }

      const { data: messageRows } = await supabase
        .from("direct_messages")
        .select("id, conversation_id, sender_id, body, created_at")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true })
        .limit(200);

      const messages: ChatMessage[] = (
        (messageRows as MessageRow[] | null) ?? []
      ).map((msg) => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        body: msg.body,
        createdAt: msg.created_at,
        mine: msg.sender_id === me,
      }));

      active = {
        id: row.id,
        friend: toFriend(friendProfile, friendId),
        messages,
      };

      // Mark read when opening
      const now = new Date().toISOString();
      const patch =
        me === row.user_low
          ? { user_low_last_read_at: now }
          : { user_high_last_read_at: now };
      await supabase
        .from("direct_conversations")
        .update(patch)
        .eq("id", row.id);
    }
  }

  const unreadCount = conversations.filter((c) =>
    active?.id === c.id ? false : c.unread,
  ).length;

  return {
    meId: me,
    conversations: conversations.map((c) =>
      active?.id === c.id ? { ...c, unread: false } : c,
    ),
    friends,
    active,
    unreadCount,
  };
}
