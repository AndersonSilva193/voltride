import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/hero';
import { PRODUCTS } from '../data/products';
import { imageSources } from '../data/media';
import { contactLink } from '../data/contact';
import { Product } from '../models/product';

gsap.registerPlugin(ScrollTrigger);

interface Line {
  code: string;
  name: string;
  spec: string;
  models: Product[];
}

const byPower = (w: number) => PRODUCTS.filter((p) => p.specs.power === w);
const ranges = (ps: Product[]) => {
  const r = [...new Set(ps.map((p) => p.specs.range))].sort((a, b) => a - b);
  return r.length > 1 ? `${r[0]}–${r[r.length - 1]}` : `${r[0]}`;
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe, Hero],
  template: `
    <app-hero />

    <section class="linhas" id="linhas" #linhas aria-labelledby="linhas-title">
      <div class="container">
        <header class="head">
          <h2 id="linhas-title">Escolha a sua linha.</h2>
          <p>
            Sete modelos em duas linhas, como num mapa de ônibus: a de 500 W para o dia a dia do
            bairro e a de 1000 W para quem anda mais.
          </p>
        </header>

        @for (l of lines; track l.code) {
          <article class="line" [attr.aria-labelledby]="'linha-' + l.code">
            <div class="line-head">
              <span class="code placa mono">{{ l.code }}</span>
              <div>
                <h3 [id]="'linha-' + l.code">{{ l.name }}</h3>
                <p>{{ l.spec }}</p>
              </div>
            </div>
            <ol class="track" [style.--n]="l.models.length">
              <i class="rail" aria-hidden="true"></i>
              @for (p of l.models; track p.id) {
                <li class="stop">
                  <a [routerLink]="['/produto', p.id]">
                    <img
                      [src]="p.images[0]"
                      [srcset]="imageSources(p.images[0])"
                      sizes="(max-width: 760px) 40vw, 240px"
                      width="1024"
                      height="688"
                      [alt]="p.name"
                      loading="lazy"
                    />
                    <span class="pin" aria-hidden="true"></span>
                    <strong>{{ p.name }}</strong>
                    <span class="price">{{ p.price | currency: 'BRL' : 'symbol' : '1.0-0' }}</span>
                  </a>
                </li>
              }
            </ol>
          </article>
        }
        <p class="ref">
          Preços, potência e autonomia são valores de referência de uma pesquisa de mercado, não
          ofertas nem fichas de fabricante.
        </p>
      </div>
    </section>

    <section class="duvidas" id="duvidas" aria-labelledby="duvidas-title">
      <div class="container cols">
        <h2 id="duvidas-title">Antes de sair de casa.</h2>
        <div class="faq">
          @for (q of faq; track q.q; let i = $index) {
            <div class="item" [class.open]="openFaq() === i">
              <h3>
                <button
                  type="button"
                  [id]="'q-' + i"
                  [attr.aria-expanded]="openFaq() === i"
                  [attr.aria-controls]="'a-' + i"
                  (click)="openFaq.set(openFaq() === i ? -1 : i)"
                >
                  {{ q.q }}
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h12M10 4v12" stroke="currentColor" stroke-width="2.5" />
                  </svg>
                </button>
              </h3>
              <div class="ans" [id]="'a-' + i" role="region" [attr.aria-labelledby]="'q-' + i">
                <p>{{ q.a }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="fim placa-surface" aria-labelledby="fim-title">
      <div class="container">
        <h2 id="fim-title">Quer ver uma de perto?</h2>
        <p>Conte qual modelo chamou sua atenção e consulte disponibilidade pelo WhatsApp.</p>
        <a class="btn btn-meiofio" [href]="contact" target="_blank" rel="noopener">
          Falar no WhatsApp
        </a>
      </div>
    </section>
  `,
  styles: `
    .linhas {
      padding: 120px 0 100px;
    }
    .head {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px 60px;
      align-items: end;
      margin-bottom: 72px;
      h2 {
        font-size: clamp(2.4rem, 5vw, 4.6rem);
        font-weight: 900;
      }
      p {
        max-width: 46ch;
        color: var(--ink-2);
        font-size: 1.1rem;
      }
    }
    .line {
      margin-bottom: 72px;
    }
    .line-head {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      .code {
        padding: 12px 16px 9px;
        font-size: 1.6rem;
        line-height: 1;
      }
      h3 {
        font-size: 1.5rem;
      }
      p {
        color: var(--ink-2);
      }
    }
    .track {
      position: relative;
      display: grid;
      /* todas as linhas usam a mesma largura de parada (5 por linha) */
      width: calc((100% + 20px) * var(--n) / 5 - 20px);
      grid-template-columns: repeat(var(--n), minmax(0, 1fr));
      gap: 20px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .rail {
      position: absolute;
      left: 0;
      right: 0;
      top: var(--rail-y, 0);
      height: 8px;
      margin-top: -4px;
      background: var(--blue);
      border-radius: 4px;
      transform-origin: left;
    }
    .stop a {
      display: grid;
      gap: 6px;
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        object-fit: cover;
        border-radius: var(--r);
        transition: translate 0.3s var(--ease);
      }
      .pin {
        position: relative;
        z-index: 1;
        width: 22px;
        height: 22px;
        margin: 10px 0 8px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid var(--ink);
        transition: background 0.18s;
      }
      strong {
        font-size: 1.1rem;
        line-height: 1.15;
      }
      .price {
        color: var(--ink-2);
        font-size: 0.95rem;
      }
      &:hover {
        img {
          translate: 0 -6px;
        }
        .pin {
          background: var(--yellow);
        }
        strong {
          text-decoration: underline;
          text-decoration-thickness: 2px;
        }
      }
    }
    .ref {
      font-size: 0.88rem;
      color: var(--ink-2);
      max-width: 70ch;
    }

    .duvidas {
      padding: 100px 0;
      border-top: 2px solid var(--ink);
      background: var(--paper-2);
    }
    .cols {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 40px 60px;
      align-items: start;
      h2 {
        font-size: clamp(2.2rem, 4vw, 3.6rem);
        font-weight: 900;
        position: sticky;
        top: calc(var(--header-h) + 32px);
      }
    }
    .faq {
      border-top: 2px solid var(--ink);
    }
    .item {
      border-bottom: 1px solid var(--line);
      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: 0;
      }
      button {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 22px 0 18px;
        background: none;
        border: 0;
        text-align: left;
        font-weight: 700;
        svg {
          flex: none;
          transition: rotate 0.25s var(--ease);
        }
      }
      &.open svg {
        rotate: 45deg;
      }
      .ans {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s var(--ease);
        p {
          overflow: hidden;
          color: var(--ink-2);
          max-width: 62ch;
        }
      }
      &.open .ans {
        grid-template-rows: 1fr;
        p {
          padding-bottom: 22px;
        }
      }
    }

    .placa-surface {
      background: var(--blue);
      color: var(--on-blue);
    }
    .fim {
      padding: 110px 0;
      .container {
        display: grid;
        gap: 22px;
        justify-items: start;
      }
      h2 {
        font-size: clamp(2.6rem, 6vw, 5.6rem);
        font-weight: 900;
      }
      p {
        color: var(--on-blue-2);
        font-size: 1.15rem;
        max-width: 44ch;
      }
    }

    @media (max-width: 900px) {
      .head,
      .cols {
        grid-template-columns: 1fr;
      }
      .cols h2 {
        position: static;
      }
    }
    @media (max-width: 760px) {
      .linhas {
        padding: 80px 0 60px;
      }
      /* No celular a linha fica vertical, como um diagrama de parada em parada. */
      .track {
        width: auto;
        grid-template-columns: 1fr;
        gap: 0;
        padding-left: 34px;
      }
      .rail {
        top: 0;
        bottom: 0;
        left: 7px;
        right: auto;
        width: 8px;
        height: auto;
        margin: 0;
        transform-origin: top;
      }
      .stop a {
        grid-template-columns: 40% 1fr;
        grid-template-rows: auto auto 1fr;
        column-gap: 14px;
        padding: 12px 0;
        position: relative;
        img {
          grid-row: 1 / 4;
        }
        .pin {
          position: absolute;
          left: -34px;
          top: calc(50% - 11px);
          margin: 0;
        }
        strong {
          align-self: end;
        }
      }
    }
  `,
})
export class Home implements AfterViewInit, OnDestroy {
  private linhas = viewChild.required<ElementRef<HTMLElement>>('linhas');
  private ctx?: gsap.Context;

  protected readonly imageSources = imageSources;
  protected readonly contact = contactLink();
  protected openFaq = signal(0);

  protected lines: Line[] = [
    {
      code: '500',
      name: 'Linha Bairro',
      spec: `500 W, ${ranges(byPower(500))} km de autonomia de referência`,
      models: byPower(500),
    },
    {
      code: '1000',
      name: 'Linha Cidade',
      spec: `1000 W, ${ranges(byPower(1000))} km de autonomia de referência`,
      models: byPower(1000),
    },
  ];

  protected faq = [
    {
      q: 'Como consultar disponibilidade?',
      a: 'Use o botão Fale conosco ou o Falar no WhatsApp e diga qual modelo você escolheu.',
    },
    {
      q: 'De onde vêm os preços?',
      a: 'São valores de referência de uma pesquisa de mercado, não ofertas nem preços de loja.',
    },
    {
      q: 'O que significam autonomia e potência?',
      a: 'São valores de referência da pesquisa, apresentados para este projeto. Não são especificações verificadas com um fabricante.',
    },
    {
      q: 'O dia do começo da página é real?',
      a: 'Não. Os horários e quilômetros do roteiro são ilustrativos, para mostrar como um dia comum se compara à autonomia de referência do modelo.',
    },
    {
      q: 'Preciso de habilitação para conduzir um veículo elétrico?',
      a: 'As regras dependem da classificação do veículo e da legislação aplicável. Este projeto não determina a categoria nem substitui a consulta às regras oficiais.',
    },
  ];

  ngAfterViewInit() {
    const root = this.linhas().nativeElement;
    this.ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        root.querySelectorAll<HTMLElement>('.track').forEach((track) => {
          const vertical = matchMedia('(max-width: 760px)').matches;
          const rail = track.querySelector('.rail');
          const pins = track.querySelectorAll('.pin');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: track, start: 'top 78%', once: true },
          });
          tl.from(rail, {
            [vertical ? 'scaleY' : 'scaleX']: 0,
            duration: 0.9,
            ease: 'power3.inOut',
          }).from(
            pins,
            { scale: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.09 },
            0.25,
          );
        });
      });
    }, root);
    this.placeRails();
    addEventListener('resize', this.placeRails);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    removeEventListener('resize', this.placeRails);
  }

  /** No desktop, o trilho passa pelo centro das bolinhas das paradas. */
  private placeRails = () => {
    this.linhas()
      .nativeElement.querySelectorAll<HTMLElement>('.track')
      .forEach((track) => {
        const pin = track.querySelector<HTMLElement>('.pin');
        if (!pin) return;
        const y = pin.offsetTop + pin.offsetHeight / 2;
        track.style.setProperty('--rail-y', `${y}px`);
      });
  };
}
