import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { testimonials } from '../data/site';
import { useMediaQuery, useReducedMotion } from '../hooks';

const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

export default function Depoimentos() {
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isTablet = useMediaQuery('(min-width: 700px)');
  const reduced = useReducedMotion();
  const perView = isDesktop ? 3 : isTablet ? 2 : 1;
  const maxIndex = Math.max(testimonials.length - perView, 0);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(null);

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);

  const go = useCallback((dir) => setIndex((i) => (i + dir > maxIndex ? 0 : i + dir < 0 ? maxIndex : i + dir)), [maxIndex]);

  // autoplay (pausa no hover/foco e com movimento reduzido)
  useEffect(() => {
    if (paused || reduced) return undefined;
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [paused, reduced, go]);

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <section className="section testimonials" aria-labelledby="depoimentos-title">
      <div className="container">
        <SectionHeading
          id="depoimentos-title"
          align="center"
          eyebrow="Depoimentos"
          title="O que nossos"
          highlight="clientes dizem"
        />

        <div
          className="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="carrossel"
        >
          <div className="carousel__viewport">
            <ul
              className="carousel__track"
              style={{ '--per': perView, transform: `translateX(-${(index * 100) / perView}%)` }}
            >
              {testimonials.map((t, i) => (
                <li
                  key={t.name}
                  className="carousel__slide"
                  aria-hidden={i < index || i >= index + perView}
                >
                  <article className="testimonial">
                    <Quote className="testimonial__quote" size={38} aria-hidden="true" />
                    <div className="testimonial__stars" aria-label={`${t.rating} de 5 estrelas`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={17} className={s < t.rating ? 'is-on' : ''} />
                      ))}
                    </div>
                    <p className="testimonial__text">“{t.text}”</p>
                    <footer className="testimonial__author">
                      <span className="avatar" aria-hidden="true">{initials(t.name)}</span>
                      <span>
                        <strong>{t.name}</strong>
                        <small>{t.service}</small>
                      </span>
                    </footer>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="carousel__controls">
            <button type="button" className="carousel__arrow" onClick={() => go(-1)} aria-label="Depoimento anterior">
              <ChevronLeft size={22} />
            </button>
            <div className="carousel__dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`carousel__dot ${i === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para o grupo ${i + 1}`}
                />
              ))}
            </div>
            <button type="button" className="carousel__arrow" onClick={() => go(1)} aria-label="Próximo depoimento">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
