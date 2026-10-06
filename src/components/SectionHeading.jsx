import Reveal from './Reveal';

/**
 * Título padrão de seção. `highlight` é a parte do título pintada em laranja.
 */
export default function SectionHeading({ eyebrow, title, highlight, text, align = 'left', id }) {
  return (
    <Reveal className={`heading heading--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="heading__title" id={id}>
        {title} {highlight && <span className="text-fire">{highlight}</span>}
      </h2>
      {text && <p className="heading__text">{text}</p>}
    </Reveal>
  );
}
