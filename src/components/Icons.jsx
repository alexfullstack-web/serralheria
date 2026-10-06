/**
 * Ícones industriais desenhados para o projeto (traço 1.8, viewBox 24)
 * + ícones de marca (WhatsApp, Instagram, Facebook) que não existem no Lucide.
 * Ícones genéricos (relógio, escudo etc.) vêm do lucide-react.
 */
import { Wrench, ShieldCheck, HardHat, Clock, PencilRuler } from 'lucide-react';

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const GateIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 21V4M21 21V4M3 21h18" />
    <rect x="5.5" y="6" width="5.5" height="15" rx=".5" />
    <rect x="13" y="6" width="5.5" height="15" rx=".5" />
    <path d="M5.5 10.5H11M5.5 15H11M13 10.5h5.5M13 15h5.5" />
  </svg>
);

export const WindowIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
    <path d="M12 3.5v17M3.5 12h17M7 7l2 2M15 15l2 2" />
  </svg>
);

export const GrilleIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 5h18M3 19h18M6 5v14M10 5v14M14 5v14M18 5v14" />
    <path d="M6 3.2v1.8M10 3.2v1.8M14 3.2v1.8M18 3.2v1.8" />
  </svg>
);

export const BeamIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4h16M4 8h16M12 4v4" />
    <path d="M6 8v12M18 8v12M4 20h4M16 20h4" />
    <path d="M6 9l12 10M18 9L6 19" opacity=".6" />
  </svg>
);

export const StairsIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 20h4v-4h4v-4h4V8h4V4h2" />
    <path d="M5 13l12-10M7 20v-2M11 16v-2M15 12v-2" opacity=".7" />
  </svg>
);

export const HandrailIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 9c3-1 15-1 18 0" />
    <path d="M5 9v11M12 8.4V20M19 9v11M3 20h18" />
    <path d="M8.5 9v11M15.5 9v11" opacity=".55" />
  </svg>
);

export const RoofIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 10l10-6 10 6" />
    <path d="M5 8.5V20M19 8.5V20M3 20h18" />
    <path d="M5 12l7-4 7 4" opacity=".55" />
  </svg>
);

export const TorchIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 3l7 7-3 1-5-5 1-3z" />
    <path d="M15.5 8.5L8 16" />
    <path d="M6 18l-2 2M7.5 20.5l-1 1.2M3.5 16.5l-1.2 1M5 21.5l.4-1.6" />
  </svg>
);

/* ---------- Marcas ---------- */
export const WhatsAppIcon = ({ size = 22, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.6 2 2.16 6.43 2.16 11.88c0 1.74.46 3.44 1.32 4.94L2.08 22l5.32-1.4a9.85 9.85 0 0 0 4.64 1.18h.01c5.45 0 9.88-4.43 9.88-9.88a9.8 9.8 0 0 0-2.88-6.99zm-7.01 15.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.53 3.69-8.21 8.23-8.21a8.17 8.17 0 0 1 8.21 8.22c0 4.53-3.69 8.22-8.22 8.22zm4.51-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
  </svg>
);

export const InstagramIcon = ({ size = 20, ...p }) => (
  <svg {...base} width={size} height={size} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
  </svg>
);

export const FacebookIcon = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.45A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1z" />
  </svg>
);

/* Mapa nome → componente, usado pelos dados em src/data/site.js */
const map = {
  wrench: Wrench,
  shield: ShieldCheck,
  helmet: HardHat,
  clock: Clock,
  gate: GateIcon,
  window: WindowIcon,
  grille: GrilleIcon,
  beam: BeamIcon,
  stairs: StairsIcon,
  handrail: HandrailIcon,
  roof: RoofIcon,
  custom: PencilRuler,
  torch: TorchIcon,
};

export function Icon({ name, size = 24, ...rest }) {
  const Cmp = map[name] || Wrench;
  return <Cmp width={size} height={size} size={size} strokeWidth={1.8} {...rest} />;
}
