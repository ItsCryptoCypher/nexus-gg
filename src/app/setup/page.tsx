import { redirect } from "next/navigation";
import { SetupChecklist } from "@/components/setup/SetupChecklist";
import { getSetupState } from "@/lib/setup/get-setup-state";

type SetupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export const metadata = {
  title: "Nexus.gg — Quick setup",
  description: "Finish Discord setup so friends can see when you're playing.",
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;
  const next =
    params.next && params.next.startsWith("/") ? params.next : "/play";
  const state = await getSetupState();

  if (!state.signedIn) {
    redirect(`/login?next=${encodeURIComponent("/setup")}`);
  }

  if (!state.discordLinked) {
    redirect("/signup");
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#07060b] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.28),transparent_55%)]" />
      <div className="relative">
        <SetupChecklist state={state} next={next} />
      </div>
    </div>
  );
}
