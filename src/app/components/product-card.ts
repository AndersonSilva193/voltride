import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { STORE_NAME, contactLink } from '../data/contact';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="card">
      <a [routerLink]="['/produto', product().id]" class="media">
        <img [src]="product().images[0]" [alt]="product().name" [style.object-position]="product().focus" loading="lazy" />
        @if (product().badge) { <span class="badge">{{ product().badge }}</span> }
        <div class="hover-specs">
          <span><b>{{ product().specs.range }}</b> km</span>
          @if (product().specs.topSpeed) { <span><b>{{ product().specs.topSpeed }}</b> km/h</span> }
          <span><b>{{ product().specs.power }}</b> W</span>
        </div>
      </a>
      <div class="body">
        <div class="top">
          <h3><a [routerLink]="['/produto', product().id]">{{ product().name }}</a></h3>
          @if (product().rating; as r) { <span class="rate">★ {{ r.toFixed(1) }} <small>({{ product().reviews }})</small></span> }
        </div>
        <p class="tag">{{ product().tagline }}</p>
        <div class="foot">
          <div class="price">
            @if (product().oldPrice) { <s>{{ product().oldPrice | currency: 'BRL' }}</s> }
            <strong>{{ product().price | currency: 'BRL' }}</strong>
          </div>
          <a class="add" [href]="contact()" target="_blank" rel="noopener" [attr.aria-label]="'Falar sobre ' + product().name">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></svg>
          </a>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    article { overflow: hidden; height: 100%; display: flex; flex-direction: column; transition: transform .35s, border-color .35s, box-shadow .35s;
      &:hover { transform: translateY(-6px); border-color: rgba(25, 230, 168, .5); box-shadow: 0 24px 60px -24px rgba(25, 230, 168, .35); } }
    .media { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #000;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2, .7, .2, 1); } }
    article:hover img { transform: scale(1.08); }
    .badge { position: absolute; top: 14px; left: 14px; padding: 5px 12px; border-radius: 99px; font-size: .72rem; font-weight: 700; letter-spacing: .06em; background: var(--green); color: #00130d; }
    .hover-specs { position: absolute; inset: auto 0 0 0; display: flex; justify-content: space-around; padding: 30px 12px 14px; font-size: .8rem; color: var(--muted);
      background: linear-gradient(0deg, rgba(4, 9, 12, .95), transparent); transform: translateY(100%); transition: transform .35s; b { color: var(--green); font-family: var(--font-display); font-size: 1rem; } }
    article:hover .hover-specs { transform: none; }
    .body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; h3 { font-size: 1.15rem; } }
    .rate { color: #ffd166; font-size: .85rem; white-space: nowrap; small { color: var(--muted); } }
    .tag { color: var(--muted); font-size: .92rem; }
    .foot { margin-top: auto; padding-top: 14px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
    .price { display: grid; line-height: 1.3; s { color: var(--muted); font-size: .85rem; } strong { font-family: var(--font-display); font-size: 1.3rem; } small { color: var(--muted); font-size: .78rem; } }
    .add { text-decoration: none; width: 46px; height: 46px; border-radius: 50%; border: 0; background: var(--grad); color: #00130d; display: grid; place-items: center; transition: transform .25s, box-shadow .25s; flex: none;
      &:hover { transform: rotate(90deg) scale(1.08); box-shadow: 0 0 24px -2px var(--green); } }
  `,
})
export class ProductCard {
  product = input.required<Product>();
  protected contact = computed(() => contactLink(`Olá, ${STORE_NAME}! Tenho interesse na ${this.product().name}.`));
}
