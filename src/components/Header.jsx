import { useEffect, useState } from 'react';
import Logo from './Logo';
import { WhatsAppIcon } from './Icons';
import { navLinks, whatsappLink } from '../data/site';
import { useScrollSpy } from '../hooks';

const ids = navLinks.map((l) => l.id);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // trava o scroll da página com o menu aberto e fecha com ESC
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const onResize = () => window.innerWidth > 1024 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${open ? 'header--open' : ''}`}>
      <div className="container header__inner">
        <Logo />

        <nav className="nav" aria-label="Menu principal">
          <ul className="nav__list" id="menu-principal">
            {navLinks.map((link, i) => (
              <li key={link.id} style={{ '--i': i }}>
                <a
                  href={`#${link.id}`}
                  className={`nav__link ${active === link.id ? 'is-active' : ''}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav__cta-mobile" style={{ '--i': navLinks.length }}>
              <a className="btn btn--primary btn--block" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> Solicitar orçamento
              </a>
            </li>
          </ul>
        </nav>

        <a className="btn btn--primary header__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} />
          <span>Solicitar orçamento</span>
        </a>

        <button
          type="button"
          className="burger"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="header__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
    </header>
  );
}
