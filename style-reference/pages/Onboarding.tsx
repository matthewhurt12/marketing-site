import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAura } from "@/context/AuraContext";
import { useAuth } from "@/context/AuthContext";
import { useDbUser } from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, MapPin, Loader2, ArrowUp } from "lucide-react";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BirthdayWheelPicker from "@/components/BirthdayWheelPicker";
import DualRangeSlider from "@/components/DualRangeSlider";
import {
  createInitialState,
  getQuestion,
  processAnswer,
  getStructuredOptions,
  getPhaseInputType,
  OnboardingState,
  ConfidenceScores,
  getOverallConfidence,
  getUncertainAreas,
  getZodiacSign,
  calculateAge,
  AIInterviewQuestion,
  UnderstandingMeta,
} from "@/lib/onboarding-engine";

interface Message {
  id: number;
  from: "ai" | "user";
  text: string;
}

type UiInputMode = "text" | "multiple_choice" | "slider" | "date_picker" | "structured_selector";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_BLOCKS = [
  { label: "Morning", key: "morning", start: "9:00 AM", end: "12:00 PM" },
  { label: "Afternoon", key: "afternoon", start: "12:00 PM", end: "3:00 PM" },
  { label: "Evening", key: "evening", start: "6:00 PM", end: "9:00 PM" },
  { label: "Night", key: "night", start: "9:00 PM", end: "11:00 PM" },
];

const DISTANCE_OPTIONS = [5, 10, 15, 25, 50];

function isSimilarQuestion(a: string, b: string, threshold = 0.6): boolean {
  const wordsA = new Set(a.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union > 0 && intersection / union > threshold;
}

const getUiInputMode = (
  phaseInputType: ReturnType<typeof getPhaseInputType>,
  structuredOptions: string[] | null,
  tapOptions: string[] | null,
): UiInputMode => {
  if ((structuredOptions && structuredOptions.length > 0) || (tapOptions && tapOptions.length > 0)) {
    return "multiple_choice";
  }

  switch (phaseInputType) {
    case "free_text":
      return "text";
    case "birthday_picker":
      return "date_picker";
    case "age_range_picker":
      return "slider";
    default:
      return "structured_selector";
  }
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, setProfile, aiProfile, setAIProfile } = useAura();
  const { user } = useAuth();
  const { dbUser } = useDbUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [engineState, setEngineState] = useState<OnboardingState>(createInitialState);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isQuestionPending, setIsQuestionPending] = useState(true);
  const [pendingStepId, setPendingStepId] = useState<string | null>(null);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const profileRef = useRef(profile);
  const aiProfileRef = useRef(aiProfile);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string[]>([]);
  const answersRef = useRef<Array<{ question_text: string; answer_text: string; question_key: string }>>([]);
  const initializedRef = useRef(false);
  const composerMountCountRef = useRef(0);
  const lastFocusedStepRef = useRef<string | null>(null);
  profileRef.current = profile;
  aiProfileRef.current = aiProfile;

  // Structured input state
  const [selectedBirthday, setSelectedBirthday] = useState<Date | undefined>(undefined);
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const [locationResult, setLocationResult] = useState<{ city: string; lat: number; lng: number } | null>(null);
  const [selectedDistance, setSelectedDistance] = useState(25);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [availabilityStep, setAvailabilityStep] = useState<"days" | "times">("days");
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<Record<string, string[]>>({});
  const [ageRangeMin, setAgeRangeMin] = useState(22);
  const [ageRangeMax, setAgeRangeMax] = useState(35);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameConfirmation, setNameConfirmation] = useState<string | null>(null);

  // AI interview tap options
  const [currentTapOptions, setCurrentTapOptions] = useState<string[] | null>(null);

  // Correction tracking for AI state
  const [correctedInterests, setCorrectedInterests] = useState<string[]>([]);
  const [inferredInterests, setInferredInterests] = useState<string[]>([]);
  const [lastAnswerInterpretation, setLastAnswerInterpretation] = useState<string>("");
  const [nextQuestionGoal, setNextQuestionGoal] = useState<string>("");
  const [nextQuestionReason, setNextQuestionReason] = useState<string>("");
  const [lastAnswerResolved, setLastAnswerResolved] = useState<boolean | null>(null);
  const correctedInterestsRef = useRef<string[]>([]);
  const inferredInterestsRef = useRef<string[]>([]);
  correctedInterestsRef.current = correctedInterests;
  inferredInterestsRef.current = inferredInterests;

  // Question history for deduplication + saturation tracking
  const questionHistoryRef = useRef<Array<{
    question_text: string;
    question_key: string;
    target_dimension: string;
    had_tap_options: boolean;
    was_clarification: boolean;
  }>>([]);

  // Track which AI question's tap options are currently displayed
  const [tapOptionsQuestionKey, setTapOptionsQuestionKey] = useState<string | null>(null);

  const structuredOptions = getStructuredOptions(engineState.phase);
  const inputType = getPhaseInputType(engineState.phase);
  const activeStepId = engineState.phase === "ai_interview"
    ? engineState.currentAiQuestion?.question_key || `ai_${engineState.aiQuestionCount}`
    : engineState.phase;
  const activeInputMode = getUiInputMode(inputType, structuredOptions, currentTapOptions);

  const logDev = useCallback((event: string, details: Record<string, unknown> = {}) => {
    if (!import.meta.env.DEV) return;
    console.debug("[onboarding]", event, details);
  }, []);

  const resizeComposer = useCallback(() => {
    const composer = composerRef.current;
    if (!composer) return;
    composer.style.height = "auto";
    composer.style.height = `${Math.min(composer.scrollHeight, 120)}px`;
  }, []);

  const detectAutofillState = useCallback(() => {
    const composer = composerRef.current;
    if (!composer) return false;

    for (const selector of [":autofill", ":-webkit-autofill"]) {
      try {
        if (composer.matches(selector)) return true;
      } catch {
        continue;
      }
    }

    return false;
  }, []);

  const logAutofillState = useCallback((source: string, nativeInputType?: string | null) => {
    if (engineState.phase !== "name") return;

    logDev("autofill-check", {
      source,
      activeStepId,
      nativeInputType: nativeInputType || null,
      autoComplete: composerRef.current?.autocomplete || null,
      inputMode: composerRef.current?.inputMode || null,
      fieldName: composerRef.current?.getAttribute("name") || null,
      focused: composerRef.current === document.activeElement,
      autofillDetected: detectAutofillState(),
    });
  }, [activeStepId, detectAutofillState, engineState.phase, logDev]);

  /**
   * Sanitize a display label: strip non-Latin scripts (CJK, etc.),
   * collapse whitespace, and trim.
   */
  const sanitizeLabel = useCallback((label: string): string => {
    const cleaned = label
      .replace(/[^\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u2100-\u214F\s.,!?;:'"()\-–—/&@#%*+=$]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return cleaned || label.trim();
  }, []);

  // Progress ring
  const overallConfidence = getOverallConfidence(engineState.confidence);
  const progressPercent = engineState.phase === "ai_interview"
    ? Math.min(100, Math.round(40 + overallConfidence * 60))
    : Math.round((( ["name", "birthday", "gender", "dating_pref", "age_range", "location", "max_distance", "availability", "core_q1", "core_q2", "core_q3", "core_q4", "relationship_intent"].indexOf(engineState.phase) + 1) / 14) * 40);

  // Create onboarding session on mount
  useEffect(() => {
    if (!dbUser) return;
    const createSession = async () => {
      const { data } = await supabase
        .from("onboarding_sessions")
        .insert({ user_id: dbUser.id, mode: "adaptive", status: "in_progress" })
        .select("id")
        .single();
      if (data) setSessionId(data.id);
    };
    createSession();
  }, [dbUser]);

  // ─── STT ────────────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setInputValue(transcript);
      requestAnimationFrame(resizeComposer);
      if (event.results[0]?.isFinal) setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [resizeComposer]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const firstQ = getQuestion(createInitialState());
    setMessages([{ id: 0, from: "ai", text: firstQ }]);
    setShowInput(true);
    setIsQuestionPending(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // ─── Persist answer to DB ──────────────────────────────────────────────────
  const persistAnswer = useCallback(async (questionKey: string, questionText: string, answer: string, answerType: string) => {
    if (!sessionId) return;
    await supabase.from("onboarding_answers").insert({
      session_id: sessionId,
      question_key: questionKey,
      question_text: questionText,
      answer_text: answer,
      answer_type: answerType,
    });
    transcriptRef.current.push(`Q: ${questionText}\nA: ${answer}`);
    answersRef.current.push({ question_text: questionText, answer_text: answer, question_key: questionKey });
  }, [sessionId]);

  // ─── Persist profile to DB ────────────────────────────────────────────────
  const persistProfile = useCallback(async (updates: Record<string, any>) => {
    if (!dbUser) return;
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.gender !== undefined) dbUpdates.gender_identity = updates.gender;
    if (updates.datingPreferences?.genderPreference !== undefined) {
      dbUpdates.dating_preference = updates.datingPreferences.genderPreference;
    }
    if (updates.maxDistance !== undefined) {
      dbUpdates.max_distance_miles = updates.maxDistance;
    }
    if (updates.location !== undefined) {
      dbUpdates.location_city = updates.location;
    }
    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from("users").update(dbUpdates).eq("id", dbUser.id);
    }
  }, [dbUser]);

  // ─── Location helpers ─────────────────────────────────────────────────────
  const requestGeolocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown";
        setLocationResult({ city, lat: latitude, lng: longitude });
      } catch {
        setLocationResult({ city: "Unknown", lat: latitude, lng: longitude });
      }
    } catch {
      setLocationResult(null);
    }
    setLocationLoading(false);
  }, []);

  // ─── Fetch adaptive AI question ──────────────────────────────────────────
  const fetchAdaptiveQuestion = useCallback(async (confidence: ConfidenceScores, qCount: number, saturatedDimensions?: string[]): Promise<{
    question: AIInterviewQuestion;
    confidence: ConfidenceScores;
    shouldContinue: boolean;
    progressLabel: string;
    understandingMeta: UnderstandingMeta;
  } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("adaptive-onboarding", {
        body: {
          answers: answersRef.current,
          activities: profileRef.current.preferredActivities || [],
          questionCount: qCount,
          currentConfidence: confidence,
          correctedInterests: correctedInterestsRef.current,
          currentInferredInterests: inferredInterestsRef.current,
          questionHistory: questionHistoryRef.current,
          saturatedDimensions: saturatedDimensions || [],
        },
      });

      if (error) {
        console.error("Adaptive onboarding error:", error);
        return null;
      }

      if (data?.question_text) {
        setNextQuestionGoal(data.target_dimension || "");
        setNextQuestionReason(data.next_question_reason || "");
        setLastAnswerResolved(data.last_answer_resolved ?? null);

        const hadTapOptions = Array.isArray(data.tap_options) && data.tap_options.length > 0;

        questionHistoryRef.current = [
          ...questionHistoryRef.current,
          {
            question_text: data.question_text,
            question_key: data.question_key,
            target_dimension: data.target_dimension,
            had_tap_options: hadTapOptions,
            was_clarification: data.last_answer_resolved === false,
          },
        ];

        return {
          question: {
            question_text: data.question_text,
            question_key: data.question_key,
            target_dimension: data.target_dimension,
            tap_options: hadTapOptions ? data.tap_options.map(sanitizeLabel) : undefined,
            progress_label: data.progress_label,
          },
          confidence: data.updated_confidence || confidence,
          shouldContinue: data.should_continue !== false,
          progressLabel: data.progress_label || "Learning about you",
          understandingMeta: {
            understanding_score: data.understanding_score ?? 0,
            dimension_confidence: data.updated_confidence || confidence,
            unresolved_dimensions: data.unresolved_dimensions || [],
            inconsistency_score: data.inconsistency_score ?? 0,
            inconsistency_flags: data.inconsistency_description ? [data.inconsistency_description] : [],
          },
        };
      }
      return null;
    } catch (e) {
      console.error("Failed to fetch adaptive question:", e);
      return null;
    }
  }, [sanitizeLabel]);

  // ─── Show next question helper ────────────────────────────────────────────
  const resetStepUi = useCallback(() => {
    setSelectedBirthday(undefined);
    setLocationResult(null);
    setManualCity("");
    setLocationLoading(false);
    setSelectedDistance(25);
    setSelectedDays([]);
    setAvailabilityStep("days");
    setSelectedTimeBlocks({});
    setCurrentTapOptions(null);
    setTapOptionsQuestionKey(null);
  }, []);

  const revealNextQuestion = useCallback((
    nextState: OnboardingState,
    nextQuestion: string,
    options?: { tapOptions?: string[] | null; tapQuestionKey?: string | null },
  ) => {
    resetStepUi();
    setEngineState(nextState);
    setCurrentTapOptions(options?.tapOptions || null);
    setTapOptionsQuestionKey(options?.tapQuestionKey || null);
    setMessages((prev) => [...prev, { id: Date.now() + 1, from: "ai", text: nextQuestion }]);
    setPendingStepId(null);
    setIsQuestionPending(false);
    setShowInput(true);
  }, [resetStepUi]);

  // ─── Send answer ────────────────────────────────────────────────────────────
  const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  const NAME_EXTRACT_PATTERNS = [
    /(?:my name is|i'm|im|i am|call me|it's|its|hey i'm|hey im)\s+([A-Za-zÀ-ÖØ-öø-ÿ' -]+)/i,
  ];

  const validateName = useCallback((raw: string): { valid: boolean; cleaned?: string; extractedName?: string; error?: string } => {
    const trimmed = raw.trim();
    if (trimmed.length < 2) return { valid: false, error: "Just enter your name (first or first + last)." };
    if (trimmed.length > 40) return { valid: false, error: "That seems a bit long — just your name is fine." };

    const words = trimmed.split(/\s+/);
    if (words.length > 3 || !NAME_REGEX.test(trimmed)) {
      for (const pattern of NAME_EXTRACT_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) {
          const extracted = match[1].trim().split(/\s+/).slice(0, 3).join(" ");
          if (NAME_REGEX.test(extracted) && extracted.length >= 2 && extracted.length <= 40) {
            return { valid: false, extractedName: extracted };
          }
        }
      }
      return { valid: false, error: "Just enter your name (first or first + last)." };
    }

    const cleaned = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    return { valid: true, cleaned };
  }, []);

  const handleSend = useCallback(async (overrideAnswer?: string) => {
    let answer = (overrideAnswer || inputValue).trim();
    if (!answer) return;

    if (engineState.phase === "name" && !nameConfirmation) {
      const result = validateName(answer);
      if (result.extractedName) {
        setNameConfirmation(result.extractedName);
        setNameError(null);
        return;
      }
      if (!result.valid) {
        setNameError(result.error || "Just enter your name (first or first + last).");
        return;
      }
      answer = result.cleaned || answer;
    }

    const composerWasFocused = composerRef.current === document.activeElement;

    setInputValue("");
    requestAnimationFrame(resizeComposer);
    setNameError(null);
    setNameConfirmation(null);
    stopListening();
    setCurrentTapOptions(null);
    setTapOptionsQuestionKey(null);
    setShowInput(false);

    if (composerWasFocused) {
      composerRef.current?.blur();
      logDev("keyboard-behavior", {
        action: "blur",
        activeStepId,
        reason: "submitted-answer",
      });
    }

    if (engineState.phase === "ai_interview") {
      const lowerAnswer = answer.toLowerCase();
      const negationPatterns = [
        /(?:not|don't|dont|never|hate|dislike|am not|i'm not|im not)\s+(?:into|interested in|a fan of|about|really into)\s+(.+)/i,
        /(?:actually|no),?\s+(?:i(?:'m| am))?\s*(?:more into|prefer|like)\s+(.+)/i,
      ];

      for (const pattern of negationPatterns) {
        const match = lowerAnswer.match(pattern);
        if (match) {
          const rejected = match[1].split(/,?\s+(?:and|or)\s+/).map((s) => s.trim().replace(/[.!?]+$/, ""));
          setCorrectedInterests((prev) => [...new Set([...prev, ...rejected])]);
          setInferredInterests((prev) => prev.filter((i) => !rejected.some((r) => i.toLowerCase().includes(r))));
        }
      }

      setLastAnswerInterpretation(answer.substring(0, 100));
    }

    const currentPhase = engineState.phase;
    const currentQuestion = getQuestion(engineState);

    let displayText = answer;
    if (currentPhase === "birthday") {
      try {
        displayText = format(new Date(answer), "MMMM d, yyyy");
      } catch {
        displayText = answer;
      }
    } else if (currentPhase === "location") {
      try {
        displayText = JSON.parse(answer).city;
      } catch {
        displayText = answer;
      }
    } else if (currentPhase === "max_distance") {
      displayText = `${answer} miles`;
    } else if (currentPhase === "age_range") {
      const [min, max] = answer.split("-");
      displayText = `${min} – ${max}`;
    } else if (currentPhase === "availability") {
      try {
        JSON.parse(answer);
        displayText = `##AVAIL##${answer}`;
      } catch {
        displayText = answer;
      }
    }

    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text: displayText }]);

    const { nextState, profileUpdates, aiProfileUpdates, needsAiQuestion } = processAnswer(
      engineState,
      answer,
      profileRef.current,
      aiProfileRef.current,
    );

    setProfile((p) => ({ ...p, ...profileUpdates }));
    setAIProfile((p) => ({ ...p, ...aiProfileUpdates }));

    if (currentPhase === "birthday" && dbUser) {
      try {
        const birthdate = new Date(answer);
        await supabase.from("users").update({
          birthdate: answer,
          age: calculateAge(birthdate),
          zodiac_sign: getZodiacSign(birthdate),
        }).eq("id", dbUser.id);
      } catch {
        // ignore
      }
    }

    if (currentPhase === "age_range" && dbUser) {
      const [min, max] = answer.split("-").map(Number);
      await supabase.from("users").update({ preferred_age_min: min || 22, preferred_age_max: max || 40 }).eq("id", dbUser.id);
    }

    if (currentPhase === "relationship_intent" && dbUser) {
      await supabase.from("users").update({ relationship_intent: answer.trim() }).eq("id", dbUser.id);
    }

    if (currentPhase === "location" && dbUser) {
      try {
        const loc = JSON.parse(answer);
        if (loc.lat && loc.lng) {
          await supabase.from("users").update({ location_lat: loc.lat, location_lng: loc.lng, location_city: loc.city }).eq("id", dbUser.id);
        } else if (loc.city) {
          // Manual city entry — forward-geocode to get real lat/lng
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc.city)}&format=json&limit=1`,
              { headers: { "Accept-Language": "en" } }
            );
            const geoData = await geoRes.json();
            if (geoData?.[0]?.lat && geoData?.[0]?.lon) {
              const geoLat = parseFloat(geoData[0].lat);
              const geoLng = parseFloat(geoData[0].lon);
              console.log("[onboarding] geocoded city:", loc.city, "→", geoLat, geoLng);
              await supabase.from("users").update({ location_lat: geoLat, location_lng: geoLng, location_city: loc.city }).eq("id", dbUser.id);
            } else {
              console.warn("[onboarding] geocode returned no results for:", loc.city);
              await supabase.from("users").update({ location_city: loc.city }).eq("id", dbUser.id);
            }
          } catch (geoErr) {
            console.warn("[onboarding] geocode failed:", geoErr);
            await supabase.from("users").update({ location_city: loc.city }).eq("id", dbUser.id);
          }
        }
      } catch {
        // not JSON — ignore
      }
    }

    if (currentPhase === "availability" && dbUser) {
      try {
        const avail = JSON.parse(answer);
        const slots: { user_id: string; day_of_week: string; start_time: string; end_time: string }[] = [];
        for (const [day, blockKeys] of Object.entries(avail)) {
          for (const blockKey of blockKeys as string[]) {
            const block = TIME_BLOCKS.find((b) => b.key === blockKey);
            if (block) {
              slots.push({ user_id: dbUser.id, day_of_week: day, start_time: block.start, end_time: block.end });
            }
          }
        }
        if (slots.length > 0) {
          await supabase.from("user_availability").delete().eq("user_id", dbUser.id);
          await supabase.from("user_availability").insert(slots);
        }
      } catch {
        // ignore
      }
    }

    const answerType = structuredOptions ? "structured" : inputType !== "free_text" ? "structured" : "free_text";
    const questionKey = currentPhase === "ai_interview"
      ? `ai_${engineState.currentAiQuestion?.question_key || engineState.aiQuestionCount}`
      : currentPhase;

    persistAnswer(questionKey, currentQuestion, answer, answerType);
    if (!["location", "availability", "birthday", "age_range"].includes(currentPhase)) {
      persistProfile(profileUpdates);
    }

    if (nextState.phase === "done") {
      setPendingStepId(null);
      setIsQuestionPending(false);
      setEngineState(nextState);

      if (sessionId) {
        supabase.from("onboarding_sessions").update({
          status: "completed",
          completed_at: new Date().toISOString(),
          raw_transcript: transcriptRef.current.join("\n\n"),
        }).eq("id", sessionId);
      }

      if (dbUser) {
        supabase.from("users").update({ uncertainty_areas: getUncertainAreas(nextState.confidence) }).eq("id", dbUser.id);
      }

      setTimeout(() => navigate("/activities"), 800);
      return;
    }

    if (needsAiQuestion) {
      const nextAiStepId = `ai_${nextState.aiQuestionCount}`;
      setPendingStepId(nextAiStepId);
      setIsQuestionPending(true);
      setIsLoadingAi(true);
      logDev("question-pending", { currentStepId: activeStepId, pendingStepId: nextAiStepId, payloadState: "provisional" });

      // Compute saturated dimensions from recent history
      const recent6 = questionHistoryRef.current.slice(-6);
      const dimClarCount: Record<string, number> = {};
      const dimTotalCount: Record<string, number> = {};
      for (const q of recent6) {
        if (!q.target_dimension) continue;
        dimTotalCount[q.target_dimension] = (dimTotalCount[q.target_dimension] || 0) + 1;
        if (q.was_clarification) {
          dimClarCount[q.target_dimension] = (dimClarCount[q.target_dimension] || 0) + 1;
        }
      }
      const saturatedDimensions = Object.keys(dimTotalCount)
        .filter(d => (dimClarCount[d] || 0) >= 2 || dimTotalCount[d] >= 3);

      let result = await fetchAdaptiveQuestion(nextState.confidence, nextState.aiQuestionCount, saturatedDimensions);

      // Duplicate / saturation detection: retry at most once
      if (result && result.shouldContinue) {
        const recentQuestions = questionHistoryRef.current.slice(-6, -1);
        const isDuplicate = recentQuestions.some(q => isSimilarQuestion(q.question_text, result!.question.question_text));
        const targetsSaturated = saturatedDimensions.includes(result.question.target_dimension || "");
        if (isDuplicate || (targetsSaturated && isDuplicate)) {
          logDev("duplicate-or-saturated-question-detected", { question: result.question.question_text, targetsSaturated });
          questionHistoryRef.current = questionHistoryRef.current.slice(0, -1);
          const retryResult = await fetchAdaptiveQuestion(nextState.confidence, nextState.aiQuestionCount + 1, saturatedDimensions);
          if (retryResult) result = retryResult;
        }
      }

      if (result) {
        const { question, confidence: newConfidence, shouldContinue, progressLabel, understandingMeta } = result;

        if (!shouldContinue) {
          const doneState: OnboardingState = {
            ...nextState,
            phase: "done",
            confidence: newConfidence,
            progressLabel,
            understandingMeta,
          };

          setPendingStepId(null);
          setIsQuestionPending(false);
          setEngineState(doneState);
          setIsLoadingAi(false);

          if (dbUser) {
            supabase.from("users").update({ uncertainty_areas: getUncertainAreas(newConfidence) }).eq("id", dbUser.id);
          }

          if (sessionId) {
            supabase.from("onboarding_sessions").update({
              status: "completed",
              completed_at: new Date().toISOString(),
              raw_transcript: transcriptRef.current.join("\n\n"),
              structured_summary_json: JSON.parse(JSON.stringify(understandingMeta)),
            }).eq("id", sessionId);
          }

          setTimeout(() => navigate("/activities"), 800);
          return;
        }

        revealNextQuestion(
          {
            ...nextState,
            phase: "ai_interview",
            confidence: newConfidence,
            currentAiQuestion: question,
            progressLabel,
            understandingMeta,
          },
          question.question_text,
          { tapOptions: question.tap_options || null, tapQuestionKey: question.question_key },
        );
        setIsLoadingAi(false);
        return;
      }

      setPendingStepId(null);
      setIsQuestionPending(false);
      setEngineState({ ...nextState, phase: "done" });
      setIsLoadingAi(false);
      if (sessionId) {
        supabase.from("onboarding_sessions").update({
          status: "completed",
          completed_at: new Date().toISOString(),
          raw_transcript: transcriptRef.current.join("\n\n"),
        }).eq("id", sessionId);
      }
      setTimeout(() => navigate("/activities"), 800);
      return;
    }

    revealNextQuestion(nextState, getQuestion(nextState));
  }, [activeStepId, dbUser, engineState, fetchAdaptiveQuestion, inputType, inputValue, logDev, nameConfirmation, navigate, persistAnswer, persistProfile, resizeComposer, revealNextQuestion, sessionId, setAIProfile, setProfile, stopListening, structuredOptions, validateName]);

  // ─── Availability helpers ─────────────────────────────────────────────────
  const toggleDay = (day: string) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const toggleTimeBlock = (day: string, blockKey: string) => {
    setSelectedTimeBlocks((prev) => {
      const current = prev[day] || [];
      const updated = current.includes(blockKey) ? current.filter((k) => k !== blockKey) : [...current, blockKey];
      return { ...prev, [day]: updated };
    });
  };

  const submitAvailability = () => {
    const result: Record<string, string[]> = {};
    for (const day of selectedDays) {
      const blocks = selectedTimeBlocks[day] || [];
      if (blocks.length > 0) result[day] = blocks;
    }
    if (Object.keys(result).length === 0) return;
    handleSend(JSON.stringify(result));
  };

  const hasAnyTimeBlocks = selectedDays.some((d) => (selectedTimeBlocks[d] || []).length > 0);
  const showComposer = showInput && activeInputMode === "text" && !isQuestionPending;
  const getComposerAttrs = (phase: string) => {
    if (phase === "name") {
      return {
        name: "obd-name",
        autoComplete: "new-password",
        autoCapitalize: "words" as const,
        autoCorrect: "off",
        spellCheck: false,
        enterKeyHint: "next" as const,
        inputMode: "text" as const,
        placeholder: "Your first name",
      };
    }
    if (phase === "location") {
      return {
        name: "obd-city",
        autoComplete: "new-password",
        autoCapitalize: "words" as const,
        autoCorrect: "off",
        spellCheck: false,
        enterKeyHint: "done" as const,
        inputMode: "text" as const,
        placeholder: "Type your response...",
      };
    }
    return {
      name: "obd-response",
      autoComplete: "new-password",
      autoCapitalize: "sentences" as const,
      autoCorrect: "on",
      spellCheck: true,
      enterKeyHint: "send" as const,
      inputMode: "text" as const,
      placeholder: "Type your response...",
    };
  };
  const composerAttrs = getComposerAttrs(engineState.phase);

  useEffect(() => {
    composerMountCountRef.current += 1;
    logDev("composer-mounted", { mountCount: composerMountCountRef.current });
  }, [logDev]);

  useEffect(() => {
    const attrs = getComposerAttrs(engineState.phase);
    logDev("active-step-change", {
      activeStepId,
      activeInputMode,
      payloadState: isQuestionPending ? "provisional" : "final",
      pendingStepId,
      composerAttrs: { name: attrs.name, autoComplete: attrs.autoComplete, inputMode: attrs.inputMode, autoCapitalize: attrs.autoCapitalize },
    });
  }, [activeInputMode, activeStepId, isQuestionPending, logDev, pendingStepId]);

  useEffect(() => {
    logDev("composer-focus", { activeStepId, focused: isComposerFocused });
  }, [activeStepId, isComposerFocused, logDev]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport || !import.meta.env.DEV) return;
    const handleResize = () => {
      logDev("visual-viewport-resize", {
        activeStepId,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        offsetTop: Math.round(viewport.offsetTop),
      });
    };
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, [activeStepId, logDev]);

  useEffect(() => {
    requestAnimationFrame(resizeComposer);
  }, [activeStepId, inputValue, resizeComposer, showComposer]);

  useEffect(() => {
    if (!showComposer) {
      if (composerRef.current === document.activeElement) {
        composerRef.current?.blur();
        logDev("keyboard-behavior", { action: "blur", activeStepId, reason: "text-composer-hidden" });
      }
      return;
    }

    if (lastFocusedStepRef.current === activeStepId) return;
    lastFocusedStepRef.current = activeStepId;
    requestAnimationFrame(() => {
      composerRef.current?.focus({ preventScroll: true });
      logDev("keyboard-behavior", { action: "focus", activeStepId, reason: "new-text-step" });
    });
  }, [activeStepId, logDev, showComposer]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const frame = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
      logDev("scroll-to-active", {
        activeStepId,
        reason: isLoadingAi ? "loading-state" : "content-update",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeStepId, availabilityStep, isLoadingAi, logDev, messages.length, showInput]);

  // ─── Progress Ring Component ─────────────────────────────────────────────
  const ProgressRing = ({ percent, label }: { percent: number; label: string }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <div className="flex items-center gap-3">
        <svg width="44" height="44" className="-rotate-90">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex h-dvh flex-col bg-background">
      <div className="flex-none flex items-center justify-center px-6 pt-[max(3.5rem,env(safe-area-inset-top,0px)_+_1rem)] pb-4">
        <ProgressRing
          percent={progressPercent}
          label={engineState.phase === "ai_interview" ? engineState.progressLabel : "Building your profile"}
        />
      </div>

      <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-6">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5 pt-2 pb-6">
          {messages.map((msg, idx) => {
            const isRecent = idx >= messages.length - 2;
            return (
              <div
                key={msg.id}
                className={cn(
                  msg.from === "ai" ? "text-left" : "text-right",
                  isRecent && "animate-[obd-fade-in_0.3s_ease-out_both]",
                )}
              >
                {msg.from === "ai" ? (
                  <p className="text-lg font-normal leading-relaxed text-foreground whitespace-pre-line">{msg.text}</p>
                ) : (
                  msg.text.startsWith("##AVAIL##") ? (
                    <div className="inline-block max-w-full rounded-2xl rounded-br-sm bg-secondary px-4 py-3">
                      {(() => {
                        try {
                          const data = JSON.parse(msg.text.slice(9));
                          const allBlocks = ['morning', 'afternoon', 'evening', 'night'];
                          const days = Object.keys(data);
                          return (
                            <div className="grid gap-y-1.5" style={{ gridTemplateColumns: '42px repeat(4, 1fr)' }}>
                              {days.map(day => (
                                <div key={day} className="contents">
                                  <span className="text-[11px] font-semibold text-foreground/70 self-center">{day.slice(0, 3)}</span>
                                  {allBlocks.map(block => (
                                    <div key={`${day}-${block}`} className="px-0.5 flex justify-center">
                                      {(data[day] as string[])?.includes(block) ? (
                                        <span className={cn(
                                          "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                                          block === 'morning' && "bg-amber-500/10 text-amber-700/80 dark:text-amber-300/80",
                                          block === 'afternoon' && "bg-orange-500/10 text-orange-700/80 dark:text-orange-300/80",
                                          block === 'evening' && "bg-indigo-500/10 text-indigo-700/80 dark:text-indigo-300/80",
                                          block === 'night' && "bg-violet-500/10 text-violet-700/80 dark:text-violet-300/80",
                                        )}>{block}</span>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        } catch { return <span className="text-sm text-secondary-foreground">{msg.text}</span>; }
                      })()}
                    </div>
                  ) : (
                    <p className="inline-block max-w-full break-words rounded-2xl rounded-br-sm bg-secondary px-5 py-3 text-sm text-secondary-foreground whitespace-pre-line">{msg.text}</p>
                  )
                )}
              </div>
            );
          })}

          {isLoadingAi && (
            <div className="flex items-center gap-2 py-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {showInput && structuredOptions && (
            <div className="flex flex-wrap gap-2.5 pt-3 animate-[obd-fade-in_0.3s_ease-out_both]">
              {structuredOptions.map((option, i) => (
                <button
                  key={option}
                  onClick={() => handleSend(option)}
                  className="rounded-full border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground aura-transition animate-[obd-fade-in_0.25s_ease-out_both]"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showInput && currentTapOptions && engineState.phase === "ai_interview" && (
            <div className="flex flex-wrap gap-2.5 pt-3 animate-[obd-fade-in_0.3s_ease-out_both]">
              {currentTapOptions.map((option, i) => {
                const label = sanitizeLabel(option);
                return (
                  <button
                    key={`${tapOptionsQuestionKey}-${option}`}
                    onClick={() => handleSend(label)}
                    className="rounded-full border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground aura-transition animate-[obd-fade-in_0.25s_ease-out_both]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {showInput && inputType === "birthday_picker" && !structuredOptions && (
            <div className="pt-4 animate-[obd-fade-in_0.3s_ease-out_both]">
              <BirthdayWheelPicker onSelect={setSelectedBirthday} onConfirm={(dateStr) => handleSend(dateStr)} />
            </div>
          )}

          {showInput && inputType === "age_range_picker" && !structuredOptions && (
            <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-8 pt-4 animate-[obd-fade-in_0.3s_ease-out_both]">
              <p className="text-2xl font-light tracking-wide text-foreground">
                {ageRangeMin} <span className="mx-1 text-muted-foreground">—</span> {ageRangeMax}
              </p>
              <div className="w-full px-2">
                <DualRangeSlider min={18} max={70} valueMin={ageRangeMin} valueMax={ageRangeMax} onChange={(min, max) => {
                  setAgeRangeMin(min);
                  setAgeRangeMax(max);
                }} />
              </div>
              <button onClick={() => handleSend(`${ageRangeMin}-${ageRangeMax}`)} className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal">
                Continue
              </button>
            </div>
          )}

          {showInput && inputType === "location_picker" && !structuredOptions && (
            <div className="flex flex-col items-center gap-4 pt-4 animate-[obd-fade-in_0.3s_ease-out_both]">
              {!locationResult && !locationLoading && (
                <>
                  <button onClick={requestGeolocation} className="flex w-full max-w-xs items-center gap-3 rounded-2xl border border-primary/30 bg-secondary px-6 py-4 hover:border-primary/50 aura-transition">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Use my location</span>
                  </button>
                  <div className="flex w-full max-w-xs items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="w-full max-w-xs">
                    <input
                      value={manualCity}
                      name="obd-city"
                      autoComplete="new-password"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="done"
                      data-form-type="other"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      onChange={(e) => setManualCity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && manualCity.trim()) {
                          handleSend(JSON.stringify({ city: manualCity.trim(), lat: null, lng: null }));
                        }
                      }}
                      className="w-full border-b border-primary/30 bg-transparent py-3 text-sm focus:border-primary focus:outline-none aura-transition placeholder:text-muted-foreground/40"
                      placeholder="Type your city…"
                    />
                  </div>
                  {manualCity.trim() && (
                    <button onClick={() => handleSend(JSON.stringify({ city: manualCity.trim(), lat: null, lng: null }))} className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal">
                      Continue
                    </button>
                  )}
                </>
              )}
              {locationLoading && (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Getting your location…</span>
                </div>
              )}
              {locationResult && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3 border-gold">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{locationResult.city}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleSend(JSON.stringify(locationResult))} className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal">
                      Use this
                    </button>
                    <button onClick={() => setLocationResult(null)} className="rounded-full border border-primary/30 px-6 py-3 text-sm text-muted-foreground hover:text-foreground aura-transition">
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showInput && inputType === "distance_picker" && !structuredOptions && (
            <div className="flex flex-col items-center gap-6 pt-4 animate-[obd-fade-in_0.3s_ease-out_both]">
              <div className="flex flex-wrap justify-center gap-3">
                {DISTANCE_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistance(d)}
                    className={`rounded-full border px-5 py-3 text-sm font-medium aura-transition ${selectedDistance === d ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-foreground hover:border-primary/50"}`}
                  >
                    {d} mi
                  </button>
                ))}
              </div>
              <button onClick={() => handleSend(String(selectedDistance))} className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal">
                Continue
              </button>
            </div>
          )}

          {showInput && inputType === "availability_picker" && !structuredOptions && (
            <div className="flex w-full flex-col items-center gap-4 pt-2 animate-[obd-fade-in_0.3s_ease-out_both]">
              {availabilityStep === "days" && (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Select your available days</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`rounded-full border px-4 py-2.5 text-xs font-medium aura-transition ${selectedDays.includes(day) ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-foreground hover:border-primary/50"}`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {selectedDays.length > 0 && (
                    <button onClick={() => setAvailabilityStep("times")} className="mt-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal">
                      Next
                    </button>
                  )}
                </>
              )}

              {availabilityStep === "times" && (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pick time blocks for each day</p>
                  <div className="w-full max-w-xs space-y-3">
                    {selectedDays.map((day) => (
                      <div key={day} className="rounded-2xl bg-secondary p-3 border-gold">
                        <p className="mb-2 text-xs font-medium text-foreground">{day}</p>
                        <div className="flex flex-wrap gap-2">
                          {TIME_BLOCKS.map((block) => {
                            const isSelected = (selectedTimeBlocks[day] || []).includes(block.key);
                            return (
                              <button
                                key={block.key}
                                onClick={() => toggleTimeBlock(day, block.key)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium aura-transition ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 text-muted-foreground hover:border-primary/40"}`}
                              >
                                {block.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-3">
                    <button onClick={() => setAvailabilityStep("days")} className="rounded-full border border-primary/30 px-6 py-3 text-sm text-muted-foreground hover:text-foreground aura-transition">
                      Back
                    </button>
                    <button disabled={!hasAnyTimeBlocks} onClick={submitAvailability} className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground aura-transition hover:bg-aura-charcoal disabled:opacity-30">
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-none border-t border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md px-6 pt-3 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]">
          {engineState.phase === "name" && nameConfirmation && showComposer && (
            <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span>Should I call you <span className="font-medium text-foreground">{nameConfirmation}</span>?</span>
              <button onClick={() => handleSend(nameConfirmation)} className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">Yes</button>
              <button onClick={() => { setNameConfirmation(null); setInputValue(""); requestAnimationFrame(resizeComposer); }} className="rounded-full border border-primary/30 px-4 py-1.5 text-xs text-muted-foreground">No</button>
            </div>
          )}

          {engineState.phase === "name" && nameError && showComposer && <p className="mb-2 text-xs text-destructive">{nameError}</p>}

          <div className="min-h-[4.5rem]">
            <div className={cn("relative", !showComposer && "pointer-events-none invisible")}>
              <textarea
                ref={composerRef}
                rows={1}
                value={inputValue}
                maxLength={engineState.phase === "name" ? 40 : undefined}
                {...composerAttrs}
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                onFocus={() => {
                  setIsComposerFocused(true);
                  logAutofillState("focus");
                }}
                onBlur={() => setIsComposerFocused(false)}
                onInput={(e) => {
                  const nativeEvent = e.nativeEvent as InputEvent;
                  const nativeInputType = nativeEvent.inputType || null;
                  if (engineState.phase === "name" && (detectAutofillState() || (nativeInputType && !["insertText", "deleteContentBackward", "deleteContentForward", "insertCompositionText"].includes(nativeInputType)))) {
                    logAutofillState("input", nativeInputType);
                  }
                }}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setNameError(null);
                  setNameConfirmation(null);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full resize-none overflow-y-auto border-b border-primary/30 bg-transparent py-4 pr-24 text-base focus:border-primary focus:outline-none aura-transition placeholder:text-muted-foreground/40"
                style={{ maxHeight: 120 }}
                placeholder={composerAttrs.placeholder}
              />

              <div className="absolute right-0 bottom-4 flex items-center gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full aura-transition",
                    isListening ? "animate-pulse bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                    inputValue.trim()
                      ? "bg-primary text-primary-foreground scale-100"
                      : "bg-muted text-muted-foreground/40 scale-95"
                  )}
                >
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <details className="fixed top-2 right-2 z-[60] max-w-[280px] rounded-lg border border-border bg-background/95 text-[10px] shadow-lg backdrop-blur-sm">
        <summary className="cursor-pointer px-2 py-1 font-mono text-muted-foreground select-none">🔍 Debug</summary>
        <div className="max-h-[55vh] space-y-0.5 overflow-y-auto px-2 py-1 font-mono text-muted-foreground leading-tight">
          <div className="border-b border-border pb-1 mb-1 font-semibold text-foreground text-[11px]">Step</div>
          <div><span className="text-foreground">Phase:</span> {engineState.phase}</div>
          <div><span className="text-foreground">Step ID:</span> {activeStepId}</div>
          <div><span className="text-foreground">Input mode:</span> {activeInputMode}</div>
          <div><span className="text-foreground">Payload:</span> {isQuestionPending ? "provisional" : "final"}</div>
          <div><span className="text-foreground">Pending:</span> {pendingStepId || "—"}</div>
          <div><span className="text-foreground">Focused:</span> {isComposerFocused ? "yes" : "no"}</div>

          <div className="border-b border-border pb-1 mt-2 mb-1 font-semibold text-foreground text-[11px]">Collected</div>
          <div><span className="text-foreground">Name:</span> {profile.name || "—"}</div>
          <div><span className="text-foreground">Age:</span> {profile.age ?? "—"}</div>
          <div><span className="text-foreground">Gender:</span> {profile.gender || "—"}</div>
          <div><span className="text-foreground">Preference:</span> {profile.datingPreferences?.genderPreference || "—"}</div>
          <div><span className="text-foreground">Location:</span> {profile.location || "—"}</div>
          <div><span className="text-foreground">Distance:</span> {profile.maxDistance ?? "—"}</div>

          <div className="border-b border-border pb-1 mt-2 mb-1 font-semibold text-foreground text-[11px]">AI Understanding</div>
          <div><span className="text-foreground">Score:</span> {(engineState.understandingMeta?.understanding_score ?? 0).toFixed(2)}</div>
          <div><span className="text-foreground">Inconsistency:</span> {(engineState.understandingMeta?.inconsistency_score ?? 0).toFixed(2)}</div>
          <div><span className="text-foreground">Q#:</span> {engineState.aiQuestionCount}</div>
          {engineState.understandingMeta?.dimension_confidence && (
            <div className="pl-2 space-y-0.5">
              {Object.entries(engineState.understandingMeta.dimension_confidence).map(([dim, val]) => (
                <div key={dim}>
                  <span className="text-foreground">{dim}:</span>{" "}
                  <span className={Number(val) < 0.5 ? "text-destructive" : ""}>{Number(val).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          <div><span className="text-foreground">Unresolved:</span> {engineState.understandingMeta?.unresolved_dimensions?.join(", ") || "—"}</div>

          <div className="border-b border-border pb-1 mt-2 mb-1 font-semibold text-foreground text-[11px]">AI Interview</div>
          <div><span className="text-foreground">Target:</span> {nextQuestionGoal || "—"}</div>
          <div><span className="text-foreground">Reason:</span> {nextQuestionReason || "—"}</div>
          <div><span className="text-foreground">Last resolved:</span> {lastAnswerResolved === null ? "—" : lastAnswerResolved ? "✅ yes" : "❌ no"}</div>
          <div><span className="text-foreground">Interpretation:</span> {lastAnswerInterpretation || "—"}</div>
          <div><span className="text-foreground">Inferred:</span> {inferredInterests.join(", ") || "—"}</div>
          <div><span className="text-foreground">Corrected:</span> {correctedInterests.join(", ") || "—"}</div>
          <div><span className="text-foreground">Dim history:</span> {questionHistoryRef.current.slice(-5).map((q) => q.target_dimension?.split("_")[0]).join(" → ") || "—"}</div>
        </div>
      </details>
    </div>
  );
};

export default Onboarding;
