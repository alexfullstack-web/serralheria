import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/** Modal da galeria: imagem grande, título, categoria, descrição e navegação. */
export default function ImageModal({ item, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    const prevFocus = document.activeElement;
    document.body.classList.add('no-scroll');
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [item, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()} key={item.id}>
        <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="Fechar">
          <X size={22} />
        </button>

        <figure className="modal__media">
          <img src={item.image} alt={item.title} style={{ objectPosition: item.position }} />
          <button type="button" className="modal__nav modal__nav--prev" onClick={onPrev} aria-label="Projeto anterior">
            <ChevronLeft size={26} />
          </button>
          <button type="button" className="modal__nav modal__nav--next" onClick={onNext} aria-label="Próximo projeto">
            <ChevronRight size={26} />
          </button>
        </figure>

        <div className="modal__info">
          <span className="tag">{item.category}</span>
          <h3 id="modal-title">{item.title}</h3>
          <p>{item.text}</p>
        </div>
      </div>
    </div>
  );
}
