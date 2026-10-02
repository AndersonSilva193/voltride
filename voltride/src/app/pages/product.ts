import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductCard } from '../components/product-card';
import { PRODUCTS } from '../data/products';
import { STORE_NAME, contactLink } from '../data/contact';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink, ProductCard],
  template: `
    @if (product(); as p) {
      <section class="container pdp">
        <nav class="crumbs"><a routerLink="/">Início</a> / <a routerLink="/loja">Loja</a> / <span>{{ p.name }}</span></nav>

        <div class="layout">
          <div class="gallery">
            <div class="main card">
              <img [src]="p.images[img()]" [alt]="p.name" [style.filter]="color().filter" [style.object-position]="img() === 0 ? p.focus : '50% 60%'" />
              @if (p.badge) { <span class="badge">{{ p.badge }}</span> }
            </div>
            <div class="thumbs">
              @for (src of p.images; track $index) {
                <button [class.on]="img() === $index" (click)="img.set($index)" [attr.aria-label]="'Foto ' + ($index + 1)">
                  <img [src]="src" alt="" [style.filter]="color().filter" />
                </button>
              }
            </div>
          </div>

          <div class="info">
            <p class="eyebrow">{{ p.category }}</p>
            <h1>{{ p.name }}</h1>
            <p class="tag">{{ p.tagline }}</p>
            <p class="rate">★ {{ p.rating.toFixed(1) }} <small>· {{ p.reviews }} avaliações</small></p>

            <div class="price">
              @if (p.oldPrice) { <s>{{ p.oldPrice | currency: 'BRL' }}</s> }
              <strong>{{ p.price | currency: 'BRL' }}</strong>
            
            </div>

            <p class="desc">{{ p.description }}</p>

            <div class="opt">
              <span class="label">Cor do neon: <b>{{ color().name }}</b></span>
              <div class="swatches">
                @for (c of p.colors; track c.name; let i = $index) {
                  <button [class.on]="colorIdx() === i" [style.--c]="c.hex" (click)="colorIdx.set(i)" [attr.aria-label]="c.name" [title]="c.name"></button>
                }
              </div>
            </div>

            <div class="buy">
              <a class="btn btn-primary grow" [href]="contact()" target="_blank" rel="noopener">Fale conosco</a>
            </div>

            <ul class="perks">
              <li>🚚 Frete grátis para todo o Brasil</li>
              <li>🛡️ Garantia de 3 anos</li>
              <li>🔋 Bateria e carregador inclusos</li>
            </ul>
          </div>
        </div>

        <div class="specs card">
          <h2>Especificações</h2>
          <dl>
            <div><dt>Autonomia</dt><dd>{{ p.specs.range }} km</dd></div>
            <div><dt>Velocidade máxima</dt><dd>{{ p.specs.topSpeed }} km/h</dd></div>
            <div><dt>Potência</dt><dd>{{ p.specs.power }} W</dd></div>
            <div><dt>Bateria</dt><dd>{{ p.specs.battery }}</dd></div>
            <div><dt>Tempo de recarga</dt><dd>{{ p.specs.charge }}</dd></div>
            <div><dt>Peso</dt><dd>{{ p.specs.weight }} kg</dd></div>
            <div><dt>Carga máxima</dt><dd>{{ p.specs.load }} kg</dd></div>
          </dl>
        </div>

        <h2 class="rel-title">Você também pode gostar</h2>
        <div class="related">
          @for (r of related(); track r.id) { <app-product-card [product]="r" /> }
        </div>
      </section>
    } @else {
      <section class="container nf">
        <h1>Modelo não encontrado</h1>
        <a class="btn btn-primary" routerLink="/loja">Voltar para a loja</a>
      </section>
    }
  `,
  styles: `
    .pdp { padding: calc(var(--header-h) + 36px) 0 110px; }
    .crumbs { color: var(--muted); font-size: .85rem; margin-bottom: 28px; a:hover { color: var(--green); } span { color: var(--text); } }
    .layout { display: grid; grid-template-columns: 1.15fr 1fr; gap: 54px; align-items: start; }
    .gallery { position: sticky; top: calc(var(--header-h) + 20px); }
    .main { position: relative; overflow: hidden; aspect-ratio: 4 / 3; img { width: 100%; height: 100%; object-fit: cover; transition: filter .5s; } }
    .badge { position: absolute; top: 18px; left: 18px; padding: 6px 14px; border-radius: 99px; font-size: .75rem; font-weight: 700; background: var(--green); color: #00130d; }
    .thumbs { display: flex; gap: 12px; margin-top: 14px;
      button { width: 92px; aspect-ratio: 4 / 3; padding: 0; border-radius: 12px; overflow: hidden; border: 2px solid var(--line); background: none; opacity: .6; transition: all .25s;
        &.on, &:hover { opacity: 1; border-color: var(--green); } img { width: 100%; height: 100%; object-fit: cover; } } }
    .info { display: grid; gap: 14px; h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); } .eyebrow { text-transform: uppercase; } }
    .tag { color: var(--muted); font-size: 1.1rem; }
    .rate { color: #ffd166; small { color: var(--muted); } }
    .price { display: grid; gap: 2px; margin: 8px 0; s { color: var(--muted); } strong { font-family: var(--font-display); font-size: 2.2rem; } small { color: var(--muted); b { color: var(--green); } } }
    .desc { color: #bcd3d1; }
    .opt { display: grid; gap: 12px; margin-top: 6px; .label { color: var(--muted); b { color: var(--text); } } }
    .swatches { display: flex; gap: 12px;
      button { width: 38px; height: 38px; border-radius: 50%; background: var(--c); border: 3px solid var(--bg); box-shadow: 0 0 0 1px var(--line); transition: all .25s;
        &:hover { transform: scale(1.1); } &.on { box-shadow: 0 0 0 2px var(--c), 0 0 22px -2px var(--c); } } }
    .buy { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; .grow { flex: 1; min-width: 190px; } }
    .perks { list-style: none; padding: 18px 0 0; margin: 10px 0 0; border-top: 1px solid var(--line); display: grid; gap: 8px; color: var(--muted); }
    .specs { margin-top: 70px; padding: 36px; h2 { font-size: 1.3rem; margin-bottom: 20px; }
      dl { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 50px; }
      dl div { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--line); }
      dt { color: var(--muted); } dd { margin: 0; font-weight: 600; } }
    .rel-title { margin: 80px 0 28px; font-size: 1.6rem; }
    .related { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
    .nf { padding: 200px 0; text-align: center; display: grid; gap: 24px; justify-items: center; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .gallery { position: static; } .related { grid-template-columns: 1fr 1fr; } .specs dl { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .related { grid-template-columns: 1fr; } .specs { padding: 24px; } }
  `,
})
export class ProductPage {
  /** Vem da rota `produto/:id` (withComponentInputBinding). */
  id = input.required<string>();

  private title = inject(Title);

  protected img = signal(0);
  protected colorIdx = signal(0);

  protected product = computed(() => PRODUCTS.find((p) => p.id === this.id()));
  protected color = computed(() => this.product()?.colors[this.colorIdx()] ?? { name: '', hex: '', filter: 'none' });
  protected related = computed(() => PRODUCTS.filter((p) => p.id !== this.id()).slice(0, 3));

  constructor() {
    effect(() => {
      const p = this.product();
      this.title.setTitle(p ? `${p.name} — Voltride` : 'Não encontrado — Voltride');
      this.img.set(0); this.colorIdx.set(0);
      window.scrollTo({ top: 0 });
    });
  }

  protected contact = computed(() =>
    contactLink(`Olá, ${STORE_NAME}! Tenho interesse na ${this.product()?.name} (${this.color().name}).`),
  );
}
