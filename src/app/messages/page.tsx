import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { getAppUser } from "@/lib/auth/get-app-user";
import { getMessagesPageData } from "@/lib/messages/get-messages-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Messages",
  description: "Send direct messages to your Nexus friends.",
};

type MessagesPageProps = {
  searchParams: Promise<{ with?: string; c?: string }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/messages");
  }

  const params = await searchParams;
  const [user, data] = await Promise.all([
    getAppUser(),
    getMessagesPageData({
      withFriendId: params.with ?? null,
      conversationId: params.c ?? null,
    }),
  ]);

  if (!data) {
    redirect("/login?next=/messages");
  }

  if (params.with && data.active && !params.c) {
    redirect(`/messages?c=${data.active.id}`);
  }

  return (
    <AppShell
      user={user}
      activeNavId="messages"
      rightSidebar={null}
      unreadMessages={data.unreadCount}
      flush
    >
      <TopBar
        user={user}
        title="Messages"
        subtitle="See your direct messages and group chats."
        className="mb-3 shrink-0"
      />
      <MessagesWorkspace
        meId={data.meId}
        conversations={data.conversations}
        friends={data.friends}
        active={data.active}
      />
    </AppShell>
  );
}
