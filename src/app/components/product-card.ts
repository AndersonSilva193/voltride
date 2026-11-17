import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { imageSources } from '../data/media';
import { contactLink } from '../data/contact';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article>
      <a [routerLink]="['/produto', product().id]" class="photo" tabindex="-1" aria-hidden="true">
        <img
          [src]="product().images[0]"
          [srcset]="imageSources(product().images[0])"
          sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 960px) 45vw, 400px"
          width="1024"
          height="688"
          alt=""
          [style.object-position]="product().focus"
          loading="lazy"
        />
      </a>
      <div class="body">
        <h3>
          <a [routerLink]="['/produto', product().id]">{{ product().name }}</a>
        </h3>
        <p class="tag">{{ product().tagline }}</p>
        <p class="spec mono">
          {{ product().specs.power }} W · {{ product().specs.range }} km <small>(ref.)</small>
        </p>
        <div class="foot">
          <span class="price">{{ product().price | currency: 'BRL' : 'symbol' : '1.0-0' }}</span>
          <a
            class="wa btn btn-linha"
            [href]="contact(product())"
            target="_blank"
            rel="noopener"
            [attr.aria-label]="'Falar sobre ' + product().name + ' pelo WhatsApp'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
            </svg>
            Consultar
          </a>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    article {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .photo img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      border-radius: var(--r);
      transition: translate 0.3s var(--ease);
    }
    article:hover .photo img {
      translate: 0 -6px;
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    h3 {
      font-size: 1.3rem;
      a:hover {
        text-decoration: underline;
        text-decoration-thickness: 2px;
      }
    }
    .tag {
      color: var(--ink-2);
    }
    .spec {
      font-size: 0.9rem;
      small {
        color: var(--ink-2);
      }
    }
    .foot {
      margin-top: auto;
      padding-top: 12px;
      border-top: 2px solid var(--ink);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .price {
      font-size: 1.25rem;
      font-weight: 500;
    }
    .wa {
      min-height: 42px;
      padding: 9px 14px 7px;
      font-size: 0.92rem;
    }
  `,
})
export class ProductCard {
  product = input.required<Product>();
  protected contact(product: Product) {
    return contactLink(`Olá, Volt Ride! Tenho interesse na ${product.name}.`);
  }
  protected readonly imageSources = imageSources;
}
