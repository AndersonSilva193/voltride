import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterLink } from '@angular/router';
import { Hero } from '../components/hero';
import { ProductCard } from '../components/product-card';
import { PRODUCTS } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero, ProductCard],
  template: `
    <app-hero />

    <section class="paint" aria-labelledby="preco">
      <div class="container">
        <h2 id="preco" class="sr">Custo por quilômetro</h2>
        <p class="big" aria-hidden="true"><span class="cur">R$</span>0,05<span class="per">/km</span></p>
        <div class="lane" aria-hidden="true"></div>
        <div class="cols">
          <p class="lead">Menos manutenção, nenhuma gasolina e recarga em tomada comum. Em um ano, a Voltride se paga no bolso.</p>
          <p class="sub">Até 160 km por carga, 60 km/h de velocidade máxima e zero emissão de CO₂.</p>
          <a class="btn btn-dark" routerLink="/loja">Quero economizar</a>
        </div>
      </div>
    </section>

    <div class="day">
      <section class="section" id="tecnologia">
        <div class="container tech">
          <h2 class="section-title">Motor e bateria projetados para durar.</h2>
          <div class="specs">
            @for (f of features; track f.title) {
              <div class="spec"><h3>{{ f.title }}</h3><p>{{ f.text }}</p></div>
            }
          </div>
        </div>
      </section>

      <section class="section featured">
        <div class="container">
          <div class="head">
            <h2 class="section-title">Os modelos queridinhos</h2>
            <a class="btn btn-ghost" routerLink="/loja">Ver todas →</a>
          </div>
          <div class="products">
            @for (p of featured; track p.id) {
              <app-product-card [product]="p" />
            }
          </div>
        </div>
      </section>

      <section class="section" id="faq">
        <div class="container narrow">
          <h2 class="section-title">Perguntas frequentes</h2>
          <div class="faq">
            @for (q of faq; track q.q; let i = $index) {
              <div class="item" [class.open]="openFaq() === i">
                <button (click)="openFaq.set(openFaq() === i ? -1 : i)" [attr.aria-expanded]="openFaq() === i">
                  {{ q.q }}<span aria-hidden="true">+</span>
                </button>
                <div class="ans"><p>{{ q.a }}</p></div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>

    <section class="close">
      <img src="media/end.jpg" alt="" loading="lazy" />
      <div class="container inner">
        <h2>Troque a gasolina.</h2>
        <a class="btn btn-primary" routerLink="/loja">Ver todas as motos</a>
      </div>
    </section>
  `,
  styles: `
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .paint { background: var(--green); color: #17191b; padding: 90px 0 80px; margin-top: -1px;
      .big { font-family: var(--font-display); font-weight: 800; font-size: clamp(7rem, 32vw, 30rem); line-height: .8; letter-spacing: -.03em; font-variant-numeric: tabular-nums;
        .cur { font-size: .3em; letter-spacing: 0; margin-right: .12em; vertical-align: top; position: relative; top: .1em; }
        .per { font-size: .32em; letter-spacing: 0; margin-left: .06em; } }
      .lane { height: 6px; margin: 44px 0 36px; background: repeating-linear-gradient(90deg, #17191b 0 56px, transparent 56px 96px); }
      .cols { display: grid; grid-template-columns: 1.2fr 1fr auto; gap: 40px; align-items: start; }
      .lead { font-size: clamp(1.2rem, 2vw, 1.6rem); font-weight: 600; line-height: 1.3; max-width: 34ch; }
      .sub { max-width: 34ch; font-weight: 500; }
      .btn-dark { background: #17191b; color: var(--green); &:hover { box-shadow: 6px 6px 0 rgba(23, 25, 27, .25); } } }

    /* luz do dia: a cena real (rua, de dia) pede seções claras */
    .day { --bg: #ebe8dd; --bg-2: #e1ded1; --surface: #f6f4ec; --surface-2: #dcd8ca; --text: #17191b; --muted: #55584f; --line: rgba(23, 25, 27, .2);
      background: var(--bg); color: var(--text);
      .btn-primary { color: #17191b; } }
    .day ::selection { background: #17191b; color: var(--green); }
    .tech { display: grid; grid-template-columns: 5fr 7fr; gap: 64px; align-items: start; }
    .tech .section-title { position: sticky; top: calc(var(--header-h) + 32px); margin: 0; font-size: clamp(2.6rem, 6vw, 5.2rem); }
    .specs { display: grid; }
    .spec { padding: 28px 0; border-top: 3px dashed #17191b; display: grid; grid-template-columns: 1fr 1.3fr; gap: 24px; align-items: baseline;
      &:last-child { border-bottom: 3px dashed #17191b; }
      h3 { font-size: 1.7rem; } p { color: var(--muted); max-width: 46ch; } }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 20px; flex-wrap: wrap; margin-bottom: 48px; .section-title { margin: 0; } }
    .section-title { font-size: clamp(2.4rem, 5vw, 4.2rem); margin-top: 0; margin-bottom: 40px; }
    .products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
    .narrow { max-width: 820px; }
    .faq { display: grid; gap: 0; }
    .item { border-top: 2px solid #17191b; overflow: hidden;
      &:last-child { border-bottom: 2px solid #17191b; }
      button { width: 100%; text-align: left; background: none; border: 0; padding: 22px 4px; font-weight: 600; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center; gap: 16px;
        span { font-size: 1.8rem; line-height: 1; transition: transform .3s; } }
      &.open button span { transform: rotate(45deg); }
      .ans { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s; p { overflow: hidden; padding: 0 4px; color: var(--muted); } }
      &.open .ans { grid-template-rows: 1fr; p { padding-bottom: 24px; } } }
    .close { position: relative; min-height: 520px; display: grid; align-items: end; overflow: hidden; background: #121416;
      img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(18, 20, 22, .9), rgba(18, 20, 22, .15) 60%); }
      .inner { position: relative; z-index: 1; padding-bottom: 64px; display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap;
        h2 { font-size: clamp(3rem, 10vw, 9rem); line-height: .85; } } }
    @media (max-width: 960px) { .products { grid-template-columns: 1fr 1fr; } .tech { grid-template-columns: 1fr; gap: 32px; } .tech .section-title { position: static; } .paint .cols { grid-template-columns: 1fr; gap: 20px; } }
    @media (max-width: 620px) { .products { grid-template-columns: 1fr; } .section { padding: 72px 0; } .spec { grid-template-columns: 1fr; gap: 8px; } }
  `,
})
export class Home implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private mm?: gsap.MatchMedia;
  private ctx?: gsap.Context;

  protected openFaq = signal(0);
  protected featured = PRODUCTS.slice(0, 3);


  protected features = [
    { title: 'Motor de alto torque', text: 'Aceleração imediata e silenciosa, sem trocas de marcha e sem vibração.', },
    { title: 'Bateria de lítio removível', text: 'Carregue na tomada de casa ou do escritório. De 0 a 100% em até 4 horas.', },
    { title: 'Frenagem regenerativa', text: 'Recupere energia a cada frenagem e estenda a autonomia no trânsito urbano.', },
    { title: 'Iluminação em LED', text: 'Farol em anel, lanterna e rodas com LED para enxergar e ser visto à noite.', },
    { title: 'Painel conectado', text: 'Acompanhe velocidade, carga e localização direto no painel e no aplicativo.', },
    { title: 'Garantia de 1 ano', text: 'Motor e bateria cobertos, com rede de assistência e peças originais.', },
  ];

  protected faq = [
    { q: 'Preciso de CNH para pilotar?', a: 'No geral não mas depende da potência do modelo e da regulamentação local. Modelos de baixa potência podem ter regras mais simples; confira a categoria na página de cada produto. (Conteúdo demonstrativo.)' },
    { q: 'Quanto tempo leva para carregar?', a: 'A recarga é feita em tomada comum e o tempo varia conforme a bateria de cada modelo. Fale com a gente para saber o tempo de recarga do modelo que você escolher.' },
    { q: 'Qual a autonomia real?', a: 'De 45 a 60 km por carga (aproximadamente), de acordo com o modelo, o peso transportado e o relevo do trajeto.' },
    { q: 'Como funciona a entrega?', a: 'Verificar disponibilidade de frete com a loja e a bicicleta chega montada, com bateria, carregador e documentação.' },
    { q: 'Como compro ou peço um orçamento?', a: 'Clique em "Fale conosco" e converse direto com a gente pelo WhatsApp. Informaremos preços, condições de pagamento e disponibilidade.' },
  ];

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      this.mm = gsap.matchMedia();
      this.mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ASSINATURA: a faixa amarela sobe como tinta cobrindo o fim do hero
        gsap.fromTo('.paint', { clipPath: 'inset(100% 0 0 0)' }, {
          clipPath: 'inset(0% 0 0 0)', ease: 'none',
          scrollTrigger: { trigger: '.paint', start: 'top 100%', end: 'top 20%', scrub: 0.6 },
        });
        gsap.from('.paint .big', {
          yPercent: 25, ease: 'expo.out', duration: 1.1,
          scrollTrigger: { trigger: '.paint', start: 'top 45%', toggleActions: 'play none none reverse' },
        });
        // lista técnica: cada linha entra pela esquerda ao cruzar a viewport
        gsap.utils.toArray<HTMLElement>('.spec').forEach((el) =>
          gsap.from(el, { x: -40, opacity: 0, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }));
      });
    }, this.host.nativeElement);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  ngOnDestroy() { this.mm?.revert(); this.ctx?.revert(); }
}
