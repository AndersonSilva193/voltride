import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Hero } from '../components/hero';
import { ProductCard } from '../components/product-card';
import { Reveal } from '../directives/reveal';
import { PRODUCTS } from '../data/products';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero, ProductCard, Reveal],
  template: `
    <app-hero />

    <section class="stats">
      <div class="container grid">
        @for (s of stats; track s.label; let i = $index) {
          <div appReveal [style.--d]="i * 100 + 'ms'">
            <b class="grad-text">{{ s.value }}</b><span>{{ s.label }}</span>
          </div>
        }
      </div>
    </section>

    <section class="section" id="tecnologia">
      <div class="container">
        <div appReveal class="head">
          <p class="eyebrow">Tecnologia</p>
          <h2 class="section-title">Motor e bateria <span class="grad-text">projetados para durar</span>.</h2>
        </div>
        <div class="features">
          @for (f of features; track f.title; let i = $index) {
            <article class="card" appReveal [style.--d]="i * 90 + 'ms'">
              <div class="ico" [innerHTML]="f.icon"></div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section featured">
      <div class="container">
        <div appReveal class="head row">
          <div>
            <p class="eyebrow">Linha 2026</p>
            <h2 class="section-title">Os modelos queridinhos</h2>
          </div>
          <a class="btn btn-ghost" routerLink="/loja">Ver todas →</a>
        </div>
        <div class="products">
          @for (p of featured; track p.id; let i = $index) {
            <app-product-card appReveal [product]="p" [style.--d]="i * 100 + 'ms'" />
          }
        </div>
      </div>
    </section>

    <section class="banner">
      <img src="media/end.jpg" alt="" loading="lazy" />
      <div class="container inner" appReveal>
        <p class="eyebrow">Economia real</p>
        <h2>Rode por <span class="grad-text">R$ 0,05</span> o quilômetro.</h2>
        <p>Menos manutenção, nenhuma gasolina e recarga em tomada comum. Em um ano, a Voltride se paga no bolso.</p>
        <a class="btn btn-primary" routerLink="/loja">Quero economizar</a>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container narrow">
        <div appReveal class="head">
          <p class="eyebrow">Dúvidas</p>
          <h2 class="section-title">Perguntas frequentes</h2>
        </div>
        <div class="faq">
          @for (q of faq; track q.q; let i = $index) {
            <div class="item" [class.open]="openFaq() === i" appReveal>
              <button (click)="openFaq.set(openFaq() === i ? -1 : i)" [attr.aria-expanded]="openFaq() === i">
                {{ q.q }}<span>+</span>
              </button>
              <div class="ans"><p>{{ q.a }}</p></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .stats { border-block: 1px solid var(--line); background: var(--bg-2); }
    .stats .grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; padding: 46px 0; gap: 20px;
      div { display: grid; gap: 4px; } b { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 3rem); } span { color: var(--muted); font-size: .9rem; } }
    .head { margin-bottom: 52px; &.row { display: flex; justify-content: space-between; align-items: end; gap: 20px; flex-wrap: wrap; } }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
    .features .card { padding: 34px 30px; transition: transform .35s, border-color .35s;
      &:hover { transform: translateY(-6px); border-color: rgba(25, 230, 168, .5); }
      h3 { font-size: 1.1rem; margin: 22px 0 10px; } p { color: var(--muted); } }
    .ico { width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; background: rgba(25, 230, 168, .08); border: 1px solid var(--line); color: var(--green); }
    .products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
    .banner { position: relative; min-height: 560px; display: grid; align-items: center; overflow: hidden;
      img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4, 9, 12, .95) 10%, rgba(4, 9, 12, .35) 70%, transparent); }
      .inner { position: relative; z-index: 1; display: grid; gap: 20px; justify-items: start; max-width: 1200px;
        h2 { font-size: clamp(2rem, 5vw, 3.8rem); max-width: 620px; } p:not(.eyebrow) { color: #cfe6e3; max-width: 480px; } } }
    .narrow { max-width: 820px; }
    .faq { display: grid; gap: 12px; }
    .item { border: 1px solid var(--line); border-radius: 14px; background: var(--surface); overflow: hidden; transition: border-color .3s;
      &.open { border-color: rgba(25, 230, 168, .5); }
      button { width: 100%; text-align: left; background: none; border: 0; padding: 20px 24px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; gap: 16px;
        span { font-size: 1.5rem; color: var(--green); transition: transform .3s; } }
      &.open button span { transform: rotate(45deg); }
      .ans { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s; p { overflow: hidden; padding: 0 24px; color: var(--muted); } }
      &.open .ans { grid-template-rows: 1fr; p { padding-bottom: 22px; } } }
    @media (max-width: 960px) { .features, .products { grid-template-columns: 1fr 1fr; } .stats .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 620px) { .features, .products { grid-template-columns: 1fr; } .section { padding: 80px 0; } }
  `,
})
export class Home {
  protected openFaq = signal(0);
  protected featured = PRODUCTS.slice(0, 3);

  protected stats = [
    { value: '160 km', label: 'autonomia máxima' },
    { value: '60 km/h', label: 'velocidade máxima' },
    { value: '0 g', label: 'de emissão de CO₂' },
    
  ];

  private sanitizer = inject(DomSanitizer);
  /** Ícones SVG estáticos definidos neste arquivo (conteúdo confiável). */
  private icon = (svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg);

  protected features = [
    { title: 'Motor de alto torque', text: 'Aceleração imediata e silenciosa, sem trocas de marcha e sem vibração.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>') },
    { title: 'Bateria de lítio removível', text: 'Carregue na tomada de casa ou do escritório. De 0 a 100% em até 4 horas.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M7 10v4M11 10v4"/></svg>') },
    { title: 'Frenagem regenerativa', text: 'Recupere energia a cada frenagem e estenda a autonomia no trânsito urbano.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>') },
    { title: 'Iluminação em LED', text: 'Farol em anel, lanterna e rodas com LED para enxergar e ser visto à noite.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>') },
    { title: 'Painel conectado', text: 'Acompanhe velocidade, carga e localização direto no painel e no aplicativo.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>') },
    { title: 'Garantia de 1 ano', text: 'Motor e bateria cobertos, com rede de assistência e peças originais.',
      icon: this.icon('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>') },
  ];

  protected faq = [
    { q: 'Preciso de CNH para pilotar?', a: 'No geral não mas depende da potência do modelo e da regulamentação local. Modelos de baixa potência podem ter regras mais simples; confira a categoria na página de cada produto. (Conteúdo demonstrativo.)' },
    { q: 'Quanto tempo leva para carregar?', a: 'A recarga é feita em tomada comum e o tempo varia conforme a bateria de cada modelo. Fale com a gente para saber o tempo de recarga do modelo que você escolher.' },
    { q: 'Qual a autonomia real?', a: 'De 45 a 60 km por carga (aproximadamente), de acordo com o modelo, o peso transportado e o relevo do trajeto.' },
    { q: 'Como funciona a entrega?', a: 'Verificar disponibilidade de frete com a loja e a bicicleta chega montada, com bateria, carregador e documentação.' },
    { q: 'Como compro ou peço um orçamento?', a: 'Clique em "Fale conosco" e converse direto com a gente pelo WhatsApp. Informaremos preços, condições de pagamento e disponibilidade.' },
  ];
}
