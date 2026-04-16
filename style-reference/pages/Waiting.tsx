import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { usePendingFollowup } from "@/hooks/use-pending-followup";
import { useDateState } from "@/hooks/use-date-state";
import { confirmDate, isChatAccessible, getChatOpenTime } from "@/lib/dates";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDbUser } from "@/hooks/use-user";
import { submitMatchFeedback, type MatchingResult } from "@/lib/matchmaking";
import {
  getActiveProposal,
  updateProposalStatus,
  storeProposalCancellation,
  getMatchPartner,
  enrichVenueMetadata,
  acceptProposal,
  surfaceNextProposal,
  type DateProposalData,
  type MatchPartnerInfo,
} from "@/lib/proposals";
import { getProfileCompletion } from "@/lib/profile-completion";
import AppHeader from "@/components/AppHeader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin, Clock, Heart, Check, X, Coffee, Wine, TreePine, Dumbbell,
  CalendarDays, MessageCircle, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PreviewScenarioPanel from "@/components/dev/PreviewScenarioPanel";
import { type PreviewScenario, mapPreviewToProps } from "@/lib/preview-scenario";
import { waitingStore, updateStore } from "@/lib/waiting-state-store";
import DateCardWithDrawer, { deriveDrawerVariant, type ChangeRequestType } from "@/components/date/DateCardWithDrawer";
import UpcomingDatesHero from "@/components/date/UpcomingDatesHero";
import UpcomingDatesSupportSection from "@/components/date/UpcomingDatesSupportSection";
import ProposalExpiryTimer from "@/components/date/ProposalExpiryTimer";
import ProposalCancelFlow from "@/components/date/ProposalCancelFlow";
import DateManageSheet from "@/components/date/DateManageSheet";
import ChangeRequestBanner from "@/components/date/ChangeRequestBanner";
import { useDateChanges } from "@/hooks/use-date-changes";
import { supabase } from "@/integrations/supabase/client";

type WaitingState = "searching" | "proposal" | "accepted_waiting" | "confirmed";

function getActivityIcon(activity: string) {
  const lower = activity.toLowerCase();
  if (lower.includes("coffee") || lower.includes("tea") || lower.includes("cafe")) return Coffee;
  if (lower.includes("bar") || lower.includes("wine") || lower.includes("cocktail") || lower.includes("karaoke") || lower.includes("trivia") || lower.includes("live music")) return Wine;
  if (lower.includes("park") || lower.includes("walk") || lower.includes("hike") || lower.includes("market")) return TreePine;
  if (lower.includes("yoga") || lower.includes("workout") || lower.includes("sport") || lower.includes("bowling")) return Dumbbell;
  return Coffee;
}

function isVenueReady(proposal: DateProposalData): boolean {
  return !!proposal.venue_name && proposal.venue_name !== "Venue TBD";
}

function getCountdown(day: string, time: string): string {
  try {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIdx = dayNames.findIndex((d) => day.toLowerCase().startsWith(d.toLowerCase()));

    if (dayIdx >= 0) {
      const currentDay = now.getDay();
      let daysUntil = dayIdx - currentDay;
      if (daysUntil <= 0) daysUntil += 7;

      if (daysUntil === 0) return `Today at ${time}`;
      if (daysUntil === 1) return `Tomorrow at ${time}`;
      if (daysUntil <= 6) return `${day} at ${time} · In ${daysUntil} days`;
      return `${day} at ${time}`;
    }

    return `${day} at ${time}`;
  } catch {
    return `${day} at ${time}`;
  }
}

/** Derive the WaitingState from a proposal row — perspective-aware per current user */
function deriveProposalState(proposal: DateProposalData, myUserId: string): WaitingState {
  const amUserA = proposal.user_id === myUserId;
  const myAccepted = amUserA ? !!proposal.user_a_accepted_at : !!proposal.user_b_accepted_at;
  const theirAccepted = amUserA ? !!proposal.user_b_accepted_at : !!proposal.user_a_accepted_at;

  // Only derive confirmed when BOTH timestamps are present
  if (myAccepted && theirAccepted) return "confirmed";
  // I accepted but they haven't → waiting on them
  if (myAccepted && !theirAccepted) return "accepted_waiting";
  // I haven't accepted yet → show proposal (regardless of whether they accepted)
  return "proposal";
}

const IS_DEV = import.meta.env.DEV;

const DUMMY_PROPOSAL: DateProposalData = {
  id: "dev-preview-001",
  user_id: "dev-user",
  candidate_user_id: "dev-partner",
  activity: "Coffee",
  venue_name: "Fleet Coffee",
  venue_area: "East Austin",
  venue_address: "2427 Webberville Rd",
  venue_lat: 30.26,
  venue_lng: -97.72,
  proposed_day: "Saturday",
  proposed_time: "7:30 PM",
  compatibility_score: 88,
  shared_items: ["board games", "live music", "running"],
  status: "proposed",
  venue_place_id: null,
  venue_photo_url: null,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  user_a_accepted_at: null,
  user_b_accepted_at: null,
};

const DUMMY_PARTNER: MatchPartnerInfo = {
  name: "Jordan",
  age: 28,
  city: "Austin, TX",
  bio: "Weekend hiker, weekday coffee snob.",
  photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  interests: ["live music", "running", "board games", "coffee", "hiking"],
};

const POLL_INTERVAL_MS = 30_000;

const Waiting = () => {
  const navigate = useNavigate();
  const { dbUser, photos, activities, availability } = useDbUser();
  const { date: activeDate, statusText: dateStatusText, chatAccessible, myConfirmation: dateMyConfirmation, refresh: refreshDate } = useDateState();
  const { pending: pendingFollowup, waitingForPartner } = usePendingFollowup();
  const [state, setState] = useState<WaitingState>(waitingStore.state);
  const [proposal, setProposal] = useState<DateProposalData | null>(waitingStore.proposal);
  const [partner, setPartner] = useState<MatchPartnerInfo | null>(waitingStore.partner);
  const [proposalStatus, setProposalStatus] = useState<"idle" | "building" | "failed">("idle");
  const [previewScenario, setPreviewScenario] = useState<PreviewScenario | null>(waitingStore.previewScenario);
  const [isPreviewPanelExpanded, setIsPreviewPanelExpanded] = useState(waitingStore.isPreviewPanelExpanded);
  const [isCardExpanded, setIsCardExpanded] = useState(waitingStore.isCardExpanded);
  const enrichAttempted = useRef(false);
  const [enrichmentTriggered, setEnrichmentTriggered] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<{ url: string; partner: MatchPartnerInfo } | null>(null);

  // Redirect to post-date followup if pending
  useEffect(() => {
    if (pendingFollowup) {
      navigate(`/post-date/${pendingFollowup.dateId}`, { replace: true });
    }
  }, [pendingFollowup, navigate]);

  // Sync state changes back to module store
  const syncState = useCallback((val: WaitingState) => { setState(val); updateStore("state", val); }, []);
  const syncProposal = useCallback((val: DateProposalData | null) => { setProposal(val); updateStore("proposal", val); }, []);
  const syncPartner = useCallback((val: MatchPartnerInfo | null) => { setPartner(val); updateStore("partner", val); }, []);
  const syncCardExpanded = useCallback((val: boolean) => { setIsCardExpanded(val); updateStore("isCardExpanded", val); }, []);
  const syncPreviewScenario = useCallback((val: PreviewScenario | null) => { setPreviewScenario(val); updateStore("previewScenario", val); }, []);
  const syncPreviewPanelExpanded = useCallback((val: boolean) => { setIsPreviewPanelExpanded(val); updateStore("isPreviewPanelExpanded", val); }, []);

  const devPreview = !!previewScenario;
  const devPreviewState = previewScenario?.waitingState ?? "searching";
  const displayState = devPreview ? devPreviewState : state;
  const previewDateProps = previewScenario?.waitingState === "confirmed" ? mapPreviewToProps(previewScenario) : null;
  const displayProposal = devPreview ? (devPreviewState !== "searching" ? { ...DUMMY_PROPOSAL, status: devPreviewState === "confirmed" ? "accepted" : "proposed" } : null) : proposal;
  const displayPartner = devPreview ? (devPreviewState !== "searching" ? DUMMY_PARTNER : null) : partner;

  /** Fetch partner data — always re-fetches, no guards */
  const fetchPartner = useCallback(async (candidateId: string): Promise<MatchPartnerInfo | null> => {
    const p = await getMatchPartner(candidateId);
    return p;
  }, []);

  /** Process a proposal row from DB and update local state */
  const processProposal = useCallback(async (p: DateProposalData) => {
    const partnerId = p.user_id === dbUser?.id ? (p.candidate_user_id || (p as any).user_b_id) : p.user_id;
    const derivedState = deriveProposalState(p, dbUser?.id || "");

    // Fetch partner reactively
    const partnerData = await fetchPartner(partnerId);
    
    syncProposal(p);
    if (partnerData) syncPartner(partnerData);
    syncState(derivedState);

    // Enrich venue if needed
    if (!enrichAttempted.current && (!p.venue_place_id || !p.venue_photo_url)) {
      enrichAttempted.current = true;
      setEnrichmentTriggered(true);
      enrichVenueMetadata(p).then((enriched) => {
        if (enriched.venue_photo_url !== p.venue_photo_url) {
          syncProposal(enriched);
        }
      });
    }
  }, [dbUser?.id, fetchPartner, syncProposal, syncPartner, syncState]);

  // ── UNCONDITIONAL proposal check on mount ──
  useEffect(() => {
    if (!dbUser?.id) return;
    
    console.log("[Waiting:mount] Checking for active proposal (unconditional)");
    getActiveProposal(dbUser.id).then(async (p) => {
      if (p) {
        console.log("[Waiting:mount] Found proposal:", { id: p.id, status: p.status });
        await processProposal(p);
      } else {
        console.log("[Waiting:mount] No active proposal — waiting for backend to create one");
        syncState("searching");
      }
    }).catch((err) => {
      console.error("[Waiting:mount] Error checking proposal:", err);
    });
  }, [dbUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── REALTIME subscription on date_proposals ──
  useEffect(() => {
    if (!dbUser?.id) return;

    const channel = supabase
      .channel(`proposals-${dbUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "date_proposals",
        },
        async (payload) => {
          const row = (payload.new || payload.old) as any;
          if (!row) return;

          // Only process proposals where this user is a participant
          if (row.user_id !== dbUser.id && row.user_b_id !== dbUser.id) return;

          console.log("[Waiting:realtime] Proposal changed:", { id: row.id, status: row.status, event: payload.eventType });

          // If proposal was declined/cancelled/expired, go back to searching
          if (["declined", "cancelled", "expired"].includes(row.status)) {
            syncProposal(null);
            syncPartner(null);
            syncState("searching");
            enrichAttempted.current = false;
            return;
          }

          // Process the updated proposal
          const proposalData: DateProposalData = {
            id: row.id,
            user_id: row.user_id,
            candidate_user_id: row.user_b_id,
            activity: row.activity,
            venue_name: row.venue_name,
            venue_address: row.venue_address,
            venue_lat: row.venue_lat,
            venue_lng: row.venue_lng,
            venue_area: row.venue_area,
            proposed_day: row.proposed_day,
            proposed_time: row.proposed_time,
            compatibility_score: row.compatibility_score,
            shared_items: row.shared_items || [],
            status: row.status,
            venue_place_id: row.venue_place_id || null,
            venue_photo_url: row.venue_photo_url || null,
            created_at: row.created_at || new Date().toISOString(),
            user_a_accepted_at: row.user_a_accepted_at || null,
            user_b_accepted_at: row.user_b_accepted_at || null,
          };

          await processProposal(proposalData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dbUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── POLLING fallback: re-check every 30s ──
  useEffect(() => {
    if (!dbUser?.id) return;

    const interval = setInterval(async () => {
      try {
        const p = await getActiveProposal(dbUser.id);
        if (p) {
          // Process if proposal id, status, or acceptance timestamps changed
          if (!proposal || p.id !== proposal.id || p.status !== proposal.status
            || p.user_a_accepted_at !== proposal.user_a_accepted_at
            || p.user_b_accepted_at !== proposal.user_b_accepted_at) {
            console.log("[Waiting:poll] Proposal update detected:", { id: p.id, status: p.status });
            await processProposal(p);
          }
        }
      } catch (err) {
        console.error("[Waiting:poll] Error:", err);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dbUser?.id, proposal?.id, proposal?.status, proposal?.user_a_accepted_at, proposal?.user_b_accepted_at]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reactive partner hydration: re-fetch whenever proposal.id changes ──
  useEffect(() => {
    if (!proposal?.id || !dbUser?.id) return;
    const partnerId = proposal.user_id === dbUser.id ? proposal.candidate_user_id : proposal.user_id;
    if (!partnerId) return;

    fetchPartner(partnerId).then((p) => {
      if (p) syncPartner(p);
    });
  }, [proposal?.id, dbUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = useCallback(async () => {
    if (!proposal?.id || !dbUser?.id) return;
    try {
      await acceptProposal(proposal.id);
      // Re-fetch authoritative state from DB instead of trusting response alone
      const fresh = await getActiveProposal(dbUser.id);
      if (fresh) {
        await processProposal(fresh);
      } else {
        // Fallback: at minimum show accepted_waiting
        syncState("accepted_waiting");
      }
    } catch (e) {
      console.error("[Waiting] Accept failed:", e);
    }
  }, [proposal, dbUser?.id, syncState, processProposal]);

  const handleDecline = useCallback(async () => {
    if (!proposal?.id || !dbUser?.id) return;
    await updateProposalStatus(proposal.id, "declined");
    submitMatchFeedback(proposal.candidate_user_id, "passed");
    enrichAttempted.current = false;

    // Attempt to surface next proposal from reserve
    const nextResult = await surfaceNextProposal();
    if (nextResult?.status === "proposal_created" && nextResult.proposal) {
      const p = nextResult.proposal;
      const mapped: DateProposalData = {
        id: p.id,
        user_id: p.user_id,
        candidate_user_id: p.user_b_id,
        activity: p.activity,
        venue_name: p.venue_name,
        venue_address: p.venue_address,
        venue_lat: p.venue_lat,
        venue_lng: p.venue_lng,
        venue_area: p.venue_area,
        proposed_day: p.proposed_day,
        proposed_time: p.proposed_time,
        compatibility_score: p.compatibility_score,
        shared_items: p.shared_items || [],
        status: "proposed",
        venue_place_id: p.venue_place_id || null,
        venue_photo_url: p.venue_photo_url || null,
        created_at: p.created_at || new Date().toISOString(),
        user_a_accepted_at: p.user_a_accepted_at || null,
        user_b_accepted_at: p.user_b_accepted_at || null,
      };
      await processProposal(mapped);
    } else {
      syncProposal(null);
      syncPartner(null);
      syncState("searching");
    }
  }, [proposal, dbUser?.id, syncProposal, syncPartner, syncState, processProposal]);

  const [cancelFlowOpen, setCancelFlowOpen] = useState(false);
  const [manageSheetOpen, setManageSheetOpen] = useState(false);

  const handleCancelWithReason = useCallback(async (reason: string, detail?: string) => {
    if (!dbUser?.id) return;
    const proposalId = proposal?.id;
    const candidateId = proposal?.candidate_user_id;
    enrichAttempted.current = false;

    // Submit feedback + exclusion via backend
    if (candidateId) {
      submitMatchFeedback(candidateId, "cancelled", reason, detail);
    }
    // If there's a confirmed date, decline it via edge function
    if (activeDate) {
      try {
        await confirmDate(activeDate.id, "decline");
        refreshDate();
      } catch (e) {
        console.error("[Waiting] Failed to cancel confirmed date:", e);
      }
    }
    // Background: store reason + update proposal
    if (proposalId) {
      storeProposalCancellation(proposalId, dbUser.id, reason, detail);
      updateProposalStatus(proposalId, "cancelled");
    }

    // Attempt to surface next proposal from reserve
    const nextResult = await surfaceNextProposal();
    if (nextResult?.status === "proposal_created" && nextResult.proposal) {
      const p = nextResult.proposal;
      const mapped: DateProposalData = {
        id: p.id,
        user_id: p.user_id,
        candidate_user_id: p.user_b_id,
        activity: p.activity,
        venue_name: p.venue_name,
        venue_address: p.venue_address,
        venue_lat: p.venue_lat,
        venue_lng: p.venue_lng,
        venue_area: p.venue_area,
        proposed_day: p.proposed_day,
        proposed_time: p.proposed_time,
        compatibility_score: p.compatibility_score,
        shared_items: p.shared_items || [],
        status: "proposed",
        venue_place_id: p.venue_place_id || null,
        venue_photo_url: p.venue_photo_url || null,
        created_at: p.created_at || new Date().toISOString(),
        user_a_accepted_at: p.user_a_accepted_at || null,
        user_b_accepted_at: p.user_b_accepted_at || null,
      };
      await processProposal(mapped);
    } else {
      syncProposal(null);
      syncPartner(null);
      syncState("searching");
    }
  }, [proposal, dbUser?.id, activeDate, syncProposal, syncPartner, syncState, refreshDate, processProposal]);

  const completion = getProfileCompletion(dbUser, photos, activities, availability);
  const activeProposal = displayProposal;
  const activePartner = displayPartner;
  const ActivityIcon = activeProposal ? getActivityIcon(activeProposal.activity) : Coffee;
  const countdown = activeProposal ? getCountdown(activeProposal.proposed_day, activeProposal.proposed_time) : "";

  const partnerInterests = useMemo(() => {
    if (!activePartner?.interests) return [];
    return [...new Set(activePartner.interests)];
  }, [activePartner?.interests]);

  const sharedItems = useMemo(() => {
    if (!activeProposal?.shared_items) return [];
    return [...new Set(activeProposal.shared_items)];
  }, [activeProposal?.shared_items]);

  const matchReasons = useMemo(() => {
    if (!activeProposal) return [];
    return generateMatchReasons(sharedItems, activeProposal.activity);
  }, [sharedItems, activeProposal?.activity]);

  const devCycle = () => {
    const order: Array<"searching" | "proposal" | "confirmed"> = ["searching", "proposal", "confirmed"];
    const current = previewScenario?.waitingState ?? "searching";
    const next = order[(order.indexOf(current as any) + 1) % order.length];
    syncPreviewScenario(previewScenario ? { ...previewScenario, waitingState: next } : null);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <AppHeader completionPercent={completion.percent} />

      <div className="flex-1 overflow-y-auto pt-24 pb-8">
        {/* Passive "waiting for partner" banner */}
        {(waitingForPartner.waiting || (devPreview && previewScenario?.postDateState === "waiting_on_partner_second_date_response")) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Waiting to hear back from <span className="text-foreground font-medium">{devPreview ? "Alex" : (waitingForPartner.partnerName || "your date")}</span>
            </p>
          </motion.div>
        )}

        {/* Preview: post-date state banners */}
        {devPreview && previewScenario?.postDateState === "date_completed_waiting_4h" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-accent/50 border border-border text-center">
            <p className="text-xs text-muted-foreground">Your date is complete — follow-up available in ~4 hours</p>
          </motion.div>
        )}
        {devPreview && previewScenario?.postDateState && previewScenario.postDateState.startsWith("followup_step_") && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4">
            <button
              onClick={() => navigate("/post-date/preview")}
              className="w-full px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center hover:bg-primary/15 transition-colors"
            >
              <p className="text-xs font-medium text-primary">📝 Complete your follow-up</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Step {previewScenario.postDateState.replace("followup_step_", "").split("_")[0]} of 5</p>
            </button>
          </motion.div>
        )}
        {devPreview && previewScenario?.postDateState === "second_date_created" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-xs text-primary font-medium">🎉 Second date created!</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">You'll both get a new proposal soon</p>
          </motion.div>
        )}
        {devPreview && previewScenario?.postDateState === "followup_complete" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-accent/50 border border-border text-center">
            <p className="text-xs text-muted-foreground">✅ Follow-up complete</p>
          </motion.div>
        )}
        {devPreview && previewScenario?.postDateState === "date_2_followup" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4">
            <button
              onClick={() => navigate("/post-date/preview")}
              className="w-full px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center hover:bg-primary/15 transition-colors"
            >
              <p className="text-xs font-medium text-primary">📝 How was date #2?</p>
            </button>
          </motion.div>
        )}
        {devPreview && previewScenario?.postDateState === "date_2_complete_no_more_dates" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-accent/50 border border-border text-center">
            <p className="text-xs text-muted-foreground">Journey with Alex complete — no more in-app dates</p>
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          {displayState === "searching" && (
            <SearchingView
              proposalStatus={proposalStatus}
              completionPercent={completion.percent}
              onCompleteProfile={() => navigate("/profile")}
            />
          )}

          {displayState === "proposal" && activeProposal && (
            <ProposalCard
              proposal={activeProposal}
              partner={activePartner}
              partnerInterests={partnerInterests}
              sharedItems={sharedItems}
              matchReasons={matchReasons}
              ActivityIcon={ActivityIcon}
              onAccept={devPreview ? () => {
                // Accept always ignores reserve — move to accepted_waiting/confirmed
                console.log("[Preview] Accept — reserve stays hidden");
                devCycle();
              } : handleAccept}
              onDecline={devPreview ? () => {
                const behavior = previewScenario?.nextProposalBehavior ?? "none";
                const hasNext = previewScenario?.hasNextProposal ?? false;
                if (hasNext && behavior === "available_after_decline") {
                  console.log("[Preview] Decline → surfacing next proposal from reserve");
                  syncPreviewScenario(previewScenario ? {
                    ...previewScenario,
                    reserveCount: Math.max(0, (previewScenario.reserveCount ?? 1) - 1),
                  } : null);
                } else {
                  console.log("[Preview] Decline → no reserve available, returning to searching");
                  syncPreviewScenario(previewScenario ? { ...previewScenario, waitingState: "searching" } : null);
                }
              } : handleDecline}
              onPhotoTap={(url) => activePartner && setFullscreenPhoto({ url, partner: activePartner })}
            />
          )}

          {displayState === "accepted_waiting" && activeProposal && (
            <AcceptedWaitingView
              proposal={activeProposal}
              partner={activePartner}
              onPhotoTap={(url) => activePartner && setFullscreenPhoto({ url, partner: activePartner })}
            />
          )}

          {displayState === "confirmed" && activeProposal && (
            <ConfirmedView
              isCardExpanded={isCardExpanded}
              onToggleCard={() => syncCardExpanded(!isCardExpanded)}
              proposal={activeProposal}
              partner={activePartner}
              partnerInterests={partnerInterests}
              sharedItems={sharedItems}
              matchReasons={matchReasons}
              ActivityIcon={ActivityIcon}
              countdown={countdown}
              completionPercent={completion.percent}
              onCompleteProfile={() => navigate("/profile")}
              dateStatusText={previewDateProps?.dateStatusText ?? dateStatusText}
              chatAccessible={previewDateProps?.chatAccessible ?? chatAccessible}
              dateRecord={previewDateProps?.dateRecord ?? activeDate}
              myConfirmation={previewDateProps?.myConfirmation ?? dateMyConfirmation}
              onConfirm={devPreview ? (action) => console.log("[Preview] onConfirm:", action) : async (action) => {
                if (activeDate) {
                  try { await confirmDate(activeDate.id, action as any); refreshDate(); } catch (e) { console.error(e); }
                }
              }}
              onNavigateChat={() => {
                const id = activeDate?.id ?? "preview";
                navigate(`/date/${id}/chat`);
              }}
              onOpenCancelFlow={() => {
                if (devPreview) {
                  const behavior = previewScenario?.nextProposalBehavior ?? "none";
                  const hasNext = previewScenario?.hasNextProposal ?? false;
                  if (hasNext && behavior === "available_after_cancel") {
                    console.log("[Preview] Cancel → surfacing next proposal from reserve");
                    syncPreviewScenario(previewScenario ? {
                      ...previewScenario,
                      waitingState: "proposal",
                      reserveCount: Math.max(0, (previewScenario.reserveCount ?? 1) - 1),
                    } : null);
                  } else {
                    console.log("[Preview] Cancel → no reserve or blocked, returning to searching");
                    syncPreviewScenario(previewScenario ? { ...previewScenario, waitingState: "searching" } : null);
                  }
                  return;
                }
                setCancelFlowOpen(true);
              }}
              onOpenManageSheet={() => setManageSheetOpen(true)}
              onPhotoTap={(url) => activePartner && setFullscreenPhoto({ url, partner: activePartner })}
              dateChangeLocked={devPreview ? (previewScenario?.changeLocked ?? false) : (activeDate?.change_locked ?? false)}
              changeRequestState={devPreview ? (previewScenario?.changeRequestState ?? "none") : "none"}
              hasUsedChange={devPreview ? (previewScenario?.hasUsedChange ?? false) : false}
              onChangeRequestAction={devPreview ? (action) => {
                console.log("[Preview] change request action:", action);
                if (action === "accept") {
                  syncPreviewScenario(previewScenario ? { ...previewScenario, changeRequestState: "accepted", changeLocked: true } : null);
                } else {
                  syncPreviewScenario(previewScenario ? { ...previewScenario, changeRequestState: "declined" } : null);
                }
              } : undefined}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cancel flow modal + reason sheet */}
      <ProposalCancelFlow
        open={cancelFlowOpen}
        onClose={() => setCancelFlowOpen(false)}
        onConfirmCancel={handleCancelWithReason}
      />

      {/* Date manage sheet */}
      {(activeDate || manageSheetOpen) && (
        <DateManageSheet
          open={manageSheetOpen}
          onClose={() => setManageSheetOpen(false)}
          dateId={activeDate?.id ?? "preview"}
          changeLocked={devPreview ? (previewScenario?.changeLocked ?? false) : (activeDate?.change_locked ?? false)}
          hasPendingRequest={devPreview ? (["outgoing_pending", "incoming_time", "incoming_place"].includes(previewScenario?.changeRequestState ?? "none")) : false}
          onOpenCancelFlow={() => { setManageSheetOpen(false); setCancelFlowOpen(true); }}
          onChangeSubmitted={() => {
            if (devPreview) {
              console.log("[Preview] change submitted");
              syncPreviewScenario(previewScenario ? { ...previewScenario, changeRequestState: "outgoing_pending" } : null);
            } else {
              refreshDate();
            }
          }}
        />
      )}

      {/* Dev Preview Control */}
      {IS_DEV && (
        <PreviewScenarioPanel
          scenario={previewScenario}
          onChange={syncPreviewScenario}
          expanded={isPreviewPanelExpanded}
          onToggleExpand={() => syncPreviewPanelExpanded(!isPreviewPanelExpanded)}
        />
      )}

      {/* Dev Debug */}
      <DebugPanel
        state={displayState}
        proposal={activeProposal}
        partner={activePartner}
        enrichmentTriggered={enrichmentTriggered}
        previewScenario={previewScenario}
      />
      {/* Bumble-style fullscreen photo overlay */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenPhoto(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-card/40 transition-colors"
              onClick={() => setFullscreenPhoto(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo card */}
            <motion.div
              className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenPhoto.url}
                alt={fullscreenPhoto.partner.name ?? "Profile"}
                className="w-full h-full object-cover"
              />
              {/* Bottom gradient + info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-20 pb-6 px-5">
                <p className="text-white text-2xl font-display font-bold">
                  {fullscreenPhoto.partner.name}
                  {fullscreenPhoto.partner.age ? <span className="font-normal">, {fullscreenPhoto.partner.age}</span> : null}
                </p>
                {fullscreenPhoto.partner.city && (
                  <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {fullscreenPhoto.partner.city}
                  </p>
                )}
                {fullscreenPhoto.partner.bio && (
                  <p className="text-white/60 text-sm mt-2 line-clamp-2">{fullscreenPhoto.partner.bio}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SearchingView({ proposalStatus, completionPercent, onCompleteProfile }: { proposalStatus: "idle" | "building" | "failed"; completionPercent: number; onCompleteProfile: () => void }) {
  let heading: string;
  let subtitle: string;

  if (proposalStatus === "building") {
    heading = "We found someone —\nplanning your date…";
    subtitle = "Building a plan you'll both enjoy";
  } else if (proposalStatus === "failed") {
    heading = "We found a match";
    subtitle = "Still working on the details — check back soon";
  } else {
    heading = "Finding someone you'll\nenjoy meeting…";
    subtitle = "We're working on it — you'll see a match here soon.";
  }

  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="relative mb-16">
        <div className="w-24 h-24 rounded-full bg-primary/10 animate-aura-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/15 animate-aura-pulse" style={{ animationDelay: "0.7s" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary/40" />
        </div>
      </div>
      <div className="text-center px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
          State of Grace
        </p>
        <h2 className="font-display text-2xl font-light text-foreground mb-3 italic whitespace-pre-line">
          {heading}
        </h2>
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}

/** "You're in — waiting on them" view */
function AcceptedWaitingView({ proposal, partner, onPhotoTap }: { proposal: DateProposalData; partner: MatchPartnerInfo | null; onPhotoTap?: (url: string) => void }) {
  return (
    <motion.div
      key="accepted_waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-8"
    >
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
          You're in
        </p>
        <h2 className="font-display text-2xl font-light text-foreground mb-3 italic">
          Waiting on {partner?.name || "them"}…
        </h2>
        <p className="text-xs text-muted-foreground max-w-[260px] mx-auto">
          You accepted the date. Once {partner?.name || "they"} accept{partner?.name ? "s" : ""} too,
          you'll both be confirmed.
        </p>
      </div>
      {/* Mini proposal summary */}
      <div className="mt-8 bg-card rounded-2xl border border-border p-4 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); if (partner?.photo_url) onPhotoTap?.(partner.photo_url); }}>
            {partner?.photo_url ? <AvatarImage src={partner.photo_url} alt={partner?.name ?? ""} /> : null}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-display">
              {partner?.name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {partner?.name || "Your match"}{partner?.age ? `, ${partner.age}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {proposal.activity} · {proposal.venue_name}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{proposal.proposed_day} at {proposal.proposed_time}</span>
        </div>
      </div>
    </motion.div>
  );
}


function ConfirmedView({
  isCardExpanded,
  onToggleCard,
  proposal,
  partner,
  partnerInterests,
  sharedItems,
  matchReasons,
  ActivityIcon,
  countdown,
  completionPercent,
  onCompleteProfile,
  dateStatusText,
  chatAccessible,
  dateRecord,
  myConfirmation,
  onConfirm,
  onNavigateChat,
  onOpenCancelFlow,
  onOpenManageSheet,
  dateChangeLocked,
  changeRequestState = "none",
  hasUsedChange = false,
  onChangeRequestAction,
  onPhotoTap,
}: {
  isCardExpanded: boolean;
  onToggleCard: () => void;
  proposal: DateProposalData;
  partner: MatchPartnerInfo | null;
  partnerInterests: string[];
  sharedItems: string[];
  matchReasons: string[];
  ActivityIcon: React.ElementType;
  countdown: string;
  completionPercent: number;
  onCompleteProfile: () => void;
  dateStatusText: string;
  chatAccessible: boolean;
  dateRecord: any;
  myConfirmation: any;
  onConfirm: (action: string) => void;
  onNavigateChat: () => void;
  onOpenCancelFlow: () => void;
  onOpenManageSheet: () => void;
  dateChangeLocked: boolean;
  changeRequestState?: string;
  hasUsedChange?: boolean;
  onChangeRequestAction?: (action: "accept" | "decline") => void;
  onPhotoTap?: (url: string) => void;
}) {
  const drawerVariant = deriveDrawerVariant(dateRecord, myConfirmation, chatAccessible);
  const dateTimeLine = `${proposal.proposed_day} ${proposal.proposed_time}`;

  return (
    <motion.div
      key="confirmed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-sm mx-auto px-6"
    >
      <UpcomingDatesHero />

      

      <DateCardWithDrawer
        variant={drawerVariant}
        partnerName={partner?.name ?? ""}
        venueName={proposal.venue_name}
        dateTimeLine={dateTimeLine}
        dateStatusText={dateStatusText}
        onConfirm={onConfirm}
        onDecline={() => onConfirm("decline")}
        onNavigateChat={onNavigateChat}
        changeRequestType={
          changeRequestState === "incoming_time" ? "incoming_time"
            : changeRequestState === "incoming_place" ? "incoming_place"
            : null
        }
        onChangeRequestAction={onChangeRequestAction}
      >
        <div className="cursor-pointer" onClick={onToggleCard}>
          <AnimatePresence mode="wait">
            {!isCardExpanded ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <Avatar className="w-10 h-10 ring-1 ring-offset-1 ring-offset-card ring-primary/20 flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); if (partner?.photo_url) onPhotoTap?.(partner.photo_url); }}>
                  {partner?.photo_url ? (
                    <AvatarImage src={partner.photo_url} alt={partner?.name ?? ""} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-display">
                    {partner?.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {partner?.name}{partner?.age ? `, ${partner.age}` : ""} · {proposal.venue_name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {proposal.proposed_day} at {proposal.proposed_time}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {Math.round(proposal.compatibility_score)}%
                  </span>
                  <span className="text-[10px] text-primary/60">match</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PartnerHeader partner={partner} interests={partnerInterests} accent="pink" onPhotoTap={onPhotoTap} />
                <VenueHero proposal={proposal} ActivityIcon={ActivityIcon} accent="pink" />
                <VenueDetails proposal={proposal} accent="pink" />
                <CompatibilitySection
                  score={proposal.compatibility_score}
                  reasons={matchReasons}
                  sharedItems={sharedItems}
                  accent="pink"
                />

                <div
                  className={`border-t border-border/40 px-5 py-4 mt-1 flex flex-col items-center gap-1 ${
                    !dateChangeLocked && !hasUsedChange ? "cursor-pointer active:bg-secondary/50 transition-colors" : ""
                  }`}
                  onClick={(e) => {
                    if (!dateChangeLocked && !hasUsedChange) {
                      e.stopPropagation();
                      onOpenManageSheet();
                    }
                  }}
                >
                  {dateChangeLocked ? (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Plan locked in
                    </span>
                  ) : hasUsedChange ? (
                    <span className="text-xs text-muted-foreground">You've already adjusted this plan</span>
                  ) : (
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                      Change
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DateCardWithDrawer>

      {!drawerVariant && <UpcomingDatesSupportSection />}
    </motion.div>
  );
}

// ─── Venue hero gradient map ──────────────────────────────────────────────

function getVenueGradient(activity: string, accent: "blue" | "pink" = "blue") {
  const lower = activity.toLowerCase();
  if (accent === "pink") {
    if (lower.includes("coffee") || lower.includes("cafe")) return "from-rose-400/80 via-pink-300/60 to-amber-200/40";
    if (lower.includes("wine") || lower.includes("bar") || lower.includes("cocktail")) return "from-rose-500/80 via-pink-400/60 to-purple-300/40";
    if (lower.includes("park") || lower.includes("walk") || lower.includes("hike")) return "from-pink-400/80 via-rose-300/60 to-emerald-200/40";
    return "from-pink-400/80 via-rose-300/60 to-amber-200/40";
  }
  if (lower.includes("coffee") || lower.includes("cafe")) return "from-amber-600/80 via-orange-400/60 to-yellow-200/40";
  if (lower.includes("wine") || lower.includes("bar") || lower.includes("cocktail")) return "from-indigo-500/80 via-purple-400/60 to-pink-300/40";
  if (lower.includes("park") || lower.includes("walk") || lower.includes("hike")) return "from-emerald-500/80 via-green-400/60 to-lime-200/40";
  if (lower.includes("yoga") || lower.includes("workout") || lower.includes("bowling")) return "from-sky-500/80 via-blue-400/60 to-cyan-200/40";
  return "from-primary/60 via-primary/40 to-accent/30";
}

// ─── Match reason generator ──────────────────────────────────────────────

function generateMatchReasons(sharedItems: string[], activity: string): string[] {
  const reasons: string[] = [];
  if (sharedItems.length >= 2) {
    reasons.push(`You both enjoy ${sharedItems[0]} and ${sharedItems[1]}`);
  } else if (sharedItems.length === 1) {
    reasons.push(`You both enjoy ${sharedItems[0]}`);
  }

  const lower = activity.toLowerCase();
  if (lower.includes("coffee") || lower.includes("cafe")) {
    reasons.push("Great for a low-pressure, conversation-first date");
  } else if (lower.includes("bar") || lower.includes("wine")) {
    reasons.push("A relaxed evening spot to connect over drinks");
  } else if (lower.includes("park") || lower.includes("walk") || lower.includes("hike")) {
    reasons.push("You both like getting outdoors — perfect for an active first date");
  } else {
    reasons.push("An activity-based date so you can connect naturally");
  }

  if (sharedItems.length >= 3) {
    reasons.push("Strong overlap in interests and hobbies");
  }

  return reasons.slice(0, 3);
}

// ─── Sub-components ──────────────────────────────────────────────────────

function PartnerHeader({ partner, interests, accent = "blue", onPhotoTap }: { partner: MatchPartnerInfo | null; interests: string[]; accent?: "blue" | "pink"; onPhotoTap?: (url: string) => void }) {
  if (!partner) return null;
  const accentColor = accent === "pink" ? "text-pink-500" : "text-primary";
  const accentBg = accent === "pink" ? "bg-pink-500/10" : "bg-primary/10";

  return (
    <div className="flex items-center gap-4 py-5 px-5 border-b border-border">
      <Avatar className="w-14 h-14 ring-2 ring-offset-2 ring-offset-card ring-primary/20 cursor-pointer" onClick={(e) => { e.stopPropagation(); if (partner.photo_url) onPhotoTap?.(partner.photo_url); }}>
        {partner.photo_url ? (
          <AvatarImage src={partner.photo_url} alt={partner.name} />
        ) : null}
        <AvatarFallback className={`${accentBg} ${accentColor} text-lg font-display`}>
          {partner.name?.charAt(0)?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-foreground">
          {partner.name}{partner.age ? `, ${partner.age}` : ""}
        </p>
        {partner.city && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {partner.city}
          </p>
        )}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {interests.slice(0, 4).map((interest, i) => (
              <span
                key={`${interest}-${i}`}
                className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
              >
                {interest.replace(/[-_]/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VenueHero({ proposal, ActivityIcon, accent = "blue" }: { proposal: DateProposalData; ActivityIcon: React.ElementType; accent?: "blue" | "pink" }) {
  const gradient = getVenueGradient(proposal.activity, accent);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showPhoto = !!proposal.venue_photo_url && !imgError;

  return (
    <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden`}>
      {showPhoto && (
        <img
          src={proposal.venue_photo_url!}
          alt={proposal.venue_name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {(!showPhoto || !imgLoaded) && (
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      )}

      {(!showPhoto || !imgLoaded) && (
        <div className="absolute right-4 bottom-4 opacity-20">
          <ActivityIcon className="w-20 h-20 text-white" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-lg font-semibold text-white drop-shadow-sm">
          {proposal.venue_name}
        </h3>
        <p className="text-xs text-white/80 mt-0.5">{proposal.activity} · {proposal.venue_area}</p>
      </div>
    </div>
  );
}

function formatProposalDate(dayName: string, createdAt: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const created = new Date(createdAt);
  const targetDay = days.indexOf(dayName);
  if (targetDay === -1) return dayName;
  const currentDay = created.getDay();
  let daysUntil = (targetDay - currentDay + 7) % 7;
  if (daysUntil === 0) daysUntil = 7;
  const date = new Date(created);
  date.setDate(date.getDate() + daysUntil);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function VenueDetails({ proposal, accent = "blue" }: { proposal: DateProposalData; accent?: "blue" | "pink" }) {
  const iconColor = accent === "pink" ? "text-pink-500" : "text-primary";

  return (
    <div className="px-5 py-4 space-y-2.5 border-b border-border">
      <div className="flex items-center gap-3">
        <MapPin className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
        <span className="text-sm text-foreground">
          {proposal.venue_area}
          {proposal.venue_address ? ` · ${proposal.venue_address}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <CalendarDays className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
        <span className="text-sm text-foreground">{formatProposalDate(proposal.proposed_day, proposal.created_at)} at {proposal.proposed_time}</span>
      </div>
    </div>
  );
}

function CompatibilitySection({ score, reasons, sharedItems, accent = "blue" }: { score: number; reasons: string[]; sharedItems: string[]; accent?: "blue" | "pink" }) {
  const accentColor = accent === "pink" ? "text-pink-500" : "text-primary";
  const accentBg = accent === "pink" ? "bg-pink-500" : "bg-primary";
  const chipBg = accent === "pink" ? "bg-pink-500/10 text-pink-600" : "bg-primary/10 text-primary";

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${accentBg}/10 flex items-center justify-center`}>
          <Heart className={`w-5 h-5 ${accentColor}`} />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{Math.round(score)}% compatible</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Match score</p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Why you match</p>
          <div className="space-y-1.5">
            {reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className={`w-3.5 h-3.5 ${accentColor} mt-0.5 flex-shrink-0`} />
                <p className="text-xs text-foreground leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sharedItems.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">You both like</p>
          <div className="flex flex-wrap gap-1.5">
            {sharedItems.map((item, i) => (
              <span key={`${item}-${i}`} className={`text-xs ${chipBg} px-3 py-1 rounded-full`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalCard({
  proposal,
  partner,
  partnerInterests,
  sharedItems,
  matchReasons,
  ActivityIcon,
  onAccept,
  onDecline,
  onPhotoTap,
}: {
  proposal: DateProposalData;
  partner: MatchPartnerInfo | null;
  partnerInterests: string[];
  sharedItems: string[];
  matchReasons: string[];
  ActivityIcon: React.ElementType;
  onAccept: () => void;
  onDecline: () => void;
  onPhotoTap?: (url: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key="proposal"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto px-6"
    >
      <div className="text-center mb-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1.5">
          A plan for you
        </p>
        <h2 className="font-display text-2xl font-light text-foreground italic">
          We found a match
        </h2>
        <div className="mt-2">
          <ProposalExpiryTimer createdAt={proposal.created_at} />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-angelic overflow-hidden">
        <PartnerHeader partner={partner} interests={partnerInterests} accent="blue" onPhotoTap={onPhotoTap} />
        <VenueHero proposal={proposal} ActivityIcon={ActivityIcon} accent="blue" />
        <VenueDetails proposal={proposal} accent="blue" />

        <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <CompatibilitySection
            score={proposal.compatibility_score}
            reasons={matchReasons}
            sharedItems={sharedItems}
            accent="blue"
          />
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-border text-muted-foreground hover:bg-secondary transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Pass
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium shadow-angelic-sm"
          >
            <Check className="w-4 h-4" />
            I'm in
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DebugPanel({
  state,
  proposal,
  partner,
  enrichmentTriggered,
  previewScenario,
}: {
  state: WaitingState;
  proposal: DateProposalData | null;
  partner: MatchPartnerInfo | null;
  enrichmentTriggered: boolean;
  previewScenario?: PreviewScenario | null;
}) {
  const venueFinalized = proposal ? isVenueReady(proposal) : false;

  return (
    <details className="fixed bottom-2 right-2 z-[60] max-w-[280px] rounded-lg border border-border bg-background/95 text-[10px] shadow-lg backdrop-blur-sm">
      <summary className="cursor-pointer px-2 py-1 font-mono text-muted-foreground">🔍 Debug</summary>
      <div className="max-h-[40vh] space-y-0.5 overflow-y-auto px-2 py-1 font-mono leading-tight">
        <div><span className="text-foreground">State:</span> {state}</div>
        <div><span className="text-foreground">Proposal ID:</span> {proposal?.id || "none"}</div>
        <div><span className="text-foreground">Venue Finalized:</span> {venueFinalized ? "✅" : "❌"}</div>
        <div><span className="text-foreground">Proposal Status:</span> {proposal?.status || "—"}</div>
        <div><span className="text-foreground">Venue:</span> {proposal?.venue_name || "—"}</div>
        <div><span className="text-foreground">Photo:</span> {proposal?.venue_photo_url ? "✅" : "❌"}</div>
        <div><span className="text-foreground">Place ID:</span> {proposal?.venue_place_id ? "✅" : "❌"}</div>
        <div><span className="text-foreground">Enrichment:</span> {enrichmentTriggered ? "✅ triggered" : "❌ not needed"}</div>

        {partner && (
          <>
            <div className="border-t border-border mt-1 pt-1">
              <span className="text-foreground">Partner:</span> {partner.name}
            </div>
            <div><span className="text-foreground">Interests ({partner.interests.length}):</span></div>
            <div className="text-muted-foreground pl-1">
              {[...new Set(partner.interests)].join(", ") || "none"}
            </div>
          </>
        )}

        {previewScenario && (
          <>
            <div className="border-t border-border mt-1 pt-1">
              <span className="text-foreground">Reserve:</span> {previewScenario.reserveCount ?? 0} held | next: {previewScenario.hasNextProposal ? "✅" : "❌"} | {previewScenario.nextProposalBehavior ?? "none"}
            </div>
            <div><span className="text-foreground">PostDate:</span> {previewScenario.postDateState ?? "none"}</div>
          </>
        )}
      </div>
    </details>
  );
}

export default Waiting;
