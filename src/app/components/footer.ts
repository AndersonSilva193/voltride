import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container grid">
        <div>
          <div class="logo">VOLT<b>RIDE</b></div>
          <p class="muted">
            Volt Ride é uma marca fictícia criada como peça de portfólio sobre mobilidade elétrica.
          </p>
        </div>
        <div>
          <h4>Catálogo</h4>
          <a routerLink="/loja">Modelos</a>
          <a routerLink="/produto/dropp-joy-city">Dropp Joy City</a>
          <a routerLink="/produto/capuccino-1000w">Capuccino 1000W</a>
        </div>
        <div>
          <h4>O projeto</h4>
          <a routerLink="/" fragment="tecnologia">Conceito</a>
          <a routerLink="/" fragment="faq">Dúvidas frequentes</a>
        </div>
      </div>
    </footer>
  `,
  styles: `
    footer {
      border-top: 1px solid var(--line);
      background: var(--bg-2);
      padding: 70px 0 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 40px;
    }
    .logo {
      font-family: var(--font-display);
      letter-spacing: 0.18em;
      font-weight: 700;
      margin-bottom: 14px;
      b {
        color: var(--green);
      }
    }
    h4 {
      font-size: 0.8rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: var(--green);
    }
    a {
      display: block;
      color: var(--muted);
      padding: 5px 0;
      transition: color 0.2s;
      &:hover {
        color: var(--text);
      }
    }
    .muted {
      color: var(--muted);
      font-size: 0.92rem;
    }
    .copy {
      margin-top: 50px;
      padding-top: 22px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 0.85rem;
    }
    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
})
export class Footer {}
