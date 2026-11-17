import { Component, computed, signal, inject } from '@angular/core';
import { ProductCard } from '../components/product-card';
import { Meta } from '@angular/platform-browser';
import { CATEGORY_LABEL, PRODUCTS } from '../data/products';

type Sort = 'relevance' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  template: `
    <section class="top container">
      <h1>Todos os modelos.</h1>
      <p>Sete scooters elétricas para o bairro e a cidade. Valores de referência de pesquisa.</p>
    </section>

    <section class="container shop">
      <div class="toolbar">
        <div class="chips" role="group" aria-label="Categorias">
          @for (c of categories; track c.id) {
            <button
              [class.on]="category() === c.id"
              [attr.aria-pressed]="category() === c.id"
              (click)="category.set(c.id)"
            >
              {{ c.label }}
            </button>
          }
        </div>
        <input
          class="search"
          type="search"
          placeholder="Buscar modelo…"
          aria-label="Buscar modelo"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
        <div class="dd" (focusout)="onFocusOut($event)" (keydown.escape)="open.set(false)">
          <button
            type="button"
            class="dd-btn"
            aria-haspopup="listbox"
            [attr.aria-expanded]="open()"
            aria-label="Ordenar"
            (click)="open.set(!open())"
          >
            <span>{{ sortLabel() }}</span>
            <svg
              [class.up]="open()"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          @if (open()) {
            <ul class="dd-menu" role="listbox">
              @for (o of sortOptions; track o.id) {
                <li role="option" [attr.aria-selected]="sort() === o.id">
                  <button type="button" [class.on]="sort() === o.id" (click)="pick(o.id)">
                    {{ o.label }}
                  </button>
                </li>
              }
            </ul>
          }
        </div>
      </div>

      <p class="count">{{ list().length }} {{ list().length === 1 ? 'modelo' : 'modelos' }}</p>

      @if (list().length) {
        <div class="grid">
          @for (p of list(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      } @else {
        <div class="empty">
          <p>Nenhum modelo encontrado.</p>
          <button class="btn btn-linha" (click)="reset()">Limpar filtros</button>
        </div>
      }
    </section>
  `,
  styles: `
    .top {
      padding: calc(var(--header-h) + 72px) 0 36px;
      display: grid;
      gap: 12px;
      h1 {
        font-size: clamp(2.6rem, 6vw, 5rem);
        font-weight: 900;
      }
      p {
        color: var(--ink-2);
        font-size: 1.1rem;
      }
    }
    .shop {
      padding: 0 0 110px;
    }
    .toolbar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      padding: 16px 0;
      margin-bottom: 8px;
      border-block: 2px solid var(--ink);
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      flex: 1;
      button {
        min-height: 44px;
        padding: 10px 16px 8px;
        border-radius: var(--r);
        border: 0;
        background: transparent;
        font-weight: 700;
        box-shadow: inset 0 0 0 2px var(--ink);
        transition: background 0.15s, color 0.15s;
        &:hover {
          background: var(--paper-2);
        }
        &.on {
          background: var(--blue);
          color: var(--on-blue);
          box-shadow: inset 0 0 0 3px var(--blue), inset 0 0 0 5px var(--on-blue);
        }
      }
    }
    .search {
      width: 220px;
      min-height: 44px;
      padding: 10px 14px 8px;
      border-radius: var(--r);
      border: 2px solid var(--ink);
      background: #fff;
      color: var(--ink);
      font: inherit;
      &::placeholder {
        color: var(--ink-2);
      }
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--yellow);
      }
    }
    .dd {
      position: relative;
      width: 270px;
    }
    .dd-btn {
      width: 100%;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 14px 8px;
      border-radius: var(--r);
      border: 2px solid var(--ink);
      background: #fff;
      color: var(--ink);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      svg {
        transition: transform 0.2s var(--ease);
        &.up {
          transform: rotate(180deg);
        }
      }
    }
    .dd-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      z-index: 20;
      list-style: none;
      margin: 0;
      padding: 6px;
      border-radius: var(--r);
      border: 2px solid var(--ink);
      background: #fff;
      box-shadow: 0 16px 32px -18px rgba(21, 24, 28, 0.5);
      button {
        width: 100%;
        text-align: left;
        padding: 10px 12px 8px;
        border: 0;
        border-radius: 4px;
        background: transparent;
        font: inherit;
        cursor: pointer;
        &:hover {
          background: var(--paper-2);
        }
        &.on {
          background: var(--blue);
          color: var(--on-blue);
          font-weight: 700;
        }
      }
    }
    .count {
      color: var(--ink-2);
      margin: 18px 0 28px;
      font-size: 0.95rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 48px 28px;
    }
    .empty {
      padding: 60px 0;
      display: grid;
      gap: 20px;
      justify-items: start;
      font-size: 1.2rem;
      font-weight: 700;
    }
    @media (max-width: 960px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 620px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .search,
      .dd {
        width: 100%;
      }
    }
`,
})
export class Shop {
  constructor() {
    inject(Meta).updateTag({
      name: 'description',
      content:
        'Explore os modelos Volt Ride e consulte detalhes de cada opção do catálogo.',
    });
  }
  protected category = signal('todas');
  protected query = signal('');
  protected sort = signal<Sort>('relevance');

  protected open = signal(false);
  protected sortOptions: { id: Sort; label: string }[] = [
    { id: 'relevance', label: 'Relevância' },
    { id: 'price-asc', label: 'Menor valor de referência' },
    { id: 'price-desc', label: 'Maior valor de referência' },
  ];
  protected sortLabel = computed(() => this.sortOptions.find((o) => o.id === this.sort())!.label);

  protected pick(id: Sort) {
    this.sort.set(id);
    this.open.set(false);
  }
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
      (p) =>
        (this.category() === 'todas' || p.category === this.category()) &&
        (!q || (p.name + ' ' + p.tagline).toLowerCase().includes(q)),
    );
    switch (this.sort()) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  });

  reset() {
    this.category.set('todas');
    this.query.set('');
  }
}
