import { useEffect, useRef } from 'react';
import SparkEngine from './SparkEngine';
import { useMediaQuery, useReducedMotion } from '../hooks';

/**
 * Camada de soldagem para colocar SOBRE uma imagem (o pai deve ser
 * position: relative). Desenha arco, clarão, faíscas, brasas e fumaça,
 * e expõe o brilho do arco na variável CSS --arc do elemento pai,
 * usada para iluminar a foto e criar o reflexo laranja no metal.
 *
 * Props:
 *  - origin: { x, y } em % — ponto exato da solda na imagem
 *  - boost: true aumenta brilho e quantidade de faíscas (hover)
 *  - sequence: ciclo realista solda/pausa com clarão
 */
export default function WeldingSparks({
  origin,
  boost = false,
  sequence = true,
  smoke = true,
  floor = 0.06,
  arcSize = 1,
  startDelay = 0.6,
  className = '',
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const engine = new SparkEngine(canvas, {
      origin,
      sequence,
      smoke: smoke && !isMobile,
      floor,
      arcSize,
      startDelay,
      density: isMobile ? 0.55 : 1,
      onArc: (lvl) => host && host.style.setProperty('--arc', lvl.toFixed(2)),
    });
    engineRef.current = engine;

    if (reduced) {
      engine.renderStatic();
      host?.style.setProperty('--arc', '0.8');
      return () => engine.destroy();
    }

    // só anima quando está visível (economia de CPU/bateria)
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? engine.start() : engine.stop()),
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvas);

    return () => {
      io.disconnect();
      ro.disconnect();
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, reduced, sequence]);

  useEffect(() => {
    engineRef.current?.setIntensity(boost ? 1.75 : 1);
  }, [boost]);

  useEffect(() => {
    engineRef.current?.setOrigin(origin.x, origin.y);
  }, [origin.x, origin.y]);

  return <canvas ref={canvasRef} className={`weld-canvas ${className}`} aria-hidden="true" />;
}
