import EmberCanvas from '../animations/EmberCanvas';
import Reveal from '../components/Reveal';
import { WhatsAppIcon } from '../components/Icons';
import { whatsappLink } from '../data/site';

export default function CtaFinal() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta__bg" aria-hidden="true">
        <EmberCanvas density={1.1} />
        <span className="cta__ring" />
        <span className="cta__ring cta__ring--2" />
      </div>
      <div className="container cta__inner">
        <Reveal variant="scale">
          <span className="cta__script">Seu projeto em</span>
          <h2 id="cta-title" className="cta__title">
            boas <span className="text-fire">mãos!</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="cta__text">Tem uma ideia em ferro ou aço? Fale conosco e solicite seu orçamento.</p>
        </Reveal>
        <Reveal delay={220}>
          <a className="btn btn--primary btn--xl btn--shine" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={24} /> Solicitar orçamento pelo WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
