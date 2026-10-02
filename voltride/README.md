# Voltride — loja demonstrativa de motos elétricas (Angular)

    npm install
    npm start        # http://localhost:4200
    npm run build

- Hero: `src/app/components/hero.ts` — scroll controla o `currentTime` de `public/media/ride.mp4`
  (re-encodado com todos os frames como keyframe para scrub suave). Textos/tempos em `phrases`.
- Catálogo: `src/app/data/products.ts` · Carrinho (localStorage): `services/cart.service.ts`
- Rotas: `/`, `/loja`, `/produto/:id`, `/checkout`, `/pedido`
