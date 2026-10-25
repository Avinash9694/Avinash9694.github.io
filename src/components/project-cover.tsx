import { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/projects';
import styles from './project-cover.module.css';

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

const MOTIFS = ['rings', 'stripes', 'dots', 'blocks', 'waves'] as const;
type Motif = (typeof MOTIFS)[number];

function motifFor(slug: string): Motif {
  return MOTIFS[hashSlug(slug) % MOTIFS.length] ?? 'rings';
}

function Motif({ kind, id }: { kind: Motif; id: string }) {
  switch (kind) {
    case 'rings':
      return (
        <g fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.25">
          {[40, 80, 120, 160, 200].map((r) => (
            <circle key={r} cx="300" cy="200" r={r} />
          ))}
          <circle cx="300" cy="200" r="10" fill="#fff" fillOpacity="0.5" stroke="none" />
        </g>
      );
    case 'stripes':
      return (
        <>
          <defs>
            <pattern
              id={`${id}-p`}
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-30)"
            >
              <line x1="0" y1="0" x2="0" y2="18" stroke="#fff" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect x="180" y="0" width="220" height="250" fill={`url(#${id}-p)`} />
          <rect x="178" y="0" width="1.5" height="250" fill="#fff" fillOpacity="0.4" />
        </>
      );
    case 'dots':
      return (
        <>
          <defs>
            <pattern id={`${id}-p`} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.6" fill="#fff" fillOpacity="0.32" />
            </pattern>
          </defs>
          <rect width="400" height="250" fill={`url(#${id}-p)`} />
          <rect
            x="230"
            y="60"
            width="120"
            height="120"
            rx="18"
            fill="#fff"
            fillOpacity="0.12"
            stroke="#fff"
            strokeOpacity="0.35"
          />
        </>
      );
    case 'blocks':
      return (
        <g fill="#fff">
          <rect x="40" y="150" width="60" height="70" rx="8" fillOpacity="0.1" />
          <rect x="110" y="80" width="60" height="140" rx="8" fillOpacity="0.18" />
          <rect x="180" y="120" width="60" height="100" rx="8" fillOpacity="0.1" />
          <rect x="250" y="40" width="60" height="180" rx="8" fillOpacity="0.26" />
          <rect x="320" y="100" width="60" height="120" rx="8" fillOpacity="0.14" />
        </g>
      );
    case 'waves':
      return (
        <g fill="none" stroke="#fff" strokeWidth="1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              strokeOpacity={0.12 + i * 0.06}
              d={`M-20 ${150 + i * 18} C 80 ${90 + i * 18}, 160 ${210 + i * 18}, 260 ${140 + i * 18} S 400 ${110 + i * 18}, 440 ${150 + i * 18}`}
            />
          ))}
        </g>
      );
  }
}

interface ProjectCoverProps {
  project: Project;
  index: number;
}

export function ProjectCover({ project, index }: ProjectCoverProps) {
  const id = `cover-${project.slug}`;
  const motif = motifFor(project.slug);
  const label = String(index + 1).padStart(2, '0');
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish before React attaches onLoad; `complete` covers that case.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className={styles.cover}>
      <svg
        className={styles.art}
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${project.title} cover art`}
      >
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={project.cover.from} />
            <stop offset="1" stopColor={project.cover.to} />
          </linearGradient>
          <radialGradient id={`${id}-v`} cx="0.5" cy="1" r="0.9">
            <stop offset="0" stopColor="#000" stopOpacity="0.35" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="250" fill={`url(#${id}-g)`} />
        <Motif kind={motif} id={id} />
        <rect width="400" height="250" fill={`url(#${id}-v)`} />
      </svg>
      {project.screenshot ? (
        <img
          ref={imgRef}
          className={`${styles.screenshot} ${loaded ? styles.loaded : ''}`}
          src={project.screenshot}
          alt={`Screenshot of ${project.title}`}
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      ) : null}
      <span className={`${styles.index} mono`} aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
