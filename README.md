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
```

The endpoint can return any subset of the `LandingContent` shape and the app will merge it with the fallback content.

## Checks

```bash
npm run lint
npm run build
```
