"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Helpers for direct-DOM chapter transitions (avoids React re-renders on scroll) ──
function setChapterVisible(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.style.opacity = visible ? "1" : "0";
  el.style.transform = visible ? "translateZ(0)" : "translate3d(0, 20px, 0)";
  el.style.pointerEvents = visible ? "auto" : "none";
}
// Separate helper for the CTA element which needs translateX(-50%) preserved
function setCtaVisible(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.style.opacity = visible ? "1" : "0";
  el.style.transform = visible
    ? "translateX(-50%) translateZ(0)"
    : "translateX(-50%) translate3d(0, 20px, 0)";
  el.style.pointerEvents = visible ? "auto" : "none";
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
  // Direct DOM refs for chapter overlays and CTA — avoids React re-renders on every scroll tick
  const chapterRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const navDotRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const navLabelRefsArr = useRef<(HTMLSpanElement | null)[]>([]);
  // Tracks current active chapter index without triggering a re-render
  const activeChapterRef = useRef<number>(0);
  const showFinalCtaRef = useRef<boolean>(false);

  const [loadPct, setLoadPct] = useState(0);
  const [initialReady, setInitialReady] = useState(false);

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

    // desynchronized: true allows the compositor to update the canvas out of sync with
    // the main thread — eliminates GPU pipeline stalls during scroll scrubbing
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    // High-quality upscale rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const total = HERO_CONFIG.totalFrames;
    const cache: (ImageBitmap | HTMLImageElement | null)[] = Array(total).fill(null);
    let loadedCount = 0;
    let currentFrame = 0;
    let rafId: number | null = null;        // used ONLY for resize redraws
    let pendingScrollFrame = -1;            // target frame requested by scroll
    let scrollRafId: number | null = null;  // single RAF slot for scroll draws
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        renderFrameAsync(currentFrame);
      }
    }

    // ── Core draw — fully synchronous, no RAF, called inside GSAP RAF tick ──────
    // IMPORTANT: never wrap this in requestAnimationFrame when called from onUpdate;
    // GSAP onUpdate already executes inside the browser's RAF. Adding another RAF
    // would defer the draw by exactly 1 frame, causing visible lag on every scroll.
    function drawFrameNow(index: number) {
      if (!canvas || !ctx) return;
      const clampedIdx = Math.max(0, Math.min(index, total - 1));

      // Bidirectional nearest-loaded-frame search:
      // Prefer the exact frame, then fan out equally in both directions.
      // This prevents jumping to very old frames when the user scrolls fast.
      let lo = clampedIdx;
      let hi = clampedIdx + 1;
      let found = -1;
      while (lo >= 0 || hi < total) {
        if (lo >= 0 && cache[lo] !== null) { found = lo; break; }
        if (hi < total && cache[hi] !== null) { found = hi; break; }
        lo--;
        hi++;
      }
      if (found < 0) return;

      const img = cache[found];
      if (!img) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const stageW = canvas.width / dpr;
      const stageH = canvas.height / dpr;
      ctx.clearRect(0, 0, stageW, stageH);
      drawCover(ctx, img, stageW, stageH);
    }

    // ── Scroll-scrub render: draw synchronously within GSAP's RAF tick ──
    // GSAP's onUpdate already runs inside the browser's RAF. Calling drawFrameNow
    // directly here (no extra RAF hop) means canvas updates land in the same paint
    // cycle as the scroll event — eliminating one full frame of visual lag.
    function renderFrameScroll(index: number) {
      pendingScrollFrame = index;
      drawFrameNow(pendingScrollFrame);
    }

    // ── Resize-triggered render: uses its own RAF slot to avoid layout thrashing ──
    function renderFrameAsync(index: number) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        drawFrameNow(index);
      });
    }

    // Legacy alias for preloader callbacks that run outside GSAP RAF
    const renderFrame = renderFrameAsync;

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
      // scrub: 0.1 gives a crisp, near-zero-lag response while still smoothing
      // micro-jitter from trackpads. At 0.4 (the old value) there was ~400ms
      // of intentional lag built into every scroll interaction.
      scrub: 0.1,
      onUpdate(self) {
        const p = self.progress;
        const pct = p * 100;

        // ── Top progress indicator — direct DOM mutation, no React state ──
        if (progressLineRef.current) {
          progressLineRef.current.style.transform = `scaleX(${p})`;
        }

        // ── Frame scrub — synchronous draw within GSAP's own RAF tick ──
        const targetFrame = Math.min(Math.round(p * (total - 1)), total - 1);
        if (targetFrame !== currentFrame) {
          currentFrame = targetFrame;
          renderFrameScroll(currentFrame);
        }

        // ── Narrative chapter sync — direct DOM, zero React overhead ──
        const isInFinalCta = pct >= 86;
        if (isInFinalCta !== showFinalCtaRef.current) {
          showFinalCtaRef.current = isInFinalCta;
          setCtaVisible(finalCtaRef.current, isInFinalCta);
          // Hide all chapter overlays and nav dots when CTA is shown
          chapterRefsArr.current.forEach((el) => setChapterVisible(el, false));
          navDotRefsArr.current.forEach((dot, i) => {
            if (dot) {
              dot.style.transform = "scaleX(0.27)";
              dot.style.background = "rgba(255,255,255,0.25)";
              dot.style.boxShadow = "none";
            }
            if (navLabelRefsArr.current[i]) {
              navLabelRefsArr.current[i]!.style.opacity = "0.45";
              navLabelRefsArr.current[i]!.style.fontWeight = "400";
              navLabelRefsArr.current[i]!.style.color = "rgba(255,255,255,0.4)";
            }
          });
        }

        if (!isInFinalCta) {
          const activeIdx = CHAPTERS.findIndex(
            (c) => pct >= c.start && pct <= c.end
          );
          const nextActive = activeIdx !== -1 ? activeIdx : activeChapterRef.current;

          if (nextActive !== activeChapterRef.current || isInFinalCta !== showFinalCtaRef.current) {
            chapterRefsArr.current.forEach((el, i) =>
              setChapterVisible(el, i === nextActive)
            );
            navDotRefsArr.current.forEach((dot, i) => {
              const isActive = i === nextActive;
              if (dot) {
                dot.style.transform = isActive ? "scaleX(1)" : "scaleX(0.27)";
                dot.style.background = isActive
                  ? "linear-gradient(90deg, #B99A62, #E5CF92)"
                  : "rgba(255,255,255,0.25)";
                dot.style.boxShadow = isActive ? "0 0 8px rgba(185,154,98,0.8)" : "none";
              }
              if (navLabelRefsArr.current[i]) {
                navLabelRefsArr.current[i]!.style.opacity = isActive ? "1" : "0.45";
                navLabelRefsArr.current[i]!.style.fontWeight = isActive ? "600" : "400";
                navLabelRefsArr.current[i]!.style.color = isActive
                  ? "#E5CF92"
                  : "rgba(255,255,255,0.4)";
              }
            });
            activeChapterRef.current = nextActive;
          }
        }
      },
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
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
              willChange: "contents",
              transform: "translateZ(0)",
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
              // Initial state: chapter 0 visible, rest hidden
              const isFirst = i === 0;
              return (
                <div
                  key={chap.chapter}
                  ref={(el) => { chapterRefsArr.current[i] = el; }}
                  style={{
                    position: "absolute",
                    left: "clamp(1.5rem, 5vw, 4.5rem)",
                    bottom: "clamp(5rem, 12vh, 8.5rem)",
                    maxWidth: "min(640px, 90vw)",
                    // Use GPU-composited properties only — no layout-triggering changes
                    opacity: isFirst ? 1 : 0,
                    transform: isFirst ? "translateZ(0)" : "translate3d(0, 20px, 0)",
                    transition:
                      "opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "opacity, transform",
                    pointerEvents: isFirst ? "auto" : "none",
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
              const isFirstNav = i === 0;
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
                    // Color is driven by direct DOM ref updates — no re-render needed
                    color: isFirstNav ? "#E5CF92" : "rgba(255,255,255,0.4)",
                    transition: "color 0.3s ease",
                  }}
                  title={c.headline}
                >
                  <span
                    ref={(el) => { navLabelRefsArr.current[i] = el; }}
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.18em",
                      fontFamily: "var(--font-sans), sans-serif",
                      // Initial state: first nav label active
                      fontWeight: isFirstNav ? 600 : 400,
                      opacity: isFirstNav ? 1 : 0.45,
                      color: isFirstNav ? "#E5CF92" : "rgba(255,255,255,0.4)",
                      transition: "opacity 0.35s ease, color 0.35s ease",
                    }}
                    className="hidden sm:inline"
                  >
                    0{i + 1}
                  </span>
                  {/* Use scaleX instead of width to avoid layout reflow — pure compositor animation */}
                  <div
                    ref={(el) => { navDotRefsArr.current[i] = el; }}
                    style={{
                      width: "22px",
                      height: "2px",
                      borderRadius: "2px",
                      transformOrigin: "left center",
                      // Initial state: first dot active (full width), rest collapsed
                      transform: isFirstNav ? "scaleX(1)" : "scaleX(0.27)",
                      background: isFirstNav
                        ? "linear-gradient(90deg, #B99A62, #E5CF92)"
                        : "rgba(255,255,255,0.25)",
                      boxShadow: isFirstNav ? "0 0 8px rgba(185,154,98,0.8)" : "none",
                      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease, box-shadow 0.35s ease",
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* ══ Final Interactive Call To Action (Triggers at 86%+ scroll) ══ */}
          <div
            ref={finalCtaRef}
            style={{
              position: "absolute",
              left: "50%",
              bottom: "clamp(5rem, 12vh, 8.5rem)",
              // Initial hidden state — driven by direct DOM mutation, not React state
              transform: "translateX(-50%) translate3d(0, 20px, 0)",
              opacity: 0,
              transition:
                "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: "none",
              willChange: "opacity, transform",
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
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 6px, 0); }
        }
        @keyframes hero-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* Promote chapter overlays and CTA to their own compositor layers */
        [data-hero-overlay] {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
}
