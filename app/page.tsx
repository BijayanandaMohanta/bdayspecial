"use client";

import { useState, useEffect } from "react";
import ImageRing, { WishSample } from "@/components/ImageRing";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const flipWords = [
  "HAPPY BIRTHDAY",
  "ANNIVERSARY",
  "SECRET SURPRISE",
  "SPECIAL MOMENTS",
];

const clothVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -75,
    skewY: 6,
    scale: 0.88,
    x: 120,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    skewY: 0,
    scale: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 90,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 65,
    skewY: -4,
    scale: 0.88,
    x: 100,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<WishSample | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % flipWords.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* 1. 3D WebGL Cylinder Canvas */}
      <ImageRing
        selectedCard={selectedCard}
        onSelectCard={(card) => setSelectedCard(card)}
      />

      {/* 2. Soft Edge Radial Vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.65)_75%,#000000_100%)]" />

      {/* 3. Hero Copy with 3D Flipping Title */}
      <div
        className={`pointer-events-none relative z-20 flex min-h-screen flex-col justify-center px-6 transition-all duration-700 ease-out ${
          selectedCard
            ? "items-start max-w-lg lg:pl-16 text-left"
            : "items-center text-center"
        }`}
      >
        <span className="pointer-events-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-rose-300 backdrop-blur-md">
          <span>✨</span> Make Unforgettable Memories
        </span>

        {/* Dynamic 3D Flipping Headline with Extruded Text Depth */}
        <div
          className="relative h-20 sm:h-28 md:h-32 flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipWords[wordIndex]}
              initial={{
                rotateX: -90,
                opacity: 0,
                y: 40,
                filter: "brightness(0.3) blur(2px)",
              }}
              animate={{
                rotateX: 0,
                opacity: 1,
                y: 0,
                filter: "brightness(1) blur(0px)",
              }}
              exit={{
                rotateX: 90,
                opacity: 0,
                y: -40,
                filter: "brightness(0.3) blur(2px)",
              }}
              transition={{
                duration: 0.65,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "50% 50% -45px",
                backfaceVisibility: "hidden",
              }}
              className="inline-block select-none"
            >
              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white"
                style={{
                  textShadow: `
                    0 1px 0 #e4e4e7,
                    0 2px 0 #a1a1aa,
                    0 3px 0 #71717a,
                    0 4px 0 #52525b,
                    0 5px 0 #3f3f46,
                    0 8px 16px rgba(0, 0, 0, 0.85),
                    0 16px 32px rgba(244, 63, 94, 0.3)
                  `,
                }}
              >
                {flipWords[wordIndex]}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-3 text-sm font-normal tracking-wide text-zinc-300 sm:text-base select-none max-w-md">
          {selectedCard
            ? "Card preview selected. Craft a personalized surprise like this."
            : "Click any floating card or drag and scroll around the ring~"}
        </p>

        <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-rose-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span>✨</span>
            <span>Create a Wish</span>
          </Link>
          <Link
            href="/wishes"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Explore Moments
          </Link>
        </div>
      </div>

      {/* 4. Cloth-Flip Card on the Right Side */}
      <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md items-center justify-center p-4 sm:p-6 lg:right-14 pointer-events-none [perspective:1400px]">
        <AnimatePresence mode="wait">
          {selectedCard && (
            <motion.div
              key={selectedCard.id}
              variants={clothVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto relative w-full overflow-hidden rounded-3xl border border-white/20 bg-zinc-950/85 p-6 shadow-2xl backdrop-blur-2xl text-white origin-right"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                aria-label="Close preview"
              >
                ✕
              </button>

              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-inner border border-white/10">
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.occasion}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-300 backdrop-blur-md">
                  {selectedCard.occasion}
                </span>
              </div>

              {/* Card Content */}
              <div className="mt-5 space-y-3">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Dear {selectedCard.recipient},
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300 font-light italic">
                  "{selectedCard.message}"
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-400">
                  <span>{selectedCard.sender}</span>
                  <Link
                    href={`/create?theme=${encodeURIComponent(selectedCard.occasion)}`}
                    className="font-semibold text-rose-400 hover:text-rose-300"
                  >
                    Send this style →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
