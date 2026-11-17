import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { contactLink } from '../data/contact';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container grid">
        <div class="brand">
          <span class="logo placa">Voltride</span>
          <p>
            Voltride é uma marca fictícia, criada como peça de portfólio sobre mobilidade elétrica.
            Fotos e vídeo gerados com IA.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <a routerLink="/loja">Todos os modelos</a>
          <a routerLink="/" fragment="linhas">Linhas</a>
          <a routerLink="/" fragment="duvidas">Dúvidas</a>
        </nav>
        <div class="hire">
          <p>Gostou deste site?</p>
          <a class="btn btn-meiofio" [href]="hire" target="_blank" rel="noopener">
            Quero um site assim
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: `
    footer {
      background: var(--ink);
      color: var(--paper);
      padding: 64px 0 56px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 40px;
      align-items: start;
    }
    .logo {
      display: inline-block;
      padding: 9px 16px 6px;
      font-weight: 900;
      font-size: 1.15rem;
      margin-bottom: 16px;
    }
    .brand p {
      color: #b9bdb3;
      max-width: 42ch;
      font-size: 0.95rem;
    }
    nav {
      display: grid;
      gap: 4px;
      a {
        width: fit-content;
        padding: 6px 0 3px;
        font-weight: 700;
        border-bottom: 2px solid transparent;
        &:hover {
          border-color: var(--yellow);
        }
      }
    }
    .hire {
      display: grid;
      gap: 12px;
      justify-items: start;
      p {
        font-weight: 700;
        font-size: 1.2rem;
      }
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Footer {
  protected readonly hire = contactLink(
    'Olá! Vi o projeto Voltride e quero conversar sobre um site para o meu negócio.',
  );
}
