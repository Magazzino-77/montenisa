# Tenuta Montenisa

One-page homepage foundation for Tenuta Montenisa, built from the Figma prototype direction with Next.js, Tailwind CSS, and GSAP. The current pass sets up the section sequence and content architecture; detailed scroll behavior and animation choreography can be layered onto each section next.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- GSAP

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Page content lives in [src/lib/landing-content.ts](src/lib/landing-content.ts). It is shaped around the current one-page chapters:

- Brand/menu/header assets and labels
- Hero
- La tenuta
- Il Corallo Rosa
- Curtes Francae
- La vigna
- La stanza nascosta
- Memoria viva
- Footer/contact

## Checks

```bash
npm run lint
npm run build
```
