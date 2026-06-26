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

const renderHeroLine = (text: string, keyPrefix: string, className = "") => (
  <span className={`block ${className}`}>{renderHeroChars(text, keyPrefix)}</span>
);

const renderHeroStatement = () => {
  const wrapRows = [
    {
      left: "Tra stanze di",
      right: "luce e memoria,",
      leftClass: "-mr-[0.35em]",
      rightClass: "-ml-[0.35em]",
    },
    {
      left: "ogni oggetto",
      right: "conserva",
      leftClass: "-mr-[1.1em]",
      rightClass: "-ml-[1.1em]",
    },
    {
      left: "una Traccia che",
      right: "rivela una Storia.",
      leftClass: "-mr-[0.65em]",
      rightClass: "-ml-[0.65em]",
    },
    {
      left: "Qui la terra",
      right: "diventa materia,",
      leftClass: "-mr-[1.15em]",
      rightClass: "-ml-[1.15em]",
    },
    {
      left: "i vigneti origine,",
      right: "le cantine tempo,",
      leftClass: "-mr-[0.55em]",
      rightClass: "-ml-[0.55em]",
    },
    {
      left: "il servizio rito.",
      right: "Le cuvée sono Tesori,",
      leftClass: "-mr-[0.1em]",
      rightClass: "-ml-[0.1em]",
    },
  ];

  return (
    <>
      {renderHeroLine("Tenuta Montenisa,", "hero-top-1", "font-medium")}
      {renderHeroLine("nel cuore della Franciacorta,", "hero-top-2")}
      {renderHeroLine(
        "è uno scrigno che custodisce Meraviglie.",
        "hero-top-3",
      )}

      <span className="relative mx-auto my-0 grid w-full max-w-[29ch] grid-cols-[minmax(0,1fr)_clamp(78px,10vw,136px)_minmax(0,1fr)] items-center gap-x-0.5 md:my-1 md:gap-x-1.5">
        <span className="relative z-10 col-start-2 row-span-6 row-start-1 block aspect-[1.12] w-[112%] -translate-x-[5%] self-center">
          <Image
            src="/images/hero-scrigno.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 150px, (min-width: 768px) 118px, 88px"
            className="object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
            aria-hidden="true"
          />
        </span>

        {wrapRows.flatMap(({ left, right, leftClass, rightClass }, rowIndex) => [
          <span
            key={`hero-wrap-left-${rowIndex}`}
            className={`col-start-1 text-right leading-[1.03] ${leftClass}`}
          >
            {renderHeroChars(left, `hero-wrap-left-${rowIndex}`)}
          </span>,
          <span
            key={`hero-wrap-right-${rowIndex}`}
            className={`col-start-3 text-left leading-[1.03] ${rightClass}`}
          >
            {renderHeroChars(right, `hero-wrap-right-${rowIndex}`)}
          </span>,
        ])}
      </span>

      {renderHeroLine(
        "protetti dalla Tenuta e svelati una a una a chi sa guardare.",
        "hero-bottom-1",
      )}
      {renderHeroLine(
        "Perché ogni meraviglia attende solo",
        "hero-bottom-2",
        "mt-1 font-medium",
      )}
      {renderHeroLine("di essere scoperta.", "hero-bottom-3", "font-medium")}
    </>
  );
};

type LandingPageProps = {
  content: LandingContent;
};

function CtaDivider({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/cta-divider.svg"
      alt=""
      width={218}
      height={17}
      className={`h-auto w-[218px] object-contain ${className}`}
      aria-hidden="true"
    />
  );
}

function ProductGallerySlider({
  slides,
}: {
  slides: ProductSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const safeSlides = slides.length > 0 ? slides : [];
  const activeSlide = safeSlides[activeIndex];

  useEffect(() => {
    const activeFrame = frameRefs.current[activeIndex];

    if (!activeFrame) {
      return;
    }

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
        gsap.set(headline, { autoAlpha: 1, y: 0 });
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
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" },
      );
    }
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
    <>
      <h2
        ref={headlineRef}
        className="font-snell text-[clamp(2.7rem,4.65vw,4rem)] font-medium italic leading-none"
        data-shutter-key={`product.slides.${activeIndex}.headline`}
      >
        {activeSlide.headline}
      </h2>

      <div
        className="mx-auto w-full max-w-[1180px]"
        data-active-slide={activeIndex}
        data-product-slider
      >
        <div className="relative mx-auto aspect-[0.75] w-full max-w-[420px] overflow-visible">
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
                sizes="(min-width: 768px) 420px, 86vw"
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
            className="absolute left-[-0.8rem] top-1/2 z-30 grid h-[72px] w-[72px] -translate-y-1/2 place-items-center opacity-82 transition hover:opacity-100 md:left-[-4.5rem] md:h-[91px] md:w-[91px]"
            aria-label="Previous image"
          >
            <Image
              src="/images/spumanti-arrow.svg"
              alt=""
              width={91}
              height={91}
              className="h-[91px] w-[91px] max-w-none object-contain"
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
            className="absolute right-[-0.8rem] top-1/2 z-30 grid h-[72px] w-[72px] -translate-y-1/2 place-items-center opacity-82 transition hover:opacity-100 md:right-[-4.5rem] md:h-[91px] md:w-[91px]"
            aria-label="Next image"
          >
            <Image
              src="/images/spumanti-arrow.svg"
              alt=""
              width={91}
              height={91}
              className="h-[91px] w-[91px] max-w-none rotate-180 object-contain"
            />
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-[980px] items-end justify-center gap-4 md:gap-8">
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
                    ? "h-[204px] w-[142px] md:h-[286px] md:w-[198px]"
                    : "h-[180px] w-[126px] md:h-[246px] md:w-[170px]"
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
                  sizes="(min-width: 768px) 172px, 34vw"
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
      </div>
    </>
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
      ref={stageRef}
      data-section="archive"
      data-archive-stage
      className="archive-grid relative bg-paper"
    >
      <SectionReference
        marker={marker}
        shutterKey="menu.sections.archive.referenceId"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1560px] items-center px-5 py-[4.5rem] md:px-8 md:py-32">
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
          <div className="relative min-h-[clamp(18rem,42vw,28rem)]">
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
                  className="mx-auto max-w-[12ch] font-menu text-[clamp(3rem,8vw,8rem)] font-medium uppercase leading-[0.9] text-ink"
                  data-shutter-key={`archive.states.${stateIndex}.headline`}
                >
                  {state.headline}
                </h2>
                <p
                  className="mx-auto mt-8 max-w-[680px] font-menu text-sm uppercase leading-7 tracking-[0.06em] text-ink/72 md:text-[0.95rem]"
                  data-shutter-key={`archive.states.${stateIndex}.body`}
                >
                  {state.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#tenuta"
            className="relative z-10 mt-12 inline-flex flex-col items-center gap-3 font-menu text-[0.72rem] uppercase tracking-[0.18em] text-ink/58 transition hover:text-wine"
            data-shutter-key="archive.cta"
          >
            <span>{archive.cta}</span>
            <CtaDivider />
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
            `+=${Math.max(cellarObjects.length * window.innerHeight * 0.44, 2800)}`,
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

      cellarObjects.forEach((object, index) => {
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
              duration: 1.42,
              ease: "none",
            },
            index,
          )
          .set(
            object,
            {
              visibility: "hidden",
            },
            index + 1.42,
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

      fadeCopy(0, 1, 3);
      fadeCopy(1, 2, 6);
      timeline.to({}, { duration: 0.1 }, cellarObjects.length + 0.4);
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
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1560px] items-center px-5 py-[4.5rem] md:px-8 md:py-32">
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
          <div className="relative min-h-[clamp(16rem,40vw,26rem)]">
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
                  className="mx-auto max-w-[14ch] font-menu text-[clamp(2.7rem,7vw,7rem)] font-medium uppercase leading-[0.9] text-ink"
                  data-shutter-key={`cellar.states.${stateIndex}.headline`}
                >
                  {state.headline}
                </h2>
                <p
                  className="mx-auto mt-7 max-w-[620px] font-menu text-sm uppercase leading-7 tracking-[0.04em] text-ink/74 md:text-[0.95rem]"
                  data-shutter-key={`cellar.states.${stateIndex}.body`}
                >
                  {state.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#spumanti"
            className="relative z-10 mt-10 inline-flex flex-col items-center gap-3 font-menu text-[0.72rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
            data-shutter-key="cellar.cta"
          >
            <span>{cellar.cta}</span>
            <CtaDivider />
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
        className="max-w-[12ch] font-menu text-[clamp(2.35rem,8vw,4.1rem)] font-normal uppercase leading-[1.08] text-paper lg:text-[clamp(3.2rem,4.5vw,4.1rem)]"
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
        className="mt-6 max-w-[651px] font-menu text-[0.92rem] leading-[1.58] text-paper/82 md:mt-8 md:text-[1.08rem] md:leading-[1.85]"
        data-shutter-key={`vineyard.states.${index}.body`}
      >
        {state.body}
      </p>
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
        className="relative hidden h-[100svh] min-h-[760px] overflow-hidden md:block"
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
  { y: "18vh", className: "h-[342px] w-[274px] rotate-[4deg]" },
  { y: "58vh", className: "h-[381px] w-[305px] rotate-[-5deg]" },
  { y: "20vh", className: "h-[336px] w-[260px] rotate-[2deg]" },
  { y: "56vh", className: "h-[337px] w-[269px] rotate-[6deg]" },
  { y: "17vh", className: "h-[370px] w-[296px] rotate-[-2deg]" },
  { y: "55vh", className: "h-[259px] w-[345px] rotate-[-3deg]" },
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
  const trackWidth = Math.max(5600, items.length * 900 + 1450);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || items.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const track = stage.querySelector<HTMLElement>("[data-memory-track]");
      const images = gsap.utils.toArray<HTMLElement>(
        "[data-memory-image]",
        stage,
      );

      if (!track) {
        return;
      }

      gsap.set(images, {
        autoAlpha: 0,
        y: () => window.innerHeight * 0.68,
        scale: 0.96,
      });

      if (reduceMotion) {
        gsap.set(images, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.max(getDistance(), 4200)}`,
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

      images.forEach((image, index) => {
        const start = index * 0.82;

        timeline.fromTo(
          image,
          {
            autoAlpha: 0,
            y: () => window.innerHeight * 0.72,
            scale: 0.96,
          },
          {
            autoAlpha: 1,
            y: () => -window.innerHeight * 0.78,
            scale: 1,
            duration: 0.96,
            ease: "none",
          },
          start,
        );

        timeline.to(
          image,
          {
            autoAlpha: 0,
            duration: 0.14,
            ease: "none",
          },
          start + 0.82,
        );
      });
    }, stage);

    return () => ctx.revert();
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
        className="relative h-[100svh] min-h-[760px]"
        style={{ width: `${trackWidth}px` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-menu font-normal uppercase leading-[0.75] text-[#e0dad6]"
        >
          <span
            data-memory-word
            className="absolute left-[170px] top-[19vh] text-[10rem] opacity-[0.2] md:text-[22rem]"
          >
            Memoria
          </span>
          <span
            data-memory-word
            className="absolute left-[1260px] top-[66vh] text-[9rem] opacity-[0.16] md:text-[20rem]"
          >
            viva
          </span>
          <span
            data-memory-word
            className="absolute left-[2080px] top-[20vh] text-[9rem] opacity-[0.16] md:text-[19rem]"
          >
            il sogno
          </span>
          <span
            data-memory-word
            className="absolute left-[3240px] top-[63vh] text-[9rem] opacity-[0.15] md:text-[19rem]"
          >
            delle bollicine
          </span>
        </div>

        {items.map((item, index) => {
          const textLeft = 330 + index * 820;
          const imageLeft = textLeft + (index % 2 === 0 ? 510 : 240);
          const textTop = index % 2 === 0 ? "27vh" : "64vh";
          const imageLayout = memoryImageLayouts[index % memoryImageLayouts.length];

          return (
            <div key={`${item.number}-${item.headline}`}>
              {item.image ? (
                <figure
                  data-memory-image
                  className={`pointer-events-none absolute z-0 overflow-hidden shadow-[0_38px_90px_rgba(0,0,0,0.34)] ${imageLayout.className}`}
                  style={{ left: `${imageLeft}px`, top: imageLayout.y }}
                  data-shutter-key={`memory.items.${index}.image`}
                  aria-hidden="true"
                >
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 320px, 60vw"
                    className="object-cover"
                  />
                </figure>
              ) : null}

              <article
                data-memory-panel
                className="absolute z-10 max-w-[360px] text-paper"
                style={{ left: `${textLeft}px`, top: textTop }}
              >
                <p
                  className="font-menu text-[1.7rem] leading-none text-paper md:text-[2.15rem]"
                  data-shutter-key={`memory.items.${index}.number`}
                >
                  ({item.number})
                </p>
                <h3
                  className="mt-5 font-menu text-lg uppercase leading-[1.08] text-paper md:text-[1.35rem]"
                  data-shutter-key={`memory.items.${index}.headline`}
                >
                  {item.headline}
                </h3>
                <p
                  className="mt-4 max-w-[330px] font-menu text-base leading-[1.38] text-paper/82 md:text-[1.08rem]"
                  data-shutter-key={`memory.items.${index}.body`}
                >
                  {item.body}
                </p>
              </article>
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
  tone = "light",
}: {
  marker: LandingSectionMarker;
  shutterKey?: string;
  tone?: "light" | "dark";
}) {
  const id = marker.referenceId;
  const toneClass =
    tone === "dark"
      ? "border-paper/12 bg-paper/[0.035] text-paper/36 hover:text-paper/70"
      : "border-ink/10 bg-ink/[0.025] text-ink/32 hover:text-ink/62";

  return (
    <a
      id={id}
      href={`#${id}`}
      className={`absolute left-5 top-36 z-20 scroll-mt-36 border px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] transition md:left-8 md:top-44 ${toneClass}`}
      data-shutter-key={shutterKey}
      aria-label={`Section reference ${id}`}
    >
      #{id}
    </a>
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
      <div className="mx-auto max-w-[1568px] px-5 pt-4 md:px-8 md:pt-7">
        <div className="relative flex h-[74px] items-center justify-between md:h-[80px] md:items-end md:pb-5">
          <a
            href="#top"
            className="relative block h-[36px] w-[178px] shrink-0 md:h-[41px] md:w-[200px]"
            aria-label={content.brand.homeAriaLabel}
          >
            <Image
              src={tone.logo.src}
              alt={tone.logo.alt}
              fill
              priority
              sizes="(min-width: 768px) 200px, 178px"
              className="object-contain"
            />
          </a>

          <a
            href="#top"
            className="absolute left-1/2 top-1/2 block h-[62px] w-[82px] -translate-x-1/2 -translate-y-1/2 md:h-[65px] md:w-[84px]"
            aria-label={content.brand.crestAriaLabel}
          >
            <Image
              src={tone.crest.src}
              alt={tone.crest.alt}
              fill
              priority
              sizes="(min-width: 768px) 84px, 82px"
              className="object-contain"
            />
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-[2.15rem] font-menu text-[0.78rem] font-semibold uppercase leading-none tracking-[0.08em] xl:flex"
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
            className="relative z-10 grid h-10 w-10 place-items-center border border-current/22 transition hover:bg-current/8 xl:hidden"
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
              className="grid w-full max-w-[520px] gap-3 py-4 font-menu text-[0.72rem] font-semibold uppercase tracking-[0.1em] sm:grid-cols-2"
            >
              {content.navigation.map((item, index) => (
                <a
                  key={item.href}
                  className="border border-current/12 px-3 py-3 text-center transition hover:bg-current/8"
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
            <div className="flex items-center justify-center gap-4 py-3 md:py-[8.5px]">
              <Image
                src={tone.diamond.src}
                alt={tone.diamond.alt}
                width={15}
                height={15}
                className="h-[11px] w-[11px] md:h-[15px] md:w-[15px]"
              />
              <p
                className="font-menu text-[0.78rem] font-bold uppercase leading-none tracking-[0.16em] md:text-sm"
                data-shutter-key={`menu.sections.${menuState.activeSection}.menuLabel`}
              >
                {menuState.sectionLabel}
              </p>
              <Image
                src={tone.diamond.src}
                alt={tone.diamond.alt}
                width={15}
                height={15}
                className="h-[11px] w-[11px] md:h-[15px] md:w-[15px]"
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

        const heroCharacters =
          gsap.utils.toArray<HTMLElement>("[data-hero-char]");
        const heroVideo =
          document.querySelector<HTMLVideoElement>("[data-hero-video]");

        if (heroCharacters.length > 0) {
          const heroCharacterStagger = 0.018;
          const heroLetterGlowDuration = 0.5;
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
              scrub: 0.7,
            },
          });

          heroTimeline.to(
            heroCharacters,
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

              heroTimeline.to(
                heroVideo,
                {
                  currentTime: Math.max(0, duration - 0.04),
                  duration: heroReadingDuration,
                  ease: "none",
                },
                0,
              );
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
          }: {
            x: number;
            y: number;
            radius: number;
            right: number;
          }) =>
            `M${x} 650 L${x} ${y} A${radius} ${radius} 0 0 1 ${right} ${y} L${right} 650 Z`;
          const interpolate = (from: number, to: number, progress: number) =>
            from + (to - from) * progress;
          const setTenutaMaskProgress = (progress: number) => {
            const sideProgress = Math.min(progress * 1.35, 1);
            maskOpenings.left?.setAttribute(
              "d",
              archPath({
                x: interpolate(82, -620, sideProgress),
                y: interpolate(320, 180, sideProgress),
                radius: interpolate(150, 300, sideProgress),
                right: interpolate(382, -110, sideProgress),
              }),
            );
            maskOpenings.center?.setAttribute(
              "d",
              archPath({
                x: interpolate(450, -260, progress),
                y: interpolate(300, -620, progress),
                radius: interpolate(150, 860, progress),
                right: interpolate(750, 1460, progress),
              }),
            );
            maskOpenings.right?.setAttribute(
              "d",
              archPath({
                x: interpolate(818, 1310, sideProgress),
                y: interpolate(320, 180, sideProgress),
                radius: interpolate(150, 300, sideProgress),
                right: interpolate(1118, 1820, sideProgress),
              }),
            );
          };

          setTenutaMaskProgress(0);

          const tenutaScrubVideo =
            tenutaStage.querySelector<HTMLVideoElement>(
              "[data-tenuta-scrub-video]",
            );

          const tenutaTimeline = gsap
            .timeline({
              scrollTrigger: {
                trigger: tenutaStage,
                start: "center center",
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
            })
            .fromTo(
              tenutaVisual ?? tenutaStage,
              { scale: 1 },
              {
                scale: () =>
                  Math.max(
                    window.innerWidth /
                      (tenutaVisual?.offsetWidth ?? tenutaStage.offsetWidth),
                    window.innerHeight /
                      (tenutaVisual?.offsetHeight ?? tenutaStage.offsetHeight),
                  ),
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
                filter: "brightness(0.78) saturate(0.82)",
              },
              {
                scale: 1,
                filter: "brightness(0.94) saturate(1.02)",
                ease: "none",
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

          if (tenutaScrubVideo) {
            const scrubTenutaVideo = () => {
              const duration = tenutaScrubVideo.duration;

              if (!Number.isFinite(duration) || duration <= 0) {
                return;
              }

              tenutaTimeline.to(
                tenutaScrubVideo,
                {
                  currentTime: Math.max(0, duration - 0.04),
                  ease: "none",
                },
                0,
              );
              ScrollTrigger.refresh();
            };

            tenutaScrubVideo.pause();
            tenutaScrubVideo.currentTime = 0;

            if (tenutaScrubVideo.readyState >= 1) {
              scrubTenutaVideo();
            } else {
              tenutaScrubVideo.addEventListener(
                "loadedmetadata",
                scrubTenutaVideo,
                { once: true },
              );
            }
          }

          tenutaTimeline.to(
            "[data-tenuta-copy]",
            {
              y: 220,
              autoAlpha: 0,
              ease: "none",
            },
            0.08,
          );
        }
      }

      // Recompute trigger positions once webfonts have swapped in; otherwise
      // the layout shift leaves pins and reveals starting at the wrong scroll Y.
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, rootRef);

    return () => context.revert();
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
          className="relative flex min-h-[100svh] flex-col bg-ink px-5 pb-14 pt-36 text-paper md:px-8 md:pt-44"
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
                  className="mx-auto max-w-[34ch] font-snell text-[clamp(1.2rem,2.1vw,2.25rem)] font-normal italic leading-[1.05] text-paper md:leading-[1]"
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
          className="relative bg-paper px-5 pb-0 pt-[4.5rem] md:px-8 md:pt-28"
        >
          <SectionReference
            marker={content.menu.sections.tenuta}
            shutterKey="menu.sections.tenuta.referenceId"
          />
          <div className="mx-auto max-w-[1560px]">
            <h2
              data-reveal
              className="mx-auto max-w-[18ch] text-center font-snell text-[clamp(2.25rem,3.78vw,4rem)] font-medium italic leading-[0.95] text-ink"
              data-shutter-key="introduction.headline"
            >
              {content.introduction.headline}
            </h2>

            <div className="relative mx-auto mt-14 w-full md:w-[1120px]" data-tenuta-reveal>
              <div
                className="relative z-20 h-[58vw] min-h-[320px] w-full overflow-hidden outline-none md:h-[590px]"
                data-tenuta-visual
                data-shutter-key="introduction.videoPlaceholder"
              >
                <div
                  className="absolute inset-0 z-0"
                  data-tenuta-video
                  aria-hidden="true"
                >
                  <video
                    data-tenuta-scrub-video
                    className="h-full w-full scale-105 object-cover object-[50%_52%]"
                    muted
                    playsInline
                    preload="auto"
                    poster={content.introduction.image!.src}
                    aria-label={content.introduction.image!.alt}
                  >
                    <source
                      src="/videos/tenuta-entrance-scroll.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute inset-0 bg-ink/16" />
                </div>
                <svg
                  className="absolute -inset-[1px] z-10 h-[calc(100%+2px)] w-[calc(100%+2px)]"
                  viewBox="0 0 1200 700"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <mask id="tenuta-arch-openings">
                      <rect width="1200" height="700" fill="white" />
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
                    x="-8"
                    y="-8"
                    width="1216"
                    height="716"
                    fill="var(--paper)"
                    mask="url(#tenuta-arch-openings)"
                  />
                </svg>
              </div>

              <div
                data-tenuta-copy
                className="relative z-0 mx-auto mt-8 max-w-[720px] text-center font-menu text-sm leading-7 text-ink/68 md:text-base"
              >
                <p data-shutter-key="introduction.body">
                  {content.introduction.body}
                </p>
                <a
                  href="#spumanti"
                  className="mt-8 inline-flex flex-col items-center gap-3 font-menu text-[0.72rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
                  data-shutter-key="introduction.cta"
                >
                <span>{content.introduction.cta}</span>
                <CtaDivider />
              </a>
            </div>
          </div>
          </div>
        </section>

        <section
          id="spumanti"
          data-section="corallo"
          className="relative bg-ink px-5 py-[4.5rem] text-paper md:px-8 md:py-28"
        >
            <SectionReference
              marker={content.menu.sections.corallo}
              shutterKey="menu.sections.corallo.referenceId"
              tone="dark"
            />
          <div className="mx-auto max-w-[1560px]">
            <div className="mx-auto grid max-w-[1180px] gap-10 text-center">
              <ProductGallerySlider slides={content.product.slides} />
              <p
                  data-reveal
                  className="mx-auto max-w-[620px] font-menu text-sm leading-7 text-paper/70 md:text-base"
                  data-shutter-key="product.body"
                >
                {content.product.body}
              </p>
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
        className="relative bg-[#f1f1f1] px-5 py-16 text-black md:px-8 md:py-16"
      >
        <div className="mx-auto flex min-h-[360px] max-w-[1560px] flex-col justify-between gap-16 font-menu uppercase tracking-[0.08em] md:min-h-[348px]">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr_1.05fr] md:items-start">
            <div className="max-w-[270px] text-[0.72rem] font-medium leading-[1.75] md:text-[0.82rem]">
              <p className="font-bold">Dove siamo</p>
              <p>Via Paolo VI, 62 - 25046 Cazzago San Martino BS</p>
            </div>

            <div className="max-w-[360px] text-[0.72rem] font-medium leading-[1.75] md:text-[0.82rem]">
              <p className="font-bold">Wine Shop/Visite</p>
              <p>+39 345 0443240</p>
              <p>T. +39 030 7750838</p>
            </div>

            <div className="grid gap-8 text-[0.72rem] font-medium leading-[1.75] md:grid-cols-[1fr_auto] md:text-right md:text-[0.82rem]">
              <div>
                <p className="font-bold">Seguici</p>
                <div className="mt-6 flex gap-7 md:justify-end">
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
                <p className="mt-6">
                  <span className="font-extrabold">ITA</span>
                  <span className="px-5"> </span>
                  <span>ENG</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="space-y-5 md:self-end">
              <div className="h-px w-full bg-black/30" />
              <p className="text-[0.48rem] font-bold leading-none tracking-[0.16em] md:text-[0.54rem]">
                ©MarchesiAntinori 2027
              </p>
            </div>

            <img
              src="/figma/footer/livello-8.svg"
              alt="Marchese Antinori crest"
              className="mx-auto aspect-[128.109/97.6713] w-[100px] object-contain"
            />

            <div className="space-y-5 text-left md:self-end md:text-right">
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
