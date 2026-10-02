import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { contactLink } from '../data/contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header [class.solid]="solid()" [class.menu]="menu()">
      <div class="container bar">
        <a routerLink="/" class="logo" aria-label="Voltride — início" (click)="menu.set(false)">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="url(#g)" />
            <defs><linearGradient id="g" x1="4" y1="2" x2="18" y2="22"><stop stop-color="#19e6a8" /><stop offset="1" stop-color="#19b8ff" /></linearGradient></defs>
          </svg>
          <span>VOLT<b>RIDE</b></span>
        </a>

        <nav [class.open]="menu()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="menu.set(false)">Início</a>
          <a routerLink="/loja" routerLinkActive="active" (click)="menu.set(false)">Loja</a>
          <a routerLink="/" fragment="tecnologia" (click)="menu.set(false)">Tecnologia</a>
          <a routerLink="/" fragment="faq" (click)="menu.set(false)">Dúvidas</a>
        </nav>

        <div class="actions">
          <a class="btn btn-primary contact" [href]="contact" target="_blank" rel="noopener">Fale conosco</a>
          <button class="burger" (click)="menu.set(!menu())" aria-label="Menu" [attr.aria-expanded]="menu()">
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: `
    header {
      position: fixed; inset: 0 0 auto 0; z-index: 100; height: var(--header-h);
      transition: background .35s, border-color .35s, backdrop-filter .35s; border-bottom: 1px solid transparent;
      &.solid, &.menu { background: rgba(4, 9, 12, .82); backdrop-filter: blur(14px); border-color: var(--line); }
    }
    .bar { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; letter-spacing: .18em; font-size: 1.05rem; b { color: var(--green); font-weight: 700; } }
    nav { display: flex; gap: 34px; a { font-size: .92rem; color: var(--muted); position: relative; transition: color .2s;
      &::after { content: ''; position: absolute; left: 0; bottom: -6px; height: 2px; width: 0; background: var(--grad); transition: width .3s; }
      &:hover, &.active { color: var(--text); &::after { width: 100%; } } } }
    .actions { display: flex; align-items: center; gap: 8px; }
    .contact { padding: 11px 22px; font-size: .9rem; }
    .burger { display: none; background: none; border: 0; width: 44px; height: 44px; position: relative;
      span { position: absolute; left: 11px; right: 11px; height: 2px; background: var(--text); transition: transform .3s; &:first-child { top: 17px; } &:last-child { top: 25px; } } }
    .menu .burger span:first-child { transform: translateY(4px) rotate(45deg); }
    .menu .burger span:last-child { transform: translateY(-4px) rotate(-45deg); }
    @media (max-width: 820px) {
      .burger { display: block; }
      nav { position: fixed; inset: var(--header-h) 0 auto 0; flex-direction: column; gap: 0; background: rgba(4, 9, 12, .96); backdrop-filter: blur(14px);
        padding: 8px 20px 24px; border-bottom: 1px solid var(--line); transform: translateY(-120%); opacity: 0; transition: transform .35s, opacity .35s; pointer-events: none;
        &.open { transform: none; opacity: 1; pointer-events: auto; }
        a { padding: 16px 0; font-size: 1.1rem; border-bottom: 1px solid var(--line); } }
    }
  `,
})
export class Header {
  protected contact = contactLink();
  protected solid = signal(false);
  protected menu = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.solid.set(window.scrollY > 40); }
}
