"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

import type { Agent } from "@/types";
import { AgentGlyph } from "@/components/selector/AgentGlyph";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { buttonStyles } from "@/components/ui/Button";
import { recordResultAction } from "@/lib/actions/challenges";
import { cn } from "@/lib/utils";

type Phase =
  | "idle"
  | "spinning"
  | "revealed"
  | "submitting"
  | "won"
  | "lost";

export function AgentSelector({
  agents,
  challengeTypeId,
  backHref,
}: {
  agents: Agent[];
  challengeTypeId: string;
  backHref: string;
}) {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const [winner, setWinner] = useState<Agent | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  function handleSpin() {
    if (phase !== "idle" || agents.length === 0) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const winningIndex = Math.floor(Math.random() * agents.length);

    setPhase("spinning");
    setWinner(null);
    setHighlightedIndex(null);

    let currentIndex = 0;
    let steps = 0;

    /*
     * Complete multiple passes through the agent list
     * before landing on the randomly selected agent.
     */
    const totalSteps = agents.length * 2 + winningIndex;

    const step = () => {
      const currentHighlight = currentIndex % agents.length;

      setHighlightedIndex(currentHighlight);

      if (steps >= totalSteps) {
        const selectedAgent = agents[winningIndex];

        setWinner(selectedAgent ?? null);
        setHighlightedIndex(winningIndex);
        setPhase("revealed");

        timeoutRef.current = null;
        return;
      }

      steps += 1;
      currentIndex += 1;

      /*
       * Fast at first.
       * Gradually slows down toward the final selection.
       */
      const progress = steps / totalSteps;
      const delay = 55 + Math.pow(progress, 3) * 450;

      timeoutRef.current = setTimeout(step, delay);
    };

    step();
  }

  async function handleResult(result: "win" | "loss") {
    if (!winner || phase !== "revealed") {
      return;
    }

    setPhase("submitting");

    try {
      await recordResultAction(
        challengeTypeId,
        winner.id,
        result
      );

      if (result === "win") {
        setPhase("won");

        timeoutRef.current = setTimeout(() => {
          router.push(backHref);
          timeoutRef.current = null;
        }, 1400);

        return;
      }

      setPhase("lost");
    } catch (error) {
      console.error(
        "Failed to record challenge result:",
        error
      );

      setPhase("revealed");
    }
  }

  function handleSelectAgain() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setWinner(null);
    setHighlightedIndex(null);
    setPhase("idle");
  }

  return (
    <div className="flex w-full flex-col items-center">

      {/* =====================================================
          AGENT SELECTION GRID
          ===================================================== */}

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            /*
             * IMPORTANT:
             * Use viewport width instead of relying only on
             * the parent's max-width.
             *
             * This prevents the agent portraits from becoming
             * tiny on the challenge page.
             */
            className="w-[92vw] max-w-[920px]"
          >
            <div
              className={cn(
                "grid w-full gap-4",
                "grid-cols-4",
                "sm:grid-cols-5",
                "md:grid-cols-6"
              )}
            >
              {agents.map((agent, index) => {
                const isHighlighted =
                  highlightedIndex === index;

                const isWinner =
                  winner?.id === agent.id;

                return (
                  <motion.div
                    key={agent.id}
                    animate={{
                      scale: isHighlighted ? 1.1 : 1,
                      y: isHighlighted ? -5 : 0,
                    }}
                    transition={{
                      duration: 0.12,
                      ease: "easeOut",
                    }}
                    className={cn(
                      /*
                       * Larger tiles.
                       */
                      "relative aspect-square overflow-hidden rounded-2xl border bg-graphite-900 p-2.5",

                      /*
                       * Normal state.
                       */
                      !isHighlighted &&
                        !isWinner &&
                        "border-graphite-700",

                      /*
                       * Currently selected agent.
                       */
                      isHighlighted &&
                        "border-signal-500 shadow-glow-accent",

                      /*
                       * Final winner.
                       */
                      isWinner &&
                        phase !== "spinning" &&
                        "border-signal-500 ring-2 ring-signal-500/40"
                    )}
                  >
                    {/* Agent portrait */}
                    <AgentGlyph
                      agent={agent}
                      className="h-full w-full"
                    />

                    {/* =================================================
                        ANIMATED SELECTION RING
                        ================================================= */}

                    <AnimatePresence>
                      {isHighlighted &&
                        phase === "spinning" && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                            }}
                            transition={{
                              duration: 0.08,
                            }}
                            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-signal-500"
                          />
                        )}
                    </AnimatePresence>

                    {/* =================================================
                        WINNER RING
                        ================================================= */}

                    <AnimatePresence>
                      {isWinner &&
                        phase === "revealed" && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.85,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-signal-500"
                          />
                        )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          INITIATE SELECTION
          ===================================================== */}

      {phase === "idle" && (
        <button
          onClick={handleSpin}
          disabled={agents.length === 0}
          className={buttonStyles(
            "primary",
            "mt-xl"
          )}
        >
          Initiate selection
        </button>
      )}

      {/* =====================================================
          SELECTING MESSAGE
          ===================================================== */}

      {phase === "spinning" && (
        <motion.p
          initial={{
            opacity: 0,
            y: 4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-xl text-sm font-medium text-graphite-400"
        >
          Selecting your agent...
        </motion.p>
      )}

      {/* =====================================================
          RESULT
          ===================================================== */}

      <AnimatePresence mode="wait">

        {/* -------------------- REVEALED -------------------- */}

        {winner &&
          (phase === "revealed" ||
            phase === "submitting") && (
            <motion.div
              key="prompt"
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                delay: 0.12,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-xl flex flex-col items-center gap-sm text-center"
            >
              <p className="text-xs font-medium tracking-wide text-graphite-400">
                Your agent
              </p>

              {/* Small winner icon + name */}
              <div className="flex items-center gap-sm">
                <AgentGlyph
                  agent={winner}
                  className="h-12 w-12"
                />

                <h2 className="font-display text-3xl font-semibold">
                  {winner.name}
                </h2>
              </div>

              <RoleBadge role={winner.role} />

              <p className="mt-sm max-w-xs text-sm text-graphite-400">
                Play your match, then report the result.
              </p>

              {/* Result buttons */}
              <div className="mt-md flex gap-md">
                <button
                  onClick={() => handleResult("win")}
                  disabled={phase === "submitting"}
                  className={buttonStyles("primary")}
                >
                  <Check className="h-4 w-4" />
                  Won
                </button>

                <button
                  onClick={() => handleResult("loss")}
                  disabled={phase === "submitting"}
                  className={buttonStyles("secondary")}
                >
                  <X className="h-4 w-4" />
                  Lost
                </button>
              </div>

              <Link
                href={backHref}
                className={buttonStyles(
                  "ghost",
                  "mt-sm text-xs"
                )}
              >
                Back to challenge
              </Link>
            </motion.div>
          )}

        {/* -------------------- WON -------------------- */}

        {winner && phase === "won" && (
          <motion.div
            key="won"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-xl flex flex-col items-center gap-sm text-center"
          >
            <div className="flex items-center gap-sm">
              <Check className="h-5 w-5 text-signal-500" />

              <h2 className="font-display text-2xl font-semibold text-signal-500">
                {winner.name} retired
              </h2>
            </div>

            <p className="text-sm text-graphite-400">
              Taking you back to the challenge.
            </p>
          </motion.div>
        )}

        {/* -------------------- LOST -------------------- */}

        {winner && phase === "lost" && (
          <motion.div
            key="lost"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-xl flex flex-col items-center gap-sm text-center"
          >
            <h2 className="text-lg font-medium">
              No luck this time
            </h2>

            <p className="text-sm text-graphite-400">
              {winner.name} stays in the pool. Try again
              whenever you&apos;re ready.
            </p>

            <div className="mt-md flex gap-md">
              <button
                onClick={handleSelectAgain}
                className={buttonStyles("primary")}
              >
                Select again
              </button>

              <Link
                href={backHref}
                className={buttonStyles("secondary")}
              >
                Back to challenge
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}