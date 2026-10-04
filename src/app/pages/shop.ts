import { Component, computed, signal } from '@angular/core';
import { ProductCard } from '../components/product-card';
import { Reveal } from '../directives/reveal';
import { CATEGORY_LABEL, PRODUCTS } from '../data/products';

type Sort = 'relevance' | 'price-asc' | 'price-desc' | 'range';

@Component({
  selector: 'app-shop',
  imports: [ProductCard, Reveal],
  template: `
    <section class="top">
      <img src="media/start.jpg" alt="" />
      <div class="container">
        <p class="eyebrow">Loja</p>
        <h1>Encontre sua <span class="grad-text">Voltride</span></h1>
      </div>
    </section>

    <section class="container shop">
      <div class="toolbar" appReveal>
        <div class="chips" role="group" aria-label="Categorias">
          @for (c of categories; track c.id) {
            <button [class.on]="category() === c.id" (click)="category.set(c.id)">{{ c.label }}</button>
          }
        </div>
        <input class="search" type="search" placeholder="Buscar modelo…" aria-label="Buscar" (input)="query.set($any($event.target).value)" />
        <div class="dd" (focusout)="onFocusOut($event)" (keydown.escape)="open.set(false)">
          <button type="button" class="dd-btn" aria-haspopup="listbox" [attr.aria-expanded]="open()" aria-label="Ordenar" (click)="open.set(!open())">
            <span>{{ sortLabel() }}</span>
            <svg [class.up]="open()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          @if (open()) {
            <ul class="dd-menu" role="listbox">
              @for (o of sortOptions; track o.id) {
                <li role="option" [attr.aria-selected]="sort() === o.id">
                  <button type="button" [class.on]="sort() === o.id" (click)="pick(o.id)">{{ o.label }}</button>
                </li>
              }
            </ul>
          }
        </div>
      </div>

      <p class="count">{{ list().length }} {{ list().length === 1 ? 'modelo' : 'modelos' }}</p>

      @if (list().length) {
        <div class="grid">
          @for (p of list(); track p.id) { <app-product-card [product]="p" /> }
        </div>
      } @else {
        <div class="empty card">
          <p>Nenhum modelo encontrado para sua busca.</p>
          <button class="btn btn-ghost" (click)="reset()">Limpar filtros</button>
        </div>
      }
    </section>
  `,
  styles: `
    .top { position: relative; padding: calc(var(--header-h) + 80px) 0 70px; overflow: hidden; border-bottom: 1px solid var(--line);
      img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 55%; opacity: .35; }
      &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, var(--bg)); }
      .container { position: relative; z-index: 1; } h1 { font-size: clamp(2.2rem, 6vw, 4.2rem); margin-top: 14px; } }
    .shop { padding: 40px 0 110px; }
    .toolbar { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 18px; }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; flex: 1;
      button { padding: 10px 20px; border-radius: 99px; border: 1px solid var(--line); background: transparent; transition: all .25s;
        &:hover { border-color: var(--green); } &.on { background: var(--grad); color: #00130d; border-color: transparent; font-weight: 600; } } }
    .search { width: 220px; }
    .dd { position: relative; width: 190px; }
    .dd-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 13px 15px; border-radius: 12px; border: 1px solid var(--line);
      background: var(--bg-2); color: var(--text); font: inherit; cursor: pointer; transition: border-color .2s, box-shadow .2s;
      &:hover, &[aria-expanded='true'] { border-color: var(--green); } &[aria-expanded='true'] { box-shadow: 0 0 0 3px rgba(25, 230, 168, .15); }
      svg { color: var(--green); transition: transform .25s; &.up { transform: rotate(180deg); } } }
    .dd-menu { position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 20; list-style: none; margin: 0; padding: 6px; border-radius: 14px;
      border: 1px solid var(--line); background: var(--surface); box-shadow: 0 18px 40px -12px rgba(0, 0, 0, .7), 0 0 24px -10px var(--green); animation: dd-in .18s ease-out;
      button { width: 100%; text-align: left; padding: 10px 12px; border: 0; border-radius: 9px; background: transparent; color: var(--text); font: inherit; cursor: pointer; transition: background .15s;
        &:hover { background: var(--surface-2); } &.on { background: var(--grad); color: #00130d; font-weight: 600; } } }
    @keyframes dd-in { from { opacity: 0; transform: translateY(-6px); } }
    .count { color: var(--muted); margin-bottom: 22px; font-size: .9rem; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
    .empty { padding: 60px; text-align: center; display: grid; gap: 20px; justify-items: center; color: var(--muted); }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 620px) { .grid { grid-template-columns: 1fr; } .search, .dd { width: 100%; } }
  `,
})
export class Shop {
  protected category = signal('todas');
  protected query = signal('');
  protected sort = signal<Sort>('relevance');

  protected open = signal(false);
  protected sortOptions: { id: Sort; label: string }[] = [
    { id: 'relevance', label: 'Relevância' },
    { id: 'price-asc', label: 'Menor preço' },
    { id: 'price-desc', label: 'Maior preço' },
    { id: 'range', label: 'Maior autonomia' },
  ];
  protected sortLabel = computed(() => this.sortOptions.find((o) => o.id === this.sort())!.label);

  protected pick(id: Sort) { this.sort.set(id); this.open.set(false); }
  protected onFocusOut(e: FocusEvent) {
    const root = e.currentTarget as HTMLElement;
    if (!root.contains(e.relatedTarget as Node | null)) this.open.set(false);
  }

  protected categories = [
    { id: 'todas', label: 'Todas' },
    ...Object.entries(CATEGORY_LABEL).map(([id, label]) => ({ id, label })),
  ];

  protected list = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = PRODUCTS.filter(
      (p) => (this.category() === 'todas' || p.category === this.category()) &&
        (!q || (p.name + ' ' + p.tagline).toLowerCase().includes(q)),
    );
    switch (this.sort()) {
      case 'price-asc': return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...items].sort((a, b) => b.price - a.price);
      case 'range': return [...items].sort((a, b) => b.specs.range - a.specs.range);
      default: return items;
    }
  });

  reset() { this.category.set('todas'); this.query.set(''); }
}
