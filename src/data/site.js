import { images } from '../assets/images';

/* =========================================================
   CONFIGURAÇÕES GERAIS — edite aqui os dados da empresa
   ========================================================= */

// Número do WhatsApp com DDI + DDD (somente números)
export const WHATSAPP_NUMBER = '5599999999999';

export const WHATSAPP_MESSAGE =
  'Olá! Gostaria de solicitar um orçamento para um projeto de serralheria.';

export const whatsappLink = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const company = {
  name: 'Serralheria',
  tagline: 'Soluções em Ferro e Aço',
  phone: '(99) 99999-9999',
  phoneHref: 'tel:+5599999999999',
  email: 'contato@serralheria.com.br',
  address: 'Rua do Aço, 123 — Centro, Sua Cidade/UF',
  hours: 'Seg a Sex 7h–18h · Sáb 7h–12h',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  year: 2026,
};

/* Ponto exato da solda em cada foto (em % da largura/altura da imagem).
   Usado para posicionar o arco elétrico e o nascimento das faíscas. */
export const weldPoint = {
  hero: { x: 50.4, y: 82 },
  oficina: { x: 49.6, y: 82 },
  sobre: { x: 52.6, y: 82 },
};

export const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'contato', label: 'Contato' },
];

export const diferenciais = [
  { icon: 'wrench', title: 'Trabalho personalizado', text: 'Do seu jeito, conforme seu projeto.' },
  { icon: 'shield', title: 'Materiais de qualidade', text: 'Mais durabilidade e segurança.' },
  { icon: 'helmet', title: 'Equipe especializada', text: 'Experiência e compromisso.' },
  { icon: 'clock', title: 'Entrega no prazo', text: 'Seu projeto sem atrasos.' },
];

export const services = [
  { icon: 'gate', title: 'Portões', text: 'Portões residenciais e comerciais.', image: images.portao },
  { icon: 'window', title: 'Janelas', text: 'Modelos personalizados e resistentes.', image: images.janela },
  { icon: 'grille', title: 'Grades', text: 'Proteção e segurança para sua propriedade.', image: images.grade },
  { icon: 'beam', title: 'Estruturas metálicas', text: 'Estruturas, coberturas e projetos especiais.', image: images.estrutura },
  { icon: 'stairs', title: 'Escadas', text: 'Escadas metálicas modernas e resistentes.', image: images.escada },
  { icon: 'handrail', title: 'Corrimãos', text: 'Corrimãos e guarda-corpos personalizados.', image: images.grade, position: 'center 70%' },
  { icon: 'roof', title: 'Coberturas', text: 'Coberturas metálicas para residências e empresas.', image: images.cobertura },
  { icon: 'custom', title: 'Projetos personalizados', text: 'Projetos desenvolvidos conforme a necessidade do cliente.', image: images.soldadorOficina, position: 'center 40%' },
];

export const steps = [
  { n: '01', title: 'Orçamento', text: 'Cliente entra em contato e apresenta sua necessidade.' },
  { n: '02', title: 'Projeto', text: 'Analisamos medidas, materiais e detalhes.' },
  { n: '03', title: 'Fabricação', text: 'Produzimos o projeto com precisão e qualidade.' },
  { n: '04', title: 'Instalação', text: 'Realizamos a instalação e entregamos o projeto finalizado.' },
];

export const projectCategories = ['Todos', 'Portões', 'Janelas', 'Grades', 'Estruturas', 'Escadas', 'Coberturas'];

export const projects = [
  { id: 1, title: 'Portão basculante em lâminas', category: 'Portões', image: images.portao,
    text: 'Portão residencial em aço galvanizado com lâminas horizontais, pintura eletrostática preta fosca e automatização.' },
  { id: 2, title: 'Janela de correr com vidro', category: 'Janelas', image: images.janela,
    text: 'Janela metálica sob medida com perfis reforçados, vedação completa e acabamento em preto.' },
  { id: 3, title: 'Guarda-corpo em aço inox', category: 'Grades', image: images.grade,
    text: 'Grade de proteção e guarda-corpo em tubos de inox escovado para área externa.' },
  { id: 4, title: 'Estrutura metálica para galpão', category: 'Estruturas', image: images.estrutura,
    text: 'Estrutura em perfis I e treliças com cobertura translúcida, dimensionada para grandes vãos.' },
  { id: 5, title: 'Escada reta com corrimão', category: 'Escadas', image: images.escada,
    text: 'Escada metálica com degraus em chapa xadrez e corrimão tubular, pintura anticorrosiva.' },
  { id: 6, title: 'Cobertura para área gourmet', category: 'Coberturas', image: images.cobertura,
    text: 'Cobertura metálica com policarbonato, calhas embutidas e estrutura aparente em preto.' },
  { id: 7, title: 'Portão de correr comercial', category: 'Portões', image: images.portao, position: 'left center',
    text: 'Portão deslizante para fachada comercial, trilho reforçado e fechadura de segurança.' },
  { id: 8, title: 'Mezanino estrutural', category: 'Estruturas', image: images.estrutura, position: 'center 30%',
    text: 'Mezanino em estrutura metálica para ampliar a área útil de uma loja, com piso em chapa.' },
  { id: 9, title: 'Janela basculante industrial', category: 'Janelas', image: images.janela, position: 'center 70%',
    text: 'Janelas basculantes em ferro para ventilação de galpão, com acionamento manual.' },
];

export const stats = [
  { value: 100, prefix: '+', suffix: '', label: 'Projetos' },
  { value: 8, prefix: '+', suffix: '', label: 'Anos de experiência' },
  { value: 90, prefix: '+', suffix: '', label: 'Clientes' },
  { value: 100, prefix: '', suffix: '%', label: 'Compromisso' },
];

// Depoimentos de exemplo — substitua por depoimentos reais dos clientes
export const testimonials = [
  { name: 'Ricardo Almeida', service: 'Portão automático', rating: 5,
    text: 'Serviço impecável do orçamento à instalação. O portão ficou exatamente como no projeto e foi entregue antes do prazo.' },
  { name: 'Fernanda Costa', service: 'Grades e guarda-corpo', rating: 5,
    text: 'Equipe muito educada e caprichosa. O acabamento das grades ficou lindo e me sinto muito mais segura em casa.' },
  { name: 'Marcos Pereira', service: 'Estrutura metálica', rating: 5,
    text: 'Fizeram a estrutura do nosso galpão com muita precisão. Cumpriram cada etapa combinada. Recomendo de olhos fechados.' },
  { name: 'Juliana Rocha', service: 'Escada metálica', rating: 5,
    text: 'A escada virou o destaque da casa. Projeto pensado nos detalhes e instalação rápida, sem sujeira.' },
  { name: 'Paulo Henrique', service: 'Cobertura metálica', rating: 5,
    text: 'Cobertura da área gourmet ficou excelente, sem nenhuma goteira. Preço justo e atendimento nota 10.' },
];

export const serviceOptions = [
  'Portão', 'Janela', 'Grade', 'Escada', 'Estrutura metálica', 'Cobertura', 'Corrimão', 'Outro',
];
