/**
 * Ambient dream background — the In Person onboarding atmosphere.
 *
 * Deep indigo base (#1a1340) with three soft, slowly drifting radial-gradient
 * blobs in the brand's pink/purple/peach (the same palette as the logo). It's
 * rendered as a SINGLE fixed layer behind all content (z-index:-1, via the
 * `.dreamy-bg` class in index.css) so there are no seams or banding, and so it
 * never paints over page content. Styles + reduced-motion live in index.css.
 */
export default function DreamBackground() {
  return <div className="dreamy-bg" aria-hidden="true" />;
}
