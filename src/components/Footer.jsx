import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Logo from './Logo';
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './Icons';
import { company, whatsappLink } from '../data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>
            Fabricação e instalação de portões, janelas, grades, escadas e estruturas metálicas com
            precisão, segurança e acabamento profissional.
          </p>
          <p className="footer__hours">
            <Clock size={16} /> {company.hours}
          </p>
        </div>

        <nav className="footer__col" aria-label="Empresa">
          <h3>Empresa</h3>
          <ul>
            <li><a href="#sobre">Sobre nós</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Serviços">
          <h3>Serviços</h3>
          <ul>
            {['Portões', 'Janelas', 'Grades', 'Estruturas', 'Escadas'].map((s) => (
              <li key={s}><a href="#servicos">{s}</a></li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3>Contato</h3>
          <ul className="footer__contact">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={17} /> WhatsApp
              </a>
            </li>
            <li><a href={company.phoneHref}><Phone size={16} /> {company.phone}</a></li>
            <li><a href={`mailto:${company.email}`}><Mail size={16} /> {company.email}</a></li>
            <li><span><MapPin size={16} /> {company.address}</span></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3>Redes sociais</h3>
          <div className="socials">
            <a href={company.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={company.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {company.year} — {company.name}. Todos os direitos reservados.</p>
          <a href="#inicio" className="footer__top">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  );
}
