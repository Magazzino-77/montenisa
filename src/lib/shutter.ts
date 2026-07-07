export type LandingNavItem = {
  label: string;
  href: string;
};

export type LandingImage = {
  src: string;
  alt: string;
};

export type ProductSlide = {
  headline: string;
  body?: string;
  image: LandingImage;
  thumbnail: LandingImage;
};

export type LandingChapter = {
  eyebrow: string;
  headline: string;
  body: string;
  image?: LandingImage;
};

export type VineyardState = {
  headline: string;
  body: string;
  primaryImage: LandingImage;
  secondaryImage: LandingImage;
  layout: "image-left" | "image-right";
};

export type LandingMemory = {
  number: string;
  headline: string;
  body: string;
  image?: LandingImage;
};

export type ArchiveObject = {
  image: LandingImage;
  placement: string;
};

export type ArchiveState = {
  headline: string;
  body: string;
  objects: ArchiveObject[];
};

export type ArchiveChapter = {
  cta: string;
  states: ArchiveState[];
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
    slides: ProductSlide[];
  };
  archive: ArchiveChapter;
  vineyard: LandingChapter & {
    states: VineyardState[];
  };
  cellar: {
    eyebrow: string;
    cta: string;
    states: ArchiveState[];
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
    slides: [
      {
        headline: "Rosé",
        body:
          "Il corallo rosato è un elemento naturale prezioso e raro, da sempre associato al fascino femminile. Le sue sfumature delicate richiamano il colore del Rosé, mentre la sua bellezza naturale riflette la freschezza e la vivacità di questa cuvée.",
        image: {
          src: "/images/corallo-3d.png",
          alt: "Pink coral sculpture",
        },
        thumbnail: {
          src: "/images/spumanti/vino-corallo.png",
          alt: "Rosé Franciacorta bottle thumbnail",
        },
      },
      {
        headline: "Blanc de Blancs",
        body:
          "La conchiglia custodisce l'eco del mare e della mineralità. La sua forma luminosa racconta una cuvée tesa, elegante e precisa, capace di trasformare freschezza e sapidità in equilibrio.",
        image: {
          src: "/images/conchiglia-3d.png",
          alt: "Ivory shell sculpture",
        },
        thumbnail: {
          src: "/images/spumanti/vino-conchiglia.png",
          alt: "Blanc de Blancs bottle thumbnail",
        },
      },
      {
        headline: "Cuvée Royale",
        body:
          "La chiave antica apre una stanza di memoria e precisione. Il suo metallo prezioso richiama una cuvée costruita sul tempo, sulla cura e su una promessa di eleganza classica.",
        image: {
          src: "/images/chiave-3d.png",
          alt: "Ornate golden key sculpture",
        },
        thumbnail: {
          src: "/images/spumanti/vino-chiave.png",
          alt: "Cuvée Royale bottle thumbnail",
        },
      },
      {
        headline: "La Lettera",
        body:
          "La lettera conserva un messaggio, una dedica, una traccia intima. Diventa simbolo di un vino che parla attraverso sfumature sottili, memoria e misura.",
        image: {
          src: "/images/spumanti/lettera.png",
          alt: "Lettera antica",
        },
        thumbnail: {
          src: "/images/spumanti/vino-lettera.png",
          alt: "Franciacorta bottle with letter still life",
        },
      },
      {
        headline: "L'Occhiale",
        body:
          "L'occhiale invita a guardare più da vicino: dettagli, riflessi, profondità. È il gesto dell'osservazione che accompagna una cuvée nitida e contemplativa.",
        image: {
          src: "/images/spumanti/occhiale.png",
          alt: "Occhiale antico",
        },
        thumbnail: {
          src: "/images/spumanti/vino-occhiale.png",
          alt: "Franciacorta bottle with antique glasses still life",
        },
      },
      {
        headline: "L'Ombrello",
        body:
          "L'ombrello protegge e rivela, come un piccolo teatro portatile. La sua presenza scenografica racconta una cuvée dal carattere gentile, elegante e sorprendente.",
        image: {
          src: "/images/spumanti/ombrello.png",
          alt: "Ombrello chiaro",
        },
        thumbnail: {
          src: "/images/spumanti/vino-ombrello.png",
          alt: "Franciacorta bottle with umbrella still life",
        },
      },
    ],
  },
  archive: {
    cta: "Scopri le meraviglie della tenuta",
    states: [
      {
        headline: "Curtes Francae",
        body:
          "Ogni meraviglia comincia da un nome. E ogni nome custodisce una storia. C'è chi racconta che “Franciacorta” derivi da Petite France, il nome affettuoso che Carlo Magno avrebbe dato a questa terra. Ma la traccia più antica conduce altrove: alle Curtes Francae, corti monastiche medievali libere da alcuni tributi, luoghi di lavoro, sapere e custodia.",
        objects: [
          {
            image: {
              src: "/images/archive-sigillo-alpha.png",
              alt: "Sigillo di cera con stemma",
            },
            placement:
              "right-[1.5%] top-[9%] h-[clamp(150px,18vw,250px)] w-[clamp(150px,18vw,250px)] rotate-[8deg] 2xl:right-[1%] 2xl:top-[7%] 2xl:h-[min(24vw,300px)] 2xl:w-[min(24vw,300px)]",
          },
          {
            image: {
              src: "/images/archive-piuma-alpha.png",
              alt: "Piuma d'oca",
            },
            placement:
              "bottom-[7%] left-[5%] h-[clamp(300px,34vw,450px)] w-[clamp(210px,24vw,320px)] -rotate-[14deg] 2xl:left-[4%] 2xl:h-[min(42vw,520px)] 2xl:w-[min(30vw,380px)] 2xl:-rotate-[18deg]",
          },
          {
            image: {
              src: "/images/archive-moneta.png",
              alt: "Moneta antica",
            },
            placement:
              "right-[5%] bottom-[10%] h-[clamp(132px,14vw,190px)] w-[clamp(132px,14vw,190px)] rotate-[12deg] 2xl:right-[3%] 2xl:bottom-[7%] 2xl:h-[min(18vw,220px)] 2xl:w-[min(18vw,220px)]",
          },
        ],
      },
      {
        headline: "Una terra che diventa metodo",
        body:
          "Nella Franciacorta, il suolo è fertile, minerale, ben drenato dai ciottoli lasciati da glaciazioni millenarie. Il clima è ventilato e temperato. Il paesaggio è vario e luminoso. Da questa combinazione di suolo, clima e bellezza nasce una vocazione rara: la capacità di trasformare l'uva in spumante attraverso un metodo preciso, paziente, naturale. Nel 1967, i vini della Franciacorta ottengono tra i primi in Italia la Denominazione di Origine Controllata. La meraviglia comincia a prendere forma.",
          objects: [
            {
              image: {
                src: "/images/archive-foglia.png",
                alt: "Foglia di vite",
              },
              placement:
                "bottom-[8%] left-[5%] h-[clamp(230px,26vw,320px)] w-[clamp(250px,28vw,340px)] -rotate-[8deg] 2xl:bottom-[5%] 2xl:left-[4%] 2xl:h-[min(30vw,380px)] 2xl:w-[min(32vw,420px)] 2xl:-rotate-[10deg]",
            },
            {
              image: {
                src: "/images/archive-roccia.png",
                alt: "Roccia stratificata",
              },
              placement:
                "right-[6%] top-[14%] h-[clamp(190px,20vw,280px)] w-[clamp(210px,22vw,300px)] rotate-[-6deg] 2xl:right-[5%] 2xl:top-[12%] 2xl:h-[min(24vw,310px)] 2xl:w-[min(26vw,340px)]",
            },
            {
              image: {
                src: "/images/archive-cristallo.png",
                alt: "Cristallo trasparente",
              },
              placement:
                "right-[8%] bottom-[10%] h-[clamp(140px,15vw,205px)] w-[clamp(140px,15vw,205px)] rotate-[10deg] 2xl:right-[7%] 2xl:bottom-[8%] 2xl:h-[min(18vw,230px)] 2xl:w-[min(18vw,230px)]",
            },
          ],
        },
      {
        headline: "1995. Una data che brilla.",
        body:
          "Per la Franciacorta, il 1995 è un anno storico, in cui una zonazione vitivinicola più attenta riconosce con precisione la natura dei suoi vini. Ai Bianchi e ai Rossi viene destinata la denominazione Terre di Franciacorta. Al vino rifermentato naturalmente in bottiglia viene riservata la DOCG Franciacorta. Nasce così il primo e unico Brut italiano DOCG con obbligo di rifermentazione naturale in bottiglia. Da quel momento, la Franciacorta non è più soltanto un luogo. È un metodo, un'identità, una promessa. Dentro Tenuta Montenisa, questa promessa diventa collezione: cuvée custodite come tesori, nate dalla terra e svelate dal tempo.",
          objects: [
            {
              image: {
                src: "/images/archive-tappo.png",
                alt: "Tappo da spumante",
              },
              placement:
                "bottom-[8%] left-[6%] h-[clamp(230px,26vw,320px)] w-[clamp(185px,20vw,260px)] rotate-[-8deg] 2xl:bottom-[5%] 2xl:left-[4%] 2xl:h-[min(30vw,390px)] 2xl:w-[min(24vw,310px)] 2xl:rotate-[-10deg]",
            },
            {
              image: {
                src: "/images/archive-bollicine.png",
                alt: "Bollicine dorate",
              },
              placement:
                "right-[7%] top-[10%] h-[clamp(190px,22vw,300px)] w-[clamp(150px,17vw,230px)] rotate-[4deg] 2xl:right-[6%] 2xl:top-[8%] 2xl:h-[min(26vw,340px)] 2xl:w-[min(21vw,270px)]",
            },
            {
              image: {
                src: "/images/archive-scudo.png",
                alt: "Scudo decorativo 1995",
              },
              placement:
                "right-[5%] bottom-[10%] h-[clamp(190px,20vw,270px)] w-[clamp(220px,24vw,320px)] rotate-[6deg] 2xl:right-[3%] 2xl:bottom-[8%] 2xl:h-[min(24vw,310px)] 2xl:w-[min(28vw,360px)]",
            },
          ],
        },
    ],
  },
  vineyard: {
    eyebrow: "I vigneti",
    headline: "La vigna custodisce",
    body:
      "Dentro la Wunderkammer di Tenuta Montenisa, la vigna è il primo linguaggio della meraviglia. Chardonnay, Pinot Nero e Pinot Bianco diventano materia viva.",
    image: {
      src: "/images/vineyard/vineyard-01-main-b.jpg",
      alt: "Vigneto di Tenuta Montenisa nella luce del mattino",
    },
    states: [
      {
        headline: "La vigna custodisce",
        body:
          "Dentro la Wunderkammer di Tenuta Montenisa, la vigna è il primo linguaggio della meraviglia. Chardonnay, Pinot Nero e Pinot Bianco diventano materia viva: lo Chardonnay porta luce e note floreali, il Pinot Nero struttura e profondità, il Pinot Bianco sapidità e mineralità. Tre varietà, tre caratteri, un’unica origine destinata a diventare cuvée.",
        primaryImage: {
          src: "/images/vineyard/vineyard-01-main-b.jpg",
          alt: "Filari di vite in controluce a Tenuta Montenisa",
        },
        secondaryImage: {
          src: "/images/vineyard/vineyard-01-detail.jpg",
          alt: "Dettaglio del vigneto di Tenuta Montenisa",
        },
        layout: "image-left",
      },
      {
        headline: "La collina di S. Stefano",
        body:
          "Sulla collina di S. Stefano si trovano i vigneti storici di Tenuta Montenisa. Qui luce, aria, pendenza e memoria diventano parte della materia. Il paesaggio non è solo sfondo: custodisce le uve, ne accompagna la maturazione e consegna alle cuvée profumo, equilibrio e complessità. Una stanza aperta della Wunderkammer, dove la natura prende voce.",
        primaryImage: {
          src: "/images/vineyard/vineyard-02-main.jpg",
          alt: "Vigneto sulla collina di S. Stefano",
        },
        secondaryImage: {
          src: "/images/vineyard/vineyard-02-detail-b.jpg",
          alt: "Dettaglio verticale dei vigneti storici",
        },
        layout: "image-right",
      },
      {
        headline: "Il brolo e la cura",
        body:
          "Accanto ai vigneti storici, Tenuta Montenisa custodisce il brolo: un appezzamento cinto da muro, raccolto e protetto. Qui la vigna diventa giardino di precisione. La scelta delle varietà e la cura dell’ambiente trasformano ogni gesto in responsabilità. Dal brolo alla bottiglia, la materia continua il suo cammino: da grappolo a carattere, da terra a cuvée.",
        primaryImage: {
          src: "/images/vineyard/vineyard-03-main-b.jpg",
          alt: "Vite e luce dorata nel brolo di Tenuta Montenisa",
        },
        secondaryImage: {
          src: "/images/vineyard/vineyard-03-detail.jpg",
          alt: "Dettaglio della cura della vigna",
        },
        layout: "image-left",
      },
    ],
  },
  cellar: {
    eyebrow: "Le cantine",
    cta: "Scopri gli spumanti",
    states: [
      {
        headline: "La stanza nascosta",
        body:
          "Sotto i portici di Tenuta Montenisa si apre la stanza più silenziosa della tenuta: le cantine di vinificazione e affinamento. Qui il racconto cambia luce. La materia raccolta nei vigneti entra in profondità e comincia il suo cammino verso la cuvée.",
        objects: [
          {
            image: {
              src: "/images/cellar/la-stanza-nascosta-1.png",
              alt: "Cantina con barrique della Tenuta Montenisa",
            },
            placement: "left-[7%] top-[13%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/la-stanza-nascosta-2.png",
              alt: "Degustazione nella sala della cantina",
            },
            placement: "left-[37%] top-[50%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/la-stanza-nascosta-3.png",
              alt: "Corridoio della cantina con botti",
            },
            placement: "right-[7%] top-[26%] w-[min(22vw,300px)] aspect-[0.73]",
          },
        ],
      },
      {
        headline: "Il tempo riposa",
        body:
          "Nelle cantine storiche, il vino in bottiglia matura sui lieviti per lunghi periodi, superiori ai tempi minimi previsti dal disciplinare. L'attesa non è immobilità. È trasformazione lenta, paziente, invisibile: il momento in cui la materia acquista profondità, equilibrio e carattere.",
        objects: [
          {
            image: {
              src: "/images/cellar/il-tempo-riposa-1.png",
              alt: "Volta della cantina storica in penombra",
            },
            placement: "left-[7%] top-[13%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/il-tempo-riposa-2.png",
              alt: "Botti in affinamento nella cantina",
            },
            placement: "left-[37%] top-[50%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/il-tempo-riposa-3.png",
              alt: "Cantina voltata con grandi botti",
            },
            placement: "right-[7%] top-[26%] w-[min(22vw,300px)] aspect-[0.73]",
          },
        ],
      },
      {
        headline: "Ogni bottiglia, un gesto",
        body:
          "Il remuage viene ancora eseguito con la massima attenzione per ogni singola bottiglia. Un gesto preciso, ripetuto, quasi rituale. Nella stanza del tempo, la cura diventa metodo e il metodo diventa espressione del territorio.",
        objects: [
          {
            image: {
              src: "/images/cellar/ogni-bottiglia-un-gesto-1.png",
              alt: "Bottiglie in affinamento sui lieviti",
            },
            placement: "left-[7%] top-[13%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/ogni-bottiglia-un-gesto-2.png",
              alt: "Pupitre con bottiglie durante il remuage",
            },
            placement: "left-[37%] top-[50%] w-[min(22vw,300px)] aspect-[0.73]",
          },
          {
            image: {
              src: "/images/cellar/ogni-bottiglia-un-gesto-3.png",
              alt: "Il gesto del remuage sulle bottiglie",
            },
            placement: "right-[7%] top-[26%] w-[min(22vw,300px)] aspect-[0.73]",
          },
        ],
      },
    ],
  },
  memory: {
    eyebrow: "La storia",
    headline: "Memoria viva il sogno delle bollicine",
    items: [
      {
        number: "01",
        headline: "L'incontro tra due famiglie",
        body:
          "La memoria dei Conti Maggi si intreccia con l'esperienza dei Marchesi Antinori. Dal 1999, Tenuta Montenisa diventa il cuore della Franciacorta Antinori.",
        image: {
          src: "/images/memory/memory-01.png",
          alt: "Ritratto storico legato alla memoria di Tenuta Montenisa",
        },
      },
      {
        number: "02",
        headline: "Palazzo Piccolo Maggi",
        body:
          "Costruito nel Cinquecento, conserva preziosi affreschi attribuiti a Lattanzio Gambara. Qui la memoria diventa arte e la storia prende forma sulle pareti.",
        image: {
          src: "/images/memory/memory-03.png",
          alt: "Dettaglio architettonico di Palazzo Piccolo Maggi",
        },
      },
      {
        number: "03",
        headline: "Il sogno delle bollicine Antinori",
        body:
          "Dai viaggi a Reims al metodo champenois, nasce il Gran Spumante Marchese Antinori. Un vino che voleva essere degno rivale delle grandi marche di Champagne.",
        image: {
          src: "/images/memory/memory-02.jpg",
          alt: "Pubblicazione storica Niccolo Antinori",
        },
      },
      {
        number: "04",
        headline: "Conte Aymo",
        body:
          "Fondatore della Mille Miglia, incarna visione, coraggio e spirito pionieristico. La cuvee che porta il suo nome ne raccoglie il carattere dinamico e determinato.",
        image: {
          src: "/images/memory/memory-04.png",
          alt: "Immagine storica dedicata al Conte Aymo",
        },
      },
      {
        number: "05",
        headline: "Contessa Maggi",
        body:
          "Presenza discreta e profonda, legata al territorio e alla comunita. Il personaggio della Contessa Maggi racconta un'eleganza fatta di armonia, cura e sensibilita.",
        image: {
          src: "/images/memory/memory-05.png",
          alt: "Ritratto ispirato alla Contessa Maggi",
        },
      },
      {
        number: "06",
        headline: "Donna Cora Antinori",
        body:
          "Figura luminosa della Belle Epoque, simbolo di grazia, raffinatezza e femminilita colta e moderna. Donna Cora Saten custodisce la sua luce in una cuvee fine e armoniosa.",
        image: {
          src: "/images/memory/memory-08.png",
          alt: "Immagine luminosa ispirata a Donna Cora Antinori",
        },
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
  "product.slides[].headline",
  "product.slides[].image.src",
  "product.slides[].image.alt",
  "product.slides[].thumbnail.src",
  "product.slides[].thumbnail.alt",
  "archive.cta",
  "archive.states[].headline",
  "archive.states[].body",
  "archive.states[].objects[].image.src",
  "archive.states[].objects[].image.alt",
  "vineyard.eyebrow",
  "vineyard.headline",
  "vineyard.body",
  "vineyard.image.src",
  "vineyard.image.alt",
  "vineyard.states[].headline",
  "vineyard.states[].body",
  "vineyard.states[].primaryImage.src",
  "vineyard.states[].primaryImage.alt",
  "vineyard.states[].secondaryImage.src",
  "vineyard.states[].secondaryImage.alt",
  "vineyard.states[].layout",
  "cellar.eyebrow",
  "cellar.cta",
  "cellar.states[].headline",
  "cellar.states[].body",
  "cellar.states[].objects[].image.src",
  "cellar.states[].objects[].image.alt",
  "memory.eyebrow",
  "memory.headline",
  "memory.items[].number",
  "memory.items[].headline",
  "memory.items[].body",
  "memory.items[].image.src",
  "memory.items[].image.alt",
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

    if (isRecord(value) && Array.isArray(value.items)) {
      return value.items;
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

const normalizeProductSlide = (
  value: unknown,
): DeepPartial<ProductSlide> | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const image = normalizeImagePayload(
    value.image ?? value.media ?? value.photo ?? value.mainImage,
  );
  const thumbnail = normalizeImagePayload(
    value.thumbnail ?? value.thumb ?? value.preview ?? value.image,
  );

  return withoutUndefined({
    headline: pickString(value, ["headline", "title", "heading", "label"]),
    body: pickString(value, ["body", "description", "copy", "text"]),
    image,
    thumbnail: thumbnail ?? image,
  }) as DeepPartial<ProductSlide>;
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

const normalizeVineyardState = (
  state: unknown,
): DeepPartial<VineyardState> | undefined => {
  if (!isRecord(state)) {
    return undefined;
  }

  const headline = pickString(state, ["headline", "title", "heading"]);
  const body = pickString(state, ["body", "copy", "description", "text"]);
  const primaryImage = normalizeImagePayload(
    state.primaryImage ??
      state.image ??
      state.mainImage ??
      state.media ??
      state.photo,
  );
  const secondaryImage =
    normalizeImagePayload(
      state.secondaryImage ??
        state.detailImage ??
        state.smallImage ??
        state.thumbnail ??
        state.supportingImage,
    ) ?? primaryImage;
  const layout = pickString(state, ["layout", "imageSide", "variant"]);

  if (!headline || !body || !primaryImage?.src || !secondaryImage?.src) {
    return undefined;
  }

  return {
    headline,
    body,
    primaryImage: {
      src: primaryImage.src,
      alt: primaryImage.alt ?? headline,
    },
    secondaryImage: {
      src: secondaryImage.src,
      alt: secondaryImage.alt ?? headline,
    },
    layout: layout === "image-right" || layout === "right" ? "image-right" : "image-left",
  } satisfies DeepPartial<VineyardState>;
};

const normalizeMemoryItem = (item: unknown): LandingMemory | undefined => {
  if (!isRecord(item)) {
    return undefined;
  }

  const number = pickString(item, ["number", "index", "label"]);
  const headline = pickString(item, ["headline", "title", "heading"]);
  const body = pickString(item, ["body", "copy", "description", "text"]);
  const image = normalizeImagePayload(item.image ?? item.media ?? item.photo);

  if (!number || !headline || !body) {
    return undefined;
  }

  return {
    number,
    headline,
    body,
    image: image?.src
      ? {
          src: image.src,
          alt: image.alt ?? headline,
        }
      : undefined,
  };
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
  const productGallery = pickArray(product, [
    "slides",
    "gallery",
    "images",
    "media",
  ]);
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
      slides: productGallery
        ?.map((item) => {
          const slide = normalizeProductSlide(item);

          if (slide?.headline && slide.image?.src) {
            return slide;
          }

          const image = normalizeImagePayload(item);

          if (!image?.src) {
            return undefined;
          }

          return {
            headline: pickString(isRecord(item) ? item : undefined, [
              "headline",
              "title",
              "heading",
              "label",
              "alt",
            ]),
            image,
            thumbnail: image,
          } satisfies DeepPartial<ProductSlide>;
        })
        .filter(Boolean),
    }),
    archive: withoutUndefined({
      cta:
        pickString(archive, ["cta", "ctaLabel", "sealLabel", "label"]) ??
        pickString(archive, ["headline"]) ??
        undefined,
      states: pickArray(archive, ["states", "chapters", "steps"])?.map(
        (state) => {
          if (!isRecord(state)) {
            return undefined;
          }

          const objects = pickArray(state, ["objects", "items", "assets"])
            ?.map((object) => {
              if (!isRecord(object)) {
                return undefined;
              }

              const image = normalizeImagePayload(
                object.image ?? object.media ?? object.asset,
              );

              if (!image?.src || !image.alt) {
                return undefined;
              }

              return {
                image: { src: image.src, alt: image.alt },
                placement:
                  pickString(object, ["placement", "className", "position"]) ??
                  "",
              } satisfies ArchiveObject;
            })
            .filter((object): object is ArchiveObject => Boolean(object));

          const headline = pickString(state, ["headline", "title", "heading"]);
          const body = pickString(state, ["body", "copy", "description", "text"]);

          if (!headline || !body) {
            return undefined;
          }

          return {
            headline,
            body,
            objects,
          } satisfies DeepPartial<ArchiveState>;
        },
      ),
    }),
    vineyard: withoutUndefined({
      ...normalizeChapterPayload(vineyard),
      states: pickArray(vineyard, ["states", "chapters", "steps"])?.map(
        normalizeVineyardState,
      ).filter(Boolean),
    }),
    cellar: withoutUndefined({
      eyebrow: pickString(cellar, ["eyebrow", "kicker", "overline", "label"]),
      cta: pickString(cellar, ["cta", "ctaLabel", "ctaText", "label"]),
      states: pickArray(cellar, ["states", "chapters", "steps"])?.map((state) => {
        if (!isRecord(state)) {
          return undefined;
        }

        const objects = pickArray(state, ["objects", "items", "assets", "images"])
          ?.map((object) => {
            if (!isRecord(object)) {
              return undefined;
            }

            const image = normalizeImagePayload(
              object.image ?? object.media ?? object.asset,
            );

            if (!image?.src || !image.alt) {
              return undefined;
            }

            return {
              image: { src: image.src, alt: image.alt },
              placement:
                pickString(object, ["placement", "className", "position"]) ??
                "",
            } satisfies ArchiveObject;
          })
          .filter((object): object is ArchiveObject => Boolean(object));

        const headline = pickString(state, ["headline", "title", "heading"]);
        const body = pickString(state, ["body", "copy", "description", "text"]);

        if (!headline || !body) {
          return undefined;
        }

        return {
          headline,
          body,
          objects,
        } satisfies DeepPartial<ArchiveState>;
      }),
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

const mergeByIndex = <T extends Record<string, unknown>>(
  fallback: T[],
  content: unknown,
): T[] => {
  const items = Array.isArray(content)
    ? content
    : isRecord(content) && Array.isArray(content.items)
      ? content.items
      : undefined;

  if (!items) {
    return fallback;
  }

  const merged = items.map((item, index) => ({
    ...fallback[index],
    ...(isRecord(item) ? withoutUndefined(item) : {}),
  })) as T[];

  return merged.length < fallback.length
    ? [...merged, ...fallback.slice(merged.length)]
    : merged;
};

const mergeProductSlides = (
  fallback: ProductSlide[],
  content: unknown,
): ProductSlide[] => {
  return mergeByIndex(fallback, content) as ProductSlide[];
};

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
    slides: mergeProductSlides(
      fallbackLandingContent.product.slides,
      content.product?.slides,
    ),
  },
  archive: {
    ...fallbackLandingContent.archive,
    ...(isRecord(content.archive) ? content.archive : {}),
    states: mergeByIndex(
      fallbackLandingContent.archive.states,
      content.archive?.states,
    ) as ArchiveState[],
  },
  vineyard: {
    ...mergeChapter(fallbackLandingContent.vineyard, content.vineyard),
    states: Array.isArray(content.vineyard?.states)
      ? (content.vineyard.states as VineyardState[])
      : fallbackLandingContent.vineyard.states,
  },
  cellar: {
    ...fallbackLandingContent.cellar,
    ...(isRecord(content.cellar) ? content.cellar : {}),
    states: mergeByIndex(
      fallbackLandingContent.cellar.states,
      content.cellar?.states,
    ) as ArchiveState[],
  },
  memory: {
    ...fallbackLandingContent.memory,
    ...(isRecord(content.memory) ? content.memory : {}),
    items: mergeByIndex(
      fallbackLandingContent.memory.items,
      content.memory?.items,
    ) as LandingMemory[],
  },
  contact: {
    ...fallbackLandingContent.contact,
    ...(isRecord(content.contact) ? content.contact : {}),
  },
});

export const resolveLandingPageContent = (payload: ContentPayload) =>
  mergeContent(
    normalizeLandingContent(
      isRecord(payload.content) ? (payload.content as ContentPayload) : payload,
    ),
  );

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
