import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DAY_STOPS,
  FRAME_SETS,
  FrameSet,
  MAP_STREETS,
  MODEL_ID,
  MODEL_NAME,
  MODEL_RANGE_KM,
  ROUTE_POINTS,
  STOP_POINT,
  frameUrl,
} from '../data/day';
import { FrameScrub } from '../lib/frame-scrub';

gsap.registerPlugin(ScrollTrigger);

/** Progresso do scroll em que o dia chega a cada parada. */
const AT = [0.1, 0.26, 0.42, 0.58, 0.74, 0.88];
const DAY_START = DAY_STOPS[0].min;
const DAY_END = DAY_STOPS[DAY_STOPS.length - 1].min;
/**
 * O vídeo liga o cabo na tomada por volta de 62% da duração. Até a última parada fora de casa
 * (feira) usamos só a parte do dia sem cabo; o trecho final (feira → casa) mostra o plugue e o farol.
 */
const PLUG_AT = 0.6;
const LAST_OUT = DAY_STOPS[DAY_STOPS.length - 2].min;
function videoAt(min: number) {
  const t = (min - DAY_START) / (LAST_OUT - DAY_START);
  if (t <= 1) return t * PLUG_AT;
  return PLUG_AT + ((min - LAST_OUT) / (DAY_END - LAST_OUT)) * (1 - PLUG_AT);
}

const seg = ROUTE_POINTS.slice(1).map(([x, y], i) => {
  const [px, py] = ROUTE_POINTS[i];
  return Math.abs(x - px) + Math.abs(y - py);
});
const cum = seg.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
const ROUTE_LEN = cum[cum.length - 1];
const STOP_LEN = STOP_POINT.map((p) => cum[p]);

const hhmm = (min: number) => {
  const m = Math.round(min);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
const kmText = (km: number) => km.toFixed(1).replace('.', ',');
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function pointAt(len: number): [number, number] {
  let i = cum.findIndex((c) => c >= len) - 1;
  if (i < 0) i = 0;
  const [x0, y0] = ROUTE_POINTS[i];
  const [x1, y1] = ROUTE_POINTS[i + 1] ?? ROUTE_POINTS[i];
  const f = seg[i] ? (len - cum[i]) / seg[i] : 0;
  return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
}

/** Estado do dia para um progresso de scroll 0..1. */
function dayAt(p: number) {
  if (p <= AT[0]) return { min: DAY_START, km: 0, len: 0 };
  const last = AT.length - 1;
  if (p >= AT[last]) {
    const s = DAY_STOPS[last];
    return { min: s.min, km: s.km, len: ROUTE_LEN };
  }
  const i = AT.findIndex((a) => a > p) - 1;
  const f = gsap.parseEase('power1.inOut')((p - AT[i]) / (AT[i + 1] - AT[i]));
  const a = DAY_STOPS[i];
  const b = DAY_STOPS[i + 1];
  return {
    min: a.min + (b.min - a.min) * f,
    km: a.km + (b.km - a.km) * f,
    len: STOP_LEN[i] + (STOP_LEN[i + 1] - STOP_LEN[i]) * f,
  };
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  host: { '[class.static]': 'still()' },
  template: `
    <section class="dia" #section aria-labelledby="dia-title">
      <div class="stage" #stage>
        <div class="frame">
          <img
            class="poster"
            src="media/hero/poster-1600.webp"
            srcset="media/hero/poster-800.webp 800w, media/hero/poster-1600.webp 1600w"
            sizes="100vw"
            width="1600"
            height="900"
            fetchpriority="high"
            alt="Scooter Capuccino creme estacionada na calçada, em frente a um muro azul, às 7h30"
          />
          @if (failed()) {
            <img
              #endPoster
              class="poster end"
              src="media/hero/end-1600.webp"
              srcset="media/hero/end-800.webp 800w, media/hero/end-1600.webp 1600w"
              sizes="100vw"
              width="1600"
              height="900"
              alt=""
            />
          }
          <canvas #canvas aria-hidden="true"></canvas>
        </div>

        <div class="slot">
        <div class="intro" [class.gone]="introGone()" [attr.inert]="introGone() ? '' : null">
          <h1 id="dia-title">
            Um dia inteiro de bairro.
            <span>Uma carga.</span>
          </h1>
          <p>Role a página e passe o dia com a {{ model }}.</p>
          <div class="cta">
            <a class="btn btn-placa" routerLink="/loja">Ver os modelos</a>
            @if (!still()) {
              <button class="btn btn-linha" type="button" (click)="skip()">Pular o dia</button>
            }
          </div>
        </div>

        <ol class="beats" aria-label="Roteiro do dia, ilustrativo">
          @for (s of stops; track s.id; let i = $index) {
            <li [class.on]="beat() === i" [class.past]="beat() > i">
              <span class="when mono">{{ time(s.min) }} · {{ s.place }}</span>
              <strong>{{ s.line }}</strong>
            </li>
          }
        </ol>

        <div class="outro" [class.on]="ended()" [attr.inert]="ended() ? null : ''">
          <h2>
            {{ dayKm }} km no dia.
            <span>Sobra bateria.</span>
          </h2>
          <p>
            A {{ model }} tem {{ range }} km de autonomia de referência. Dá para fazer o roteiro
            ilustrativo e ainda ter carga.
          </p>
          <div class="cta">
            <a class="btn btn-placa" routerLink="/loja">Ver os 7 modelos</a>
            <a class="btn btn-linha" [routerLink]="['/produto', modelId]">Conhecer a {{ model }}</a>
          </div>
        </div>
        </div>

        <aside class="guia" aria-label="Painel do trajeto">
          <div class="clock placa mono" #clock aria-hidden="true">07:30</div>
          <svg class="map" viewBox="0 0 320 200" aria-hidden="true">
            <rect width="320" height="200" class="land" />
            <rect x="170" y="140" width="80" height="45" class="park" />
            <path [attr.d]="streets" class="street" />
            <polyline [attr.points]="routePts" class="route-base" />
            <polyline
              #route
              [attr.points]="routePts"
              class="route"
              [attr.stroke-dasharray]="routeLen"
              [attr.stroke-dashoffset]="routeLen"
            />
            @for (s of stops; track s.id; let i = $index) {
              @if (i < stops.length - 1) {
                <circle [attr.cx]="s.x" [attr.cy]="s.y" r="6" class="stop" [class.hit]="beat() >= i" />
              }
            }
            <g #marker class="marker" transform="translate(40 160)">
              <circle r="9" />
              <circle r="4" class="dot" />
            </g>
          </svg>
          <div class="read">
            <div>
              <span class="lbl">Rodado</span>
              <b class="mono"><span #km>0,0</span> km</b>
            </div>
            <div class="batt">
              <span class="lbl">Bateria</span>
              <i><b #batt></b></i>
            </div>
          </div>
          <p class="note">Trajeto ilustrativo. Autonomia de referência: {{ range }} km.</p>
        </aside>
      </div>
    </section>
  `,
  styles: `
    @mixin flow {
      .stage {
        display: flex;
        flex-direction: column;
        padding-top: var(--header-h);
      }
      .frame {
        position: relative;
        inset: auto;
        flex: none;
        aspect-ratio: 16 / 9;
        width: 100%;
      }
      /* Coluna: vídeo, área de texto (ocupa o que sobra), painel. Nada se sobrepõe. */
      .slot {
        display: block;
        position: relative;
        flex: 1 1 auto;
        min-height: 0;
        margin: 18px 20px 0;
      }
      .intro,
      .outro,
      .beats {
        inset: 0 0 auto 0;
        width: auto;
        max-width: none;
      }
      .intro h1,
      .outro h2 {
        font-size: clamp(1.9rem, 8.6vw, 2.8rem);
      }
      .beats strong {
        font-size: clamp(1.9rem, 9vw, 3rem);
      }
      .guia {
        position: relative;
        inset: auto;
        flex: none;
        width: auto;
        margin: 10px 20px 14px;
        grid-template-columns: auto 1fr;
        .map {
          display: none;
        }
        .read {
          grid-template-columns: auto 1fr;
        }
      }
    }

    :host {
      display: block;
    }
    .stage {
      position: relative;
      height: 100vh;
      height: 100svh;
      overflow: hidden;
      background: var(--paper);
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #a9c3d6;
      overflow: hidden;
    }
    .poster,
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 70% 50%;
    }
    .end {
      opacity: 0;
    }

    .intro,
    .outro {
      position: absolute;
      left: max(20px, calc((100vw - 1240px) / 2));
      top: calc(var(--header-h) + 9vh);
      width: min(44vw, 640px);
      display: grid;
      gap: 18px;
      justify-items: start;
    }
    .intro {
      transition:
        opacity 0.3s,
        translate 0.4s var(--ease),
        visibility 0.3s;
      &.gone {
        opacity: 0;
        translate: 0 -24px;
        visibility: hidden;
      }
    }
    h1,
    h2 {
      font-size: clamp(2.6rem, 5vw, 5.4rem);
      font-weight: 900;
      line-height: 0.98;
      letter-spacing: -0.03em;
      span {
        display: block;
        width: fit-content;
        padding-bottom: 0.06em;
        background: linear-gradient(var(--yellow), var(--yellow)) 0 100% / 100% 0.16em no-repeat;
      }
    }
    .intro p,
    .outro p {
      font-size: 1.1rem;
      font-weight: 600;
      max-width: 34ch;
    }
    .cta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 4px;
    }
    .btn-linha {
      background: rgba(236, 237, 231, 0.86);
    }

    .outro {
      opacity: 0;
      visibility: hidden;
      translate: 0 24px;
      transition:
        opacity 0.4s,
        translate 0.5s var(--ease),
        visibility 0.4s;
      &.on {
        opacity: 1;
        visibility: visible;
        translate: 0 0;
      }
    }

    .beats {
      position: absolute;
      left: max(20px, calc((100vw - 1240px) / 2));
      top: 30%;
      width: min(36vw, 520px);
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        position: absolute;
        inset: 0 auto auto 0;
        display: grid;
        gap: 10px;
        clip-path: inset(0 100% 0 0);
        transition: clip-path 0.5s var(--ease);
        &.on {
          clip-path: inset(0 0 0 0);
        }
        &.past {
          clip-path: inset(0 0 0 100%);
          transition-duration: 0.3s;
        }
      }
      .when {
        width: fit-content;
        padding: 6px 10px 4px;
        border-radius: var(--r);
        background: var(--ink);
        color: var(--paper);
        font-size: 0.95rem;
      }
      strong {
        font-size: clamp(2.6rem, 5.4vw, 5.6rem);
        font-weight: 900;
        line-height: 0.98;
        letter-spacing: -0.03em;
      }
    }

    .guia {
      position: absolute;
      left: max(20px, calc((100vw - 1240px) / 2));
      bottom: 24px;
      width: min(600px, 100vw - 40px);
      display: grid;
      grid-template-columns: auto 200px 1fr;
      align-items: center;
      gap: 8px 16px;
      padding: 12px;
      background: var(--paper);
      border: 2px solid var(--ink);
      border-radius: var(--r);
      box-shadow: 0 18px 40px -22px rgba(21, 24, 28, 0.55);
    }
    .clock {
      justify-self: start;
      padding: 10px 16px 7px;
      font-size: 2rem;
      line-height: 1;
    }
    .map {
      width: 100%;
      height: auto;
      border-radius: 3px;
      .land {
        fill: var(--paper-2);
      }
      .park {
        fill: #c9dcc0;
      }
      .street {
        stroke: #fff;
        stroke-width: 7;
        fill: none;
      }
      .route-base {
        fill: none;
        stroke: var(--paper-3);
        stroke-width: 6;
        stroke-linejoin: round;
      }
      .route {
        fill: none;
        stroke: var(--blue);
        stroke-width: 6;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .stop {
        fill: #fff;
        stroke: var(--ink);
        stroke-width: 3;
        &.hit {
          fill: var(--yellow);
        }
      }
      .marker circle {
        fill: var(--blue);
        stroke: #fff;
        stroke-width: 3;
      }
      .marker .dot {
        fill: #fff;
        stroke: none;
      }
    }
    .read {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 16px;
      align-items: end;
      .lbl {
        display: block;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ink-2);
      }
      b {
        font-size: 1.35rem;
      }
    }
    .batt i {
      display: block;
      height: 14px;
      margin-top: 4px;
      border: 2px solid var(--ink);
      border-radius: 3px;
      padding: 1px;
      b {
        display: block;
        height: 100%;
        width: 100%;
        background: var(--blue);
        transform-origin: left;
      }
    }
    .read {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .note {
      grid-column: 1 / -1;
      font-size: 0.78rem;
      color: var(--ink-2);
    }

    /* No desktop o .slot não gera caixa: os textos se posicionam sobre a foto, no palco. */
    .slot {
      display: contents;
    }

    @media (max-width: 760px) {
      @include flow;
      .guia {
        padding: 10px;
        gap: 8px 14px;
        align-items: center;
      }
      .clock {
        font-size: 1.5rem;
      }
      .read b {
        font-size: 1.15rem;
      }
      .note {
        grid-column: 1 / -1;
      }
      .outro .btn {
        min-height: 44px;
        padding: 10px 16px 8px;
      }
    }
    /* Celulares baixos: o texto de apoio sai para o título e os botões caberem acima do painel. */
    @media (max-width: 760px) and (max-height: 760px) {
      .slot {
        margin-top: 14px;
      }
      .intro,
      .outro {
        gap: 12px;
      }
      .outro p {
        display: none;
      }
    }
    @media (max-width: 760px) and (max-height: 620px) {
      .intro p {
        display: none;
      }
      .intro h1,
      .outro h2,
      .beats strong {
        font-size: 1.75rem;
      }
    }

    /* Movimento reduzido: sem pin nem scrub. Manhã e fim de tarde lado a lado, roteiro em lista. */
    :host(.static) {
      @include flow;
      .stage {
        height: auto;
        padding-bottom: 32px;
      }
      .slot {
        margin: 0;
      }
      .intro p,
      .outro p {
        display: block;
      }
      .intro,
      .outro,
      .beats,
      .guia {
        position: relative;
        inset: auto;
        top: auto;
        margin: 24px 20px 0;
        opacity: 1;
        visibility: visible;
        translate: none;
      }
      .beats li {
        position: static;
        clip-path: none;
        margin-bottom: 14px;
        strong {
          font-size: 1.6rem;
        }
      }
      .guia {
        width: min(640px, 100% - 40px);
        .map {
          display: block;
        }
      }
      @media (min-width: 761px) {
        .guia {
          grid-template-columns: auto 200px 1fr;
        }
      }
      @media (min-width: 761px) {
        .frame {
          max-height: 70svh;
        }
        .intro,
        .outro,
        .beats,
        .guia {
          margin-inline: max(20px, calc((100vw - 1240px) / 2));
        }
      }
    }
  `,
})
export class Hero implements AfterViewInit, OnDestroy {
  private section = viewChild.required<ElementRef<HTMLElement>>('section');
  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private clock = viewChild.required<ElementRef<HTMLElement>>('clock');
  private km = viewChild.required<ElementRef<HTMLElement>>('km');
  private batt = viewChild.required<ElementRef<HTMLElement>>('batt');
  private route = viewChild.required<ElementRef<SVGPolylineElement>>('route');
  private marker = viewChild.required<ElementRef<SVGGElement>>('marker');
  private endPoster = viewChild<ElementRef<HTMLImageElement>>('endPoster');

  protected readonly stops = DAY_STOPS;
  protected readonly streets = MAP_STREETS;
  protected readonly routePts = ROUTE_POINTS.map((p) => p.join(',')).join(' ');
  protected readonly routeLen = ROUTE_LEN;
  protected readonly model = MODEL_NAME;
  protected readonly modelId = MODEL_ID;
  protected readonly range = MODEL_RANGE_KM;
  protected readonly dayKm = kmText(DAY_STOPS[DAY_STOPS.length - 1].km);
  protected readonly time = hhmm;

  protected beat = signal(-1);
  protected introGone = signal(false);
  protected ended = signal(false);
  protected still = signal(false);
  protected failed = signal(false);

  private mm?: gsap.MatchMedia;
  private scrub?: FrameScrub;
  private trigger?: ScrollTrigger;
  private frames = 1;
  private onResize = () => this.scrub?.resize();

  ngAfterViewInit() {
    this.mm = gsap.matchMedia();
    this.mm.add(
      {
        desktop: '(min-width: 761px)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop, motion } = ctx.conditions as Record<string, boolean>;
        const saveData =
          (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
          true;
        if (!motion) {
          this.still.set(true);
          this.render(1, false);
          return () => this.still.set(false);
        }
        this.still.set(false);
        this.start(desktop ? 'd' : 'm', !saveData);
        return () => this.stop();
      },
    );
  }

  ngOnDestroy() {
    this.mm?.revert();
  }

  /** Pula para o fim do dia (o scroll continua controlando tudo). */
  skip() {
    if (this.trigger) window.scrollTo({ top: this.trigger.end + 2, behavior: 'smooth' });
  }

  private start(set: FrameSet, loadFrames: boolean) {
    this.frames = FRAME_SETS[set];
    if (loadFrames) {
      const urls = Array.from({ length: this.frames }, (_, i) => frameUrl(set, i));
      this.scrub = new FrameScrub(this.canvas().nativeElement, urls, 0.7, (ok) => {
        if (!ok) this.failed.set(true);
      });
      addEventListener('resize', this.onResize);
    } else {
      this.failed.set(true);
    }

    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: this.section().nativeElement,
        pin: this.stage().nativeElement,
        start: 'top top',
        end: set === 'd' ? '+=320%' : '+=220%',
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => this.render(state.p, true),
    });
    this.trigger = tween.scrollTrigger;
    this.render(0, true);
    // fontes e imagens mudam a altura do layout: recalcula depois que tudo assentar
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  private stop() {
    removeEventListener('resize', this.onResize);
    this.scrub?.dispose();
    this.scrub = undefined;
    this.trigger = undefined;
  }

  private render(p: number, moving: boolean) {
    const d = dayAt(p);
    const t = videoAt(d.min);

    this.scrub?.set(t * (this.frames - 1));
    const end = this.endPoster()?.nativeElement;
    if (end) end.style.opacity = String(t);

    this.clock().nativeElement.textContent = moving ? hhmm(d.min) : '07:30–18:00';
    this.km().nativeElement.textContent = kmText(d.km);
    this.batt().nativeElement.style.transform = `scaleX(${clamp(1 - d.km / MODEL_RANGE_KM)})`;
    this.route().nativeElement.style.strokeDashoffset = String(ROUTE_LEN - d.len);
    const [x, y] = pointAt(d.len);
    this.marker().nativeElement.setAttribute('transform', `translate(${x} ${y})`);

    if (!moving) return;
    // cada frase aparece um pouco antes da parada e sai antes da próxima
    let b = -1;
    for (let i = 0; i < AT.length; i++) {
      const enter = AT[i] - 0.035;
      const leave = i < AT.length - 1 ? AT[i + 1] - 0.06 : 0.925;
      if (p >= enter && p < leave) b = i;
    }
    if (b !== this.beat()) this.beat.set(b);
    const gone = p > 0.06;
    if (gone !== this.introGone()) this.introGone.set(gone);
    const ended = p >= 0.925;
    if (ended !== this.ended()) this.ended.set(ended);
  }
}
