# Serralheria — Site institucional

Site premium para serralheria/metalúrgica feito com **React + Vite + JavaScript** (sem TypeScript), CSS puro e `lucide-react`.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a versão de produção em /dist
npm run preview  # testa o build localmente
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Número do WhatsApp (`WHATSAPP_NUMBER`), mensagem, telefone, e-mail, endereço, redes | `src/data/site.js` |
| Serviços, etapas, projetos do portfólio, depoimentos, números | `src/data/site.js` |
| Imagens | `src/assets/images/` (imports em `src/assets/images/index.js`) |
| Ponto da solda em cada foto (onde nascem as faíscas) | `weldPoint` em `src/data/site.js` |
| Cores, fontes e tokens | `:root` em `src/index.css` |
| Title, description e Open Graph | `index.html` |

> As imagens atuais foram recortadas da arte de referência e são **placeholders**.
> Troque pelas fotos reais da empresa mantendo os mesmos nomes de arquivo.
> Se trocar as fotos do soldador, ajuste `weldPoint` (em % da largura/altura) para o arco ficar exatamente no ponto da solda.

## Estrutura

```
src/
├── animations/
│   ├── SparkEngine.js     # motor de partículas (arco, clarão, faíscas, brasas, fumaça)
│   ├── WeldingSparks.jsx  # camada de solda sobre uma foto (hover intensifica)
│   ├── WeldingScene.jsx   # cena ilustrada: estrutura → tocha → arco → cordão → resfriamento
│   └── EmberCanvas.jsx    # brasas flutuando nos fundos
├── assets/images/
├── components/            # Header, Footer, Logo, Icons, Reveal, Modal, WhatsApp flutuante…
├── data/site.js           # todo o conteúdo do site
├── hooks/                 # useInView, useCountUp, useScrollSpy, useScrollProgress…
├── sections/              # uma seção por arquivo
├── styles/                # components.css e sections.css
├── App.jsx
├── main.jsx
└── index.css              # tokens, base, botões e animações de entrada
```

## Desempenho e acessibilidade

- Animações em canvas só rodam quando a área está visível (Intersection Observer) e usam menos partículas no celular.
- Respeita `prefers-reduced-motion` (mostra o brilho estático, sem partículas).
- Imagens em WebP com `loading="lazy"`; fontes servidas pelo próprio site (`@fontsource`).
- Formulário com validação visual, máscara de telefone e envio simulado (sem backend).
