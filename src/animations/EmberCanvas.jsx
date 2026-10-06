import { useEffect, useRef } from 'react';
import { EmberField } from './SparkEngine';
import { useMediaQuery, useReducedMotion } from '../hooks';

/** Fundo com brasas/faíscas flutuando — ocupa todo o elemento pai. */
export default function EmberCanvas({ density = 1, className = '' }) {
  const ref = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const field = new EmberField(ref.current, { density: density * (isMobile ? 0.5 : 1) });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? field.start() : field.stop()));
    io.observe(ref.current);
    const ro = new ResizeObserver(() => field.resize());
    ro.observe(ref.current);
    return () => {
      io.disconnect();
      ro.disconnect();
      field.destroy();
    };
  }, [density, isMobile, reduced]);

  return <canvas ref={ref} className={`ember-canvas ${className}`} aria-hidden="true" />;
}
