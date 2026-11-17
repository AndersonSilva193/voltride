import { Component, computed, effect, inject, input } from '@angular/core';
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
        <nav class="crumbs" aria-label="Você está em">
          <a routerLink="/">Início</a> <span aria-hidden="true">›</span>
          <a routerLink="/loja">Modelos</a> <span aria-hidden="true">›</span>
          <span aria-current="page">{{ p.name }}</span>
        </nav>

        <div class="layout">
          <div class="gallery">
            <img
              [src]="p.images[0]"
              [srcset]="imageSources(p.images[0])"
              sizes="(max-width: 900px) calc(100vw - 40px), 700px"
              width="1024"
              height="688"
              fetchpriority="high"
              [alt]="p.name + ', de perfil, estacionada numa rua de bairro'"
              [style.object-position]="p.focus"
            />
          </div>

          <div class="info">
            <span class="line placa mono">{{ p.specs.power === 1000 ? '1000' : '500' }}</span>
            <h1>{{ p.name }}</h1>
            <p class="tag">{{ p.tagline }}</p>
            <p class="desc">{{ p.description }}</p>

            <dl class="specs">
              <div>
                <dt>Valor de referência</dt>
                <dd class="price">{{ p.price | currency: 'BRL' : 'symbol' : '1.0-0' }}</dd>
              </div>
              <div>
                <dt>Potência de referência</dt>
                <dd class="mono">{{ p.specs.power }} W</dd>
              </div>
              <div>
                <dt>Autonomia de referência</dt>
                <dd class="mono">{{ p.specs.range }} km</dd>
              </div>
              <div>
                <dt>Cor</dt>
                <dd>
                  <i class="swatch" [style.background]="p.colors[0].hex" aria-hidden="true"></i>
                  {{ p.colors[0].name }}
                </dd>
              </div>
            </dl>
            <p class="ref">{{ researchPrice }} Autonomia e potência não são ficha de fabricante.</p>

            <a class="btn btn-placa buy" [href]="contact()" target="_blank" rel="noopener">
              Consultar disponibilidade no WhatsApp
            </a>
          </div>
        </div>

        <h2 class="rel-title">Outros modelos</h2>
        <div class="related">
          @for (r of related(); track r.id) {
            <app-product-card [product]="r" />
          }
        </div>
      </section>
    } @else {
      <section class="container nf">
        <h1>Modelo não encontrado.</h1>
        <p>O endereço pode estar errado ou o modelo saiu do catálogo.</p>
        <a class="btn btn-placa" routerLink="/loja">Ver todos os modelos</a>
      </section>
    }
  `,
  styles: `
    .pdp {
      padding: calc(var(--header-h) + 32px) 0 110px;
    }
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: var(--ink-2);
      font-size: 0.92rem;
      margin-bottom: 28px;
      a {
        font-weight: 700;
        color: var(--ink);
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .layout {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 56px;
      align-items: start;
    }
    .gallery {
      position: sticky;
      top: calc(var(--header-h) + 24px);
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        object-fit: cover;
        border-radius: var(--r);
      }
    }
    .info {
      display: grid;
      gap: 14px;
      justify-items: start;
      .line {
        padding: 9px 12px 6px;
        font-size: 1.1rem;
        line-height: 1;
      }
      h1 {
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
      }
    }
    .tag {
      font-size: 1.2rem;
      font-weight: 700;
    }
    .desc {
      color: var(--ink-2);
      max-width: 52ch;
    }
    .specs {
      width: 100%;
      margin: 8px 0 0;
      border-top: 2px solid var(--ink);
      div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 16px;
        padding: 13px 0 10px;
        border-bottom: 1px solid var(--line);
      }
      dt {
        color: var(--ink-2);
      }
      dd {
        margin: 0;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .price {
        font-size: 1.4rem;
        font-weight: 500;
      }
    }
    .swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid var(--ink);
    }
    .ref {
      font-size: 0.85rem;
      color: var(--ink-2);
    }
    .buy {
      width: 100%;
      margin-top: 6px;
    }
    .rel-title {
      margin: 96px 0 28px;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      font-weight: 900;
      padding-top: 24px;
      border-top: 2px solid var(--ink);
    }
    .related {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px 28px;
    }
    .nf {
      padding: 200px 0 160px;
      display: grid;
      gap: 20px;
      justify-items: start;
      h1 {
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
      }
    }
    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .gallery {
        position: static;
      }
      .related {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .related {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ProductPage {
  /** Vem da rota `produto/:id` (withComponentInputBinding). */
  id = input.required<string>();

  private title = inject(Title);
  private meta = inject(Meta);

  protected product = computed(() => PRODUCTS.find((p) => p.id === this.id()));
  protected related = computed(() => {
    const p = this.product();
    const same = PRODUCTS.filter((r) => r.id !== this.id() && r.specs.power === p?.specs.power);
    const rest = PRODUCTS.filter((r) => r.id !== this.id() && r.specs.power !== p?.specs.power);
    return [...same, ...rest].slice(0, 3);
  });

  constructor() {
    effect(() => {
      const p = this.product();
      this.title.setTitle(p ? `${p.name} | Volt Ride` : 'Modelo não encontrado | Volt Ride');
      this.meta.updateTag({
        name: 'description',
        content: p
          ? `Conheça ${p.name} no catálogo Volt Ride e consulte detalhes do modelo.`
          : 'Modelo não encontrado no catálogo Volt Ride.',
      });
      window.scrollTo({ top: 0 });
    });
  }

  protected contact = computed(() =>
    contactLink(`Olá, Volt Ride! Tenho interesse na ${this.product()?.name}.`),
  );
  protected readonly researchPrice = RESEARCH_PRICE;
  protected readonly imageSources = imageSources;
}
