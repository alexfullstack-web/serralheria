/**
 * Imagens do site — todas importadas em um só lugar.
 *
 * Para trocar uma imagem, basta substituir o arquivo nesta pasta mantendo o
 * mesmo nome (ou alterar o import abaixo). Proporções recomendadas:
 *   - soldador-hero / oficina-acao ......... 1180 x 956  (≈ 5:4)
 *   - soldador-oficina ..................... 960 x 956   (≈ 1:1)
 *   - portao, janela, grade, estrutura,
 *     escada, cobertura .................... 1200 x 860  (≈ 4:3)
 *
 * IMPORTANTE: as imagens atuais foram recortadas da arte de referência e
 * servem como placeholders. Substitua por fotos reais da empresa.
 * Se trocar as fotos do soldador, ajuste o ponto da solda (weldPoint) em
 * src/data/site.js para as faíscas nascerem no lugar certo.
 */
import soldadorHero from './soldador-hero.webp';      // Imagem 1 — soldador realizando soldagem
import portao from './portao.webp';                    // Imagem 2 — portão de ferro moderno
import janela from './janela.webp';                    // Imagem 3 — janela metálica
import grade from './grade.webp';                      // Imagem 4 — grade de proteção
import escada from './escada.webp';                    // Imagem 5 — escada metálica
import estrutura from './estrutura.webp';              // Imagem 6 — estrutura metálica
import cobertura from './cobertura.webp';              // Imagem 7 — cobertura metálica
import soldadorOficina from './soldador-oficina.webp'; // Imagem 8 — soldador trabalhando em oficina
import oficinaAcao from './oficina-acao.webp';         // Oficina em Ação (variação da imagem 1)

export const images = {
  soldadorHero,
  portao,
  janela,
  grade,
  escada,
  estrutura,
  cobertura,
  soldadorOficina,
  oficinaAcao,
};
