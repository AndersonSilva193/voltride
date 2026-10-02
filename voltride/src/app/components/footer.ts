import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container grid">
        <div>
          <div class="logo">VOLT<b>RIDE</b></div>
          <p class="muted">Mobilidade elétrica com design, potência e zero emissão. Projeto demonstrativo.</p>
        </div>
        <div>
          <h4>Loja</h4>
          <a routerLink="/loja">Todas as motos</a>
          <a routerLink="/produto/volt-one">Volt One</a>
          <a routerLink="/produto/volt-pro">Volt Pro</a>
        </div>
        <div>
          <h4>Empresa</h4>
          <a routerLink="/" fragment="tecnologia">Tecnologia</a>
          <a routerLink="/" fragment="faq">Dúvidas frequentes</a>
        </div>
        <form class="news" (submit)="$event.preventDefault(); subscribe(email.value); email.value = ''" #f>
          <h4>Novidades</h4>
          <p class="muted">Receba lançamentos e ofertas.</p>
          <div class="row">
            <input #email type="email" required placeholder="seu@email.com" aria-label="E-mail" />
            <button class="btn btn-primary" type="submit">Assinar</button>
          </div>
          @if (done()) { <small class="ok">Inscrição confirmada. Obrigado!</small> }
        </form>
      </div>
      <div class="container copy">© 2026 Voltride — atendimento e vendas pela Moto Peças.</div>
    </footer>
  `,
  styles: `
    footer { border-top: 1px solid var(--line); background: var(--bg-2); padding: 70px 0 28px; }
    .grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.6fr; gap: 40px; }
    .logo { font-family: var(--font-display); letter-spacing: .18em; font-weight: 700; margin-bottom: 14px; b { color: var(--green); } }
    h4 { font-size: .8rem; letter-spacing: .25em; text-transform: uppercase; margin-bottom: 16px; color: var(--green); }
    a { display: block; color: var(--muted); padding: 5px 0; transition: color .2s; &:hover { color: var(--text); } }
    .muted { color: var(--muted); font-size: .92rem; }
    .row { display: flex; gap: 10px; margin-top: 14px; input { min-width: 0; } .btn { padding: 12px 20px; } }
    .ok { color: var(--green); display: block; margin-top: 10px; }
    .copy { margin-top: 50px; padding-top: 22px; border-top: 1px solid var(--line); color: var(--muted); font-size: .85rem; }
    @media (max-width: 860px) { .grid { grid-template-columns: 1fr 1fr; } .news { grid-column: 1 / -1; } }
  `,
})
export class Footer {
  protected done = signal(false);
  subscribe(value: string) {
    if (value.includes('@')) { this.done.set(true); setTimeout(() => this.done.set(false), 4000); }
  }
}
