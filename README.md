# Voltride — loja demonstrativa de scooters elétricas (Angular + GSAP)

Peça de portfólio. Marca fictícia; fotos e vídeo gerados com IA (Higgsfield).

    npm install
    npm start        # http://localhost:4200
    npm run build

## Como está organizado
- **Hero "um dia de bairro":** `src/app/components/hero.ts`. GSAP + ScrollTrigger prendem a seção e o
  scroll vira o relógio do dia: sequência de frames num canvas (`src/app/lib/frame-scrub.ts`),
  placas de parada, mini-mapa, hodômetro e bateria. Roteiro em `src/app/data/day.ts`.
- **Linhas de modelos:** `src/app/pages/home.ts` (diagrama de linha de ônibus que se desenha no scroll).
- **Catálogo:** `src/app/data/products.ts` · fotos em `public/media/catalog/`.
- **Rotas:** `/`, `/loja`, `/produto/:id`.
- **Direção de arte e roteiro:** `docs/creative-brief.md` (contrato de direção), `docs/storyboard.md`.
- **Origem dos assets e custos:** `docs/asset-manifest.json`.

## Regenerar os frames do hero
O vídeo-fonte fica em `assets-src/hero/source-day.mp4` (fora do git; baixe pelo job no manifesto).

    ffmpeg -i assets-src/hero/source-day.mp4 -an -vf "fps=8,scale=1440:-2" -c:v libwebp -quality 50 public/media/hero/seq/d_%04d.webp
    ffmpeg -i assets-src/hero/source-day.mp4 -an -vf "fps=6,scale=720:-2"  -c:v libwebp -quality 62 public/media/hero/seq/m_%04d.webp

Se mudar a quantidade de frames, atualize `FRAME_SETS` em `src/app/data/day.ts`.
