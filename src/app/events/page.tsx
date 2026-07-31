import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { EventsHome } from "@/components/events/EventsHome";
import { upcomingEvents } from "@/data/mock";
import { getAppUser } from "@/lib/auth/get-app-user";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Events",
  description:
    "Discover tournaments, community nights, and watch parties across your games.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/events");
  }

  const user = await getAppUser();

  return (
    <AppShell user={user} activeNavId="events" comingSoon>
      <TopBar
        user={user}
        title="Events"
        subtitle="Discover tournaments, community nights, and watch parties."
      />
      <EventsHome events={upcomingEvents} />
    </AppShell>
  );
}
