import { renderToString } from 'react-dom/server';
import { StaticPortfolio } from './static-portfolio';

/** Used by scripts/prerender.mjs to bake the static page into dist/index.html. */
export function renderStatic(): string {
  return renderToString(<StaticPortfolio />);
}
