/**
 * Desenha uma sequência de frames num canvas a partir de uma posição contínua (0..n-1).
 * - "cover" com ponto focal horizontal, para o sujeito não sair do quadro em telas estreitas;
 * - mistura o frame seguinte pela fração da posição (time-lapse suave com poucos frames);
 * - carrega em duas passadas: frame 0, um a cada 8, depois o resto, em lotes de 6;
 * - frame que falhou é coberto pelo vizinho carregado mais próximo.
 */
export class FrameScrub {
  private readonly g: CanvasRenderingContext2D;
  private readonly imgs: (HTMLImageElement | undefined)[];
  private pos = 0;
  private drawn = -1;
  private disposed = false;
  private loadedCount = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly urls: string[],
    private readonly focusX = 0.5,
    private readonly onFirstFrame?: (ok: boolean) => void,
  ) {
    this.g = canvas.getContext('2d', { alpha: false })!;
    this.imgs = new Array(urls.length);
    this.resize();
    void this.loadAll();
  }

  get ready() {
    return this.loadedCount > 0;
  }

  /** posição em frames, contínua: 12.4 = 60% do 12 + 40% do 13 */
  set(position: number) {
    this.pos = Math.min(this.urls.length - 1, Math.max(0, position));
    this.draw();
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (w && h && (w !== this.canvas.width || h !== this.canvas.height)) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.draw(true);
  }

  dispose() {
    this.disposed = true;
  }

  private nearest(i: number) {
    for (let d = 0; d < this.urls.length; d++) {
      if (this.imgs[i - d]) return i - d;
      if (this.imgs[i + d]) return i + d;
    }
    return -1;
  }

  private paint(im: HTMLImageElement, alpha: number) {
    const { width: cw, height: ch } = this.canvas;
    const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s;
    const h = im.naturalHeight * s;
    const x = (cw - w) * this.focusX;
    this.g.globalAlpha = alpha;
    this.g.drawImage(im, x, (ch - h) / 2, w, h);
  }

  private draw(force = false) {
    if (this.disposed || !this.canvas.width) return;
    const base = Math.floor(this.pos);
    const frac = this.pos - base;
    const a = this.nearest(base);
    if (a < 0) return;
    const key = a + (this.imgs[base + 1] ? frac : 0);
    if (!force && key === this.drawn) return;
    this.paint(this.imgs[a]!, 1);
    const next = this.imgs[base + 1];
    if (a === base && next && frac > 0.01) this.paint(next, frac);
    this.g.globalAlpha = 1;
    this.drawn = key;
  }

  private load(i: number) {
    return new Promise<void>((resolve) => {
      if (this.imgs[i] || this.disposed) return resolve();
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => {
        this.imgs[i] = im;
        this.loadedCount++;
        this.draw(true);
        resolve();
      };
      im.onerror = () => resolve();
      im.src = this.urls[i];
    });
  }

  private async batch(ids: number[], size = 6) {
    for (let k = 0; k < ids.length && !this.disposed; k += size) {
      await Promise.all(ids.slice(k, k + size).map((i) => this.load(i)));
    }
  }

  private async loadAll() {
    await this.load(0);
    this.onFirstFrame?.(!!this.imgs[0]);
    if (!this.imgs[0]) return;
    const all = this.urls.map((_, i) => i);
    await this.batch(all.filter((i) => i % 8 === 0));
    await this.batch(all);
  }
}
