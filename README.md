# Tenuta Montenisa

One-page homepage foundation for Tenuta Montenisa, built from the Figma prototype direction with Next.js, Tailwind CSS, and GSAP. The current pass sets up the section sequence and content architecture; detailed scroll behavior and animation choreography can be layered onto each section next.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- GSAP
- Server-side Shutter content adapter with fallback page data

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Fallback page content lives in [src/lib/shutter.ts](src/lib/shutter.ts). It is shaped around the current one-page chapters:

- Brand/menu/header assets and labels
- Hero
- La tenuta
- Il Corallo Rosa
- Curtes Francae
- La vigna
- La stanza nascosta
- Memoria viva
- Footer/contact

When Shutter exposes the landing page JSON, set one of these server-side environment variables in Vercel:

```bash
SHUTTER_CONTENT_ENDPOINT=
SHUTTER_LANDING_ENDPOINT=
SHUTTER_IMAGE_HOSTNAMES=
```

The endpoint can return any subset of the `LandingContent` shape and the app will merge it with the fallback content. `headline` is the canonical key for visible page headings, including the hero H1. Legacy aliases such as `title`, `heading`, `heroHeadline`, `subheadline`, `copy`, `description`, `imageUrl`, and `ctaLabel` are also accepted by the adapter. `SHUTTER_IMAGE_HOSTNAMES` is a comma-separated list of HTTPS hostnames used by Shutter-hosted images, for example `assets.shutter.m77.dev,cdn.example.com`.

You can audit the active mapping at [http://localhost:3000/api/shutter-audit](http://localhost:3000/api/shutter-audit). It returns the configured endpoint status, every mapped visible field, fallback content, and the resolved content currently powering the homepage.

For a quick end-to-end CMS test, the endpoint can return a small partial payload like:

```json
{
  "brand": {
    "mark": "M77"
  },
  "menu": {
    "sections": {
      "hero": {
        "menuLabel": "La Franciacorta CMS",
        "referenceId": "la-franciacorta"
      }
    }
  },
  "navigation": [
    { "label": "Tenuta CMS", "href": "#tenuta" },
    { "label": "Spumanti CMS", "href": "#spumanti" },
    { "label": "Cantina CMS", "href": "#cantina" },
    { "label": "Contatti CMS", "href": "#contatti" }
  ],
  "hero": {
    "eyebrow": "Tenuta CMS",
    "secondaryEyebrow": "Franciacorta CMS",
    "scrollLabel": "Scorri CMS",
    "headline": "Titolo hero da Shutter",
    "subtitle": "Sottotitolo da Shutter",
    "body": "Body copy aggiornata dal contenuto Shutter."
  },
  "introduction": {
    "headline": "La Tenuta da Shutter"
  },
  "product": {
    "headline": "Spumante da Shutter"
  },
  "archive": {
    "sealLabel": "Sigillo da Shutter"
  },
  "vineyard": {
    "eyebrow": "Vigna da Shutter"
  },
  "cellar": {
    "cta": "CTA cantina da Shutter"
  },
  "memory": {
    "items": [
      {
        "number": "01",
        "headline": "Memoria da Shutter",
        "body": "Primo elemento memoria aggiornato dal CMS."
      }
    ]
  },
  "contact": {
    "eyebrow": "Footer da Shutter",
    "title": "Tenuta Montenisa CMS",
    "email": "cms@example.com",
    "location": "Luogo da Shutter",
    "legal": "Legal da Shutter"
  }
}
```

## Checks

```bash
npm run lint
npm run build
```
