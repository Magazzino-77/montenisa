"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type {
  ArchiveChapter,
  LandingContent,
  LandingSectionKey,
  LandingSectionMarker,
  ProductSlide,
} from "@/lib/shutter";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const renderHeroChars = (text: string, keyPrefix: string) =>
  Array.from(text).map((character, index) => (
    <span
      key={`${keyPrefix}-${index}`}
      data-hero-char={character.trim() ? "true" : undefined}
    >
      {character}
    </span>
  ));

type HeroTextSegment = string | { text: string; highlight: true };

const renderHeroTextSegments = (
  segments: HeroTextSegment[],
  keyPrefix: string,
) =>
  segments.map((segment, segmentIndex) => {
    const text = typeof segment === "string" ? segment : segment.text;
    const characters = renderHeroChars(text, `${keyPrefix}-${segmentIndex}`);

    if (typeof segment === "string") {
      return characters;
    }

    return (
      <span
        key={`${keyPrefix}-highlight-${segmentIndex}`}
        className="font-snell"
      >
        {characters}
      </span>
    );
  });

const renderHeroMixedLine = (
  segments: HeroTextSegment[],
  keyPrefix: string,
  className = "",
) => (
  <span className={`block ${className}`}>
    {renderHeroTextSegments(segments, keyPrefix)}
  </span>
);

const renderHeroStatement = () => {
  return (
    <>
      <span className="relative mx-auto my-4 block aspect-[1.12] w-[clamp(92px,13vw,170px)] md:my-5">
          <Image
            src="/images/hero-scrigno.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 170px, (min-width: 768px) 130px, 96px"
            className="object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
            aria-hidden="true"
          />
      </span>

      {renderHeroMixedLine(
        [
          { text: "Tenuta Montenisa", highlight: true },
          ", nel cuore della Franciacorta,",
        ],
        "hero-bottom-1",
      )}
      {renderHeroMixedLine(
        [
          "è uno ",
          { text: "Scrigno", highlight: true },
          " che custodisce ",
          { text: "Meraviglie", highlight: true },
          ".",
        ],
        "hero-bottom-2",
      )}
      {renderHeroMixedLine(
        [
          "Tra stanze di luce e memoria, ogni oggetto qui conservato ci svela una ",
          { text: "Traccia", highlight: true },
          " e rivela la sua ",
          { text: "Storia", highlight: true },
          ".",
        ],
        "hero-bottom-3",
      )}
    </>
  );
};

type LandingPageProps = {
  content: LandingContent;
};

function CtaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-y border-current px-1.5 py-[18px] leading-none">
      {children}
    </span>
  );
}

function ProductGallerySlider({
  slides,
}: {
  slides: ProductSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRootRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const safeSlides = slides.length > 0 ? slides : [];
  const activeSlide = safeSlides[activeIndex];

  useEffect(() => {
    const root = sliderRootRef.current;
    const activeFrame = frameRefs.current[activeIndex];

    if (!root || !activeFrame) {
      return;
    }

    const ctx = gsap.context(() => {
      const frames = frameRefs.current.filter(
        (frame): frame is HTMLElement => Boolean(frame),
      );
      const thumbs = thumbRefs.current.filter(
        (thumb): thumb is HTMLButtonElement => Boolean(thumb),
      );
      const headline = headlineRef.current;
      const animatable = [...frames, ...thumbs, headline].filter(Boolean);

      // Cancel any in-flight tweens so rapid prev/next clicks can't strand a
      // frame in a half-revealed state.
      gsap.killTweensOf(animatable);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(frames, {
          autoAlpha: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set(activeFrame, { autoAlpha: 1 });
        gsap.set(thumbs, { autoAlpha: 1, y: 0 });
        if (headline) {
          gsap.set(headline, { autoAlpha: 1, x: 0 });
        }
        return;
      }

      // Crossfade the outgoing frame instead of hard-cutting it.
      gsap.to(
        frames.filter((frame) => frame !== activeFrame),
        {
          autoAlpha: 0,
          scale: 1.025,
          duration: 0.5,
          ease: "power2.out",
        },
      );
      gsap.fromTo(
        activeFrame,
        {
          autoAlpha: 0,
          scale: 1.035,
          clipPath: "inset(0% 0% 0% 100%)",
        },
        {
          autoAlpha: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        thumbs,
        {
          y: 12,
          autoAlpha: 0.42,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.055,
        },
      );

      if (headline) {
        gsap.fromTo(
          headline,
          { autoAlpha: 0, x: -92 },
          { autoAlpha: 1, x: 0, duration: 0.72, ease: "power3.out" },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [activeIndex]);

  if (safeSlides.length === 0 || !activeSlide) {
    return null;
  }

  const goToPrevious = () =>
    setActiveIndex((current) =>
      current === 0 ? safeSlides.length - 1 : current - 1,
    );
  const goToNext = () =>
    setActiveIndex((current) =>
      current === safeSlides.length - 1 ? 0 : current + 1,
    );
  const visibleThumbs =
    safeSlides.length > 2
      ? [-1, 0, 1].map((offset) => {
          const index =
            (activeIndex + offset + safeSlides.length) % safeSlides.length;

          return {
            index,
            offset,
            slide: safeSlides[index],
          };
        })
      : safeSlides.map((slide, index) => ({
          index,
          offset: index === activeIndex ? 0 : index < activeIndex ? -1 : 1,
          slide,
        }));

  return (
    <div ref={sliderRootRef} className="contents">
      <h2
        ref={headlineRef}
        className="font-menu text-[clamp(2rem,3.25vw,2.5rem)] font-normal uppercase leading-none text-paper 2xl:text-[2.5rem]"
        data-shutter-key={`product.slides.${activeIndex}.headline`}
      >
        {activeSlide.headline}
      </h2>

      <div
        className="mx-auto w-full max-w-[1280px]"
        data-active-slide={activeIndex}
        data-product-slider
      >
        <div className="relative mx-auto mt-3 aspect-[0.58] w-full max-w-[136px] overflow-visible md:max-w-[160px] lg:max-w-[170px] 2xl:max-w-[210px]">
          {safeSlides.map((slide, index) => (
            <figure
              key={`${slide.image.src}-${index}`}
              ref={(element) => {
                frameRefs.current[index] = element;
              }}
              className={`pointer-events-none absolute inset-0 ${
                index === activeIndex ? "" : "opacity-0"
              }`}
              data-shutter-key={`product.slides.${index}.image`}
              aria-hidden={activeIndex !== index}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(min-width: 1536px) 210px, (min-width: 1024px) 170px, (min-width: 768px) 160px, 42vw"
                className="object-contain object-[50%_50%] mix-blend-lighten"
              />
            </figure>
          ))}

          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              goToPrevious();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToPrevious();
              }
            }}
            className="absolute left-[-0.8rem] top-1/2 z-30 grid h-[58px] w-[58px] -translate-y-1/2 place-items-center opacity-82 transition hover:opacity-100 md:left-[-3.2rem] md:h-[64px] md:w-[64px] 2xl:left-[-4.5rem] 2xl:h-[91px] 2xl:w-[91px]"
            aria-label="Previous image"
          >
            <Image
              src="/images/spumanti-arrow.svg"
              alt=""
              width={91}
              height={91}
              className="h-[64px] w-[64px] max-w-none object-contain 2xl:h-[91px] 2xl:w-[91px]"
            />
          </button>
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              goToNext();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToNext();
              }
            }}
            className="absolute right-[-0.8rem] top-1/2 z-30 grid h-[58px] w-[58px] -translate-y-1/2 place-items-center opacity-82 transition hover:opacity-100 md:right-[-3.2rem] md:h-[64px] md:w-[64px] 2xl:right-[-4.5rem] 2xl:h-[91px] 2xl:w-[91px]"
            aria-label="Next image"
          >
            <Image
              src="/images/spumanti-arrow.svg"
              alt=""
              width={91}
              height={91}
              className="h-[64px] w-[64px] max-w-none rotate-180 object-contain 2xl:h-[91px] 2xl:w-[91px]"
            />
          </button>
        </div>

        {activeSlide.body ? (
          <p
            data-reveal
            className="mx-auto mt-5 max-w-[720px] font-menu text-[0.76rem] leading-6 text-paper/82 md:mt-6 md:text-sm md:leading-7"
            data-shutter-key={`product.slides.${activeIndex}.body`}
          >
            {activeSlide.body}
          </p>
        ) : null}

        <div className="mx-auto mt-7 flex w-screen max-w-none items-center justify-center gap-8 overflow-hidden md:mt-8 md:gap-14 2xl:mt-10">
          {visibleThumbs.map(({ slide, index, offset }) => {
            const isActive = activeIndex === index;
            const sideOverlay =
              offset < 0
                ? "bg-[linear-gradient(90deg,rgba(16,16,17,0.72),rgba(16,16,17,0.38)_58%,rgba(16,16,17,0.18))]"
                : "bg-[linear-gradient(270deg,rgba(16,16,17,0.72),rgba(16,16,17,0.38)_58%,rgba(16,16,17,0.18))]";

            return (
              <button
                key={`thumb-${slide.thumbnail.src}-${index}-${offset}`}
                ref={(element) => {
                  thumbRefs.current[index] = element;
                }}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setActiveIndex(index);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={`group relative shrink-0 overflow-hidden transition duration-500 ${
                  isActive
                    ? "aspect-[2157/1458] w-[min(70vw,520px)] md:w-[min(42vw,640px)]"
                    : "aspect-[2157/1458] w-[min(46vw,320px)] md:w-[min(28vw,430px)]"
                } ${
                  isActive
                    ? "opacity-100"
                    : "opacity-86 hover:opacity-100"
                }`}
                aria-label={`Show ${slide.headline}`}
                aria-current={isActive ? "true" : undefined}
              >
                <Image
                  src={slide.thumbnail.src}
                  alt={slide.thumbnail.alt}
                  fill
                  sizes="(min-width: 1536px) 640px, (min-width: 768px) 42vw, 70vw"
                  className={`object-cover transition duration-700 ${
                    isActive ? "scale-105" : "scale-100 group-hover:scale-105"
                  }`}
                />
                {!isActive ? (
                  <>
                    <span
                      className={`pointer-events-none absolute inset-0 ${sideOverlay} transition-opacity duration-500 group-hover:opacity-70`}
                    />
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,16,17,0.08),rgba(16,16,17,0.46))] transition-opacity duration-500 group-hover:opacity-70" />
                  </>
                ) : null}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-paper transition-transform duration-500 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <a
          href="#archivio"
          className="mx-auto mt-9 inline-flex items-center font-menu text-[0.72rem] uppercase tracking-[0.18em] text-paper/82 transition hover:text-paper md:mt-10"
        >
          <CtaLabel>Scopri di più</CtaLabel>
        </a>
      </div>
    </div>
  );
}

function ArchiveChapterSection({
  archive,
  marker,
}: {
  archive: ArchiveChapter;
  marker: LandingSectionMarker;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const states = archive.states;

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || states.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Everything created inside the context is reverted on cleanup — including
    // the infinite "float" tweens, which previously leaked across re-renders.
    const ctx = gsap.context(() => {
      const stateLayers = gsap.utils.toArray<HTMLElement>(
        "[data-archive-state]",
        stage,
      );
      const copyLayers = gsap.utils.toArray<HTMLElement>(
        "[data-archive-copy]",
        stage,
      );
      const floaters = gsap.utils.toArray<HTMLElement>(
        "[data-archive-float]",
        stage,
      );

      gsap.set(stateLayers, { autoAlpha: 0 });
      gsap.set(copyLayers, { autoAlpha: 0, y: 28 });
      gsap.set(stateLayers[0], { autoAlpha: 1 });
      gsap.set(copyLayers[0], { autoAlpha: 1, y: 0 });

      // Idle drift lives on an inner wrapper so it never competes with the
      // scroll-driven entrance transform on [data-archive-object].
      if (!reduceMotion) {
        floaters.forEach((floater, index) => {
          gsap.to(floater, {
            x: index % 2 === 0 ? 10 : -12,
            y: index % 2 === 0 ? -26 : 24,
            rotation: index % 2 === 0 ? 5.5 : -5,
            scale: index % 2 === 0 ? 1.035 : 1.025,
            duration: 3.6 + index * 0.28,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }

      if (reduceMotion || states.length === 1) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${states.length * 95}%`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          // Middle of the three page pins (tenuta=3, archive=2, cantina=1) so
          // spacers are measured top-to-bottom; see the tenuta ScrollTrigger.
          refreshPriority: 2,
        },
      });

      states.forEach((_, index) => {
        if (index === 0) {
          return;
        }

        const previous = index - 1;
        const transitionStart = previous;

        timeline.to(
          `[data-archive-copy="${previous}"]`,
          {
            autoAlpha: 0,
            y: -24,
            duration: 0.35,
            ease: "power2.inOut",
          },
          transitionStart,
        );
        timeline.to(
          `[data-archive-state="${previous}"]`,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.inOut",
          },
          transitionStart,
        );
        timeline.fromTo(
          `[data-archive-copy="${index}"]`,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          transitionStart + 0.08,
        );
        timeline.fromTo(
          `[data-archive-state="${index}"] [data-archive-object]`,
          { y: 120, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          transitionStart + 0.04,
        );
        timeline.to(
          `[data-archive-state="${index}"]`,
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: "none",
          },
          transitionStart + 0.04,
        );
      });
    }, stage);

    return () => ctx.revert();
  }, [states]);

  if (states.length === 0) {
    return null;
  }

  return (
    <section
      id="archivio"
      ref={stageRef}
      data-section="archive"
      data-archive-stage
      className="archive-grid relative bg-paper"
    >
      <SectionReference
        marker={marker}
        shutterKey="menu.sections.archive.referenceId"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.18] mix-blend-multiply"
        aria-hidden="true"
      >
        <Image
          src="/images/archive-pattern.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1560px] items-center px-5 py-[4.5rem] md:px-8 md:py-24 2xl:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {states.map((state, stateIndex) => (
            <div
              key={`archive-state-${stateIndex}`}
              data-archive-state={stateIndex}
              className="absolute inset-0"
              aria-hidden={stateIndex !== 0}
            >
              {state.objects.map((object, objectIndex) => (
                <div
                  key={`${object.image.src}-${objectIndex}`}
                  data-archive-object
                  className={`absolute ${object.placement ?? ""}`}
                  data-shutter-key={`archive.states.${stateIndex}.objects.${objectIndex}.image`}
                >
                  <div data-archive-float className="absolute inset-0">
                    <img
                      src={object.image.src}
                      alt={object.image.alt}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1180px] text-center">
          <div className="relative min-h-[clamp(16rem,35vw,24rem)] 2xl:min-h-[clamp(18rem,42vw,28rem)]">
            {states.map((state, stateIndex) => (
              <div
                key={`archive-copy-${stateIndex}`}
                data-archive-copy={stateIndex}
                className={
                  stateIndex === 0
                    ? "relative"
                    : "absolute inset-x-0 top-0"
                }
                aria-hidden={stateIndex !== 0}
              >
                <h2
                  className="mx-auto max-w-none whitespace-nowrap font-menu text-[clamp(2.25rem,3.28vw,2.625rem)] font-medium uppercase leading-[0.9] text-ink"
                  data-shutter-key={`archive.states.${stateIndex}.headline`}
                >
                  {state.headline}
                </h2>
                <p
                  className="mx-auto mt-6 max-w-[640px] font-menu text-sm uppercase leading-6 tracking-[0.05em] text-ink/72 md:text-[0.9rem] md:leading-7 2xl:mt-8 2xl:max-w-[680px] 2xl:text-[0.95rem]"
                  data-shutter-key={`archive.states.${stateIndex}.body`}
                >
                  {state.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#tenuta"
            className="relative z-10 mt-8 inline-flex items-center font-menu text-[0.68rem] uppercase tracking-[0.16em] text-ink/58 transition hover:text-wine 2xl:mt-12 2xl:text-[0.72rem] 2xl:tracking-[0.18em]"
            data-shutter-key="archive.cta"
          >
            <CtaLabel>{archive.cta}</CtaLabel>
          </a>
        </div>
      </div>
    </section>
  );
}

function CellarChapterSection({
  cellar,
  marker,
}: {
  cellar: LandingContent["cellar"];
  marker: LandingSectionMarker;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const states = cellar.states;

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || states.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const stateLayers = gsap.utils.toArray<HTMLElement>(
        "[data-cellar-state]",
        stage,
      );
      const copyLayers = gsap.utils.toArray<HTMLElement>(
        "[data-cellar-copy]",
        stage,
      );
      const cellarObjects = gsap.utils.toArray<HTMLElement>(
        "[data-cellar-object]",
        stage,
      );

      gsap.set(stateLayers, { autoAlpha: 1 });
      gsap.set(copyLayers, { autoAlpha: 0, y: 28 });
      gsap.set(cellarObjects, {
        autoAlpha: 1,
        visibility: "hidden",
        y: () => window.innerHeight,
        yPercent: 0,
        scale: 0.96,
      });
      gsap.set(stateLayers[0], { autoAlpha: 1 });
      gsap.set(copyLayers[0], { autoAlpha: 1, y: 0 });

      if (reduceMotion) {
        gsap.set(cellarObjects.slice(0, 3), {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      if (cellarObjects.length <= 3) {
        gsap.set(cellarObjects, {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${Math.max(cellarObjects.length * window.innerHeight * 0.34, 2200)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          // Lowest of the three page pins (tenuta=3, archive=2, cantina=1) so
          // its spacer is measured after the ones above it.
          refreshPriority: 1,
        },
      });

      const objectInterval = 0.58;
      const objectTravelDuration = 1.36;

      cellarObjects.forEach((object, index) => {
        const start = index * objectInterval;

        timeline
          .fromTo(
            object,
            {
              visibility: "visible",
              y: () => window.innerHeight - object.offsetTop + 48,
              scale: 0.96,
            },
            {
              visibility: "visible",
              y: () => -(object.offsetTop + object.offsetHeight + 48),
              scale: 1,
              duration: objectTravelDuration,
              ease: "none",
            },
            start,
          )
          .set(
            object,
            {
              visibility: "hidden",
            },
            start + objectTravelDuration,
          );
      });

      const fadeCopy = (previous: number, next: number, at: number) => {
        if (!copyLayers[previous] || !copyLayers[next]) {
          return;
        }

        timeline
          .to(
            `[data-cellar-copy="${previous}"]`,
            { autoAlpha: 0, y: -30, duration: 0.35, ease: "power2.inOut" },
            at,
          )
          .fromTo(
            `[data-cellar-copy="${next}"]`,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
            at + 0.08,
          );
      };

      fadeCopy(0, 1, objectInterval * 3);
      fadeCopy(1, 2, objectInterval * 6);
      timeline.to(
        {},
        { duration: 0.1 },
        cellarObjects.length * objectInterval + objectTravelDuration * 0.35,
      );
    }, stage);

    return () => ctx.revert();
  }, [states]);

  if (states.length === 0) {
    return null;
  }

  return (
    <section
      ref={stageRef}
      id="cantina"
      data-section="cantina"
      className="relative overflow-hidden bg-paper"
    >
      <SectionReference
        marker={marker}
        shutterKey="menu.sections.cantina.referenceId"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1560px] items-center px-5 py-[4.5rem] md:px-8 md:py-24 2xl:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {states.map((state, stateIndex) => (
            <div
              key={`cellar-state-${stateIndex}`}
              data-cellar-state={stateIndex}
              className="absolute inset-0"
              aria-hidden={stateIndex !== 0}
            >
              {state.objects.map((object, objectIndex) => (
                <div
                  key={`${object.image.src}-${objectIndex}`}
                  data-cellar-object
                  className={`absolute ${object.placement ?? ""}`}
                  data-shutter-key={`cellar.states.${stateIndex}.objects.${objectIndex}.image`}
                >
                  <Image
                    src={object.image.src}
                    alt={object.image.alt}
                    fill
                    sizes="(min-width: 768px) 300px, 40vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1180px] text-center">
          <div className="relative min-h-[clamp(15rem,34vw,23rem)] 2xl:min-h-[clamp(16rem,40vw,26rem)]">
            {states.map((state, stateIndex) => (
              <div
                key={`cellar-copy-${stateIndex}`}
                data-cellar-copy={stateIndex}
                className={
                  stateIndex === 0 ? "relative" : "absolute inset-x-0 top-0"
                }
                aria-hidden={stateIndex !== 0}
              >
                <h2
                  className="mx-auto max-w-none whitespace-nowrap font-menu text-[clamp(2.5rem,4.05vw,3rem)] font-medium uppercase leading-[0.9] text-ink 2xl:text-[3rem]"
                  data-shutter-key={`cellar.states.${stateIndex}.headline`}
                >
                  {state.headline}
                </h2>
                <p
                  className="mx-auto mt-6 max-w-[590px] font-menu text-sm uppercase leading-6 tracking-[0.04em] text-ink/74 md:text-[0.9rem] md:leading-7 2xl:mt-7 2xl:max-w-[620px] 2xl:text-[0.95rem]"
                  data-shutter-key={`cellar.states.${stateIndex}.body`}
                >
                  {state.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#spumanti"
            className="relative z-10 mt-8 inline-flex items-center font-menu text-[0.68rem] uppercase tracking-[0.16em] text-ink transition hover:text-wine 2xl:mt-10 2xl:text-[0.72rem] 2xl:tracking-[0.18em]"
            data-shutter-key="cellar.cta"
          >
            <CtaLabel>{cellar.cta}</CtaLabel>
          </a>
        </div>
      </div>
    </section>
  );
}

function VineyardVisual({
  state,
  index,
}: {
  state: LandingContent["vineyard"]["states"][number];
  index: number;
}) {
  return (
    <div
      data-vineyard-column
      className="relative mx-auto h-[34svh] min-h-[250px] w-full max-w-[680px] md:h-[56svh] lg:h-full lg:max-w-none"
    >
      <figure
        className="absolute left-1/2 top-1/2 h-full w-[70%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 overflow-hidden md:w-[76%] lg:inset-0 lg:w-full lg:max-w-none lg:translate-x-0 lg:translate-y-0"
        data-shutter-key={`vineyard.states.${index}.primaryImage`}
      >
        <Image
          src={state.primaryImage.src}
          alt={state.primaryImage.alt}
          fill
          sizes="(min-width: 1024px) 42vw, 78vw"
          className="object-cover"
        />
      </figure>
    </div>
  );
}

function VineyardCopy({
  state,
  index,
}: {
  state: LandingContent["vineyard"]["states"][number];
  index: number;
}) {
  return (
    <article
      data-vineyard-column
      className="mx-auto flex w-full max-w-[680px] flex-col items-center text-center"
    >
      <h2
        className="max-w-[12ch] font-menu text-[clamp(2.35rem,8vw,2.625rem)] font-normal uppercase leading-[1.08] text-paper lg:text-[2.625rem]"
        data-shutter-key={`vineyard.states.${index}.headline`}
      >
        {state.headline}
      </h2>
      <figure
        className="relative mt-7 h-[180px] w-[150px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:mt-8 md:h-[260px] md:w-[217px]"
        data-shutter-key={`vineyard.states.${index}.secondaryImage`}
      >
        <Image
          src={state.secondaryImage.src}
          alt={state.secondaryImage.alt}
          fill
          sizes="(min-width: 1024px) 217px, 40vw"
          className="object-cover"
        />
      </figure>
      <p
        className="mt-6 max-w-[620px] font-menu text-[0.92rem] leading-[1.58] text-paper/82 md:mt-7 md:text-[1rem] md:leading-[1.75] 2xl:mt-8 2xl:max-w-[651px] 2xl:text-[1.08rem] 2xl:leading-[1.85]"
        data-shutter-key={`vineyard.states.${index}.body`}
      >
        {state.body}
      </p>
      <a
        href="#tenuta"
        className="mt-7 inline-flex items-center font-menu text-[0.72rem] uppercase tracking-[0.18em] text-paper/72 transition hover:text-paper 2xl:mt-8"
      >
        <CtaLabel>Esplora la tenuta</CtaLabel>
      </a>
    </article>
  );
}

function VineyardScrollSection({
  vineyard,
  marker,
}: {
  vineyard: LandingContent["vineyard"];
  marker: LandingSectionMarker;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const states = vineyard.states;

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || states.length === 0) {
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isDesktop) {
      return;
    }

    const ctx = gsap.context(() => {
      const copyLayers = states
        .map((_, index) =>
          stage.querySelector<HTMLElement>(`[data-vineyard-copy="${index}"]`),
        )
        .filter((layer): layer is HTMLElement => Boolean(layer));
      const imageLayers = states
        .map((_, index) =>
          stage.querySelector<HTMLElement>(`[data-vineyard-image="${index}"]`),
        )
        .filter((layer): layer is HTMLElement => Boolean(layer));

      gsap.set(copyLayers, {
        visibility: "hidden",
        opacity: 1,
        y: 0,
      });
      gsap.set(imageLayers, {
        visibility: "hidden",
        yPercent: 110,
        zIndex: 20,
      });
      gsap.set(copyLayers[0], {
        visibility: "visible",
        opacity: 1,
        y: 0,
      });
      gsap.set(imageLayers[0], {
        visibility: "visible",
        yPercent: 0,
        zIndex: 22,
      });

      if (reduceMotion || states.length === 1) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.max(states.length * window.innerHeight * 0.95, 2600)}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          refreshPriority: 1.5,
        },
      });

      let cursor = 0.25;

      states.forEach((_, index) => {
        if (index === 0) {
          return;
        }

        const previousCopy = copyLayers[index - 1];
        const nextCopy = copyLayers[index];
        const previousImage = imageLayers[index - 1];
        const nextImage = imageLayers[index];

        if (!previousCopy || !nextCopy || !previousImage || !nextImage) {
          return;
        }

        timeline
          .set(nextCopy, { visibility: "visible", opacity: 1, y: 0 }, cursor)
          .set(nextImage, { visibility: "visible", zIndex: 30 + index }, cursor)
          .to(
            previousImage,
            {
              yPercent: -110,
              duration: 1.05,
              ease: "none",
            },
            cursor,
          )
          .fromTo(
            nextImage,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.05,
              ease: "none",
            },
            cursor,
          )
          .set(previousImage, { visibility: "hidden" }, cursor + 1.18)
          .set(previousCopy, { visibility: "hidden" }, cursor + 1.18);

        cursor += 1.45;
      });

      timeline.to({}, { duration: 0.6 });
    }, stage);

    return () => ctx.revert();
  }, [states]);

  if (states.length === 0) {
    return null;
  }

  return (
    <section
      ref={stageRef}
      id="vigna"
      data-section="vigna"
      className="relative overflow-hidden bg-[#141414] text-paper"
    >
      <SectionReference
        marker={marker}
        shutterKey="menu.sections.vigna.referenceId"
        tone="dark"
      />

      <div className="space-y-24 px-5 pb-24 pt-[24rem] md:hidden">
        {states.map((state, index) => (
          <div key={`vineyard-mobile-${state.headline}-${index}`} className="grid gap-10">
            <VineyardCopy state={state} index={index} />
            <VineyardVisual state={state} index={index} />
          </div>
        ))}
      </div>

      <div
        data-vineyard-desktop
        className="relative hidden h-[100svh] min-h-[640px] overflow-hidden md:block lg:min-h-[700px] 2xl:min-h-[760px]"
      >
        <div className="mx-auto grid h-full max-w-[1560px] grid-cols-2 gap-20">
          {(["left", "right"] as const).map((side) => (
            <div
              key={`vineyard-column-${side}`}
              className="relative h-full overflow-hidden"
              data-vineyard-desktop-column={side}
            >
              {states.map((state, index) => {
                const imageSide = state.layout === "image-right" ? "right" : "left";
                const copySide = imageSide === "right" ? "left" : "right";

                return imageSide === side ? (
                  <div
                    key={`vineyard-image-${index}`}
                    data-vineyard-image={index}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <VineyardVisual state={state} index={index} />
                  </div>
                ) : copySide === side ? (
                  <div
                    key={`vineyard-copy-${index}`}
                    data-vineyard-copy={index}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    aria-hidden={index !== 0}
                  >
                    <VineyardCopy state={state} index={index} />
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const memoryImageLayouts = [
  "h-[min(23vh,184px)] w-[min(18vh,146px)]",
  "h-[min(28vh,224px)] w-[min(17vh,136px)]",
  "h-[min(25vh,200px)] w-[min(17vh,136px)]",
  "h-[min(23vh,184px)] w-[min(18vh,144px)]",
  "h-[min(27vh,216px)] w-[min(18vh,144px)]",
  "h-[min(22vh,176px)] w-[min(17vh,136px)]",
];

const memoryWordLayouts = [
  {
    text: "Memoria",
    className:
      "left-[120px] top-[38vh] text-[7.8rem] opacity-[0.9] md:text-[9.2rem] lg:text-[10.4rem] 2xl:top-[37vh] 2xl:text-[12.8rem]",
  },
  {
    text: "viva",
    className:
      "left-[900px] top-[56vh] text-[7.4rem] opacity-[0.9] md:text-[8.8rem] lg:text-[10rem] 2xl:top-[57vh] 2xl:text-[12rem]",
  },
  {
    text: "il sogno",
    className:
      "left-[1510px] top-[38vh] text-[7.4rem] opacity-[0.9] md:text-[8.8rem] lg:text-[10rem] 2xl:top-[37vh] 2xl:text-[12rem]",
  },
  {
    text: "delle bollicine",
    className:
      "left-[2120px] top-[56vh] text-[7.2rem] opacity-[0.9] md:text-[8.5rem] lg:text-[9.6rem] 2xl:top-[57vh] 2xl:text-[11.5rem]",
  },
];

const memoryPanelLayouts = [
  {
    left: 290,
    top: "24vh",
    slot: "above Memoria",
    direction: "text-left-image-right",
  },
  {
    left: 285,
    top: "67vh",
    slot: "below Memoria",
    direction: "image-left-text-right",
  },
  {
    left: 875,
    top: "24vh",
    slot: "above viva",
    direction: "text-left-image-right",
  },
  {
    left: 1480,
    top: "63vh",
    slot: "between viva and sogno",
    direction: "text-left-image-right",
  },
  {
    left: 2080,
    top: "22vh",
    slot: "above sogno",
    direction: "image-right-text-left",
  },
  {
    left: 2750,
    top: "24vh",
    slot: "above bollicine",
    direction: "text-left-image-right",
  },
];

function MemoryHorizontalSection({
  memory,
  marker,
}: {
  memory: LandingContent["memory"];
  marker: LandingSectionMarker;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const items = memory.items;
  const trackWidth = Math.max(5000, items.length * 620 + 1200);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || items.length === 0) {
      return;
    }

    let cleanupMemoryScroll = () => {};
    const ctx = gsap.context(() => {
      const track = stage.querySelector<HTMLElement>("[data-memory-track]");
      const words = stage.querySelector<HTMLElement>("[data-memory-words]");

      if (!track || !words) {
        return;
      }

      const getTrackWidth = () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-memory-slot]");
        const contentRight = panels.reduce(
          (maxRight, panel) =>
            Math.max(maxRight, panel.offsetLeft + panel.offsetWidth),
          0,
        );

        return Math.max(
          track.scrollWidth,
          contentRight + Math.min(window.innerWidth * 0.55, 720),
          window.innerWidth,
        );
      };
      const getDistance = () => Math.max(0, getTrackWidth() - window.innerWidth);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.max(getDistance(), 4600)}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });

      timeline.to(
        track,
        {
          x: () => -getDistance(),
          duration: items.length,
          ease: "none",
        },
        0,
      );
      timeline.to(
        words,
        {
          x: () => getDistance() * 0.18,
          force3D: true,
          duration: items.length,
          ease: "none",
        },
        0,
      );

      const refreshMemoryScroll = () => ScrollTrigger.refresh();
      const images = gsap.utils.toArray<HTMLImageElement>("img", track);
      const pendingImages = images.filter((image) => !image.complete);

      pendingImages.forEach((image) => {
        image.addEventListener("load", refreshMemoryScroll, { once: true });
        image.addEventListener("error", refreshMemoryScroll, { once: true });
      });

      window.addEventListener("load", refreshMemoryScroll, { once: true });
      document.fonts?.ready.then(refreshMemoryScroll);

      cleanupMemoryScroll = () => {
        pendingImages.forEach((image) => {
          image.removeEventListener("load", refreshMemoryScroll);
          image.removeEventListener("error", refreshMemoryScroll);
        });
        window.removeEventListener("load", refreshMemoryScroll);
      };
    }, stage);

    return () => {
      cleanupMemoryScroll();
      ctx.revert();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={stageRef}
      data-section="memoria"
      className="relative overflow-hidden bg-[#141414] text-paper"
    >
      <SectionReference
        marker={marker}
        shutterKey="menu.sections.memoria.referenceId"
        tone="dark"
      />

      <div
        data-memory-track
        className="relative h-[100svh] min-h-[640px] lg:min-h-[700px] 2xl:min-h-[760px]"
        style={{ width: `${trackWidth}px` }}
      >
        <div
          data-memory-words
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-menu font-normal uppercase leading-[0.75] text-white will-change-transform"
        >
          {memoryWordLayouts.map((word) => (
            <span
              key={word.text}
              data-memory-word={word.text}
              className={`absolute ${word.className}`}
            >
              {word.text}
            </span>
          ))}
        </div>

        {items.map((item, index) => {
          const fallbackPanel = {
            left: 410 + index * 720,
            top: index % 2 === 0 ? "40vh" : "64vh",
            direction: "image-left-text-right",
          };
          const panelLayout =
            memoryPanelLayouts[index % memoryPanelLayouts.length] ??
            fallbackPanel;
          const imageLayout = memoryImageLayouts[index % memoryImageLayouts.length];
          const imageFirst =
            panelLayout.direction === "image-left-text-right" ||
            panelLayout.direction === "image-right-text-left";
          const reverseOrder =
            panelLayout.direction === "text-left-image-right" ||
            panelLayout.direction === "image-right-text-left";
          const memoryImage = item.image ? (
            <figure
              data-memory-image
              className={`pointer-events-none relative shrink-0 overflow-hidden shadow-[0_28px_70px_rgba(0,0,0,0.38)] ${imageLayout}`}
              data-shutter-key={`memory.items.${index}.image`}
              aria-hidden="true"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 768px) 240px, 54vw"
                className="object-cover"
              />
            </figure>
          ) : null;
          const memoryText = (
            <article
              data-memory-panel
              className="max-w-[260px] text-paper"
            >
              <p
                className="font-menu text-[1.1rem] leading-none text-paper md:text-[1.35rem]"
                data-shutter-key={`memory.items.${index}.number`}
              >
                ({item.number})
              </p>
              <h3
                className="mt-2 font-menu text-[0.72rem] uppercase leading-[1.08] text-paper md:text-[0.82rem]"
                data-shutter-key={`memory.items.${index}.headline`}
              >
                {item.headline}
              </h3>
              <p
                className="mt-2 max-w-[245px] font-menu text-[0.68rem] leading-[1.25] text-paper/84 md:text-[0.76rem]"
                data-shutter-key={`memory.items.${index}.body`}
              >
                {item.body}
              </p>
            </article>
          );

          return (
            <div
              key={`${item.number}-${item.headline}`}
              className={`absolute z-20 flex items-start gap-6 ${reverseOrder ? "flex-row-reverse" : ""}`}
              style={{ left: `${panelLayout.left}px`, top: panelLayout.top }}
              data-memory-slot={panelLayout.slot}
            >
              {imageFirst ? memoryImage : memoryText}
              {imageFirst ? memoryText : memoryImage}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionReference({
  marker,
  shutterKey,
}: {
  marker: LandingSectionMarker;
  shutterKey?: string;
  tone?: "light" | "dark";
}) {
  const id = marker.referenceId;

  return (
    <span
      id={id}
      className="pointer-events-none absolute left-0 top-0 h-px w-px scroll-mt-36 overflow-hidden opacity-0"
      data-shutter-key={shutterKey}
      aria-hidden="true"
    />
  );
}

type MenuState = {
  activeSection: LandingSectionKey;
  isDark: boolean;
  sectionLabel: string;
  showSectionLabel: boolean;
};

function SiteMenu({
  content,
  menuState,
}: {
  content: LandingContent;
  menuState: MenuState;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tone = menuState.isDark
    ? {
        background: "bg-ink",
        text: "text-[#f1efee]",
        rule: "bg-[#f1efee]/36",
        logo: content.brand.wordmark.light,
        crest: content.brand.crest.light,
        diamond: content.brand.diamond.light,
      }
    : {
        background: "bg-[#f7f4ef]",
        text: "text-ink",
        rule: "bg-ink/32",
        logo: content.brand.wordmark.dark,
        crest: content.brand.crest.dark,
        diamond: content.brand.diamond.dark,
      };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 ${tone.background} ${tone.text} transition-colors duration-500`}
      data-menu-theme={menuState.isDark ? "dark" : "light"}
    >
      <div className="mx-auto max-w-[1568px] px-5 pt-3 md:px-8 md:pt-4 2xl:pt-7">
        <div className="relative flex h-[64px] items-center justify-between md:h-[68px] md:items-end md:pb-4 2xl:h-[80px] 2xl:pb-5">
          <a
            href="#top"
            className="relative block h-[32px] w-[158px] shrink-0 md:h-[37px] md:w-[180px] 2xl:h-[41px] 2xl:w-[200px]"
            aria-label={content.brand.homeAriaLabel}
          >
            <Image
              src={tone.logo.src}
              alt={tone.logo.alt}
              fill
              priority
              sizes="(min-width: 1536px) 200px, (min-width: 768px) 180px, 158px"
              className="object-contain"
            />
          </a>

          <a
            href="#top"
            className="absolute left-1/2 top-1/2 block h-[54px] w-[72px] -translate-x-1/2 -translate-y-1/2 md:h-[56px] md:w-[72px] 2xl:h-[65px] 2xl:w-[84px]"
            aria-label={content.brand.crestAriaLabel}
          >
            <Image
              src={tone.crest.src}
              alt={tone.crest.alt}
              fill
              priority
              sizes="(min-width: 1536px) 84px, (min-width: 768px) 72px, 72px"
              className="object-contain"
            />
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-[1.55rem] font-menu text-[0.7rem] font-semibold uppercase leading-none tracking-[0.07em] xl:flex 2xl:gap-[2.15rem] 2xl:text-[0.78rem] 2xl:tracking-[0.08em]"
          >
            {content.navigation.map((item, index) => {
              return (
                <a
                  key={item.href}
                  className="whitespace-nowrap transition-opacity hover:opacity-65"
                  data-shutter-key={`navigation.${index}.label`}
                  href={item.href}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="relative z-10 grid h-9 w-9 place-items-center border border-current/22 transition hover:bg-current/8 xl:hidden"
            aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">
              {isMenuOpen ? "Chiudi menu" : "Apri menu"}
            </span>
            <span className="flex w-4 flex-col gap-[5px]" aria-hidden="true">
              <span
                className={`h-px w-full bg-current transition ${
                  isMenuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-px w-full bg-current transition ${
                  isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div className={`h-px w-full ${tone.rule}`} />

        <div
          id="site-mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 xl:hidden ${
            isMenuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="flex justify-center overflow-hidden">
            <nav
              aria-label="Primary navigation"
              className="grid w-full max-w-[520px] gap-2 py-3 font-menu text-[0.68rem] font-semibold uppercase tracking-[0.09em] sm:grid-cols-2"
            >
              {content.navigation.map((item, index) => (
                <a
                  key={item.href}
                  className="border border-current/12 px-3 py-2.5 text-center transition hover:bg-current/8"
                  data-shutter-key={`navigation.${index}.label`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ${
            menuState.showSectionLabel
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!menuState.showSectionLabel}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-center gap-3 py-2 md:py-1.5 2xl:gap-4 2xl:py-[8.5px]">
              <Image
                src={tone.diamond.src}
                alt={tone.diamond.alt}
                width={15}
                height={15}
                className="h-[10px] w-[10px] md:h-[11px] md:w-[11px] 2xl:h-[15px] 2xl:w-[15px]"
              />
              <p
                className="font-menu text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] md:text-[0.72rem] 2xl:text-sm 2xl:tracking-[0.16em]"
                data-shutter-key={`menu.sections.${menuState.activeSection}.menuLabel`}
              >
                {menuState.sectionLabel}
              </p>
              <Image
                src={tone.diamond.src}
                alt={tone.diamond.alt}
                width={15}
                height={15}
                className="h-[10px] w-[10px] md:h-[11px] md:w-[11px] 2xl:h-[15px] 2xl:w-[15px]"
              />
            </div>
            <div className={`h-px w-full ${tone.rule}`} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function LandingPage({ content }: LandingPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuState, setMenuState] = useState<MenuState>({
    activeSection: "hero",
    isDark: content.menu.darkSections.includes("hero"),
    sectionLabel: content.menu.sections.hero.menuLabel,
    showSectionLabel: false,
  });

  const handleSmoothAnchorClick = (event: MouseEvent<HTMLDivElement>) => {
    const clickTarget =
      event.target instanceof Element ? event.target : event.currentTarget;
    const link = clickTarget.closest<HTMLAnchorElement>('a[href^="#"]');

    if (!link) {
      return;
    }

    const hash = link.hash;

    if (!hash || hash === "#") {
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));

    if (!target) {
      return;
    }

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const headerHeight =
      document.querySelector<HTMLElement>("header")?.offsetHeight ?? 0;
    const isSectionTarget =
      target.matches("[data-section]") ||
      ["SECTION", "FOOTER", "MAIN"].includes(target.tagName);
    const targetDocumentTop = isSectionTarget
      ? target.offsetTop
      : target.getBoundingClientRect().top + window.scrollY;
    const targetY =
      hash === "#top"
        ? 0
        : targetDocumentTop - headerHeight - 18;

    if (reduceMotion) {
      window.scrollTo(0, Math.max(0, targetY));
      window.history.pushState(null, "", hash);
      return;
    }

    gsap.to(window, {
      duration: 1.15,
      ease: "power3.inOut",
      // ScrollToPlugin keeps in sync with ScrollTrigger; autoKill yields the
      // tween the moment the user scrolls, so it never fights manual input.
      scrollTo: { y: Math.max(0, targetY), autoKill: true },
      overwrite: "auto",
      onComplete: () => {
        window.history.pushState(null, "", hash);
      },
    });
  };

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    let heroVideoTicker: (() => void) | null = null;

    const context = gsap.context(() => {
      const darkMenuSections = new Set(content.menu.darkSections);
      const updateMenu = (section: LandingSectionKey) => {
        setMenuState({
          activeSection: section,
          isDark: darkMenuSections.has(section),
          sectionLabel:
            content.menu.sections[section]?.menuLabel ??
            content.menu.sections.hero.menuLabel,
          showSectionLabel: section !== "hero",
        });
      };

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((element) => {
        const section = (element.dataset.section ?? "hero") as LandingSectionKey;

        ScrollTrigger.create({
          trigger: element,
          start: "top 38%",
          end: "bottom 38%",
          onEnter: () => updateMenu(section),
          onEnterBack: () => updateMenu(section),
        });
      });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!reduceMotion) {
        // fromTo (not from): the reveal targets are hidden via CSS for SSR, so
        // an explicit start state is required or they would animate 0 -> 0.
        gsap.fromTo(
          "[data-hero-reveal]",
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.12,
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 46, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 82%",
                once: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((element) => {
          gsap.to(element, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });

        const heroCharacters = gsap.utils.toArray<HTMLElement>(
          "[data-hero-text] [data-hero-char]",
        );
        const heroVideo =
          document.querySelector<HTMLVideoElement>("[data-hero-video]");

        if (heroCharacters.length > 0) {
          const heroCharacterStagger = 0.026;
          const heroLetterGlowDuration = 0.72;
          const heroReadingDuration =
            heroLetterGlowDuration +
            Math.max(0, heroCharacters.length - 1) * heroCharacterStagger;

          gsap.set(heroCharacters, {
            color: "rgba(247, 244, 239, 0.24)",
            textShadow: "0 0 0 rgba(247, 244, 239, 0)",
          });

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-section='hero']",
              start: "top top",
              end: "+=4200",
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              refreshPriority: 4,
              scrub: 0.45,
            },
          });

          heroTimeline.fromTo(
            heroCharacters,
            {
              color: "rgba(247, 244, 239, 0.24)",
              textShadow: "0 0 0 rgba(247, 244, 239, 0)",
            },
            {
              color: "rgba(247, 244, 239, 0.96)",
              textShadow: "0 0 18px rgba(247, 244, 239, 0.28)",
              duration: heroLetterGlowDuration,
              ease: "none",
              stagger: heroCharacterStagger,
            },
            0,
          );

          if (heroVideo) {
            const scrubVideo = () => {
              const duration = heroVideo.duration;

              if (!Number.isFinite(duration) || duration <= 0) {
                return;
              }

              const maxTime = Math.max(0, duration - 0.04);
              let targetTime = 0;
              let renderedTime = heroVideo.currentTime || 0;

              if (heroVideoTicker) {
                gsap.ticker.remove(heroVideoTicker);
              }

              heroVideo.muted = true;
              heroVideo.playsInline = true;
              heroVideo.preload = "auto";
              heroVideo.setAttribute("webkit-playsinline", "true");

              void heroVideo
                .play()
                .then(() => {
                  heroVideo.pause();
                  heroVideo.currentTime = renderedTime;
                })
                .catch(() => {
                  heroVideo.pause();
                });

              heroTimeline.eventCallback("onUpdate", () => {
                const timelineProgress = Math.min(
                  heroTimeline.time() / heroReadingDuration,
                  1,
                );
                targetTime = timelineProgress * maxTime;
              });

              heroVideoTicker = () => {
                const delta = targetTime - renderedTime;

                if (Math.abs(delta) < 0.001) {
                  return;
                }

                renderedTime += delta * 0.22;

                if (Math.abs(heroVideo.currentTime - renderedTime) > 0.01) {
                  heroVideo.currentTime = Math.max(
                    0,
                    Math.min(maxTime, renderedTime),
                  );
                }
              };

              gsap.ticker.add(heroVideoTicker);
              ScrollTrigger.refresh();
            };

            heroVideo.pause();
            heroVideo.currentTime = 0;

            if (heroVideo.readyState >= 1) {
              scrubVideo();
            } else {
              heroVideo.addEventListener("loadedmetadata", scrubVideo, {
                once: true,
              });
            }
          }
        }

        const tenutaStage = document.querySelector<HTMLElement>(
          "[data-tenuta-reveal]",
        );

        if (tenutaStage) {
          const tenutaVisual = tenutaStage.querySelector<HTMLElement>(
            "[data-tenuta-visual]",
          );
          const tenutaText = gsap.utils.toArray<HTMLElement>(
            "[data-tenuta-heading], [data-tenuta-copy]",
            tenutaStage,
          );
          const maskOpenings = {
            left: tenutaVisual?.querySelector<SVGPathElement>(
              '[data-tenuta-mask-opening="left"]',
            ),
            center: tenutaVisual?.querySelector<SVGPathElement>(
              '[data-tenuta-mask-opening="center"]',
            ),
            right: tenutaVisual?.querySelector<SVGPathElement>(
              '[data-tenuta-mask-opening="right"]',
            ),
          };
          const archPath = ({
            x,
            y,
            radius,
            right,
            bottom = 650,
          }: {
            x: number;
            y: number;
            radius: number;
            right: number;
            bottom?: number;
          }) =>
            `M${x} ${bottom} L${x} ${y} A${radius} ${radius} 0 0 1 ${right} ${y} L${right} ${bottom} Z`;
          const interpolate = (from: number, to: number, progress: number) =>
            from + (to - from) * progress;
          const tenutaMaskEase = gsap.parseEase("power2.inOut");
          const setTenutaMaskProgress = (progress: number) => {
            const centerProgress = tenutaMaskEase(progress);
            const sideProgress = Math.min(progress * 1.35, 1);
            const centerBottom = interpolate(650, 860, centerProgress);
            maskOpenings.left?.setAttribute(
              "d",
              archPath({
                x: interpolate(82, -620, sideProgress),
                y: interpolate(320, 180, sideProgress),
                radius: interpolate(150, 300, sideProgress),
                right: interpolate(382, -110, sideProgress),
                bottom: interpolate(650, 820, sideProgress),
              }),
            );
            maskOpenings.center?.setAttribute(
              "d",
              archPath({
                x: interpolate(450, -320, centerProgress),
                y: interpolate(300, -560, centerProgress),
                radius: interpolate(150, 920, centerProgress),
                right: interpolate(750, 1520, centerProgress),
                bottom: centerBottom,
              }),
            );
            maskOpenings.right?.setAttribute(
              "d",
              archPath({
                x: interpolate(818, 1310, sideProgress),
                y: interpolate(320, 180, sideProgress),
                radius: interpolate(150, 300, sideProgress),
                right: interpolate(1118, 1820, sideProgress),
                bottom: interpolate(650, 820, sideProgress),
              }),
            );
          };

          setTenutaMaskProgress(0);

          const getTenutaTopOffset = () =>
            Math.max(
              0,
              document.querySelector<HTMLElement>("header")?.getBoundingClientRect()
                .bottom ?? 0,
            );
          const getElementDocumentTop = (element: HTMLElement | null) => {
            let top = 0;
            let current: HTMLElement | null = element;

            while (current) {
              top += current.offsetTop;
              current = current.offsetParent as HTMLElement | null;
            }

            return top;
          };
          const tenutaTimelineRef: {
            current?: gsap.core.Timeline & {
              scrollTrigger?: { start: number };
            };
          } = {};
          const getTenutaTargetFrame = () => {
            const visualWidth =
              tenutaVisual?.offsetWidth ?? tenutaStage.offsetWidth;
            const visualHeight =
              tenutaVisual?.offsetHeight ?? tenutaStage.offsetHeight;
            const triggerStart =
              tenutaTimelineRef.current?.scrollTrigger?.start ??
              window.scrollY;
            const visualTopAtPin =
              getElementDocumentTop(tenutaVisual ?? tenutaStage) -
              triggerStart;
            const targetTop = getTenutaTopOffset();
            const targetHeight = Math.max(
              1,
              window.innerHeight - targetTop + 64,
            );
            const targetScale = Math.max(
              window.innerWidth / visualWidth,
              targetHeight / visualHeight,
            );

            return {
              scale: targetScale,
              x: 0,
              y: targetTop - visualTopAtPin,
            };
          };

          const tenutaTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: tenutaStage,
                start: () => `top top+=${getTenutaTopOffset() + 12}`,
                end: "+=1800",
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                // Highest of the three page pins (tenuta=3, archive=2,
                // cantina=1) so spacers are restored top-to-bottom during
                // refresh; otherwise lower pins (created earlier, in child
                // effects) measure their start before this spacer exists and
                // engage too early.
                refreshPriority: 3,
                scrub: true,
                onUpdate: (self) => setTenutaMaskProgress(self.progress),
              },
            });
          tenutaTimelineRef.current = tenutaTimeline as gsap.core.Timeline & {
            scrollTrigger?: { start: number };
          };
          tenutaTimeline
            .fromTo(
              tenutaVisual ?? tenutaStage,
              { x: 0, y: 0, scale: 1 },
              {
                x: () => getTenutaTargetFrame().x,
                y: () => getTenutaTargetFrame().y,
                scale: () => getTenutaTargetFrame().scale,
                transformOrigin: "center top",
                force3D: true,
                ease: "none",
              },
              0,
            )
            .fromTo(
              "[data-tenuta-video]",
              {
                scale: 1.08,
              },
              {
                scale: 1,
                ease: "none",
              },
              0,
            )
            .fromTo(
              "[data-tenuta-video-shade]",
              {
                autoAlpha: 0.22,
              },
              {
                autoAlpha: 0.08,
                ease: "none",
              },
              0,
            )
            .to(
              tenutaText,
              {
                y: (index) => (index === 0 ? -34 : 72),
                autoAlpha: 0,
                duration: 0.16,
                ease: "power1.out",
              },
              0,
            )
            .to(
              "[data-tenuta-mask-surface]",
              {
                opacity: 0.92,
                ease: "none",
              },
              0,
            );

        }
      }

      // Recompute trigger positions once webfonts have swapped in; otherwise
      // the layout shift leaves pins and reveals starting at the wrong scroll Y.
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, rootRef);

    return () => {
      if (heroVideoTicker) {
        gsap.ticker.remove(heroVideoTicker);
      }
      context.revert();
    };
  }, [content.menu.darkSections, content.menu.sections]);

  return (
    <div
      ref={rootRef}
      onClick={handleSmoothAnchorClick}
      className="grain min-h-screen overflow-hidden bg-background text-ink"
    >
      <SiteMenu content={content} menuState={menuState} />

      <main id="top">
        <section
          data-section="hero"
          className="relative flex min-h-[100svh] flex-col bg-ink px-5 pb-12 pt-28 text-paper md:px-8 md:pt-32 2xl:pb-14 2xl:pt-44"
        >
          <SectionReference
            marker={content.menu.sections.hero}
            shutterKey="menu.sections.hero.referenceId"
            tone="dark"
          />
          <div className="absolute inset-0 opacity-[0.68]">
            <video
              data-hero-video
              className="h-full w-full scale-105 object-cover"
              muted
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={content.hero.image.src}
              aria-label={content.hero.image.alt}
            >
              <source
                src="/videos/capitole-entrance-scrub.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,16,17,0.14),rgba(16,16,17,0.56)_72%),linear-gradient(180deg,rgba(16,16,17,0.12),rgba(16,16,17,0.62))]" />

          <div className="relative z-10 flex w-full flex-1 items-center justify-center">
            <div className="mx-auto max-w-[1180px] text-center">
                <h1
                  data-hero-reveal
                  data-hero-text
                  className="mx-auto max-w-[46ch] font-menu text-[clamp(1.1rem,1.82vw,2rem)] font-normal leading-[1.05] text-paper md:leading-[1] 2xl:max-w-[58ch] 2xl:text-[clamp(1.2rem,2.1vw,2.25rem)]"
                  data-shutter-key="hero.headline"
                >
                  {renderHeroStatement()}
                </h1>
            </div>
          </div>

        </section>

        <section
          id="tenuta"
          data-section="tenuta"
          className="relative bg-paper px-5 pb-0 pt-12 md:px-8 md:pt-16"
        >
          <SectionReference
            marker={content.menu.sections.tenuta}
            shutterKey="menu.sections.tenuta.referenceId"
          />
          <div className="mx-auto max-w-[1560px]">
            <div
              className="relative mx-auto w-full max-w-[1120px]"
              data-tenuta-reveal
            >
              <h2
                data-tenuta-heading
                className="relative z-30 mx-auto mb-4 max-w-full text-center font-snell text-[clamp(1.8rem,3.55vw,2.625rem)] font-normal uppercase leading-[0.95] text-ink md:mb-5 2xl:text-[2.625rem]"
                data-shutter-key="introduction.headline"
              >
                {content.introduction.headline}
              </h2>
              <div
                className="relative z-20 h-[58vw] min-h-[320px] w-full overflow-hidden outline-none md:h-[590px]"
                data-tenuta-visual
                data-shutter-key="introduction.videoPlaceholder"
              >
                <div
                  className="absolute inset-0 z-0 overflow-hidden"
                  data-tenuta-video
                  aria-hidden="true"
                >
                  <Image
                    src="/images/tenuta-arches-static.png"
                    alt={content.introduction.image!.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="scale-105 object-cover object-[50%_52%]"
                  />
                  <div
                    className="absolute inset-0 bg-ink"
                    data-tenuta-video-shade
                  />
                </div>
                <svg
                  className="pointer-events-none absolute -inset-[1px] z-10 h-[calc(100%+2px)] w-[calc(100%+2px)]"
                  viewBox="0 0 1200 700"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <mask
                      id="tenuta-arch-openings"
                      maskUnits="userSpaceOnUse"
                      x="-1800"
                      y="-1800"
                      width="4800"
                      height="3600"
                    >
                      <rect
                        x="-1800"
                        y="-1800"
                        width="4800"
                        height="3600"
                        fill="white"
                      />
                      <path
                        data-tenuta-mask-opening="left"
                        d="M82 650 L82 320 A150 150 0 0 1 382 320 L382 650 Z"
                        fill="black"
                      />
                      <path
                        data-tenuta-mask-opening="center"
                        d="M450 650 L450 300 A150 150 0 0 1 750 300 L750 650 Z"
                        fill="black"
                      />
                      <path
                        data-tenuta-mask-opening="right"
                        d="M818 650 L818 320 A150 150 0 0 1 1118 320 L1118 650 Z"
                        fill="black"
                      />
                    </mask>
                  </defs>
                  <rect
                    data-tenuta-mask-surface
                    x="-1800"
                    y="-1800"
                    width="4800"
                    height="3600"
                    fill="var(--paper)"
                    mask="url(#tenuta-arch-openings)"
                  />
                </svg>
              </div>

              <div
                data-tenuta-copy
                className="relative z-30 mx-auto mt-8 max-w-[720px] text-center font-menu text-sm leading-7 text-ink/68 md:text-base"
              >
                <p data-shutter-key="introduction.body">
                  {content.introduction.body}
                </p>
                <a
                  href="#spumanti"
                  className="mt-8 inline-flex items-center font-menu text-[0.72rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
                  data-shutter-key="introduction.cta"
                >
                  <CtaLabel>{content.introduction.cta}</CtaLabel>
                </a>
            </div>
          </div>
          </div>
        </section>

        <section
          id="spumanti"
          data-section="corallo"
          className="relative bg-ink px-5 py-[4.5rem] text-paper md:px-8 md:py-24 2xl:py-28"
        >
            <SectionReference
              marker={content.menu.sections.corallo}
              shutterKey="menu.sections.corallo.referenceId"
              tone="dark"
            />
          <div className="mx-auto max-w-[1560px]">
            <div className="mx-auto grid max-w-[1180px] gap-10 text-center">
              <ProductGallerySlider slides={content.product.slides} />
            </div>
          </div>
        </section>

        <ArchiveChapterSection
          archive={content.archive}
          marker={content.menu.sections.archive}
        />

        <VineyardScrollSection
          vineyard={content.vineyard}
          marker={content.menu.sections.vigna}
        />

        <CellarChapterSection
          cellar={content.cellar}
          marker={content.menu.sections.cantina}
        />

        <MemoryHorizontalSection
          memory={content.memory}
          marker={content.menu.sections.memoria}
        />
      </main>

      <footer
        id="contatti"
        data-section="contatti"
        className="relative bg-[#f1f1f1] px-5 py-7 text-black md:px-8 md:py-6 2xl:py-10"
      >
        <div className="mx-auto flex min-h-[220px] max-w-[1560px] flex-col justify-between gap-6 font-menu uppercase tracking-[0.08em] md:min-h-[180px] 2xl:min-h-[260px] 2xl:gap-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start 2xl:gap-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-start">
              <div className="max-w-[270px] text-[0.64rem] font-medium leading-[1.7] md:text-[0.72rem]">
                <p className="font-bold">Dove siamo</p>
                <p>Via Paolo VI, 62 - 25046 Cazzago San Martino BS</p>
              </div>

              <div className="max-w-[360px] text-[0.64rem] font-medium leading-[1.7] md:text-[0.72rem]">
                <p className="font-bold">Wine Shop/Visite</p>
                <p>+39 345 0443240</p>
                <p>T. +39 030 7750838</p>
              </div>
            </div>

            <div className="text-[0.64rem] font-medium leading-[1.7] md:justify-self-center md:text-center md:text-[0.72rem]">
              <a
                className="underline underline-offset-4 transition hover:text-wine"
                href="#"
              >
                Guida alla degustazione
              </a>
            </div>

            <div className="grid gap-5 text-[0.64rem] font-medium leading-[1.7] md:grid-cols-[auto_auto] md:justify-self-end md:text-right md:text-[0.72rem] 2xl:gap-6">
              <div>
                <p className="font-bold">Seguici</p>
                <div className="mt-3 grid gap-1.5 md:justify-items-end 2xl:mt-5">
                  <a className="underline underline-offset-4 transition hover:text-wine" href="#">
                    Facebook
                  </a>
                  <a className="underline underline-offset-4 transition hover:text-wine" href="#">
                    Instagram
                  </a>
                </div>
              </div>
              <div>
                <p className="font-bold">Lingua</p>
                <p className="mt-3 grid gap-1.5 2xl:mt-5">
                  <span className="font-extrabold">ITA</span>
                  <span>ENG</span>
                  <span>DE</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center 2xl:gap-8">
            <div className="space-y-4 md:self-end 2xl:space-y-5">
              <div className="h-px w-full bg-black/30" />
              <p className="text-[0.48rem] font-bold leading-none tracking-[0.16em] md:text-[0.54rem]">
                ©MarchesiAntinori 2027
              </p>
            </div>

            <img
              src="/figma/footer/livello-8.svg"
              alt="Marchese Antinori crest"
              className="mx-auto aspect-[128.109/97.6713] w-[64px] object-contain 2xl:w-[96px]"
            />

            <div className="space-y-4 text-left md:self-end md:text-right 2xl:space-y-5">
              <div className="h-px w-full bg-black/30" />
              <p className="text-[0.48rem] font-bold leading-none tracking-[0.16em] md:text-[0.54rem]">
                Privacy&nbsp;&nbsp;.&nbsp;&nbsp; Terms&nbsp;&nbsp;.&nbsp;&nbsp; Cookies
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
