import Reveal from '../components/Reveal';
import { Icon } from '../components/Icons';
import { diferenciais } from '../data/site';

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="features" aria-label="Nossos diferenciais">
      <div className="container features__grid">
        {diferenciais.map((d, i) => (
          <Reveal key={d.title} className="feature" delay={i * 110}>
            <span className="feature__icon">
              <Icon name={d.icon} size={30} />
            </span>
            <div>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
