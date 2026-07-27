"use client";

import { useState, useTransition } from "react";
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
    <div className="border-t border-border-subtle p-3 sm:p-4">
      <div className="flex items-end gap-2 rounded-2xl border border-border-subtle bg-background px-3 py-2">
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
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-dark"
          disabled={pending}
        />
        <div className="mb-1 flex items-center gap-0.5 text-muted">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Emoji"
            disabled
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Attach file"
            disabled
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover hover:text-foreground sm:flex"
            aria-label="Attach image"
            disabled
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={pending || !body.trim()}
            onClick={submit}
            aria-label="Send message"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
