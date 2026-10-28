import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { LpsShiplet } from "@/components/sections/lps-shiplet";
import { K, KoherentShell, PageHead, sans } from "@/components/sections/koherent-ui";
import { ScoreFlow } from "./score-flow";

// /koherent/score — the Logistics Performance Score, the site's main ask
// (deck slides 33–34; Chris, Aug 7: a score with real value instead of a
// contact form). The same shiplet as /plus/assessment, reskinned through its
// --lps-* variables. Michael (Aug 6): it rates them against what world-class
// logistics looks like.
// It starts at question one (autoStart), as on /parcelforum/score: the pitch
// now lives in the PageHead, so the shiplet's own intro card would only say it
// twice. Nothing under it either: once someone has started sixteen questions,
// the page stops selling (the result screen has its own talk button).

const LEAD =
  "Sixteen questions, five minutes. Each answer scores a level from 1 to 5 across three pillars, logistics costs, operational excellence and customer experience, weighted into one score out of 100 against world-class logistics. You get the score, a read on each pillar, and a short written report on where the leverage is.";

export const metadata: Metadata = {
  title: "Your Logistics Performance Score",
  description: LEAD,
};

const lpsTheme = {
  "--lps-accent": K.plum,
  "--lps-accent-tint": K.mist,
  "--lps-accent-soft": "rgba(70,25,72,0.14)",
  "--lps-accent-half": "rgba(70,25,72,0.5)",
  "--lps-ink": K.ink,
  "--lps-sub": K.stone,
  "--lps-body": K.stone,
  // dark enough for 4.5:1 on the cards and panels: it sets the answer-number
  // badges, "/ 100" and the small print
  "--lps-faint": "#736B7B",
  "--lps-line": K.line,
  "--lps-track": K.mist,
  "--lps-panel": "#F4F0F6",
  "--lps-card": K.card,
  "--lps-font": "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif",
  "--lps-display-font": "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif",
  "--lps-display-weight": "700",
} as CSSProperties;

export default function KoherentScorePage() {
  return (
    <KoherentShell>
      {/* the questionnaire is the hero object, so the first question is on
          screen with the title; the privacy line sits under the words */}
      <PageHead
        chapter={4}
        label="Your score"
        heading={<>How coherent is your logistics?</>}
        lead={
          <>
            {LEAD}
            <span style={{ ...sans, display: "block", fontSize: 13, lineHeight: 1.6, color: K.stone, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${K.line}` }}>
              No cost. We use your answers to write your report, and we keep them with your contact details so we can follow up. The Logistics Performance Index uses totals only, never a company&rsquo;s name.
            </span>
          </>
        }
        aside={
          <ScoreFlow>
            <div style={lpsTheme}>
              <LpsShiplet autoStart />
            </div>
          </ScoreFlow>
        }
      />
    </KoherentShell>
  );
}
