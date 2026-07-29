import Image from "next/image";
import { Flame, HelpCircle, MessageCircle, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { HubActivityPost } from "@/data/mock";

type HubActivityCardProps = {
  post: HubActivityPost;
};

const typeStyles: Record<
  HubActivityPost["type"],
  { label: string; className: string }
> = {
  clip: {
    label: "Clip",
    className: "bg-accent/90 text-white",
  },
  screenshot: {
    label: "Screenshot",
    className: "bg-status-online/90 text-white",
  },
  discussion: {
    label: "Discussion",
    className: "bg-status-in-game/90 text-white",
  },
  help: {
    label: "Help",
    className: "bg-status-looking/90 text-white",
  },
};

export function HubActivityCard({ post }: HubActivityCardProps) {
  const type = typeStyles[post.type];
  const hasMedia = Boolean(post.mediaUrl);

  return (
    <article className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-colors hover:bg-surface-hover">
      {hasMedia ? (
        <div className="relative h-[130px] w-full">
          <Image
            src={post.mediaUrl!}
            alt={post.title}
            fill
            className="object-cover"
            sizes="260px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-black/20" />
          <span
            className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${type.className}`}
          >
            {type.label}
          </span>
        </div>
      ) : (
        <div className="relative flex h-[130px] flex-col justify-between bg-surface p-3.5">
          <span
            className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${type.className}`}
          >
            {type.label}
          </span>
          <div className="flex items-start gap-2">
            {post.type === "help" ? (
              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-status-looking" />
            ) : (
              <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-status-in-game" />
            )}
            <p className="line-clamp-3 text-xs leading-relaxed text-muted">
              {post.body}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="flex items-center gap-2">
          <Avatar src={post.avatarUrl} alt={post.username} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {post.username}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
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
              <span>·</span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {post.title}
        </h3>

        <div className="mt-auto flex items-center gap-3 text-[11px] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3 w-3 text-status-looking" />
            {post.likesLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {post.commentsLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
