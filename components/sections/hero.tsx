"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — customize sequence source and track length here
// ─────────────────────────────────────────────────────────────────────────────
export const HERO_CONFIG = {
  frameBase: "/drone_scroll_animation",
  framePrefix: "seq_",
  frameExt: ".webp",
  totalFrames: 192,
  scrollHeight: "650vh", // total vertical track height for scrubbing
} as const;

// Generate ordered list of frame URLs: /drone_scroll_animation/seq_0001.webp -> seq_0192.webp
const FRAMES: string[] = Array.from(
  { length: HERO_CONFIG.totalFrames },
  (_, i) =>
    `${HERO_CONFIG.frameBase}/${HERO_CONFIG.framePrefix}${String(i + 1).padStart(4, "0")}${HERO_CONFIG.frameExt}`
);

// ── Cinematic Text Overlays Synced to Narrative Chapters ──────────────────────
interface OverlayChapter {
  start: number; // progress % start
  end: number;   // progress % end
  chapter: string;
  headline: string;
  subline: string;
  targetScrollPct: number;
  showScrollHint?: boolean;
}

const CHAPTERS: OverlayChapter[] = [
  {
    start: 0,
    end: 22,
    chapter: "01 · AERIAL HORIZON",
    headline: "Your Sanctuary, From Above",
    subline: "A sweeping descent over private manicured grounds, azure pool & signature architecture in Indore.",
    targetScrollPct: 0.05,
    showScrollHint: true,
  },
  {
    start: 25,
    end: 48,
    chapter: "02 · ARCHITECTURAL MAJESTY",
    headline: "Every Detail, Masterfully Crafted",
    subline: "Natural stone facades, warm wood paneling & expansive cantilevered terraces designed for permanence.",
    targetScrollPct: 0.35,
    showScrollHint: false,
  },
  {
    start: 51,
    end: 74,
    chapter: "03 · RESORT-STYLE LEISURE",
    headline: "An Everyday Private Oasis",
    subline: "Shimmering waters, poolside cabana lounge & tranquil green courtyards built for refined relaxation.",
    targetScrollPct: 0.62,
    showScrollHint: false,
  },
  {
    start: 77,
    end: 87,
    chapter: "04 · STEP INSIDE OPULENCE",
    headline: "Where Grandeur Welcomes You Home",
    subline: "Double-height living volumes, luminous glass walls & bespoke luxury finishes crafted by Lakshya Buildcon.",
    targetScrollPct: 0.82,
    showScrollHint: false,
  },
];

// ── Helper: Cover-fit Canvas Draw (like object-fit: cover) ─────────────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | ImageBitmap,
  cw: number,
  ch: number
) {
  const iw = "naturalWidth" in img ? img.naturalWidth : img.width;
  const ih = "naturalHeight" in img ? img.naturalHeight : img.height;
  if (!iw || !ih) return;

  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const [loadPct, setLoadPct] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showFinalCta, setShowFinalCta] = useState(false);

  // Check prefers-reduced-motion
  const isReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const handleScrollToExplore = useCallback(() => {
    if (trackRef.current) {
      const targetY = trackRef.current.offsetTop + window.innerHeight * 0.7;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!canvas || !track || !stage) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const total = HERO_CONFIG.totalFrames;
    const cache: (ImageBitmap | HTMLImageElement | null)[] = Array(total).fill(null);
    let loadedCount = 0;
    let currentFrame = 0;
    let rafId: number | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;
    let isFirstReady = false;

    // Canvas resize calculation with DPR capping
    function resizeCanvas() {
      if (!canvas || !stage || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = stage.getBoundingClientRect();
      const pixelWidth = Math.floor(rect.width * dpr);
      const pixelHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderFrame(currentFrame);
      }
    }

    // Render frame to canvas with nearest-fallback logic
    function renderFrame(index: number) {
      if (!canvas || !ctx) return;
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        rafId = null;
        let candidateIdx = Math.max(0, Math.min(index, total - 1));

        // Find nearest loaded frame if current isn't ready
        while (candidateIdx >= 0 && cache[candidateIdx] === null) {
          candidateIdx--;
        }
        if (candidateIdx < 0) {
          candidateIdx = cache.findIndex((item) => item !== null);
          if (candidateIdx < 0) return;
        }

        const img = cache[candidateIdx];
        if (!img) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const stageW = canvas.width / dpr;
        const stageH = canvas.height / dpr;

        ctx.clearRect(0, 0, stageW, stageH);
        drawCover(ctx, img, stageW, stageH);
      });
    }

    // Load individual frame
    function loadSingleFrame(index: number): Promise<void> {
      return new Promise((resolve) => {
        if (cache[index] !== null) {
          resolve();
          return;
        }

        const img = new Image();
        img.decoding = "async";
        img.src = FRAMES[index];

        img.onload = async () => {
          try {
            if ("createImageBitmap" in window) {
              cache[index] = await createImageBitmap(img);
            } else {
              cache[index] = img;
            }
          } catch {
            cache[index] = img;
          }

          loadedCount++;
          const pct = Math.round((loadedCount / total) * 100);
          setLoadPct(pct);

          if (index === 0 && !isFirstReady) {
            isFirstReady = true;
            setInitialReady(true);
            renderFrame(0);
          }

          if (index === currentFrame) {
            renderFrame(currentFrame);
          }
          resolve();
        };

        img.onerror = () => {
          loadedCount++;
          resolve();
        };
      });
    }

    // Preloading pipeline: 3-tier progressive streaming
    async function initPreloader() {
      // Tier 1: First 8 frames loaded immediately for instant first-paint
      const initialBatch = [0, 1, 2, 3, 4, 5, 6, 7];
      await Promise.all(initialBatch.map(loadSingleFrame));
      if (!isFirstReady) {
        isFirstReady = true;
        setInitialReady(true);
        renderFrame(0);
      }

      // Tier 2: Uniform keyframe spine across entire 192-frame timeline (every 4th frame)
      // Ensures that wherever the user scrolls, a crisp nearby frame is ready with 0ms lag
      const keyframes: number[] = [];
      for (let i = 8; i < total; i += 4) {
        keyframes.push(i);
      }
      for (let i = 0; i < keyframes.length; i += 6) {
        const batch = keyframes.slice(i, i + 6);
        await Promise.all(batch.map(loadSingleFrame));
      }

      // Tier 3: Infill remaining frames for full 60fps continuous playback
      const remaining: number[] = [];
      for (let i = 0; i < total; i++) {
        if (cache[i] === null) remaining.push(i);
      }
      for (let i = 0; i < remaining.length; i += 6) {
        const batch = remaining.slice(i, i + 6);
        await Promise.all(batch.map(loadSingleFrame));
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(stage);
    resizeCanvas();

    // If reduced motion, load only first frame
    if (isReducedMotion.current) {
      loadSingleFrame(0).then(() => {
        setLoadPct(100);
        setInitialReady(true);
        renderFrame(0);
        setActiveChapterIndex(0);
      });
      return () => {
        resizeObserver.disconnect();
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    // Start loading sequence
    initPreloader();

    // Bind scroll progress to frame scrubbing via GSAP ScrollTrigger
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4, // ultra-smooth cinematic response
      onUpdate(self) {
        const p = self.progress;
        const pct = p * 100;

        // Top progress indicator
        if (progressLineRef.current) {
          progressLineRef.current.style.transform = `scaleX(${p})`;
        }

        // Scrub frame
        const targetFrame = Math.min(
          Math.floor(p * total),
          total - 1
        );

        if (targetFrame !== currentFrame) {
          currentFrame = targetFrame;
          renderFrame(currentFrame);
        }

        // Active narrative chapter sync
        const activeIdx = CHAPTERS.findIndex(
          (c) => pct >= c.start && pct <= c.end
        );
        if (activeIdx !== -1) {
          setActiveChapterIndex(activeIdx);
        }

        // Show CTA near sequence completion
        setShowFinalCta(pct >= 86);
      },
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      scrollTriggerInstance?.kill();
      cache.forEach((item) => {
        if (item && "close" in item && typeof (item as ImageBitmap).close === "function") {
          (item as ImageBitmap).close();
        }
      });
    };
  }, []);

  return (
    <>
      {/* ══ Scroll Track (Controls scroll distance) ══ */}
      <div
        ref={trackRef}
        id="home"
        style={{
          height: HERO_CONFIG.scrollHeight,
          position: "relative",
          background: "#080808",
        }}
      >
        {/* ══ Sticky Viewport Stage (Sticks for the entire track scroll) ══ */}
        <div
          ref={stageRef}
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100svh",
            minHeight: "100dvh",
            overflow: "hidden",
            background: "#080808",
          }}
        >
          {/* Main Drone Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
            aria-label="Drone flythrough of Lakshya luxury villa"
          />

          {/* Deep Cinematic Scrims (Ensures text & stats are always readable) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: [
                "linear-gradient(to bottom,",
                "  rgba(8,8,8,0.65) 0%,",
                "  rgba(8,8,8,0.2) 20%,",
                "  transparent 40%,",
                "  rgba(8,8,8,0.3) 65%,",
                "  rgba(8,8,8,0.85) 100%",
                ")",
              ].join(""),
              pointerEvents: "none",
            }}
          />

          {/* ══ Top Scroll Progress Bar ══ */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "rgba(255, 255, 255, 0.08)",
              zIndex: 40,
            }}
          >
            <div
              ref={progressLineRef}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #B99A62, #E5CF92)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
                willChange: "transform",
                boxShadow: "0 0 10px rgba(185, 154, 98, 0.6)",
              }}
            />
          </div>

          {/* ══ Elegant Minimal Preloader ══ */}
          {!initialReady && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#080808",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid rgba(185,154,98,0.25)",
                  borderTopColor: "#B99A62",
                  animation: "hero-spin 1s linear infinite",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "1.1rem",
                    letterSpacing: "0.24em",
                    color: "rgba(255,255,255,0.92)",
                    textTransform: "uppercase",
                  }}
                >
                  Lakshya Buildcon
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.32em",
                    color: "#B99A62",
                    textTransform: "uppercase",
                    marginTop: "6px",
                  }}
                >
                  Cinematic Drone Experience
                </div>
              </div>
              <div
                style={{
                  width: "180px",
                  height: "1px",
                  background: "rgba(255,255,255,0.12)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${loadPct}%`,
                    background: "linear-gradient(90deg, #B99A62, #E5CF92)",
                    transition: "width 0.2s ease-out",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.4)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {loadPct}%
              </div>
            </div>
          )}



          {/* ══ Narrative Overlays Synced to Flight Chapters ══ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 25,
              pointerEvents: "none",
            }}
          >
            {CHAPTERS.map((chap, i) => {
              const isCurrent = activeChapterIndex === i && !showFinalCta;
              return (
                <div
                  key={chap.chapter}
                  style={{
                    position: "absolute",
                    left: "clamp(1.5rem, 5vw, 4.5rem)",
                    bottom: "clamp(5rem, 12vh, 8.5rem)",
                    maxWidth: "min(640px, 90vw)",
                    opacity: isCurrent ? 1 : 0,
                    transform: `translateY(${isCurrent ? 0 : 20}px)`,
                    transition:
                      "opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "opacity, transform",
                  }}
                >
                  {/* Chapter badge & gold rule */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "#B99A62",
                        fontWeight: 600,
                      }}
                    >
                      {chap.chapter}
                    </span>
                    <div
                      style={{
                        height: "1px",
                        width: "36px",
                        background: "rgba(185,154,98,0.4)",
                      }}
                    />
                  </div>

                  {/* Headline */}
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display), Georgia, serif",
                      fontWeight: 300,
                      fontSize: "clamp(2.1rem, 5.2vw, 4.2rem)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.025em",
                      color: "#FFFFFF",
                      textShadow: "0 4px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    {chap.headline}
                  </h1>

                  {/* Subline */}
                  <p
                    style={{
                      margin: "14px 0 0",
                      fontFamily: "var(--font-sans), sans-serif",
                      fontWeight: 300,
                      fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.7)",
                      textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      maxWidth: "520px",
                    }}
                  >
                    {chap.subline}
                  </p>

                  {/* Scroll Hint on Chapter 1 */}
                  {chap.showScrollHint && (
                    <button
                      type="button"
                      onClick={handleScrollToExplore}
                      style={{
                        marginTop: "26px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        pointerEvents: "auto",
                        color: "rgba(255,255,255,0.5)",
                        transition: "color 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "1px solid rgba(185,154,98,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(8,8,8,0.3)",
                        }}
                      >
                        <ChevronDown
                          size={14}
                          color="#B99A62"
                          style={{ animation: "hero-bounce 1.8s ease-in-out infinite" }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                        }}
                      >
                        Scroll to explore
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ══ Chapter Quick Navigator (Desktop right edge) ══ */}
          <nav
            aria-label="Flight Chapters"
            style={{
              position: "absolute",
              right: "clamp(1.2rem, 3.5vw, 3rem)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 35,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              pointerEvents: "auto",
            }}
          >
            {CHAPTERS.map((c, i) => {
              const isActive = activeChapterIndex === i && !showFinalCta;
              return (
                <button
                  key={c.chapter}
                  type="button"
                  onClick={() => {
                    if (trackRef.current) {
                      const trackTop = trackRef.current.offsetTop;
                      const trackH = trackRef.current.offsetHeight - window.innerHeight;
                      const targetY = trackTop + trackH * c.targetScrollPct;
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "6px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    color: isActive ? "#E5CF92" : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s ease",
                  }}
                  title={c.headline}
                >
                  <span
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.18em",
                      fontFamily: "var(--font-sans), sans-serif",
                      fontWeight: isActive ? 600 : 400,
                      opacity: isActive ? 1 : 0.45,
                    }}
                    className="hidden sm:inline"
                  >
                    0{i + 1}
                  </span>
                  <div
                    style={{
                      width: isActive ? "22px" : "6px",
                      height: "2px",
                      borderRadius: "2px",
                      background: isActive
                        ? "linear-gradient(90deg, #B99A62, #E5CF92)"
                        : "rgba(255,255,255,0.25)",
                      boxShadow: isActive ? "0 0 8px rgba(185,154,98,0.8)" : "none",
                      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* ══ Final Interactive Call To Action (Triggers at 86%+ scroll) ══ */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "clamp(5rem, 12vh, 8.5rem)",
              transform: `translateX(-50%) translateY(${showFinalCta ? "0px" : "20px"})`,
              opacity: showFinalCta ? 1 : 0,
              transition:
                "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: showFinalCta ? "auto" : "none",
              zIndex: 35,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#E5CF92",
                fontWeight: 600,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              Private Site Tours Available
            </div>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 38px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #B99A62 0%, #D4B87A 100%)",
                color: "#080808",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow:
                  "0 12px 35px rgba(185, 154, 98, 0.45), inset 0 1px 1px rgba(255,255,255,0.4)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow =
                  "0 16px 45px rgba(185, 154, 98, 0.6), inset 0 1px 1px rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(185, 154, 98, 0.45), inset 0 1px 1px rgba(255,255,255,0.4)";
              }}
            >
              <span>Book a Site Visit</span>
              <ArrowRight size={15} color="#080808" />
            </a>
          </div>

        </div>
      </div>

      {/* Global Hero Animations */}
      <style>{`
        @keyframes hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes hero-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
