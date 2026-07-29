import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HubRecentPost } from "@/data/mock";

type RecentHubPostsProps = {
  posts: HubRecentPost[];
};

export function RecentHubPosts({ posts }: RecentHubPostsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Recent Posts</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="flex items-start gap-2.5">
            <Avatar src={post.avatarUrl} alt={post.username} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {post.snippet}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                <span className="relative h-3.5 w-3.5 shrink-0 overflow-hidden rounded">
                  <Image
                    src={post.gameIconUrl}
                    alt={post.gameTitle}
                    fill
                    className="object-cover"
                    sizes="14px"
                  />
                </span>
                <span className="truncate">{post.gameTitle}</span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-medium text-status-looking">
              {post.timeAgo}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
