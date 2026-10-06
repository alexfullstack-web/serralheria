import { CheckCircle2 } from 'lucide-react';
import Reveal from '../components/Reveal';
import WeldingSparks from '../animations/WeldingSparks';
import { images } from '../assets/images';
import { stats, weldPoint } from '../data/site';
import { useCountUp, useInView } from '../hooks';

const pillars = [
  'Experiência em projetos residenciais, comerciais e industriais',
  'Materiais certificados e soldas com controle de qualidade',
  'Segurança em todas as etapas, da oficina à instalação',
  'Acabamento fino, pintura anticorrosiva e eletrostática',
  'Compromisso com prazo e orçamento combinados',
  'Atendimento personalizado do início ao fim',
];

function Stat({ value, prefix, suffix, label, start, delay }) {
  const n = useCountUp(value, start, 1700 + delay);
  return (
    <div className="stat">
      <strong>
        {prefix}
        {n}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export default function Sobre() {
  const [statsRef, statsVisible] = useInView({ threshold: 0.4 });

  return (
    <section id="sobre" className="section about" aria-labelledby="sobre-title">
      <div className="container about__grid">
        <Reveal variant="left" className="about__media">
          <div className="weld-frame weld-frame--about">
            <img
              src={images.soldadorOficina}
              alt="Profissional da serralheria soldando estrutura metálica com máscara de proteção"
              width="960"
              height="956"
              loading="lazy"
              decoding="async"
              className="weld-frame__img"
            />
            <div className="weld-frame__light" aria-hidden="true" style={{ '--wx': `${weldPoint.sobre.x}%`, '--wy': `${weldPoint.sobre.y}%` }} />
            <WeldingSparks origin={weldPoint.sobre} smoke={false} startDelay={1.2} />
          </div>
          <div className="about__badge">
            <strong>+8</strong>
            <span>anos transformando aço em projetos</span>
          </div>
        </Reveal>

        <div className="about__content">
          <Reveal>
            <span className="eyebrow">Sobre nós</span>
            <h2 id="sobre-title" className="heading__title">
              Experiência que transforma <span className="text-fire">ferro em projeto</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="about__lead">
              Somos uma serralheria especializada na fabricação e instalação de produtos em ferro e aço.
              Unimos a experiência de oficina com equipamentos modernos para entregar peças resistentes,
              seguras e com acabamento de alto padrão.
            </p>
            <p>
              Cada projeto é tratado de forma única: ouvimos sua necessidade, tiramos as medidas no local,
              desenvolvemos a solução ideal e cuidamos da instalação para que o resultado final seja
              exatamente o que você imaginou.
            </p>
          </Reveal>

          <Reveal as="ul" className="about__list" delay={180}>
            {pillars.map((p) => (
              <li key={p}>
                <CheckCircle2 size={20} /> {p}
              </li>
            ))}
          </Reveal>

          <div className="stats" ref={statsRef}>
            {stats.map((s, i) => (
              <Stat key={s.label} {...s} start={statsVisible} delay={i * 120} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
