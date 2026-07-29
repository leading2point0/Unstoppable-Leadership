"use client";

import * as React from "react";
import { Info } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { INSIGHT_CATEGORY_LABELS, type InsightContent } from "@/types/insight";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const CATEGORY_BADGE_VARIANT: Record<string, BadgeProps["variant"]> = {
  "book-concept": "accent",
  research: "success",
  counterpoint: "caution",
  example: "outline",
  leadership: "default",
  source: "neutral",
  caution: "critical",
  quote: "accent",
};

const CLOSE_DELAY_MS = 150;

/**
 * Accessible insight trigger. Opens on hover, keyboard focus, and click/tap
 * — never hover-only. Escape closes it and returns focus to the trigger.
 */
export function InsightPopover({
  insight,
  children,
}: {
  insight: InsightContent;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="text-accent focus-visible:outline-accent inline-flex items-center rounded-full align-middle focus-visible:outline-2"
          aria-label={`More information: ${insight.title}`}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onFocus={openNow}
          onBlur={closeSoon}
          onClick={(event) => {
            // Radix's own Trigger click handler toggles open state, which
            // would immediately close a popover that focus/hover already
            // opened. Take over entirely: click always opens (never
            // toggles closed) — closing happens via Escape, blur, or
            // moving the pointer away.
            event.preventDefault();
            openNow();
          }}
        >
          {children ?? <Info className="h-[0.9em] w-[0.9em]" aria-hidden="true" />}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            "border-border bg-surface z-50 w-80 rounded-lg border p-4 text-sm shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        >
          <Badge variant={CATEGORY_BADGE_VARIANT[insight.category]} className="mb-2">
            {INSIGHT_CATEGORY_LABELS[insight.category]}
          </Badge>
          <p className="font-medium">{insight.title}</p>
          <p className="text-slate mt-1">{insight.summary}</p>

          {insight.quoteText && (
            <blockquote className="border-accent text-slate mt-2 border-l-2 pl-3 italic">
              &ldquo;{insight.quoteText}&rdquo;
            </blockquote>
          )}

          {insight.application && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Apply this now: </span>
              {insight.application}
            </p>
          )}

          {(insight.sourceTitle || insight.sourceUrl) && (
            <div className="border-border text-slate-muted mt-3 border-t pt-2 text-xs">
              {insight.sourceAuthor && <span>{insight.sourceAuthor}. </span>}
              {insight.sourceTitle && <cite>{insight.sourceTitle}</cite>}
              {insight.sourcePage && <span>, p. {insight.sourcePage}</span>}
              {insight.accessedDate && <span> · accessed {insight.accessedDate}</span>}
              {insight.sourceUrl && (
                <>
                  {" "}
                  <a
                    href={insight.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    View source
                  </a>
                </>
              )}
            </div>
          )}

          {!insight.verified && (
            <p className="text-caution mt-2 text-xs">Reflective note — not a verified citation.</p>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
