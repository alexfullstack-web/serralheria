import { WhatsAppIcon } from './Icons';
import { whatsappLink } from '../data/site';

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp e solicitar orçamento"
    >
      <span className="wa-float__ring" aria-hidden="true" />
      <span className="wa-float__ring wa-float__ring--2" aria-hidden="true" />
      <WhatsAppIcon size={30} />
      <span className="wa-float__tip">Orçamento rápido</span>
    </a>
  );
}
