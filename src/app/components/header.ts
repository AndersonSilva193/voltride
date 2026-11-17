import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { contactLink } from '../data/contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header [class.menu]="menu()">
      <div class="container bar">
        <a routerLink="/" class="logo placa" aria-label="Voltride, início" (click)="menu.set(false)">
          Voltride
        </a>

        <nav
          id="main-navigation"
          [class.open]="menu()"
          [attr.inert]="menu() ? null : mobile() ? '' : null"
        >
          <a routerLink="/loja" routerLinkActive="active" (click)="menu.set(false)">Modelos</a>
          <a routerLink="/" fragment="linhas" (click)="menu.set(false)">Linhas</a>
          <a routerLink="/" fragment="duvidas" (click)="menu.set(false)">Dúvidas</a>
        </nav>

        <div class="actions">
          <a class="btn btn-meiofio contact" [href]="contact" target="_blank" rel="noopener">
            Fale conosco
          </a>
          <button
            class="burger"
            (click)="menu.set(!menu())"
            [attr.aria-label]="menu() ? 'Fechar menu' : 'Abrir menu'"
            aria-controls="main-navigation"
            [attr.aria-expanded]="menu()"
          >
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: `
    header {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 100;
      height: var(--header-h);
      background: var(--paper);
      border-bottom: 2px solid var(--ink);
    }
    .bar {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      padding: 9px 16px 6px;
      font-weight: 900;
      font-size: 1.15rem;
      letter-spacing: 0.01em;
    }
    nav {
      display: flex;
      gap: 28px;
      margin-right: auto;
      a {
        font-weight: 700;
        padding: 6px 0 3px;
        border-bottom: 3px solid transparent;
        transition: border-color 0.18s;
        &:hover {
          border-color: var(--line);
        }
        &.active {
          border-color: var(--yellow);
        }
      }
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .contact {
      white-space: nowrap;
      min-height: 42px;
      padding: 10px 18px 8px;
    }
    .burger {
      display: none;
      background: none;
      border: 0;
      width: 44px;
      height: 44px;
      position: relative;
      span {
        position: absolute;
        left: 11px;
        right: 11px;
        height: 3px;
        background: var(--ink);
        transition: transform 0.25s var(--ease);
        &:first-child {
          top: 16px;
        }
        &:last-child {
          top: 25px;
        }
      }
    }
    .menu .burger span:first-child {
      transform: translateY(4.5px) rotate(45deg);
    }
    .menu .burger span:last-child {
      transform: translateY(-4.5px) rotate(-45deg);
    }
    @media (max-width: 760px) {
      .bar {
        gap: 10px;
        justify-content: space-between;
      }
      .logo {
        font-size: 1rem;
        padding: 8px 12px 5px;
      }
      .contact {
        padding: 9px 12px 7px;
        font-size: 0.9rem;
      }
      .burger {
        display: block;
      }
      nav {
        position: fixed;
        inset: var(--header-h) 0 auto 0;
        flex-direction: column;
        gap: 0;
        margin: 0;
        background: var(--paper);
        padding: 4px 20px 20px;
        border-bottom: 2px solid var(--ink);
        transform: translateY(-8px);
        opacity: 0;
        visibility: hidden;
        transition:
          transform 0.25s var(--ease),
          opacity 0.2s,
          visibility 0.2s;
        &.open {
          transform: none;
          opacity: 1;
          visibility: visible;
        }
        a {
          padding: 16px 0 13px;
          font-size: 1.2rem;
          border-bottom: 1px solid var(--line);
        }
      }
    }
  `,
})
export class Header {
  protected readonly contact = contactLink();
  protected menu = signal(false);
  protected mobile = signal(window.innerWidth <= 760);
  @HostListener('window:resize')
  onResize() {
    this.mobile.set(window.innerWidth <= 760);
  }
  @HostListener('window:keydown.escape')
  closeMenu() {
    this.menu.set(false);
  }
}
