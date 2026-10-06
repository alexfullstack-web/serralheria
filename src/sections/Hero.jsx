import { ArrowRight, ChevronDown } from 'lucide-react';
import WeldingSparks from '../animations/WeldingSparks';
import EmberCanvas from '../animations/EmberCanvas';
import { WhatsAppIcon } from '../components/Icons';
import { images } from '../assets/images';
import { weldPoint, whatsappLink } from '../data/site';

export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <EmberCanvas density={0.6} />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow hero__eyebrow">Qualidade • Resistência • Segurança</span>
          <h1 id="hero-title" className="hero__title">
            <span className="text-steel">Sua ideia em</span>
            <span className="text-fire">ferro e aço</span>
          </h1>
          <p className="hero__subtitle">
            Fabricamos portões, janelas, grades, estruturas metálicas, escadas e projetos personalizados.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} /> Solicitar orçamento
            </a>
            <a className="btn btn--ghost btn--lg" href="#servicos">
              Ver nossos serviços <ArrowRight size={18} />
            </a>
          </div>

          <ul className="hero__badges" aria-label="Destaques">
            <li><strong>+100</strong> projetos entregues</li>
            <li><strong>+8</strong> anos de oficina</li>
            <li><strong>100%</strong> sob medida</li>
          </ul>
        </div>

        {/* Imagem + camada de soldagem animada */}
        <div className="hero__visual">
          <div className="weld-frame weld-frame--hero">
            <img
              src={images.soldadorHero}
              alt="Soldador com máscara e luvas de proteção soldando uma peça de aço, com faíscas saindo do ponto de solda"
              width="1180"
              height="956"
              fetchpriority="high"
              decoding="async"
              className="weld-frame__img"
            />
            <div className="weld-frame__light" aria-hidden="true" style={{ '--wx': `${weldPoint.hero.x}%`, '--wy': `${weldPoint.hero.y}%` }} />
            <WeldingSparks origin={weldPoint.hero} startDelay={0.9} />
          </div>
          <p className="hero__signature" aria-hidden="true">
            Metal que <span>vira realidade</span>
          </p>
        </div>
      </div>

      <a href="#diferenciais" className="hero__scroll" aria-label="Rolar para os diferenciais">
        <ChevronDown size={22} />
      </a>
    </section>
  );
}
