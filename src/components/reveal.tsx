import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/use-reveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds. */
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'section';
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  const classes = className ? `reveal ${className}` : 'reveal';
  return (
    // The `as` union keeps this a plain HTML element, so a single ref type covers every tag.
    <Tag ref={ref as never} className={classes} style={style}>
      {children}
    </Tag>
  );
}
