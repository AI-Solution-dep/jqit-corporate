"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ROTATION_INTERVAL_MS = 5_000;

const heroSlides = [
  {
    src: "/hero-collage.webp",
    label: "JQITのメンバーとオフィス",
  },
  {
    src: "/hero-customer-workshop.webp",
    label: "顧客とのワークショップ",
  },
  {
    src: "/hero-ai-development.webp",
    label: "AI・システム開発",
  },
  {
    src: "/hero-office-district-dusk.webp",
    label: "夕景のオフィス街",
  },
] as const;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setActiveIndex(0);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, prefersReducedMotion]);

  const animationPlayState = isPaused ? "paused" : "running";

  return (
    <div className="relative z-0 overflow-hidden min-[1280px]:absolute min-[1280px]:inset-y-0 min-[1280px]:right-0">
      <div
        id="hero-visuals"
        aria-hidden="true"
        className="relative ml-[-39%] aspect-[1792/1008] w-[139%] max-w-none min-[600px]:ml-[-18%] min-[600px]:w-[118%] min-[1280px]:ml-0 min-[1280px]:h-full min-[1280px]:w-auto"
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.src}
              data-active={isActive}
              className={`hero-media-slide absolute inset-0 ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div
                className="hero-media-drift relative h-full w-full"
                style={{
                  animationDelay: `${index * -1.6}s`,
                  animationPlayState,
                }}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  unoptimized
                  className="object-cover object-right"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-white from-0% via-white/95 via-18% via-white/60 via-36% to-transparent to-68% min-[1280px]:block"
      />

      {!prefersReducedMotion && (
        <div
          className="absolute bottom-3 right-4 z-20 flex items-center rounded-full border border-white/70 bg-white/85 p-1 backdrop-blur-md min-[600px]:bottom-5 min-[600px]:right-6 min-[1280px]:bottom-7 min-[1280px]:right-8"
          role="group"
          aria-label="トップ画像の切り替え"
        >
          <div className="flex items-center" role="group" aria-label="表示する画像">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`${index + 1}枚目：${slide.label}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  className="group grid h-8 min-w-8 place-items-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                      isActive
                        ? "w-5 bg-brand"
                        : "w-1.5 bg-ink/30 group-hover:bg-ink/60"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-ink/15" />

          <button
            type="button"
            aria-controls="hero-visuals"
            aria-label={isPaused ? "画像の自動切り替えを再生" : "画像の自動切り替えを一時停止"}
            aria-pressed={isPaused}
            onClick={() => setIsPaused((paused) => !paused)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            {isPaused ? (
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                <path d="M4.25 2.65a.75.75 0 0 1 1.14-.64l8 5a.75.75 0 0 1 0 1.28l-8 5a.75.75 0 0 1-1.14-.64v-10Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                <rect x="3.25" y="2.5" width="3.25" height="11" rx="0.75" />
                <rect x="9.5" y="2.5" width="3.25" height="11" rx="0.75" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
