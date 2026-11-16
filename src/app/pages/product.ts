import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductCard } from '../components/product-card';
import { PRODUCTS } from '../data/products';
import { imageSources } from '../data/media';
import { contactLink, RESEARCH_PRICE } from '../data/contact';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink, ProductCard],
  template: `
    @if (product(); as p) {
      <section class="container pdp">
        <nav class="crumbs">
          <a routerLink="/">Início</a> / <a routerLink="/loja">Catálogo</a> /
          <span>{{ p.name }}</span>
        </nav>

        <div class="layout">
          <div class="gallery">
            <div class="main card">
              <img
                [src]="p.images[img()]"
                [srcset]="imageSources(p.images[img()])"
                sizes="(max-width: 900px) calc(100vw - 40px), 620px"
                width="1280"
                height="853"
                fetchpriority="high"
                [alt]="p.name"
                [style.filter]="color().filter"
                [style.object-position]="p.focus"
              />
            </div>
            @if (p.images.length > 1) {
              <div class="thumbs">
                @for (src of p.images; track $index) {
                  <button
                    [class.on]="img() === $index"
                    (click)="img.set($index)"
                    [attr.aria-label]="'Foto ' + ($index + 1)"
                  >
                    <img
                      [src]="src"
                      width="1280"
                      height="853"
                      alt=""
                      [style.filter]="color().filter"
                    />
                  </button>
                }
              </div>
            }
          </div>

          <div class="info">
            <h1>{{ p.name }}</h1>
            <p class="tag">{{ p.tagline }}</p>

            <div class="price">
              <strong>{{ p.price | currency: 'BRL' }}</strong>
              <small>{{ researchPrice }}</small>
            </div>

            <p class="desc">{{ p.description }}</p>

            <div class="opt">
              <span class="label"
                >Cor apresentada: <b>{{ color().name }}</b></span
              >
              <div class="swatches">
                @for (c of p.colors; track c.name; let i = $index) {
                  <button
                    [class.on]="colorIdx() === i"
                    [style.--c]="c.hex"
                    (click)="colorIdx.set(i)"
                    [attr.aria-label]="c.name"
                    [title]="c.name"
                  ></button>
                }
              </div>
            </div>

            <div class="buy">
              <a class="btn btn-primary grow" [href]="contact()" target="_blank" rel="noopener">
                Fale conosco
              </a>
            </div>
          </div>
        </div>

        <div class="specs card">
          <h2>Dados de referência</h2>
          <p>
            Autonomia e potência são valores de referência da pesquisa, não especificações
            verificadas com fabricante.
          </p>
          <dl>
            <div>
              <dt>Potência de referência</dt>
              <dd>{{ p.specs.power }} W</dd>
            </div>
          </dl>
        </div>

        <h2 class="rel-title">Outros modelos do catálogo</h2>
        <div class="related">
          @for (r of related(); track r.id) {
            <app-product-card [product]="r" />
          }
        </div>
      </section>
    } @else {
      <section class="container nf">
        <h1>Modelo não encontrado</h1>
        <a class="btn btn-primary" routerLink="/loja">Voltar ao catálogo</a>
      </section>
    }
  `,
  styles: `
    .pdp {
      padding: calc(var(--header-h) + 36px) 0 110px;
    }
    .crumbs {
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 28px;
      a:hover {
        color: var(--green);
      }
      span {
        color: var(--text);
      }
    }
    .layout {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 54px;
      align-items: start;
    }
    .gallery {
      position: sticky;
      top: calc(var(--header-h) + 20px);
    }
    .main {
      container-type: inline-size;
      position: relative;
      overflow: hidden;
      aspect-ratio: 3 / 2;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: filter 0.5s;
      }
    }
    .badge {
      position: absolute;
      top: 18px;
      left: 18px;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--green);
      color: #00130d;
    }
    .thumbs {
      display: flex;
      gap: 12px;
      margin-top: 14px;
      button {
        width: 92px;
        aspect-ratio: 3 / 2;
        padding: 0;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid var(--line);
        background: none;
        opacity: 0.6;
        transition: all 0.25s;
        &.on,
        &:hover {
          opacity: 1;
          border-color: var(--green);
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .info {
      display: grid;
      gap: 14px;
      h1 {
        font-size: clamp(2rem, 4.5vw, 3.2rem);
      }
      .eyebrow {
        text-transform: uppercase;
      }
    }
    .image-context {
      margin-top: 12px;
      color: var(--muted);
      font-size: 0.82rem;
    }
    .muted {
      color: var(--muted);
    }
    .tag {
      color: var(--muted);
      font-size: 1.1rem;
    }
    .rate {
      color: #ffd166;
      small {
        color: var(--muted);
      }
    }
    .price {
      display: grid;
      gap: 2px;
      margin: 8px 0;
      s {
        color: var(--muted);
      }
      strong {
        font-family: var(--font-display);
        font-size: 2.2rem;
      }
      small {
        color: var(--muted);
        b {
          color: var(--green);
        }
      }
    }
    .desc {
      color: #bcd3d1;
    }
    .opt {
      display: grid;
      gap: 12px;
      margin-top: 6px;
      .label {
        color: var(--muted);
        b {
          color: var(--text);
        }
      }
    }
    .swatches {
      display: flex;
      gap: 12px;
      button {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--c);
        border: 3px solid var(--bg);
        box-shadow: 0 0 0 1px var(--line);
        transition: all 0.25s;
        &:hover {
          transform: scale(1.1);
        }
        &.on {
          box-shadow: 0 0 0 2px var(--green);
        }
      }
    }
    .buy {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
      .grow {
        flex: 1;
        min-width: 190px;
      }
    }
    .perks {
      list-style: none;
      padding: 18px 0 0;
      margin: 10px 0 0;
      border-top: 1px solid var(--line);
      display: grid;
      gap: 8px;
      color: var(--muted);
    }
    .specs {
      margin-top: 70px;
      padding: 36px;
      h2 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }
      dl {
        margin: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0 50px;
      }
      dl div {
        display: flex;
        gap: 16px;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid var(--line);
      }
      dt {
        color: var(--muted);
      }
      dd {
        margin: 0;
        font-weight: 600;
        white-space: nowrap;
      }
    }
    .rel-title {
      margin: 80px 0 28px;
      font-size: 1.6rem;
    }
    .related {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 26px;
    }
    .nf {
      padding: 200px 0;
      text-align: center;
      display: grid;
      gap: 24px;
      justify-items: center;
    }
    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .gallery {
        position: static;
      }
      .related {
        grid-template-columns: 1fr 1fr;
      }
      .specs dl {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .related {
        grid-template-columns: 1fr;
      }
      .specs {
        padding: 24px;
      }
    }
  `,
})
export class ProductPage {
  /** Vem da rota `produto/:id` (withComponentInputBinding). */
  id = input.required<string>();

  private title = inject(Title);
  private meta = inject(Meta);

  protected img = signal(0);
  protected colorIdx = signal(0);

  protected product = computed(() => PRODUCTS.find((p) => p.id === this.id()));
  protected color = computed(
    () => this.product()?.colors[this.colorIdx()] ?? { name: '', hex: '', filter: 'none' },
  );
  protected related = computed(() => PRODUCTS.filter((p) => p.id !== this.id()).slice(0, 3));

  constructor() {
    effect(() => {
      const p = this.product();
      this.title.setTitle(
        p ? `${p.name} | Volt Ride` : 'Modelo não encontrado | Volt Ride',
      );
      this.meta.updateTag({
        name: 'description',
        content: p
          ? `Conheça ${p.name} no catálogo Volt Ride e consulte detalhes do modelo.`
          : 'Modelo não encontrado no catálogo Volt Ride.',
      });
      this.img.set(0);
      this.colorIdx.set(0);
      window.scrollTo({ top: 0 });
    });
  }

  protected contact = computed(() =>
    contactLink(`Olá, Volt Ride! Tenho interesse na ${this.product()?.name} (${this.color().name}).`),
  );
  protected readonly researchPrice = RESEARCH_PRICE;
  protected readonly imageSources = imageSources;
}
