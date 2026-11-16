import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { imageSources } from '../data/media';
import { contactLink, RESEARCH_PRICE } from '../data/contact';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="card">
      <a [routerLink]="['/produto', product().id]" class="media">
        <div class="photo">
          <img
            [src]="product().images[0]"
            [srcset]="imageSources(product().images[0])"
            sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 960px) 45vw, 380px"
            width="1280"
            height="853"
            [alt]="product().name"
            [style.object-position]="product().focus"
            loading="lazy"
          />
        </div>
        <div class="hover-specs">
          <span
            >Potência de referência: <b>{{ product().specs.power }} W</b></span
          >
          <small>Autonomia e potência: referências de pesquisa, não ficha de fabricante.</small>
        </div>
      </a>
      <div class="body">
        <div class="top">
          <h3>
            <a [routerLink]="['/produto', product().id]">{{ product().name }}</a>
          </h3>
        </div>
        <p class="tag">{{ product().tagline }}</p>
        <div class="foot">
          <div class="price">
            <strong>{{ product().price | currency: 'BRL' }}</strong>
            <small>{{ researchPrice }}</small>
          </div>
          <a
            class="add"
            [href]="contact(product())"
            target="_blank"
            rel="noopener"
            [attr.aria-label]="'Falar sobre ' + product().name + ' pelo WhatsApp'"
            [title]="'Falar sobre ' + product().name + ' pelo WhatsApp'"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  `,
  styles: `
    .photo {
      position: relative;
      container-type: inline-size;
    }

    :host {
      display: block;
    }
    article {
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      transition:
        transform 0.35s,
        border-color 0.35s,
        box-shadow 0.35s;
      &:hover {
        transform: translateY(-6px);
        border-color: rgba(25, 230, 168, 0.5);
        box-shadow: 0 18px 34px -24px rgba(0, 0, 0, 0.6);
      }
    }
    .media {
      position: relative;
      display: block;
      overflow: hidden;
      background: #000;
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        object-fit: contain;
        transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
    }
    article:hover img {
      transform: none;
    }
    .badge {
      position: absolute;
      top: 14px;
      left: 14px;
      padding: 5px 12px;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      background: var(--green);
      color: #00130d;
    }
    .hover-specs {
      display: grid;
      gap: 5px;
      padding: 14px 18px;
      font-size: 0.78rem;
      color: var(--muted);
      background: var(--bg-2);
      b {
        color: var(--text);
        font-weight: 600;
      }
      small {
        line-height: 1.5;
      }
    }
    .body {
      padding: 20px 22px 22px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      h3 {
        font-size: 1.15rem;
      }
    }
    .rate {
      color: #ffd166;
      font-size: 0.85rem;
      white-space: nowrap;
      small {
        color: var(--muted);
      }
    }
    .tag {
      color: var(--muted);
      font-size: 0.92rem;
    }
    .foot {
      margin-top: auto;
      padding-top: 14px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
    }
    .price {
      display: grid;
      line-height: 1.3;
      s {
        color: var(--muted);
        font-size: 0.85rem;
      }
      strong {
        font-family: var(--font-display);
        font-size: 1.3rem;
      }
      small {
        color: var(--muted);
        font-size: 0.78rem;
      }
    }
    .add {
      text-decoration: none;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 0;
      background: var(--grad);
      color: #00130d;
      display: grid;
      place-items: center;
      transition:
        transform 0.25s,
        box-shadow 0.25s;
      flex: none;
      &:hover {
        transform: translateY(-2px);
      }
    }
  `,
})
export class ProductCard {
  product = input.required<Product>();
  protected contact(product: Product) {
    return contactLink(`Olá, Volt Ride! Tenho interesse na ${product.name}.`);
  }
  protected readonly researchPrice = RESEARCH_PRICE;
  protected readonly imageSources = imageSources;
}
