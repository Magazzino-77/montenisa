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
  title: string;
  body: string;
  image?: LandingImage;
};

export type LandingMemory = {
  number: string;
  title: string;
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
    title: string;
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
  archive: LandingChapter & {
    sealLabel: string;
  };
  vineyard: LandingChapter;
  cellar: LandingChapter & {
    secondaryImage: LandingImage;
    cta: string;
  };
  memory: {
    eyebrow: string;
    title: string;
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
    title: "Nel cuore della Franciacorta",
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
    title: "Dove ogni meraviglia ha inizio",
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
    title: "Il Corallo Rosa",
    body:
      "Una sezione scura e scenografica per il racconto dello spumante: un oggetto centrale, dettagli laterali e un ritmo più contemplativo, pronto per slider, parallax e micro-interazioni.",
    image: {
      src: "/images/montenisa-corallo-rosa.png",
      alt: "Rosé bottle still life with coral form",
    },
    gallery: [
      {
        src: "/images/montenisa-corallo-rosa.png",
        alt: "Dark product still life",
      },
      {
        src: "/images/montenisa-cellar.png",
        alt: "Cellar detail with barrels",
      },
      {
        src: "/images/montenisa-estate-hero.png",
        alt: "Estate facade detail",
      },
    ],
  },
  archive: {
    eyebrow: "Le promesse di origine",
    title: "Curtes Francae",
    body:
      "Il capitolo d'archivio lavora su pergamene, sigilli e tracce storiche. Per ora resta una sezione statica con elementi decorativi, pronta per una futura scena in cui le carte entrano e si sovrappongono allo scroll.",
    sealLabel: "Archivio Montenisa",
  },
  vineyard: {
    eyebrow: "I vigneti",
    title: "La vigna custodisce",
    body:
      "Dove la natura lascia il tempo al metodo. Una sezione orizzontale, più silenziosa, che alterna fotografia e testo per preparare movimenti di camera, dissolvenze e progressioni lente.",
    image: {
      src: "/images/montenisa-vineyard.png",
      alt: "Winter vineyard in soft light",
    },
  },
  cellar: {
    eyebrow: "Le cantine",
    title: "La stanza nascosta",
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
    title: "Memoria viva",
    items: [
      {
        number: "01",
        title: "La dimora",
        body:
          "Una casa agricola e nobile, fatta di soglie, portici e corti interne.",
      },
      {
        number: "02",
        title: "Il paesaggio",
        body:
          "La Franciacorta come territorio di precisione, attesa e trasformazione.",
      },
      {
        number: "03",
        title: "Il sogno delle bollicine",
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

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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
      ? content.product.gallery
      : fallbackLandingContent.product.gallery,
  },
  archive: mergeChapter(fallbackLandingContent.archive, content.archive),
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
      ? content.memory.items
      : fallbackLandingContent.memory.items,
  },
  contact: {
    ...fallbackLandingContent.contact,
    ...(isRecord(content.contact) ? content.contact : {}),
  },
});

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

    const content = (await response.json()) as DeepPartial<LandingContent>;

    return mergeContent(content);
  } catch {
    return fallbackLandingContent;
  }
}
