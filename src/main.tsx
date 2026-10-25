import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app';
import { detectTier } from './lib/device-tier';
import { StaticPortfolio } from './static/static-portfolio';
import { useSceneStore } from './store/scene-store';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

const tier = detectTier();
useSceneStore.setState({ tier });
document.documentElement.dataset.tier = tier;

if (tier === 'low' && root.hasChildNodes()) {
  hydrateRoot(
    root,
    <StrictMode>
      <StaticPortfolio />
    </StrictMode>,
  );
} else {
  root.replaceChildren();
  createRoot(root).render(
    <StrictMode>
      <App tier={tier} />
    </StrictMode>,
  );
}
