import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Phrase {
  text: string;
  sub: string;
  from: number;
  to: number;
  pos: 'left' | 'right' | 'center';
}

/**
 * Hero com "scroll scrubbing": a section é mais alta que a viewport e o palco
 * fica fixo (sticky) enquanto o scroll controla o `currentTime` do vídeo.
 * Na prática, a página fica "travada" na moto durante todo o percurso.
 */
@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  template: `
    <section class="track" #track>
      <div class="stage" #stage>
        <video #video muted playsinline preload="auto" poster="media/start.jpg" src="media/ride.mp4"
               (error)="failed.set(true)"></video>
        @if (failed()) {
          <img class="fb" src="media/start.jpg" alt="" />
          <img class="fb" src="media/end.jpg" alt="" [style.opacity]="progress()" />
        }
        <div class="shade"></div>
        <div class="streaks"></div>

        <!-- intro -->
        <div class="intro" [class.gone]="progress() > 0.05">
          <p class="eyebrow">Mobilidade elétrica · 2026</p>
          <h1>VOLT<span class="grad-text">RIDE</span></h1>
          <p class="lead">A cidade nunca foi tão silenciosa. Nem tão rápida.</p>
          <div class="hint" aria-hidden="true"><i></i><span>Role para acelerar</span></div>
        </div>

        <!-- frases durante o percurso -->
        @for (p of phrases; track p.text; let i = $index) {
          <div class="phrase {{ p.pos }}" [class.on]="active() === i" [class.past]="active() !== i && i < reached()">
            <h2><span>{{ p.text }}</span></h2>
            <p>{{ p.sub }}</p>
          </div>
        }

        <!-- final -->
        <div class="outro" [class.on]="progress() > 0.94">
          <h2>Escolha a <span class="grad-text">sua</span>.</h2>
          <div class="cta">
            <a class="btn btn-primary" routerLink="/loja">Ver todas as motos</a>
            <a class="btn btn-ghost" routerLink="/produto/volt-one">Conhecer a Volt One</a>
          </div>
        </div>

        <!-- HUD -->
        <div class="hud" [class.on]="progress() > 0.03 && progress() < 0.97" aria-hidden="true">
          <div class="speed"><b>{{ speed() }}</b><span>km/h</span></div>
          <div class="bar"><i></i></div>
        </div>
        @if (progress() < 0.9) {
          <button class="skip" (click)="skip()">Pular animação ↓</button>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .track { position: relative; height: 650vh; background: var(--bg); }
    .stage { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; --p: 0; }
    video, .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; }
    .shade { position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(120% 90% at 50% 45%, transparent 35%, rgba(2, 6, 8, calc(.55 + var(--p) * .25)) 100%),
        linear-gradient(180deg, rgba(4, 9, 12, .75), transparent 28%, transparent 62%, rgba(4, 9, 12, .85)); }
    .streaks { position: absolute; inset: -10% 0; pointer-events: none; mix-blend-mode: screen;
      opacity: calc(clamp(0, (var(--p) - .08) * 4, 1) * .5);
      background:
        repeating-linear-gradient(0deg, transparent 0 46px, rgba(25, 230, 168, .10) 47px, transparent 49px 95px),
        repeating-linear-gradient(0deg, transparent 0 130px, rgba(25, 184, 255, .12) 132px, transparent 134px 210px);
      background-size: 600px 100%, 900px 100%;
      animation: streak .5s linear infinite;
      mask-image: linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent); }
    @keyframes streak { to { background-position: -600px 0, -900px 0; } }

    .intro { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; gap: 16px; padding: 0 20px; transition: opacity .6s, transform .6s, filter .6s;
      h1 { font-size: clamp(3rem, 12vw, 9rem); font-weight: 900; letter-spacing: .08em; text-shadow: 0 0 60px rgba(25, 230, 168, .35); }
      .lead { color: var(--muted); font-size: clamp(1rem, 2vw, 1.3rem); max-width: 520px; }
      &.gone { opacity: 0; transform: translateY(-40px) scale(1.05); filter: blur(10px); pointer-events: none; } }
    .hint { position: absolute; bottom: 38px; display: grid; justify-items: center; gap: 12px; font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; color: var(--muted);
      i { width: 24px; height: 40px; border: 2px solid var(--green); border-radius: 14px; position: relative;
        &::after { content: ''; position: absolute; left: 50%; top: 7px; width: 4px; height: 8px; margin-left: -2px; border-radius: 4px; background: var(--green); animation: wheel 1.6s infinite; } } }
    @keyframes wheel { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(14px); } }

    .phrase { position: absolute; top: 50%; width: min(760px, 88%); pointer-events: none; opacity: 0; transform: translate(60px, -50%); filter: blur(14px);
      transition: opacity .55s, transform .75s cubic-bezier(.2, .8, .2, 1), filter .55s;
      h2 { font-size: clamp(2.2rem, 7vw, 5.6rem); font-weight: 900; line-height: 1; text-transform: uppercase;
        span { background: linear-gradient(100deg, #fff 30%, var(--green) 70%, var(--cyan)); -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 30px rgba(25, 230, 168, .35)); } }
      p { margin-top: 14px; font-size: clamp(.95rem, 1.6vw, 1.25rem); color: #cfe6e3; letter-spacing: .08em; text-transform: uppercase; }
      &.left { left: 6%; text-align: left; } &.right { right: 6%; text-align: right; transform: translate(-60px, -50%); }
      &.center { left: 50%; margin-left: calc(min(760px, 88%) / -2); text-align: center; transform: translate(0, -20%); }
      &.on { opacity: 1; filter: none; transform: translate(0, -50%); }
      &.past { transform: translate(-80px, -50%); filter: blur(14px); }
      &.right.past { transform: translate(80px, -50%); }
      &.center.past { transform: translate(0, -90%); } }

    .outro { position: absolute; inset: auto 0 12% 0; display: grid; justify-items: center; gap: 26px; text-align: center; opacity: 0; transform: translateY(40px); transition: opacity .7s, transform .7s; pointer-events: none;
      h2 { font-size: clamp(2.4rem, 7vw, 5rem); font-weight: 900; text-transform: uppercase; }
      .cta { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
      &.on { opacity: 1; transform: none; pointer-events: auto; } }

    .hud { position: absolute; left: 6%; right: 6%; bottom: 34px; display: flex; align-items: center; gap: 22px; opacity: 0; transition: opacity .5s;
      &.on { opacity: 1; }
      .speed { display: flex; align-items: baseline; gap: 8px; min-width: 150px; font-family: var(--font-display);
        b { font-size: 2.4rem; font-weight: 700; color: var(--green); text-shadow: 0 0 18px rgba(25, 230, 168, .6); font-variant-numeric: tabular-nums; }
        span { font-size: .75rem; letter-spacing: .2em; color: var(--muted); } }
      .bar { flex: 1; height: 3px; background: rgba(255, 255, 255, .12); border-radius: 3px; overflow: hidden;
        i { display: block; height: 100%; width: calc(var(--p) * 100%); background: var(--grad); box-shadow: 0 0 14px var(--green); } } }
    .skip { position: absolute; top: calc(var(--header-h) + 14px); right: 20px; background: rgba(4, 9, 12, .5); border: 1px solid var(--line); border-radius: 99px; padding: 8px 16px; font-size: .78rem; color: var(--muted); backdrop-filter: blur(8px); transition: color .2s, border-color .2s;
      &:hover { color: var(--text); border-color: var(--green); } }

    @media (max-width: 700px) {
      .track { height: 520vh; }
      .phrase.left, .phrase.right { left: 6%; right: 6%; width: auto; text-align: left; }
      .hud { bottom: 22px; } .speed b { font-size: 1.8rem; }
    }
    @media (prefers-reduced-motion: reduce) { .streaks { animation: none; } }
  `,
})
export class Hero implements AfterViewInit, OnDestroy {
  private track = viewChild.required<ElementRef<HTMLElement>>('track');
  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  protected failed = signal(false);
  protected progress = signal(0);

  protected phrases: Phrase[] = [
    { text: 'Zero emissão.', sub: 'Nenhum ruído. Nenhuma fumaça.', from: 0.10, to: 0.25, pos: 'left' },
    { text: '100% elétrica.', sub: 'Torque instantâneo desde o primeiro giro', from: 0.27, to: 0.42, pos: 'right' },
    { text: 'Acelera no silêncio.', sub: 'Do zero ao 80 em segundos', from: 0.44, to: 0.60, pos: 'left' },
    { text: 'Até 160 km de autonomia.', sub: 'Uma carga. A semana inteira', from: 0.62, to: 0.78, pos: 'right' },
    { text: 'A cidade é sua.', sub: 'Sem fila. Sem trânsito. Sem limites', from: 0.80, to: 0.93, pos: 'center' },
  ];

  protected active = computed(() => {
    const p = this.progress();
    return this.phrases.findIndex((f) => p >= f.from && p < f.to);
  });
  protected reached = computed(() => this.phrases.filter((f) => this.progress() >= f.from).length);
  protected speed = computed(() => Math.round(Math.pow(this.progress(), 1.2) * 85));

  private target = 0;
  private current = 0;
  private raf = 0;
  private duration = 0;
  private lastSet = -1;

  ngAfterViewInit() {
    const v = this.video().nativeElement;
    const onMeta = () => {
      this.duration = v.duration || 0;
      // "destrava" o vídeo em browsers que exigem um play() antes de permitir seek.
      v.play().then(() => v.pause()).catch(() => undefined);
      this.read();
      this.tick();
    };
    if (v.readyState >= 1) onMeta(); else v.addEventListener('loadedmetadata', onMeta, { once: true });
    this.read();
  }

  ngOnDestroy() { cancelAnimationFrame(this.raf); }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  read() {
    const el = this.track().nativeElement;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top;
    this.target = Math.min(1, Math.max(0, -top / total));
    if (!this.raf) this.raf = requestAnimationFrame(() => this.tick());
  }

  skip() {
    const el = this.track();
    window.scrollTo({ top: el.nativeElement.offsetTop + el.nativeElement.offsetHeight - window.innerHeight, behavior: 'smooth' });
  }

  private tick() {
    this.raf = 0;
    // suavização: o vídeo "persegue" a posição do scroll
    this.current += (this.target - this.current) * 0.14;
    if (Math.abs(this.target - this.current) < 0.0006) this.current = this.target;

    this.progress.set(Math.round(this.current * 1000) / 1000);
    this.stage().nativeElement.style.setProperty('--p', this.current.toFixed(4));

    const v = this.video().nativeElement;
    if (this.duration) {
      const t = this.current * (this.duration - 0.04);
      if (Math.abs(t - this.lastSet) > 1 / 60) { v.currentTime = t; this.lastSet = t; }
    }
    if (this.current !== this.target) this.raf = requestAnimationFrame(() => this.tick());
  }
}
