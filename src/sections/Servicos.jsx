import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { Icon } from '../components/Icons';
import { services, whatsappLink } from '../data/site';

export default function Servicos() {
  return (
    <section id="servicos" className="section services" aria-labelledby="servicos-title">
      <div className="container">
        <div className="services__head">
          <SectionHeading
            id="servicos-title"
            eyebrow="Nossos serviços"
            title="O que nós"
            highlight="fazemos"
            text="Trabalhamos com diversos serviços em ferro e aço, sempre buscando qualidade, resistência e acabamento profissional."
          />
          <Reveal delay={150}>
            <a href="#contato" className="btn btn--outline">
              Solicitar um serviço <ArrowRight size={18} />
            </a>
          </Reveal>
        </div>

        <div className="services__grid">
          {services.map((s, i) => (
            <Reveal key={s.title} as="article" className="service-card" delay={(i % 4) * 90}>
              <div className="service-card__media">
                <img
                  src={s.image}
                  alt={`${s.title} em ferro e aço fabricados pela serralheria`}
                  loading="lazy"
                  decoding="async"
                  width="564"
                  height="408"
                  style={{ objectPosition: s.position }}
                />
              </div>
              <div className="service-card__body">
                <span className="service-card__icon">
                  <Icon name={s.icon} size={26} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a
                  className="service-card__link"
                  href={whatsappLink(`Olá! Gostaria de um orçamento para: ${s.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Pedir orçamento de ${s.title}`}
                >
                  Orçamento <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
