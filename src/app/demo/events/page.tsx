import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { EventsHome } from "@/components/events/EventsHome";
import { upcomingEvents } from "@/data/mock";

export const metadata = {
  title: "Nexus.gg — Events (Demo)",
  description:
    "Mock Events showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /events is UI-only. */
export default function DemoEventsPage() {
  return (
    <AppShell basePath="/demo" activeNavId="events" comingSoon>
      <TopBar
        title="Events"
        subtitle="Discover tournaments, community nights, and watch parties."
      />
      <EventsHome events={upcomingEvents} />
    </AppShell>
  );
}
