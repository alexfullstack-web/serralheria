import { useState } from 'react';
import { CircleAlert, CircleCheck, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { WhatsAppIcon } from '../components/Icons';
import { company, serviceOptions, whatsappLink } from '../data/site';

const empty = { nome: '', telefone: '', email: '', servico: '', mensagem: '' };

// (99) 99999-9999
function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validate(v) {
  const e = {};
  if (v.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
  if (v.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe um telefone válido com DDD.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Informe um e-mail válido.';
  if (!v.servico) e.servico = 'Selecione o tipo de serviço.';
  if (v.mensagem.trim().length < 10) e.mensagem = 'Descreva seu projeto (mínimo 10 caracteres).';
  return e;
}

function Field({ id, label, error, touched, value, children }) {
  const state = touched ? (error ? 'is-invalid' : value ? 'is-valid' : '') : '';
  return (
    <div className={`field ${state}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field__control">
        {children}
        {state === 'is-invalid' && <CircleAlert className="field__icon" size={18} aria-hidden="true" />}
        {state === 'is-valid' && <CircleCheck className="field__icon" size={18} aria-hidden="true" />}
      </div>
      <span className="field__error" id={`${id}-erro`} role={state === 'is-invalid' ? 'alert' : undefined}>
        {state === 'is-invalid' ? error : ''}
      </span>
    </div>
  );
}

export default function Contato() {
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success
  const errors = validate(values);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: name === 'telefone' ? maskPhone(value) : value }));
    if (status === 'success') setStatus('idle');
  };
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ nome: true, telefone: true, email: true, servico: true, mensagem: true });
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    // Sem backend por enquanto: simula o envio
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setValues(empty);
      setTouched({});
    }, 1400);
  };

  const common = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': touched[name] && !!errors[name],
    'aria-describedby': `f-${name}-erro`,
  });

  return (
    <section id="contato" className="section contact" aria-labelledby="contato-title">
      <div className="container contact__grid">
        <div className="contact__info">
          <SectionHeading
            id="contato-title"
            eyebrow="Contato"
            title="Solicite seu"
            highlight="orçamento"
            text="Preencha o formulário com os detalhes do seu projeto. Respondemos rapidamente com uma proposta sob medida."
          />
          <Reveal as="ul" className="contact__list" delay={120}>
            <li>
              <span className="contact__ico"><WhatsAppIcon size={20} /></span>
              <div>
                <small>WhatsApp</small>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">{company.phone}</a>
              </div>
            </li>
            <li>
              <span className="contact__ico"><Phone size={20} /></span>
              <div>
                <small>Telefone</small>
                <a href={company.phoneHref}>{company.phone}</a>
              </div>
            </li>
            <li>
              <span className="contact__ico"><Mail size={20} /></span>
              <div>
                <small>E-mail</small>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </li>
            <li>
              <span className="contact__ico"><MapPin size={20} /></span>
              <div>
                <small>Endereço</small>
                <span>{company.address}</span>
              </div>
            </li>
          </Reveal>
        </div>

        <Reveal variant="right" className="contact__formwrap">
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form__row">
              <Field id="f-nome" label="Nome" error={errors.nome} touched={touched.nome} value={values.nome}>
                <input type="text" autoComplete="name" placeholder="Seu nome" {...common('nome')} />
              </Field>
              <Field id="f-telefone" label="Telefone" error={errors.telefone} touched={touched.telefone} value={values.telefone}>
                <input type="tel" inputMode="tel" autoComplete="tel" placeholder="(99) 99999-9999" {...common('telefone')} />
              </Field>
            </div>
            <div className="form__row">
              <Field id="f-email" label="E-mail" error={errors.email} touched={touched.email} value={values.email}>
                <input type="email" autoComplete="email" placeholder="voce@email.com" {...common('email')} />
              </Field>
              <Field id="f-servico" label="Tipo de serviço" error={errors.servico} touched={touched.servico} value={values.servico}>
                <select {...common('servico')}>
                  <option value="" disabled>Selecione…</option>
                  {serviceOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="f-mensagem" label="Mensagem" error={errors.mensagem} touched={touched.mensagem} value={values.mensagem}>
              <textarea rows={5} placeholder="Conte sobre seu projeto: medidas, local, modelo desejado…" {...common('mensagem')} />
            </Field>

            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <Loader2 size={20} className="spin" /> Enviando…
                </>
              ) : (
                <>
                  <Send size={19} /> Enviar solicitação
                </>
              )}
            </button>

            <div className={`form__success ${status === 'success' ? 'is-visible' : ''}`} role="status" aria-live="polite">
              {status === 'success' && (
                <>
                  <CircleCheck size={22} />
                  <span>Solicitação enviada com sucesso! Entraremos em contato em breve.</span>
                </>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
