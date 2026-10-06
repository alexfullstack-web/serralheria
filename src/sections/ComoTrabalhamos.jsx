import { useRef } from 'react';
import { MessageSquareText, PencilRuler, Factory, Truck } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { steps } from '../data/site';
import { useScrollProgress } from '../hooks';

const stepIcons = [MessageSquareText, PencilRuler, Factory, Truck];

export default function ComoTrabalhamos() {
  const trackRef = useRef(null);
  const progress = useScrollProgress(trackRef, { start: 0.85, end: 0.8 });

  return (
    <section className="section process" aria-labelledby="processo-title">
      <div className="container">
        <SectionHeading
          id="processo-title"
          align="center"
          eyebrow="Passo a passo"
          title="Como"
          highlight="trabalhamos"
          text="Um processo claro, do primeiro contato até a instalação final."
        />

        <ol className="timeline" ref={trackRef} style={{ '--progress': progress }}>
          <span className="timeline__line" aria-hidden="true">
            <span className="timeline__fill" />
            <span className="timeline__spark" />
          </span>
          {steps.map((s, i) => {
            const Ico = stepIcons[i];
            const reached = progress >= (i / (steps.length - 1)) * 0.96;
            return (
              <li key={s.n} className={`timeline__step ${reached ? 'is-active' : ''}`} style={{ '--i': i }}>
                <span className="timeline__dot">
                  <Ico size={26} strokeWidth={1.8} />
                </span>
                <div className="timeline__card">
                  <span className="timeline__n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
