import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageCircle, Clock, AlertCircle, User, MapPin, CalendarDays, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRecord, DateConfirmation } from "@/lib/dates";

export type DrawerVariant =
  | "awaiting_24h"
  | "awaiting_5h"
  | "soft_cancelled"
  | "chat_available"
  | "change_request"
  | null;

export type ChangeRequestType = "incoming_time" | "incoming_place" | null;

export function deriveDrawerVariant(
  dateRecord: DateRecord | null,
  myConfirmation: DateConfirmation | null,
  chatAccessible: boolean
): DrawerVariant {
  if (!dateRecord) return null;
  const state = dateRecord.state;
  if (chatAccessible || state === "chat_open") return "chat_available";
  if (state === "soft_cancelled") return "soft_cancelled";
  if (state === "awaiting_24h" && !myConfirmation?.confirmed_24h_at) return "awaiting_24h";
  if (state === "awaiting_3h" && !myConfirmation?.confirmed_3h_at) return "awaiting_5h";
  return null;
}

/* ── Priority order (lower = higher priority) ── */
const PRIORITY: Record<string, number> = {
  change_request: 0,
  awaiting_24h: 1,
  awaiting_5h: 1,
  soft_cancelled: 2,
  chat_available: 3,
};

/* ── Drawer copy by variant ── */

function getDrawerCopy(variant: DrawerVariant) {
  switch (variant) {
    case "awaiting_24h":
      return {
        label: "Needs your attention",
        heading: "Are you still in?",
        subtitle: "Confirm to keep your date on track.",
        icon: Clock,
      };
    case "awaiting_5h":
      return {
        label: "Almost time",
        heading: "Still going?",
        subtitle: "A quick confirm keeps things on track.",
        icon: Clock,
      };
    case "soft_cancelled":
      return {
        label: "Needs your attention",
        heading: "Your date needs a check-in",
        subtitle: "Re-confirm to keep your plans.",
        icon: AlertCircle,
      };
    case "chat_available":
      return {
        label: "Chat is open",
        heading: "Say hello",
        subtitle: "Your chat window is open — introduce yourself.",
        icon: MessageCircle,
      };
    default:
      return null;
  }
}

/* ── Stacked preview label for non-active states ── */

function getPreviewLabel(variant: DrawerVariant, changeType?: ChangeRequestType) {
  if (variant === "change_request") {
    return changeType === "incoming_place" ? "Change request · new place" : "Change request · new time";
  }
  const copy = getDrawerCopy(variant);
  return copy?.label ?? "";
}

function getPreviewIcon(variant: DrawerVariant) {
  if (variant === "change_request") return Clock;
  const copy = getDrawerCopy(variant);
  return copy?.icon ?? Clock;
}

/* ── Types for action items ── */

interface ActionItem {
  variant: DrawerVariant;
  priority: number;
}

/* ── Main component ── */

interface DateCardWithDrawerProps {
  variant: DrawerVariant;
  partnerName: string;
  venueName: string;
  dateTimeLine: string;
  dateStatusText: string;
  onConfirm: (action: string) => void;
  onDecline: () => void;
  onNavigateChat: () => void;
  // Change request props
  changeRequestType?: ChangeRequestType;
  onChangeRequestAction?: (action: "accept" | "decline") => void;
  children: React.ReactNode;
}

export default function DateCardWithDrawer({
  variant,
  partnerName,
  venueName,
  dateTimeLine,
  dateStatusText,
  onConfirm,
  onDecline,
  onNavigateChat,
  changeRequestType,
  onChangeRequestAction,
  children,
}: DateCardWithDrawerProps) {
  // Build prioritized action list
  const actionItems = useMemo(() => {
    const items: ActionItem[] = [];
    if (changeRequestType) {
      items.push({ variant: "change_request", priority: PRIORITY.change_request });
    }
    if (variant && variant !== "change_request") {
      items.push({ variant, priority: PRIORITY[variant] ?? 99 });
    }
    items.sort((a, b) => a.priority - b.priority);
    return items;
  }, [variant, changeRequestType]);

  const activeItem = actionItems[0] ?? null;
  const previewItem = actionItems[1] ?? null;

  const confirmAction = variant === "awaiting_5h" ? "confirm_3h" : "confirm_24h";

  // Track a "just confirmed" state for the collapse animation
  const [collapsing, setCollapsing] = useState<string | null>(null);

  // Reset collapsing when active variant changes
  useEffect(() => {
    if (!activeItem || activeItem.variant !== collapsing) setCollapsing(null);
  }, [activeItem, collapsing]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsing(activeItem?.variant ?? null);
    setTimeout(() => {
      onConfirm(confirmAction);
    }, 400);
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecline();
  };

  const handleChangeAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsing("change_request");
    setTimeout(() => {
      onChangeRequestAction?.("accept");
    }, 400);
  };

  const handleChangeDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsing("change_request");
    setTimeout(() => {
      onChangeRequestAction?.("decline");
    }, 400);
  };

  const showActive = activeItem && activeItem.variant !== collapsing;
  const showPreview = previewItem && previewItem.variant !== collapsing;

  return (
    <div className="w-full relative">
      {/* Stacked preview card behind — only when there's a secondary state */}
      <AnimatePresence mode="sync">
        {showPreview && showActive && (
          <motion.div
            key={`preview-${previewItem.variant}`}
            initial={{ opacity: 0, y: 0, scale: 0.98 }}
            animate={{ opacity: 0.55, y: 10, scale: 0.97 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-x-0 top-0 z-0 pointer-events-none"
          >
            <div className="w-full bg-card rounded-2xl border border-border shadow-angelic overflow-hidden">
              <div className="border-b border-border">
                <div className="h-[2px] bg-gradient-to-r from-[#E08600]/60 via-[#E08600]/30 to-transparent" />
                <div className="px-5 py-3 flex items-center gap-2">
                  {(() => {
                    const Icon = getPreviewIcon(previewItem.variant);
                    return (
                      <>
                        <div className="w-5 h-5 rounded-full bg-[#E08600]/15 flex items-center justify-center">
                          <Icon className="w-2.5 h-2.5 text-[#E08600]" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#E08600]/70">
                          {getPreviewLabel(previewItem.variant, changeRequestType)}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card — always on top */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="w-full bg-card rounded-2xl border border-border shadow-angelic overflow-hidden relative z-10"
      >
        {/* Active action drawer */}
        <AnimatePresence mode="sync">
          {showActive && (
            <motion.div
              key={`active-${activeItem.variant}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.25, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              {activeItem.variant === "change_request" ? (
                <ChangeRequestDrawer
                  changeType={changeRequestType!}
                  partnerName={partnerName}
                  onAccept={handleChangeAccept}
                  onDecline={handleChangeDecline}
                />
              ) : (
                <ConfirmationDrawer
                  variant={activeItem.variant}
                  partnerName={partnerName}
                  venueName={venueName}
                  dateTimeLine={dateTimeLine}
                  onConfirm={handleConfirm}
                  onDecline={handleDecline}
                  onNavigateChat={onNavigateChat}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date card body — always visible */}
        {children}
      </motion.div>
    </div>
  );
}

/* ── Confirmation drawer (existing design) ── */

function ConfirmationDrawer({
  variant,
  partnerName,
  venueName,
  dateTimeLine,
  onConfirm,
  onDecline,
  onNavigateChat,
}: {
  variant: DrawerVariant;
  partnerName: string;
  venueName: string;
  dateTimeLine: string;
  onConfirm: (e: React.MouseEvent) => void;
  onDecline: (e: React.MouseEvent) => void;
  onNavigateChat: () => void;
}) {
  const copy = getDrawerCopy(variant);
  if (!copy) return null;

  return (
    <div className="border-b border-border">
      <div className="h-[2px] bg-gradient-to-r from-[#E08600]/60 via-[#E08600]/30 to-transparent" />
      <div className="px-5 pt-4 pb-4">
        {/* Label */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-full bg-[#E08600]/20 flex items-center justify-center">
            <copy.icon className="w-3 h-3 text-[#E08600]" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#E08600]">
            {copy.label}
          </span>
        </div>

        {/* Heading + subtitle */}
        <h3 className="text-lg font-semibold text-foreground mb-0.5">
          {copy.heading}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {copy.subtitle}
        </p>

        {/* Identity pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1 text-[11px] text-foreground/70">
            <User className="w-3 h-3" />
            {partnerName}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1 text-[11px] text-foreground/70">
            <MapPin className="w-3 h-3" />
            {venueName}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1 text-[11px] text-foreground/70">
            <CalendarDays className="w-3 h-3" />
            {dateTimeLine}
          </span>
        </div>

        {/* Action buttons */}
        {variant === "chat_available" ? (
          <Button
            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium tracking-wide shadow-angelic-sm"
            onClick={(e) => { e.stopPropagation(); onNavigateChat(); }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Open Chat
          </Button>
        ) : (
          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl border border-border bg-secondary text-foreground/60 hover:bg-secondary/80 h-11 text-sm tracking-wide"
              onClick={onDecline}
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              I can't go
            </Button>
            <Button
              className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium tracking-wide shadow-angelic-sm"
              onClick={onConfirm}
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              {variant === "soft_cancelled" ? "Re-confirm" : "I'm still in"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Change request drawer ── */

function ChangeRequestDrawer({
  changeType,
  partnerName,
  onAccept,
  onDecline,
}: {
  changeType: ChangeRequestType;
  partnerName: string;
  onAccept: (e: React.MouseEvent) => void;
  onDecline: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="border-b border-border">
      <div className="h-[2px] bg-gradient-to-r from-[#22C55E]/60 via-[#22C55E]/30 to-transparent" />
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
              <Clock className="w-3 h-3 text-[#22C55E]" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#22C55E]">
              Change request
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
            <Map className="w-4 h-4 text-[#22C55E]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {partnerName || "They"} suggested a new {changeType === "incoming_place" ? "place" : "time"}
        </h3>
        <div className="bg-secondary/50 rounded-xl px-4 py-3 mb-4">
          {changeType === "incoming_place" ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-foreground/60" />
              <span className="text-sm text-foreground">Suggested venue</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-foreground/60" />
              <span className="text-sm text-foreground">Saturday at 8:00 PM</span>
            </div>
          )}
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="ghost"
            className="flex-1 rounded-xl border border-border bg-secondary text-foreground/60 hover:bg-secondary/80 h-11 text-sm tracking-wide"
            onClick={onDecline}
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Keep original
          </Button>
          <Button
            className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium tracking-wide shadow-angelic-sm"
            onClick={onAccept}
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
