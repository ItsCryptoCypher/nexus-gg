"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ImagePlus, Paperclip, Send, Smile } from "lucide-react";
import { sendDirectMessage } from "@/app/messages/actions";
import type { ChatMessage } from "@/lib/messages/types";

type MessageComposerProps = {
  conversationId: string;
  friendName: string;
  onSent?: (message: ChatMessage) => void;
};

export function MessageComposer({
  conversationId,
  friendName,
  onSent,
}: MessageComposerProps) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const trimmed = body.trim();
    if (!trimmed || pending) return;

    startTransition(async () => {
      setError(null);
      const result = await sendDirectMessage(conversationId, trimmed);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBody("");
      onSent?.(result.message);
    });
  }

  return (
    <div className="border-t border-border-subtle px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border-subtle bg-[#111018] px-3.5 py-2">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={4000}
            placeholder={`Message ${friendName}...`}
            className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-dark"
            disabled={pending}
          />
          <div className="flex shrink-0 items-center gap-0.5 text-muted">
            <ComposerIcon label="Emoji" disabled>
              <Smile className="h-4 w-4" />
            </ComposerIcon>
            <ComposerIcon label="Attach file" disabled>
              <Paperclip className="h-4 w-4" />
            </ComposerIcon>
            <ComposerIcon label="Attach image" disabled>
              <ImagePlus className="h-4 w-4" />
            </ComposerIcon>
          </div>
        </div>
        <button
          type="button"
          disabled={pending || !body.trim()}
          onClick={submit}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_18px_rgba(124,58,237,0.4)] transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function ComposerIcon({
  children,
  label,
  disabled,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.04] hover:text-foreground disabled:opacity-50"
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
