"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { sendDirectMessage } from "@/app/messages/actions";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/lib/messages/types";

type MessageComposerProps = {
  conversationId: string;
  onSent?: (message: ChatMessage) => void;
};

export function MessageComposer({
  conversationId,
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
    <div className="border-t border-border-subtle p-3">
      <div className="flex items-end gap-2">
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
          placeholder="Write a message..."
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-dark focus:border-accent/50"
          disabled={pending}
        />
        <Button
          type="button"
          size="lg"
          disabled={pending || !body.trim()}
          onClick={submit}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
