import { company } from '../data/site';

/** Logo: emblema de capacete de solda com faísca + nome da empresa. */
export default function Logo({ compact = false }) {
  return (
    <a href="#inicio" className={`logo ${compact ? 'logo--compact' : ''}`} aria-label={`${company.name} — voltar ao início`}>
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="logoSteel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2f5f9" />
            <stop offset=".5" stopColor="#9aa6b6" />
            <stop offset="1" stopColor="#4c5664" />
          </linearGradient>
          <radialGradient id="logoSpark" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".3" stopColor="#ffd27a" />
            <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* capacete */}
        <path d="M14 34c0-12 8-21 19-21s17 8 17 19v8c0 3-2 5-5 5H22c-5 0-8-4-8-8z" fill="url(#logoSteel)" />
        <rect x="24" y="25" width="22" height="11" rx="2.5" fill="#0b1220" stroke="#3aa0ff" strokeWidth="1.6" />
        <rect x="26.5" y="27.5" width="17" height="6" rx="1.5" fill="#1d6fe0" opacity=".55" />
        {/* faísca */}
        <circle className="logo__spark" cx="47" cy="48" r="9" fill="url(#logoSpark)" />
        <g stroke="#ff8a1f" strokeWidth="1.6" strokeLinecap="round" className="logo__rays">
          <path d="M47 48l9 6M47 48l11-3M47 48l5 10M47 48l-2 11M47 48l8-10" />
        </g>
      </svg>
      <span className="logo__text">
        <strong>{company.name}</strong>
        {!compact && <small>{company.tagline}</small>}
      </span>
    </a>
  );
}
