export type LandingNavItem = {
  label: string;
  href: string;
};

export type LandingImage = {
  src: string;
  alt: string;
};

export type LandingChapter = {
  eyebrow: string;
  headline: string;
  body: string;
  image?: LandingImage;
};

export type LandingMemory = {
  number: string;
  headline: string;
  body: string;
};

export type LandingSectionKey =
  | "hero"
  | "tenuta"
  | "corallo"
  | "archive"
  | "vigna"
  | "cantina"
  | "memoria"
  | "contatti";

export type LandingSectionMarker = {
  referenceId: string;
  menuLabel: string;
};

export type LandingContent = {
  brand: {
    name: string;
    mark: string;
    homeAriaLabel: string;
    crestAriaLabel: string;
    wordmark: {
      light: LandingImage;
      dark: LandingImage;
    };
    crest: {
      light: LandingImage;
      dark: LandingImage;
    };
    diamond: {
      light: LandingImage;
      dark: LandingImage;
    };
  };
  menu: {
    sections: Record<LandingSectionKey, LandingSectionMarker>;
    darkSections: LandingSectionKey[];
  };
  navigation: LandingNavItem[];
  hero: {
    eyebrow: string;
    secondaryEyebrow: string;
    scrollLabel: string;
    headline: string;
    subtitle: string;
    body: string;
    image: LandingImage;
  };
  introduction: LandingChapter & {
    cta: string;
  };
  product: LandingChapter & {
    gallery: LandingImage[];
  };
  archive: Omit<LandingChapter, "image"> & {
    sealLabel: string;
  };
  vineyard: LandingChapter;
  cellar: LandingChapter & {
    secondaryImage: LandingImage;
    cta: string;
  };
  memory: {
    eyebrow: string;
    headline: string;
    items: LandingMemory[];
  };
  contact: {
    eyebrow: string;
    title: string;
    email: string;
    location: string;
    legal: string;
  };
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

type ContentPayload = DeepPartial<LandingContent> & Record<string, unknown>;

export const fallbackLandingContent: LandingContent = {
  brand: {
    name: "Tenuta Montenisa",
    mark: "M77",
    homeAriaLabel: "Marchese Antinori Tenuta Montenisa home",
    crestAriaLabel: "Tenuta Montenisa home",
    wordmark: {
      light: {
        src: "/brand/marchese-antinori-wordmark-light.svg",
        alt: "Marchese Antinori",
      },
      dark: {
        src: "/brand/marchese-antinori-wordmark-dark.svg",
        alt: "Marchese Antinori",
      },
    },
    crest: {
      light: {
        src: "/brand/marchese-antinori-logo-light.svg",
        alt: "Tenuta Montenisa crest",
      },
      dark: {
        src: "/brand/marchese-antinori-logo-dark.svg",
        alt: "Tenuta Montenisa crest",
      },
    },
    diamond: {
      light: {
        src: "/brand/menu-diamond-light.svg",
        alt: "",
      },
      dark: {
        src: "/brand/menu-diamond-dark.svg",
        alt: "",
      },
    },
  },
  menu: {
    sections: {
      hero: {
        referenceId: "la-franciacorta",
        menuLabel: "La Franciacorta",
      },
      tenuta: {
        referenceId: "la-tenuta",
        menuLabel: "La Tenuta",
      },
      corallo: {
        referenceId: "gli-spumanti",
        menuLabel: "Gli Spumanti",
      },
      archive: {
        referenceId: "curtes-francae",
        menuLabel: "Curtes Francae",
      },
      vigna: {
        referenceId: "la-vigna",
        menuLabel: "I Vigneti",
      },
      cantina: {
        referenceId: "visita-la-cantina",
        menuLabel: "Visita la Cantina",
      },
      memoria: {
        referenceId: "la-storia",
        menuLabel: "La Storia",
      },
      contatti: {
        referenceId: "contatti",
        menuLabel: "Contatti",
      },
    },
    darkSections: ["hero", "corallo", "vigna", "memoria"],
  },
  navigation: [
    { label: "La Tenuta", href: "#tenuta" },
    { label: "Gli Spumanti", href: "#spumanti" },
    { label: "Visita la Cantina", href: "#cantina" },
    { label: "Contatti", href: "#contatti" },
  ],
  hero: {
    eyebrow: "Tenuta Montenisa",
    secondaryEyebrow: "Franciacorta",
    scrollLabel: "Scroll",
    headline: "Nel cuore della Franciacorta",
    subtitle: "Una storia che custodisce meraviglia.",
    body:
      "Tra stanze di pietra, vigne ordinate e archivi di famiglia, Montenisa diventa una dimora narrativa: ogni sezione della homepage apre un capitolo, pronto per essere animato in dettaglio.",
    image: {
      src: "/images/montenisa-estate-hero.png",
      alt: "Historic wine estate at dusk",
    },
  },
  introduction: {
    eyebrow: "La tenuta",
    headline: "Dove ogni meraviglia ha inizio",
    body:
      "La storica Tenuta Montenisa accoglie attraverso un luogo che custodisce vini, gesti e memoria. Questa pagina imposta il ritmo generale del prototipo: ingresso, scoperta, prodotto, archivio, vigna, cantina e memoria.",
    cta: "Scopri le meraviglie della tenuta",
    image: {
      src: "/images/montenisa-estate-hero.png",
      alt: "Arches and garden of the estate",
    },
  },
  product: {
    eyebrow: "Le meraviglie della tenuta",
    headline: "Il Corallo Rosa",
    body:
      "Una sezione scura e scenografica per il racconto dello spumante: un oggetto centrale, dettagli laterali e un ritmo più contemplativo, pronto per slider, parallax e micro-interazioni.",
    image: {
      src: "/images/montenisa-corallo-rosa.png",
      alt: "Rosé bottle still life with coral form",
    },
    gallery: [
      {
        src: "/images/corallo-3d.png",
        alt: "Pink coral sculpture",
      },
      {
        src: "/images/chiave-3d.png",
        alt: "Ornate golden key sculpture",
      },
      {
        src: "/images/conchiglia-3d.png",
        alt: "Ivory shell sculpture",
      },
    ],
  },
  archive: {
    eyebrow: "Le promesse di origine",
    headline: "Curtes Francae",
    body:
      "Il capitolo d'archivio lavora su pergamene, sigilli e tracce storiche. Per ora resta una sezione statica con elementi decorativi, pronta per una futura scena in cui le carte entrano e si sovrappongono allo scroll.",
    sealLabel: "Archivio Montenisa",
  },
  vineyard: {
    eyebrow: "I vigneti",
    headline: "La vigna custodisce",
    body:
      "Dove la natura lascia il tempo al metodo. Una sezione orizzontale, più silenziosa, che alterna fotografia e testo per preparare movimenti di camera, dissolvenze e progressioni lente.",
    image: {
      src: "/images/montenisa-vineyard.png",
      alt: "Winter vineyard in soft light",
    },
  },
  cellar: {
    eyebrow: "Le cantine",
    headline: "La stanza nascosta",
    body:
      "Sotto i portici della Tenuta Montenisa si apre la stanza più segreta: la cantina. Qui il racconto cambia luce e scala, con forme ad arco e immagini sospese.",
    cta: "Le cantine e i segreti",
    image: {
      src: "/images/montenisa-cellar.png",
      alt: "Hidden wine cellar with oak barrels",
    },
    secondaryImage: {
      src: "/images/montenisa-vineyard.png",
      alt: "Vineyard detail",
    },
  },
  memory: {
    eyebrow: "La storia",
    headline: "Memoria viva",
    items: [
      {
        number: "01",
        headline: "La dimora",
        body:
          "Una casa agricola e nobile, fatta di soglie, portici e corti interne.",
      },
      {
        number: "02",
        headline: "Il paesaggio",
        body:
          "La Franciacorta come territorio di precisione, attesa e trasformazione.",
      },
      {
        number: "03",
        headline: "Il sogno delle bollicine",
        body:
          "La materia del vino incontra una forma più luminosa e contemporanea.",
      },
    ],
  },
  contact: {
    eyebrow: "Dove siamo",
    title: "Tenuta Montenisa",
    email: "studio@montenisa.it",
    location: "Calino, Franciacorta",
    legal: "Prototype foundation by M77. Content ready for Shutter.",
  },
};

export const landingContentAudit = [
  "brand.name",
  "brand.mark",
  "brand.homeAriaLabel",
  "brand.crestAriaLabel",
  "brand.wordmark.light.src",
  "brand.wordmark.light.alt",
  "brand.wordmark.dark.src",
  "brand.wordmark.dark.alt",
  "brand.crest.light.src",
  "brand.crest.light.alt",
  "brand.crest.dark.src",
  "brand.crest.dark.alt",
  "brand.diamond.light.src",
  "brand.diamond.light.alt",
  "brand.diamond.dark.src",
  "brand.diamond.dark.alt",
  "menu.sections.hero.referenceId",
  "menu.sections.hero.menuLabel",
  "menu.sections.tenuta.referenceId",
  "menu.sections.tenuta.menuLabel",
  "menu.sections.corallo.referenceId",
  "menu.sections.corallo.menuLabel",
  "menu.sections.archive.referenceId",
  "menu.sections.archive.menuLabel",
  "menu.sections.vigna.referenceId",
  "menu.sections.vigna.menuLabel",
  "menu.sections.cantina.referenceId",
  "menu.sections.cantina.menuLabel",
  "menu.sections.memoria.referenceId",
  "menu.sections.memoria.menuLabel",
  "menu.sections.contatti.referenceId",
  "menu.sections.contatti.menuLabel",
  "navigation[].label",
  "navigation[].href",
  "hero.eyebrow",
  "hero.secondaryEyebrow",
  "hero.scrollLabel",
  "hero.headline",
  "hero.subtitle",
  "hero.body",
  "hero.image.src",
  "hero.image.alt",
  "introduction.eyebrow",
  "introduction.headline",
  "introduction.body",
  "introduction.cta",
  "introduction.image.src",
  "introduction.image.alt",
  "product.eyebrow",
  "product.headline",
  "product.body",
  "product.image.src",
  "product.image.alt",
  "product.gallery[].src",
  "product.gallery[].alt",
  "archive.eyebrow",
  "archive.headline",
  "archive.body",
  "archive.sealLabel",
  "vineyard.eyebrow",
  "vineyard.headline",
  "vineyard.body",
  "vineyard.image.src",
  "vineyard.image.alt",
  "cellar.eyebrow",
  "cellar.headline",
  "cellar.body",
  "cellar.cta",
  "cellar.image.src",
  "cellar.image.alt",
  "cellar.secondaryImage.src",
  "cellar.secondaryImage.alt",
  "memory.eyebrow",
  "memory.headline",
  "memory.items[].number",
  "memory.items[].headline",
  "memory.items[].body",
  "contact.eyebrow",
  "contact.title",
  "contact.email",
  "contact.location",
  "contact.legal",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const withoutUndefined = <T extends Record<string, unknown>>(record: T) =>
  Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

const pickString = (
  record: Record<string, unknown> | undefined,
  keys: string[],
) => {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string") {
      return value;
    }
  }

  return undefined;
};

const pickRecord = (
  record: Record<string, unknown> | undefined,
  keys: string[],
) => {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
};

const pickArray = (
  record: Record<string, unknown> | undefined,
  keys: string[],
) => {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return undefined;
};

const normalizeImagePayload = (
  value: unknown,
): DeepPartial<LandingImage> | undefined => {
  if (typeof value === "string") {
    return { src: value };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return withoutUndefined({
    src: pickString(value, ["src", "url", "imageUrl", "assetUrl"]),
    alt: pickString(value, ["alt", "altText", "description", "title"]),
  }) as DeepPartial<LandingImage>;
};

const normalizeNavItem = (item: unknown): LandingNavItem | undefined => {
  if (!isRecord(item)) {
    return undefined;
  }

  const label = pickString(item, ["label", "title", "text", "name"]);
  const href = pickString(item, ["href", "url", "anchor"]);

  if (!label || !href) {
    return undefined;
  }

  return { label, href };
};

const normalizeChapterPayload = (
  value: unknown,
): DeepPartial<LandingChapter> | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  return withoutUndefined({
    eyebrow: pickString(value, ["eyebrow", "kicker", "overline", "label"]),
    headline: pickString(value, ["headline", "title", "heading"]),
    body: pickString(value, ["body", "copy", "description", "text"]),
    image: normalizeImagePayload(
      value.image ?? value.media ?? value.photo ?? value.backgroundImage,
    ),
  }) as DeepPartial<LandingChapter>;
};

const normalizeMemoryItem = (item: unknown): LandingMemory | undefined => {
  if (!isRecord(item)) {
    return undefined;
  }

  const number = pickString(item, ["number", "index", "label"]);
  const headline = pickString(item, ["headline", "title", "heading"]);
  const body = pickString(item, ["body", "copy", "description", "text"]);

  if (!number || !headline || !body) {
    return undefined;
  }

  return { number, headline, body };
};

export const normalizeLandingContent = (
  payload: ContentPayload,
): DeepPartial<LandingContent> => {
  const hero = pickRecord(payload, ["hero", "heroSection", "topBanner"]);
  const introduction = pickRecord(payload, [
    "introduction",
    "tenuta",
    "estate",
    "laTenuta",
  ]);
  const product = pickRecord(payload, [
    "product",
    "spumanti",
    "corallo",
    "wine",
  ]);
  const archive = pickRecord(payload, ["archive", "curtesFrancae", "history"]);
  const vineyard = pickRecord(payload, ["vineyard", "vigna", "vigneti"]);
  const cellar = pickRecord(payload, ["cellar", "cantina"]);
  const memory = pickRecord(payload, ["memory", "memoria", "story"]);
  const contact = pickRecord(payload, ["contact", "contacts", "footer"]);
  const brand = pickRecord(payload, ["brand"]);
  const menu = pickRecord(payload, ["menu"]);
  const navigation = pickArray(payload, ["navigation", "nav", "menuItems"]);
  const productGallery = pickArray(product, ["gallery", "images", "media"]);
  const memoryItems = pickArray(memory, ["items", "entries", "chapters"]);

  return withoutUndefined({
    brand: isRecord(brand)
      ? {
          name: pickString(brand, ["name", "title"]),
          mark: pickString(brand, ["mark", "monogram", "logoText"]),
          homeAriaLabel: pickString(brand, ["homeAriaLabel"]),
          crestAriaLabel: pickString(brand, ["crestAriaLabel"]),
          wordmark: isRecord(brand.wordmark) ? brand.wordmark : undefined,
          crest: isRecord(brand.crest) ? brand.crest : undefined,
          diamond: isRecord(brand.diamond) ? brand.diamond : undefined,
        }
      : undefined,
    menu: isRecord(menu) ? menu : undefined,
    navigation: navigation?.map(normalizeNavItem).filter(Boolean),
    hero: withoutUndefined({
      ...normalizeChapterPayload(hero),
      eyebrow: pickString(hero, ["eyebrow", "kicker", "overline", "label"]),
      secondaryEyebrow: pickString(hero, [
        "secondaryEyebrow",
        "secondaryLabel",
        "location",
      ]),
      scrollLabel: pickString(hero, ["scrollLabel", "scroll", "scrollText"]),
      headline: pickString(payload, ["heroHeadline", "headline"]) ??
        pickString(hero, ["headline", "title", "heading"]),
      subtitle:
        pickString(payload, ["heroSubtitle", "subheadline"]) ??
        pickString(hero, ["subtitle", "subheadline", "intro"]),
      body:
        pickString(payload, ["heroBody", "description"]) ??
        pickString(hero, ["body", "copy", "description", "text"]),
      image: normalizeImagePayload(
        hero?.image ??
          hero?.backgroundImage ??
          hero?.media ??
          payload.heroImage ??
          payload.heroImageUrl,
      ),
    }) as DeepPartial<LandingContent["hero"]>,
    introduction: withoutUndefined({
      ...normalizeChapterPayload(introduction),
      cta: pickString(introduction, ["cta", "ctaLabel", "ctaText"]),
    }),
    product: withoutUndefined({
      ...normalizeChapterPayload(product),
      gallery: productGallery?.map(normalizeImagePayload).filter(Boolean),
    }),
    archive: withoutUndefined({
      ...normalizeChapterPayload(archive),
      sealLabel: pickString(archive, ["sealLabel", "label", "cta", "ctaLabel"]),
    }),
    vineyard: normalizeChapterPayload(vineyard),
    cellar: withoutUndefined({
      ...normalizeChapterPayload(cellar),
      cta: pickString(cellar, ["cta", "ctaLabel", "ctaText"]),
      secondaryImage: normalizeImagePayload(
        cellar?.secondaryImage ?? cellar?.secondaryMedia ?? cellar?.detailImage,
      ),
    }),
    memory: withoutUndefined({
      eyebrow: pickString(memory, ["eyebrow", "kicker", "overline", "label"]),
      headline: pickString(memory, ["headline", "title", "heading"]),
      items: memoryItems?.map(normalizeMemoryItem).filter(Boolean),
    }),
    contact: isRecord(contact)
      ? withoutUndefined({
          eyebrow: pickString(contact, ["eyebrow", "kicker", "overline", "label"]),
          title: pickString(contact, ["title", "headline", "name"]),
          email: pickString(contact, ["email", "mail"]),
          location: pickString(contact, ["location", "address", "place"]),
          legal: pickString(contact, ["legal", "legalText", "copyright"]),
        })
      : undefined,
  }) as DeepPartial<LandingContent>;
};

const mergeImage = (
  fallback: LandingImage,
  content: DeepPartial<LandingImage> | undefined,
): LandingImage => ({
  ...fallback,
  ...(isRecord(content) ? content : {}),
});

const mergeChapter = <T extends LandingChapter>(
  fallback: T,
  content: DeepPartial<T> | undefined,
): T => ({
  ...fallback,
  ...(isRecord(content) ? content : {}),
  image:
    isRecord(content?.image) && fallback.image
      ? { ...fallback.image, ...content.image }
      : (content?.image as T["image"]) ?? fallback.image,
});

const mergeSectionMarkers = (
  content: DeepPartial<LandingContent["menu"]["sections"]> | undefined,
): LandingContent["menu"]["sections"] => {
  const fallbackSections = fallbackLandingContent.menu.sections;
  const nextSections = { ...fallbackSections };

  (Object.keys(fallbackSections) as LandingSectionKey[]).forEach((section) => {
    nextSections[section] = {
      ...fallbackSections[section],
      ...(isRecord(content?.[section]) ? content[section] : {}),
    };
  });

  return nextSections;
};

const mergeContent = (
  content: DeepPartial<LandingContent>,
): LandingContent => ({
  ...fallbackLandingContent,
  ...content,
  brand: {
    ...fallbackLandingContent.brand,
    ...(isRecord(content.brand) ? content.brand : {}),
    wordmark: {
      light: mergeImage(
        fallbackLandingContent.brand.wordmark.light,
        content.brand?.wordmark?.light,
      ),
      dark: mergeImage(
        fallbackLandingContent.brand.wordmark.dark,
        content.brand?.wordmark?.dark,
      ),
    },
    crest: {
      light: mergeImage(
        fallbackLandingContent.brand.crest.light,
        content.brand?.crest?.light,
      ),
      dark: mergeImage(
        fallbackLandingContent.brand.crest.dark,
        content.brand?.crest?.dark,
      ),
    },
    diamond: {
      light: mergeImage(
        fallbackLandingContent.brand.diamond.light,
        content.brand?.diamond?.light,
      ),
      dark: mergeImage(
        fallbackLandingContent.brand.diamond.dark,
        content.brand?.diamond?.dark,
      ),
    },
  },
  menu: {
    ...fallbackLandingContent.menu,
    ...(isRecord(content.menu) ? content.menu : {}),
    sections: mergeSectionMarkers(content.menu?.sections),
    darkSections: Array.isArray(content.menu?.darkSections)
      ? content.menu.darkSections
      : fallbackLandingContent.menu.darkSections,
  },
  navigation: Array.isArray(content.navigation)
    ? content.navigation
    : fallbackLandingContent.navigation,
  hero: {
    ...fallbackLandingContent.hero,
    ...(isRecord(content.hero) ? content.hero : {}),
    image: {
      ...fallbackLandingContent.hero.image,
      ...(isRecord(content.hero?.image) ? content.hero.image : {}),
    },
  },
  introduction: mergeChapter(
    fallbackLandingContent.introduction,
    content.introduction,
  ),
  product: {
    ...mergeChapter(fallbackLandingContent.product, content.product),
    gallery: Array.isArray(content.product?.gallery)
      ? (content.product.gallery as LandingImage[])
      : fallbackLandingContent.product.gallery,
  },
  archive: {
    ...fallbackLandingContent.archive,
    ...(isRecord(content.archive) ? content.archive : {}),
  },
  vineyard: mergeChapter(fallbackLandingContent.vineyard, content.vineyard),
  cellar: {
    ...mergeChapter(fallbackLandingContent.cellar, content.cellar),
    secondaryImage: {
      ...fallbackLandingContent.cellar.secondaryImage,
      ...(isRecord(content.cellar?.secondaryImage)
        ? content.cellar.secondaryImage
        : {}),
    },
  },
  memory: {
    ...fallbackLandingContent.memory,
    ...(isRecord(content.memory) ? content.memory : {}),
    items: Array.isArray(content.memory?.items)
      ? (content.memory.items as LandingMemory[])
      : fallbackLandingContent.memory.items,
  },
  contact: {
    ...fallbackLandingContent.contact,
    ...(isRecord(content.contact) ? content.contact : {}),
  },
});

export const resolveLandingPageContent = (payload: ContentPayload) =>
  mergeContent(normalizeLandingContent(payload));

export async function getLandingPageContent(): Promise<LandingContent> {
  const endpoint =
    process.env.SHUTTER_CONTENT_ENDPOINT ?? process.env.SHUTTER_LANDING_ENDPOINT;

  if (!endpoint) {
    return fallbackLandingContent;
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 120,
      },
    });

    if (!response.ok) {
      return fallbackLandingContent;
    }

    const payload = (await response.json()) as ContentPayload;

    return resolveLandingPageContent(payload);
  } catch {
    return fallbackLandingContent;
  }
}
