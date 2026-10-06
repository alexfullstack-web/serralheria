import { useEffect, useRef, useState } from 'react';
import SparkEngine from './SparkEngine';
import { useMediaQuery, useReducedMotion } from '../hooks';

/**
 * Cena ilustrada da soldagem, em loop de 10 s:
 *  1. A estrutura de ferro aparece (perfis montando)
 *  2. A tocha se posiciona na junta
 *  3. O ponto começa a emitir luz
 *  4. Clarão azul/branco (abertura do arco)
 *  5–8. Faíscas espalham, caem e somem enquanto o cordão de solda avança
 *  9. O brilho pulsa durante todo o cordão
 * 10. A tocha sai, o cordão esfria (laranja → aço) e o ciclo recomeça
 *
 * SVG para a estrutura/tocha + SparkEngine (canvas) para luz e faíscas.
 */
const W = 600;
const H = 360;
const SEAM_Y = 196;
const SEAM_X0 = 160;
const SEAM_X1 = 440;
const SEAM_LEN = SEAM_X1 - SEAM_X0;
const PARK = { x: 640, y: -40 };
const CYCLE = 10;

const PHASES = [
  { until: 1.6, label: 'Montagem da estrutura' },
  { until: 2.6, label: 'Posicionando a tocha' },
  { until: 3.1, label: 'Abertura do arco' },
  { until: 7.6, label: 'Soldagem' },
  { until: 9.4, label: 'Resfriamento' },
  { until: CYCLE, label: 'Peça finalizada' },
];

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;

export default function WeldingScene() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const torchRef = useRef(null);
  const beadRef = useRef(null);
  const hotRef = useRef(null);
  const heatRef = useRef(null);
  const [label, setLabel] = useState(PHASES[0].label);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const engine = new SparkEngine(canvasRef.current, {
      origin: { x: (SEAM_X0 / W) * 100, y: (SEAM_Y / H) * 100 },
      sequence: false,
      smoke: !isMobile,
      floor: 0.2,
      arcSize: 0.8,
      density: isMobile ? 0.5 : 0.85,
    });
    engine.setArc(false);
    engine.arcTarget = 0;

    const setTorch = (x, y) => torchRef.current?.setAttribute('transform', `translate(${x} ${y})`);

    if (reduced) {
      wrap.dataset.phase = '5';
      setTorch(PARK.x, PARK.y);
      beadRef.current.style.strokeDashoffset = '0';
      setLabel('Peça finalizada');
      return () => engine.destroy();
    }

    let raf = 0;
    let t0 = performance.now();
    let lastPhase = -1;
    let running = false;

    const frame = (now) => {
      const t = ((now - t0) / 1000) % CYCLE;
      const phase = PHASES.findIndex((p) => t < p.until);
      if (phase !== lastPhase) {
        lastPhase = phase;
        wrap.dataset.phase = String(phase);
        setLabel(PHASES[phase].label);
        if (phase === 0) {
          beadRef.current.style.strokeDashoffset = String(SEAM_LEN);
        }
      }

      let tx = PARK.x;
      let ty = PARK.y;
      let weldP = 0;
      let arc = false;

      if (phase === 1) {
        const k = ease(clamp01((t - 1.6) / 1));
        tx = lerp(PARK.x, SEAM_X0, k);
        ty = lerp(PARK.y, SEAM_Y, k);
      } else if (phase === 2) {
        tx = SEAM_X0;
        ty = SEAM_Y;
        // o ponto começa a brilhar fraco antes do clarão
        engine.arcTarget = 0.2 + 0.1 * Math.random();
      } else if (phase === 3) {
        weldP = clamp01((t - 3.1) / 4.5);
        // pequeno "zigue-zague" do soldador
        tx = SEAM_X0 + SEAM_LEN * weldP;
        ty = SEAM_Y + Math.sin(t * 22) * 1.6;
        arc = true;
      } else if (phase === 4) {
        weldP = 1;
        const k = ease(clamp01((t - 7.6) / 1.4));
        tx = lerp(SEAM_X1, PARK.x, k);
        ty = lerp(SEAM_Y, PARK.y, k);
      } else if (phase === 5) {
        weldP = 1;
      }

      if (arc && engine.arcTarget < 1) engine.setArc(true);
      if (!arc && engine.arcTarget >= 1) engine.setArc(false);
      if (phase !== 2 && !arc) engine.arcTarget = 0;

      setTorch(tx, ty);
      engine.setOrigin((tx / W) * 100, (Math.min(ty, SEAM_Y) / H) * 100);

      if (phase >= 3) {
        const drawn = SEAM_LEN * weldP;
        beadRef.current.style.strokeDashoffset = String(SEAM_LEN - drawn);
        // trecho incandescente logo atrás da tocha
        const hotLen = Math.min(70, drawn);
        hotRef.current.style.strokeDasharray = `0 ${drawn - hotLen} ${hotLen} ${SEAM_LEN}`;
        heatRef.current.setAttribute('cx', String(SEAM_X0 + drawn));
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      engine.start();
      t0 = performance.now();
      lastPhase = -1;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      engine.stop();
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 });
    io.observe(wrap);
    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvasRef.current);

    return () => {
      io.disconnect();
      ro.disconnect();
      stop();
      engine.destroy();
    };
  }, [isMobile, reduced]);

  return (
    <div className="weld-scene" ref={wrapRef} data-phase="0">
      <svg className="weld-scene__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ilustração animada: estrutura de aço sendo soldada">
        <defs>
          <linearGradient id="ws-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d6878" />
            <stop offset=".18" stopColor="#c9d1dc" />
            <stop offset=".4" stopColor="#6f7a8a" />
            <stop offset="1" stopColor="#2b323d" />
          </linearGradient>
          <linearGradient id="ws-steel-v" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2b323d" />
            <stop offset=".35" stopColor="#9aa5b4" />
            <stop offset=".55" stopColor="#5d6878" />
            <stop offset="1" stopColor="#222831" />
          </linearGradient>
          <linearGradient id="ws-torch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a414d" />
            <stop offset=".5" stopColor="#8e98a6" />
            <stop offset="1" stopColor="#1f242c" />
          </linearGradient>
          <linearGradient id="ws-copper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7a4a22" />
            <stop offset=".5" stopColor="#e3a066" />
            <stop offset="1" stopColor="#6b3d18" />
          </linearGradient>
          <radialGradient id="ws-heat">
            <stop offset="0" stopColor="#ffb347" stopOpacity=".9" />
            <stop offset=".5" stopColor="#ff6a00" stopOpacity=".35" />
            <stop offset="1" stopColor="#ff4d00" stopOpacity="0" />
          </radialGradient>
          <pattern id="ws-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(120,150,190,.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#ws-grid)" />
        {/* bancada */}
        <rect className="ws-bench" x="40" y="292" width="520" height="14" rx="3" fill="#1a2029" stroke="#2c3542" />
        <rect className="ws-bench" x="70" y="306" width="10" height="44" fill="#151a21" />
        <rect className="ws-bench" x="520" y="306" width="10" height="44" fill="#151a21" />

        {/* estrutura: colunas + vigas em perfil I */}
        <g className="ws-part ws-part--1">
          <rect x="120" y="120" width="26" height="172" fill="url(#ws-steel-v)" />
          <rect x="112" y="120" width="42" height="8" fill="#8f9aa9" />
          <rect x="112" y="284" width="42" height="8" fill="#4a5361" />
        </g>
        <g className="ws-part ws-part--2">
          <rect x="454" y="120" width="26" height="172" fill="url(#ws-steel-v)" />
          <rect x="446" y="120" width="42" height="8" fill="#8f9aa9" />
          <rect x="446" y="284" width="42" height="8" fill="#4a5361" />
        </g>
        <g className="ws-part ws-part--3">
          {/* viga superior */}
          <rect x="146" y="166" width="308" height="30" fill="url(#ws-steel)" />
          <rect x="146" y="163" width="308" height="5" fill="#d7dde6" opacity=".65" />
        </g>
        <g className="ws-part ws-part--4">
          {/* chapa inferior que será soldada */}
          <rect x="146" y="197" width="308" height="22" fill="url(#ws-steel)" />
          <rect x="146" y="217" width="308" height="4" fill="#20262f" />
          {/* mão francesa */}
          <path d="M146 221l60 60h-60z" fill="#3b4451" />
          <path d="M454 221l-60 60h60z" fill="#3b4451" />
        </g>

        {/* junta e cordão de solda */}
        <line x1={SEAM_X0} y1={SEAM_Y} x2={SEAM_X1} y2={SEAM_Y} stroke="#0d1117" strokeWidth="3" />
        <path
          ref={beadRef}
          className="ws-bead"
          d={`M${SEAM_X0} ${SEAM_Y}H${SEAM_X1}`}
          stroke="#9aa3ae"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ strokeDasharray: SEAM_LEN, strokeDashoffset: SEAM_LEN }}
        />
        <path
          ref={hotRef}
          className="ws-hot"
          d={`M${SEAM_X0} ${SEAM_Y}H${SEAM_X1}`}
          stroke="#ffb347"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ strokeDasharray: `0 ${SEAM_LEN}` }}
        />
        <ellipse ref={heatRef} className="ws-heat" cx={SEAM_X0} cy={SEAM_Y} rx="46" ry="22" fill="url(#ws-heat)" />

        {/* tocha MIG (ponta em 0,0) */}
        <g ref={torchRef} className="ws-torch" transform={`translate(${PARK.x} ${PARK.y})`}>
          <g transform="rotate(34)">
            <path d="M-4 -46 Q -2 -120 60 -150" stroke="#14181e" strokeWidth="12" fill="none" strokeLinecap="round" />
            <rect x="-9" y="-92" width="18" height="50" rx="7" fill="url(#ws-torch)" />
            <rect x="-11" y="-72" width="22" height="5" rx="2" fill="#ff7a1a" />
            <path d="M-8 -42 L8 -42 L5 -12 L-5 -12 Z" fill="url(#ws-copper)" />
            <rect x="-2" y="-12" width="4" height="9" fill="#cfd6df" />
          </g>
        </g>
      </svg>
      <canvas ref={canvasRef} className="weld-canvas" aria-hidden="true" />
      <div className="weld-scene__label" aria-live="polite">
        <span className="weld-scene__dot" /> {label}
      </div>
    </div>
  );
}
