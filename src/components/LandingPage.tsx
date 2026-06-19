"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type {
  ArchiveChapter,
  LandingContent,
  LandingImage,
  LandingSectionKey,
  LandingSectionMarker,
  ProductSlide,
} from "@/lib/shutter";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type LandingPageProps = {
  content: LandingContent;
};

type FigureProps = {
  image: LandingImage;
  className?: string;
  imageClassName?: string;
  shutterKey?: string;
  priority?: boolean;
  sizes?: string;
};

function Figure({
  image,
  className = "",
  imageClassName = "",
  shutterKey,
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: FigureProps) {
  return (
    <figure
      className={`relative overflow-hidden ${className}`}
      data-shutter-key={shutterKey}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
    </figure>
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

    gsap.set(frameRefs.current.filter(Boolean), {
      autoAlpha: 0,
      scale: 1.025,
      clipPath: "inset(0% 0% 0% 100%)",
    });
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
      thumbRefs.current.filter(Boolean),
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

    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
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

  return (
    <>
      <h2
        ref={headlineRef}
        data-reveal
        className="font-display text-[clamp(2.7rem,7vw,7.4rem)] font-medium italic leading-none"
        data-shutter-key={`product.slides.${activeIndex}.headline`}
      >
        {activeSlide.headline}
      </h2>

      <div
        className="mx-auto w-full max-w-[1180px]"
        data-active-slide={activeIndex}
        data-product-slider
      >
        <div className="relative mx-auto aspect-[0.75] w-full max-w-[420px] overflow-hidden">
          {safeSlides.map((slide, index) => (
            <figure
              key={`${slide.image.src}-${index}`}
              ref={(element) => {
                frameRefs.current[index] = element;
              }}
              className="pointer-events-none absolute inset-0"
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
            className="absolute left-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center border border-paper/24 bg-ink/42 font-display text-2xl leading-none text-paper backdrop-blur-sm transition hover:bg-paper hover:text-ink"
            aria-label="Previous image"
          >
            ‹
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
            className="absolute right-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center border border-paper/24 bg-ink/42 font-display text-2xl leading-none text-paper backdrop-blur-sm transition hover:bg-paper hover:text-ink"
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-[760px] items-end justify-center gap-3 md:gap-6">
          {safeSlides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={`thumb-${slide.thumbnail.src}-${index}`}
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
                    ? "h-[120px] w-[160px] md:h-[172px] md:w-[230px]"
                    : "h-[94px] w-[126px] md:h-[136px] md:w-[182px]"
                } ${
                  isActive
                    ? "opacity-100"
                    : "opacity-48 hover:opacity-90"
                }`}
                aria-label={`Show ${slide.headline}`}
                aria-current={isActive ? "true" : undefined}
              >
                <Image
                  src={slide.thumbnail.src}
                  alt={slide.thumbnail.alt}
                  fill
                  sizes="(min-width: 768px) 220px, 30vw"
                  className={`object-contain transition duration-700 ${
                    isActive ? "scale-105" : "scale-100 group-hover:scale-105"
                  }`}
                />
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

function Crest({
  className = "",
  label,
  shutterKey,
}: {
  className?: string;
  label: string;
  shutterKey?: string;
}) {
  return (
    <div
      className={`font-display text-[1.35rem] font-semibold leading-none ${className}`}
      data-shutter-key={shutterKey}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function ArchiveChapterSection({
  archive,
  diamond,
  marker,
}: {
  archive: ArchiveChapter;
  diamond: LandingImage;
  marker: LandingSectionMarker;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const states = archive.states.length > 0 ? archive.states : [];

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || states.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const stateLayers = gsap.utils.toArray<HTMLElement>(
      "[data-archive-state]",
      stage,
    );
    const copyLayers = gsap.utils.toArray<HTMLElement>(
      "[data-archive-copy]",
      stage,
    );
    const objects = gsap.utils.toArray<HTMLElement>(
      "[data-archive-object]",
      stage,
    );

    gsap.set(stateLayers, { autoAlpha: 0 });
    gsap.set(copyLayers, { autoAlpha: 0, y: 28 });
    gsap.set(stateLayers[0], { autoAlpha: 1 });
    gsap.set(copyLayers[0], { autoAlpha: 1, y: 0 });

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

    objects.forEach((object, index) => {
      gsap.to(object, {
        y: index % 2 === 0 ? -14 : 12,
        rotation: index % 2 === 0 ? 2.5 : -2.5,
        duration: 4.8 + index * 0.35,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
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
                  className={`absolute ${object.placement ?? ""} relative`}
                  data-shutter-key={`archive.states.${stateIndex}.objects.${objectIndex}.image`}
                >
                  <Image
                    src={object.image.src}
                    alt={object.image.alt}
                    fill
                    sizes="(min-width: 1024px) 320px, 42vw"
                    className="object-contain mix-blend-lighten"
                  />
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
                  className="mx-auto max-w-[12ch] font-display text-[clamp(3rem,8vw,8rem)] font-medium uppercase leading-[0.9] text-ink"
                  data-shutter-key={`archive.states.${stateIndex}.headline`}
                >
                  {state.headline}
                </h2>
                <p
                  className="mx-auto mt-8 max-w-[680px] text-sm uppercase leading-7 tracking-[0.06em] text-ink/72 md:text-[0.95rem]"
                  data-shutter-key={`archive.states.${stateIndex}.body`}
                >
                  {state.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#tenuta"
            className="relative z-10 mt-12 inline-flex flex-col items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/58 transition hover:text-wine"
            data-shutter-key="archive.cta"
          >
            <span className="flex items-center gap-4">
              <span className="h-px w-12 bg-current" />
              {archive.cta}
              <span className="h-px w-12 bg-current" />
            </span>
            <Image
              src={diamond.src}
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
              className="opacity-72"
            />
          </a>
        </div>
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
  const tone = menuState.isDark
    ? {
        background: "bg-[#1d1d1b]",
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

  const hrefToSection: Record<string, LandingSectionKey> = {
    "#top": "hero",
    [`#${content.menu.sections.hero.referenceId}`]: "hero",
    "#tenuta": "tenuta",
    [`#${content.menu.sections.tenuta.referenceId}`]: "tenuta",
    "#spumanti": "corallo",
    [`#${content.menu.sections.corallo.referenceId}`]: "corallo",
    [`#${content.menu.sections.archive.referenceId}`]: "archive",
    "#vigna": "vigna",
    [`#${content.menu.sections.vigna.referenceId}`]: "vigna",
    "#cantina": "cantina",
    [`#${content.menu.sections.cantina.referenceId}`]: "cantina",
    [`#${content.menu.sections.memoria.referenceId}`]: "memoria",
    "#contatti": "contatti",
    [`#${content.menu.sections.contatti.referenceId}`]: "contatti",
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 ${tone.background} ${tone.text} transition-colors duration-500`}
      data-menu-theme={menuState.isDark ? "dark" : "light"}
    >
      <div className="mx-auto max-w-[1568px] px-5 pt-4 md:px-8 md:pt-7">
        <div className="relative flex h-[74px] items-center justify-between md:h-[122px]">
          <a
            href="#top"
            className="relative block h-[36px] w-[178px] shrink-0 md:h-[61px] md:w-[300px]"
            aria-label={content.brand.homeAriaLabel}
          >
            <Image
              src={tone.logo.src}
              alt={tone.logo.alt}
              fill
              priority
              sizes="(min-width: 768px) 300px, 178px"
              className="object-contain"
            />
          </a>

          <a
            href="#top"
            className="absolute left-1/2 top-1/2 block h-[62px] w-[82px] -translate-x-1/2 -translate-y-1/2 md:h-[98px] md:w-[128px]"
            aria-label={content.brand.crestAriaLabel}
          >
            <Image
              src={tone.crest.src}
              alt={tone.crest.alt}
              fill
              priority
              sizes="(min-width: 768px) 128px, 82px"
              className="object-contain"
            />
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-[2.15rem] font-menu text-[0.78rem] font-semibold uppercase leading-none tracking-[0.08em] md:flex"
          >
            {content.navigation.map((item, index) => {
              const isActive = hrefToSection[item.href] === menuState.activeSection;

              return (
                <a
                  key={item.href}
                    className={`whitespace-nowrap transition-opacity hover:opacity-65 ${
                      isActive ? "font-black" : ""
                    }`}
                    data-shutter-key={`navigation.${index}.label`}
                    href={item.href}
                  >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className={`h-px w-full ${tone.rule}`} />

        <div className="menu-row-scroll flex gap-6 overflow-x-auto py-3 font-menu text-[0.7rem] font-semibold uppercase tracking-[0.08em] md:hidden">
            {content.navigation.map((item, index) => (
              <a
                key={item.href}
                className="shrink-0"
                data-shutter-key={`navigation.${index}.label`}
                href={item.href}
              >
              {item.label}
            </a>
          ))}
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
            <div className="flex items-center justify-center gap-4 py-3 md:py-4">
              <Image
                src={tone.diamond.src}
                alt={tone.diamond.alt}
                width={15}
                height={15}
                className="h-[11px] w-[11px] md:h-[15px] md:w-[15px]"
              />
              <p
                className="font-menu text-[0.78rem] font-bold uppercase leading-none tracking-[0.16em] md:text-base"
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

    const scrollState = {
      y: window.scrollY,
    };

    gsap.to(scrollState, {
      y: Math.max(0, targetY),
      duration: 1.15,
      ease: "power3.inOut",
      onUpdate: () => {
        window.scrollTo(0, scrollState.y);
      },
      onComplete: () => {
        window.scrollTo(0, Math.max(0, targetY));
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
        gsap.from("[data-hero-reveal]", {
          y: 34,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 46,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          });
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

        const tenutaStage = document.querySelector<HTMLElement>(
          "[data-tenuta-reveal]",
        );

        if (tenutaStage) {
          const maskOpenings = {
            left: tenutaStage.querySelector<SVGPathElement>(
              '[data-tenuta-mask-opening="left"]',
            ),
            center: tenutaStage.querySelector<SVGPathElement>(
              '[data-tenuta-mask-opening="center"]',
            ),
            right: tenutaStage.querySelector<SVGPathElement>(
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

          gsap
            .timeline({
              scrollTrigger: {
                trigger: tenutaStage,
                start: "center center",
                end: "+=1800",
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                scrub: true,
                onUpdate: (self) => setTenutaMaskProgress(self.progress),
              },
            })
            .to(
              tenutaStage,
              {
                width: () => window.innerWidth,
                minWidth: () => window.innerWidth,
                maxWidth: "none",
                height: () => window.innerHeight,
                minHeight: () => window.innerHeight,
                x: () => -(window.innerWidth - tenutaStage.offsetWidth) / 2,
                y: () => -(window.innerHeight - tenutaStage.offsetHeight) / 2,
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
        }
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
          className="relative flex min-h-[100svh] items-center justify-center bg-ink px-5 pb-16 pt-36 text-paper md:px-8 md:pt-48"
        >
          <SectionReference
            marker={content.menu.sections.hero}
            shutterKey="menu.sections.hero.referenceId"
            tone="dark"
          />
          <div className="absolute inset-0 opacity-[0.48]">
              <Image
                src={content.hero.image.src}
                alt={content.hero.image.alt}
              fill
              priority
              sizes="100vw"
              className="scale-105 object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,16,17,0.28),rgba(16,16,17,0.84)_68%),linear-gradient(180deg,rgba(16,16,17,0.28),rgba(16,16,17,0.9))]" />

          <div className="relative mx-auto flex min-h-[78svh] w-full max-w-[1560px] flex-col justify-between">
            <div className="mx-auto max-w-[920px] text-center">
                <p
                  data-hero-reveal
                  className="font-display text-[clamp(1.55rem,3vw,3.7rem)] italic leading-tight text-paper/88"
                  data-shutter-key="hero.subtitle"
                >
                {content.hero.subtitle}
              </p>
                <h1
                  data-hero-reveal
                  className="mx-auto mt-5 max-w-[12ch] font-display text-[clamp(3rem,12vw,3.45rem)] font-semibold leading-[0.86] text-paper md:text-[clamp(3.8rem,9vw,10.5rem)] md:leading-[0.84]"
                  data-shutter-key="hero.headline"
                >
                  {content.hero.headline}
                </h1>
                <p
                  data-hero-reveal
                  className="mx-auto mt-7 max-w-[620px] text-pretty text-sm leading-7 text-paper/76 md:text-base"
                  data-shutter-key="hero.body"
                >
                  {content.hero.body}
                </p>
            </div>

            <div
              data-hero-reveal
              className="mx-auto flex items-center gap-4 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-paper/72"
            >
              <span className="h-px w-14 bg-paper/34" />
              <span data-shutter-key="hero.scrollLabel">
                {content.hero.scrollLabel}
              </span>
              <span className="h-px w-14 bg-paper/34" />
            </div>
          </div>
        </section>

        <section
          id="tenuta"
          data-section="tenuta"
          className="relative bg-paper px-5 py-[4.5rem] md:px-8 md:py-28"
        >
          <SectionReference
            marker={content.menu.sections.tenuta}
            shutterKey="menu.sections.tenuta.referenceId"
          />
          <div className="mx-auto max-w-[1560px]">
            <h2
              data-reveal
              className="mx-auto max-w-[18ch] text-center font-display text-[clamp(2.25rem,5vw,5.8rem)] font-medium leading-[0.95] text-ink"
              data-shutter-key="introduction.headline"
            >
              {content.introduction.headline}
            </h2>

            <div
              className="relative mx-auto mt-14 h-[58vw] min-h-[320px] w-full overflow-hidden outline-none md:h-[590px] md:w-[1120px]"
              data-tenuta-reveal
              data-shutter-key="introduction.videoPlaceholder"
            >
              <div
                className="absolute inset-0 z-0"
                data-tenuta-video
                aria-hidden="true"
              >
                <Image
                  src={content.introduction.image!.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 1120px, 118vw"
                  className="scale-105 object-cover object-[50%_52%]"
                />
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
              data-reveal
              className="mx-auto mt-14 max-w-[720px] text-center text-sm leading-7 text-ink/68 md:text-base"
            >
                <p data-shutter-key="introduction.body">
                  {content.introduction.body}
                </p>
                <a
                  href="#spumanti"
                  className="mt-8 inline-flex items-center gap-4 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
                  data-shutter-key="introduction.cta"
                >
                <span className="h-px w-12 bg-current" />
                {content.introduction.cta}
                <span className="h-px w-12 bg-current" />
              </a>
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
                  className="mx-auto max-w-[620px] text-sm leading-7 text-paper/70 md:text-base"
                  data-shutter-key="product.body"
                >
                {content.product.body}
              </p>
            </div>
          </div>
        </section>

        <ArchiveChapterSection
          archive={content.archive}
          diamond={content.brand.diamond.light}
          marker={content.menu.sections.archive}
        />

        <section
          id="vigna"
          data-section="vigna"
          className="relative bg-ink px-5 py-[4.5rem] text-paper md:px-8 md:py-28"
        >
            <SectionReference
              marker={content.menu.sections.vigna}
              shutterKey="menu.sections.vigna.referenceId"
              tone="dark"
            />
          <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
            <Figure
                image={content.vineyard.image!}
                shutterKey="vineyard.image"
              className="aspect-[0.9] lg:aspect-[0.82]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div data-reveal className="lg:pl-8">
                <p
                  className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold"
                  data-shutter-key="vineyard.eyebrow"
                >
                {content.vineyard.eyebrow}
              </p>
                <h2
                  className="mt-6 max-w-[9ch] font-display text-[clamp(3.3rem,7vw,7.4rem)] font-medium uppercase leading-[0.9]"
                  data-shutter-key="vineyard.headline"
                >
                {content.vineyard.headline}
              </h2>
                <p
                  className="mt-8 max-w-[560px] text-sm leading-7 text-paper/70 md:text-base"
                  data-shutter-key="vineyard.body"
                >
                {content.vineyard.body}
              </p>
            </div>
          </div>
        </section>

        <section
          id="cantina"
          data-section="cantina"
          className="relative bg-paper px-5 py-[4.5rem] md:px-8 md:py-28"
        >
            <SectionReference
              marker={content.menu.sections.cantina}
              shutterKey="menu.sections.cantina.referenceId"
            />
          <div className="mx-auto max-w-[1320px]">
            <div className="relative min-h-[780px] md:min-h-[900px]">
              <Figure
                  image={content.cellar.image!}
                  shutterKey="cellar.image"
                className="arch absolute left-0 top-0 aspect-[0.58] w-[54%] max-w-[470px] md:w-[34%]"
                sizes="(min-width: 768px) 34vw, 54vw"
              />
              <Figure
                  image={content.cellar.secondaryImage}
                  shutterKey="cellar.secondaryImage"
                className="arch absolute right-0 top-[230px] aspect-[0.72] w-[48%] max-w-[390px] md:right-[8%] md:w-[28%]"
                imageClassName="object-[48%_50%]"
                sizes="(min-width: 768px) 28vw, 48vw"
              />
              <div
                data-reveal
                className="absolute left-1/2 top-[250px] w-[min(92vw,720px)] -translate-x-1/2 text-center md:top-[300px]"
              >
                  <p
                    className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-wine"
                    data-shutter-key="cellar.eyebrow"
                  >
                  {content.cellar.eyebrow}
                </p>
                  <h2
                    className="mt-5 font-display text-[clamp(3rem,7vw,7.6rem)] font-medium uppercase leading-[0.9] text-ink"
                    data-shutter-key="cellar.headline"
                  >
                  {content.cellar.headline}
                </h2>
                  <p
                    className="mx-auto mt-7 max-w-[560px] text-sm uppercase leading-7 tracking-[0.04em] text-ink/74"
                    data-shutter-key="cellar.body"
                  >
                  {content.cellar.body}
                </p>
                <a
                    href="#contatti"
                    className="mt-8 inline-flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
                    data-shutter-key="cellar.cta"
                  >
                  <span className="h-px w-10 bg-current" />
                  {content.cellar.cta}
                  <span className="h-px w-10 bg-current" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          data-section="memoria"
          className="relative bg-ink px-5 py-20 text-paper md:px-8 md:py-32"
        >
            <SectionReference
              marker={content.menu.sections.memoria}
              shutterKey="menu.sections.memoria.referenceId"
              tone="dark"
            />
          <div className="mx-auto max-w-[1560px]">
            <div className="relative min-h-[640px]">
              <h2
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(8rem,27vw,27rem)] font-medium uppercase leading-none text-paper/95"
                  data-shutter-key="memory.headline"
                >
                {content.memory.headline}
              </h2>
              <div className="relative z-10 grid gap-8 md:grid-cols-3 md:items-start">
                {content.memory.items.map((item, index) => (
                  <article
                    data-reveal
                    key={item.number}
                    className={`max-w-[320px] border-t border-paper/30 pt-5 text-paper ${
                      index === 1 ? "md:mt-48" : index === 2 ? "md:mt-20" : ""
                    }`}
                  >
                      <p
                        className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold"
                        data-shutter-key={`memory.items.${index}.number`}
                      >
                      ({item.number})
                    </p>
                      <h3
                        className="mt-4 font-display text-3xl font-medium leading-none"
                        data-shutter-key={`memory.items.${index}.headline`}
                      >
                      {item.headline}
                    </h3>
                      <p
                        className="mt-5 text-sm leading-6 text-paper/70"
                        data-shutter-key={`memory.items.${index}.body`}
                      >
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        data-section="contatti"
        className="relative bg-paper px-5 py-12 text-ink md:px-8 md:py-16"
      >
          <SectionReference
            marker={content.menu.sections.contatti}
            shutterKey="menu.sections.contatti.referenceId"
          />
        <div className="mx-auto grid max-w-[1560px] gap-8 border-y border-ink/18 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
              <p
                className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/60"
                data-shutter-key="contact.eyebrow"
              >
              {content.contact.eyebrow}
            </p>
              <p
                className="mt-2 font-display text-2xl"
                data-shutter-key="contact.location"
              >
              {content.contact.location}
            </p>
          </div>
          <div className="text-center">
              <Crest
                label={content.brand.mark}
                shutterKey="brand.mark"
                className="text-center"
              />
              <p
                className="mt-3 font-display text-xl leading-none"
                data-shutter-key="contact.title"
              >
              {content.contact.title}
            </p>
          </div>
          <div className="md:text-right">
            <a
                className="font-display text-2xl transition hover:text-wine"
                data-shutter-key="contact.email"
                href={`mailto:${content.contact.email}`}
              >
              {content.contact.email}
            </a>
              <p
                className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/54"
                data-shutter-key="contact.legal"
              >
              {content.contact.legal}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
