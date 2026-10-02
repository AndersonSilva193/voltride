import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/** Adiciona a classe `in` quando o elemento entra na viewport. */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class Reveal implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;

  ngOnInit() {
    this.io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { this.el.classList.add('in'); this.io?.disconnect(); }
      },
      { threshold: 0.12 },
    );
    this.io.observe(this.el);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}
