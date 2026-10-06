import { useState } from 'react';
import { Flame, ShieldCheck, Gauge } from 'lucide-react';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import WeldingSparks from '../animations/WeldingSparks';
import WeldingScene from '../animations/WeldingScene';
import { images } from '../assets/images';
import { weldPoint } from '../data/site';

export default function OficinaEmAcao() {
  const [hover, setHover] = useState(false);

  return (
    <section className="section workshop" aria-labelledby="oficina-title">
      <div className="workshop__bg" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          id="oficina-title"
          eyebrow="Ao vivo da oficina"
          title="Oficina em"
          highlight="ação"
          text="Cada peça passa pelas mãos de soldadores experientes, com equipamento de proteção, controle de qualidade e acabamento caprichado."
        />

        <div className="workshop__grid">
          <Reveal variant="scale" className="workshop__photo">
            <div
              className={`weld-frame weld-frame--interactive ${hover ? 'is-hover' : ''}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={images.oficinaAcao}
                alt="Soldador profissional trabalhando com solda MIG na oficina"
                width="1180"
                height="956"
                loading="lazy"
                decoding="async"
                className="weld-frame__img"
              />
              <div className="weld-frame__light" aria-hidden="true" style={{ '--wx': `${weldPoint.oficina.x}%`, '--wy': `${weldPoint.oficina.y}%` }} />
              <div className="weld-frame__smoke" aria-hidden="true" />
              <WeldingSparks origin={weldPoint.oficina} boost={hover} startDelay={0.3} />
              <span className="weld-frame__hint">Passe o mouse para intensificar</span>
            </div>
          </Reveal>

          <div className="workshop__side">
            <Reveal variant="right">
              <WeldingScene />
            </Reveal>
            <Reveal variant="right" delay={120}>
              <ul className="workshop__specs">
                <li><Flame size={20} /> <span><strong>Solda MIG, TIG e eletrodo</strong> para cada tipo de peça</span></li>
                <li><ShieldCheck size={20} /> <span><strong>EPI completo</strong> e normas de segurança</span></li>
                <li><Gauge size={20} /> <span><strong>Precisão milimétrica</strong> do corte ao acabamento</span></li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
