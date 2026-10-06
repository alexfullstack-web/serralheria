import { useCallback, useMemo, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ImageModal from '../components/ImageModal';
import Reveal from '../components/Reveal';
import { projectCategories, projects } from '../data/site';

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos');
  const [openIndex, setOpenIndex] = useState(null);

  const list = useMemo(
    () => (filter === 'Todos' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => setOpenIndex((i) => (i - 1 + list.length) % list.length), [list.length]);
  const next = useCallback(() => setOpenIndex((i) => (i + 1) % list.length), [list.length]);

  return (
    <section id="projetos" className="section portfolio" aria-labelledby="projetos-title">
      <div className="container">
        <SectionHeading
          id="projetos-title"
          align="center"
          eyebrow="Portfólio"
          title="Projetos"
          highlight="realizados"
          text="Alguns trabalhos entregues pela nossa equipe. Clique para ver os detalhes."
        />

        <Reveal className="filters" role="tablist" aria-label="Filtrar projetos por categoria">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              className={`filters__btn ${filter === cat ? 'is-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {/* key no grid reinicia a animação de entrada a cada filtro */}
        <div className="gallery" key={filter}>
          {list.length === 0 && <p className="gallery__empty">Em breve novos projetos nesta categoria.</p>}
          {list.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`gallery__item ${i === 0 && list.length > 3 ? 'gallery__item--wide' : ''}`}
              style={{ '--i': i }}
              onClick={() => setOpenIndex(i)}
              aria-label={`Ver projeto: ${p.title}`}
            >
              <img src={p.image} alt={p.title} loading="lazy" decoding="async" style={{ objectPosition: p.position }} />
              <span className="gallery__overlay">
                <span className="tag">{p.category}</span>
                <strong>{p.title}</strong>
                <span className="gallery__zoom"><ZoomIn size={20} /></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <ImageModal item={openIndex !== null ? list[openIndex] : null} onClose={close} onPrev={prev} onNext={next} />
    </section>
  );
}
