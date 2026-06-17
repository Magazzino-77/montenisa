"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type {
  LandingContent,
  LandingImage,
  LandingSectionKey,
  LandingSectionMarker,
} from "@/lib/shutter";

type LandingPageProps = {
  content: LandingContent;
};

type FigureProps = {
  image: LandingImage;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

function Figure({
  image,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: FigureProps) {
  return (
    <figure className={`relative overflow-hidden ${className}`}>
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

function Crest({ className = "", label }: { className?: string; label: string }) {
  return (
    <div
      className={`font-display text-[1.35rem] font-semibold leading-none ${className}`}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function SectionReference({
  marker,
  tone = "light",
}: {
  marker: LandingSectionMarker;
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
            {content.navigation.map((item) => {
              const isActive = hrefToSection[item.href] === menuState.activeSection;

              return (
                <a
                  key={item.href}
                  className={`whitespace-nowrap transition-opacity hover:opacity-65 ${
                    isActive ? "font-black" : ""
                  }`}
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
          {content.navigation.map((item) => (
            <a key={item.href} className="shrink-0" href={item.href}>
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
              <p className="font-menu text-[0.78rem] font-bold uppercase leading-none tracking-[0.16em] md:text-base">
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
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
          <SectionReference marker={content.menu.sections.hero} tone="dark" />
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
            <div
              data-hero-reveal
              className="flex items-center justify-between border-y border-paper/26 py-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/70"
            >
              <span>{content.hero.eyebrow}</span>
              <span>{content.hero.secondaryEyebrow}</span>
            </div>

            <div className="mx-auto max-w-[920px] text-center">
              <p
                data-hero-reveal
                className="font-display text-[clamp(1.55rem,3vw,3.7rem)] italic leading-tight text-paper/88"
              >
                {content.hero.subtitle}
              </p>
              <h1
                data-hero-reveal
                className="mx-auto mt-5 max-w-[12ch] font-display text-[clamp(3rem,12vw,3.45rem)] font-semibold leading-[0.86] text-paper md:text-[clamp(3.8rem,9vw,10.5rem)] md:leading-[0.84]"
              >
                {content.hero.title}
              </h1>
              <p
                data-hero-reveal
                className="mx-auto mt-7 max-w-[620px] text-pretty text-sm leading-7 text-paper/76 md:text-base"
              >
                {content.hero.body}
              </p>
            </div>

            <div
              data-hero-reveal
              className="mx-auto flex items-center gap-4 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-paper/72"
            >
              <span className="h-px w-14 bg-paper/34" />
              <span>{content.hero.scrollLabel}</span>
              <span className="h-px w-14 bg-paper/34" />
            </div>
          </div>
        </section>

        <section
          id="tenuta"
          data-section="tenuta"
          className="relative bg-paper px-5 py-[4.5rem] md:px-8 md:py-28"
        >
          <SectionReference marker={content.menu.sections.tenuta} />
          <div className="mx-auto max-w-[1560px]">
            <div className="chapter-rule text-center text-ink/72">
              <Crest label={content.brand.mark} className="mx-auto text-ink" />
              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                {content.introduction.eyebrow}
              </p>
            </div>

            <h2
              data-reveal
              className="mx-auto mt-12 max-w-[18ch] text-center font-display text-[clamp(2.25rem,5vw,5.8rem)] font-medium leading-[0.95] text-ink"
            >
              {content.introduction.title}
            </h2>

            <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-3 gap-3 md:gap-8">
              {[0, 1, 2].map((index) => (
                <Figure
                  key={index}
                  image={content.introduction.image!}
                  className="arch aspect-[0.62] border border-ink/12"
                  imageClassName={`scale-125 ${
                    index === 0
                      ? "object-[28%_50%]"
                      : index === 1
                        ? "object-[50%_50%]"
                        : "object-[72%_50%]"
                  }`}
                  sizes="(min-width: 768px) 28vw, 31vw"
                />
              ))}
            </div>

            <div
              data-reveal
              className="mx-auto mt-14 max-w-[720px] text-center text-sm leading-7 text-ink/68 md:text-base"
            >
              <p>{content.introduction.body}</p>
              <a
                href="#spumanti"
                className="mt-8 inline-flex items-center gap-4 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
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
          <SectionReference marker={content.menu.sections.corallo} tone="dark" />
          <div className="mx-auto max-w-[1560px]">
            <div className="chapter-rule chapter-rule-dark text-center text-paper/72">
              <Crest label={content.brand.mark} className="mx-auto text-paper" />
              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                {content.product.eyebrow}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[1180px] gap-10 text-center">
              <h2
                data-reveal
                className="font-display text-[clamp(2.7rem,7vw,7.4rem)] font-medium italic leading-none"
              >
                {content.product.title}
              </h2>
              <Figure
                image={content.product.image!}
                className="mx-auto aspect-[0.75] w-full max-w-[420px] border border-paper/14"
                imageClassName="object-[50%_50%]"
                sizes="(min-width: 768px) 420px, 86vw"
              />
              <p
                data-reveal
                className="mx-auto max-w-[620px] text-sm leading-7 text-paper/70 md:text-base"
              >
                {content.product.body}
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {content.product.gallery.map((image, index) => (
                <Figure
                  key={`${image.src}-${index}`}
                  image={image}
                  className="aspect-[0.84] border border-paper/12"
                  imageClassName="transition duration-700 hover:scale-105"
                  sizes="(min-width: 768px) 31vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>

        <section
          data-section="archive"
          className="archive-grid relative bg-paper px-5 py-[4.5rem] md:px-8 md:py-32"
        >
          <SectionReference marker={content.menu.sections.archive} />
          <div className="mx-auto grid max-w-[1180px] gap-10 text-center">
            <div
              data-drift
              className="mx-auto h-48 w-48 rounded-full border border-wine/40 bg-wine shadow-[inset_0_18px_28px_rgba(255,255,255,0.16),0_24px_50px_rgba(74,16,20,0.24)] md:h-64 md:w-64"
              aria-hidden="true"
            />
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-wine">
              {content.archive.eyebrow}
            </p>
            <h2
              data-reveal
              className="mx-auto max-w-[11ch] font-display text-[clamp(3rem,8vw,8rem)] font-medium uppercase leading-[0.9] text-ink"
            >
              {content.archive.title}
            </h2>
            <p
              data-reveal
              className="mx-auto max-w-[680px] text-sm uppercase leading-7 tracking-[0.06em] text-ink/72"
            >
              {content.archive.body}
            </p>
            <div
              data-reveal
              className="mx-auto flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/58"
            >
              <span className="h-px w-12 bg-current" />
              {content.archive.sealLabel}
              <span className="h-px w-12 bg-current" />
            </div>
          </div>
        </section>

        <section
          id="vigna"
          data-section="vigna"
          className="relative bg-ink px-5 py-[4.5rem] text-paper md:px-8 md:py-28"
        >
          <SectionReference marker={content.menu.sections.vigna} tone="dark" />
          <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
            <Figure
              image={content.vineyard.image!}
              className="aspect-[0.9] border border-paper/12 lg:aspect-[0.82]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div data-reveal className="lg:pl-8">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold">
                {content.vineyard.eyebrow}
              </p>
              <h2 className="mt-6 max-w-[9ch] font-display text-[clamp(3.3rem,7vw,7.4rem)] font-medium uppercase leading-[0.9]">
                {content.vineyard.title}
              </h2>
              <p className="mt-8 max-w-[560px] text-sm leading-7 text-paper/70 md:text-base">
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
          <SectionReference marker={content.menu.sections.cantina} />
          <div className="mx-auto max-w-[1320px]">
            <div className="relative min-h-[780px] md:min-h-[900px]">
              <Figure
                image={content.cellar.image!}
                className="arch absolute left-0 top-0 aspect-[0.58] w-[54%] max-w-[470px] border border-ink/12 md:w-[34%]"
                sizes="(min-width: 768px) 34vw, 54vw"
              />
              <Figure
                image={content.cellar.secondaryImage}
                className="arch absolute right-0 top-[230px] aspect-[0.72] w-[48%] max-w-[390px] border border-ink/12 md:right-[8%] md:w-[28%]"
                imageClassName="object-[48%_50%]"
                sizes="(min-width: 768px) 28vw, 48vw"
              />
              <div
                data-reveal
                className="absolute left-1/2 top-[250px] w-[min(92vw,720px)] -translate-x-1/2 text-center md:top-[300px]"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-wine">
                  {content.cellar.eyebrow}
                </p>
                <h2 className="mt-5 font-display text-[clamp(3rem,7vw,7.6rem)] font-medium uppercase leading-[0.9] text-ink">
                  {content.cellar.title}
                </h2>
                <p className="mx-auto mt-7 max-w-[560px] text-sm uppercase leading-7 tracking-[0.04em] text-ink/74">
                  {content.cellar.body}
                </p>
                <a
                  href="#contatti"
                  className="mt-8 inline-flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink transition hover:text-wine"
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
          <SectionReference marker={content.menu.sections.memoria} tone="dark" />
          <div className="mx-auto max-w-[1560px]">
            <div className="chapter-rule chapter-rule-dark text-center text-paper/72">
              <Crest label={content.brand.mark} className="mx-auto text-paper" />
              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                {content.memory.eyebrow}
              </p>
            </div>

            <div className="relative mt-[4.5rem] min-h-[640px] md:mt-24">
              <h2
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(8rem,27vw,27rem)] font-medium uppercase leading-none text-paper/95"
              >
                {content.memory.title}
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
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold">
                      ({item.number})
                    </p>
                    <h3 className="mt-4 font-display text-3xl font-medium leading-none">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-paper/70">
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
        <SectionReference marker={content.menu.sections.contatti} />
        <div className="mx-auto grid max-w-[1560px] gap-8 border-y border-ink/18 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/60">
              {content.contact.eyebrow}
            </p>
            <p className="mt-2 font-display text-2xl">
              {content.contact.location}
            </p>
          </div>
          <div className="text-center">
            <Crest label={content.brand.mark} className="text-center" />
            <p className="mt-3 font-display text-xl leading-none">
              {content.contact.title}
            </p>
          </div>
          <div className="md:text-right">
            <a
              className="font-display text-2xl transition hover:text-wine"
              href={`mailto:${content.contact.email}`}
            >
              {content.contact.email}
            </a>
            <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/54">
              {content.contact.legal}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
