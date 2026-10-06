import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Hero from './sections/Hero';
import Diferenciais from './sections/Diferenciais';
import Servicos from './sections/Servicos';
import ComoTrabalhamos from './sections/ComoTrabalhamos';
import OficinaEmAcao from './sections/OficinaEmAcao';
import Portfolio from './sections/Portfolio';
import Sobre from './sections/Sobre';
import Destaque from './sections/Destaque';
import Depoimentos from './sections/Depoimentos';
import CtaFinal from './sections/CtaFinal';
import Contato from './sections/Contato';

export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Diferenciais />
        <Servicos />
        <ComoTrabalhamos />
        <OficinaEmAcao />
        <Portfolio />
        <Sobre />
        <Destaque />
        <Depoimentos />
        <CtaFinal />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
