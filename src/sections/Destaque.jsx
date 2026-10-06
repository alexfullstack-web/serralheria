import { useRef } from 'react';
import EmberCanvas from '../animations/EmberCanvas';
import Reveal from '../components/Reveal';
import { images } from '../assets/images';
import { useScrollProgress } from '../hooks';

export default function Destaque() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 1, end: 0 });

  return (
    <section className="spotlight" ref={ref} style={{ '--p': p }} aria-labelledby="destaque-title">
      <div className="spotlight__bg" aria-hidden="true">
        <img src={images.oficinaAcao} alt="" loading="lazy" decoding="async" className="spotlight__photo" />
        <div className="spotlight__glow" />
        <div className="spotlight__smoke" />
        <div className="spotlight__smoke spotlight__smoke--2" />
        <EmberCanvas density={1.4} />
      </div>
      <div className="container spotlight__content">
        <Reveal variant="scale">
          <h2 id="destaque-title" className="spotlight__title">
            Metal que vira <span className="text-fire">realidade.</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="spotlight__text">Do primeiro projeto até a instalação final, cuidamos de cada detalhe.</p>
        </Reveal>
      </div>
    </section>
  );
}
