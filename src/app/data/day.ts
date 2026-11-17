/**
 * Roteiro do hero: um dia de bairro com a Capuccino 1000W.
 * Horários e km são ILUSTRATIVOS (a tela diz isso). A autonomia vem do catálogo (referência).
 */
export interface DayStop {
  id: string;
  place: string;
  /** Frase curta, um verbo: é o que aparece grande na cena. */
  line: string;
  /** minutos desde 00:00 */
  min: number;
  km: number;
  /** posição no mini-mapa (viewBox 320 x 200) */
  x: number;
  y: number;
}

export const DAY_STOPS: DayStop[] = [
  { id: 'casa', place: 'Casa', line: 'Sai de casa.', min: 7 * 60 + 30, km: 0, x: 40, y: 160 },
  { id: 'padaria', place: 'Padaria', line: 'Passa na padaria.', min: 7 * 60 + 48, km: 1.2, x: 100, y: 160 },
  { id: 'trabalho', place: 'Trabalho', line: 'Chega no trabalho.', min: 8 * 60 + 20, km: 6.8, x: 260, y: 40 },
  { id: 'mercado', place: 'Mercado', line: 'Resolve o almoço.', min: 12 * 60 + 40, km: 8.9, x: 280, y: 130 },
  { id: 'feira', place: 'Feira', line: 'Volta pela feira.', min: 17 * 60 + 10, km: 13.7, x: 160, y: 130 },
  { id: 'tomada', place: 'Casa', line: 'Liga na tomada.', min: 18 * 60, km: 19.6, x: 40, y: 160 },
];

/** Trajeto pelas ruas do mini-mapa (só segmentos retos), passando pelas paradas na ordem. */
export const ROUTE_POINTS: [number, number][] = [
  [40, 160], [100, 160], [100, 100], [200, 100], [200, 40], [260, 40],
  [260, 130], [280, 130], [160, 130], [160, 160], [40, 160],
];
/** Ruas do mini-mapa (decorativas), em volta do trajeto. */
export const MAP_STREETS =
  'M10 160 H310 M10 100 H310 M10 40 H310 M10 130 H310 M40 10 V190 M100 10 V190 ' +
  'M160 10 V190 M200 10 V190 M260 10 V190 M280 10 V190';
/** Índice em ROUTE_POINTS de cada parada de DAY_STOPS. */
export const STOP_POINT = [0, 1, 5, 7, 8, 10];

export const MODEL_RANGE_KM = 60;
export const MODEL_NAME = 'Capuccino 1000W';
export const MODEL_ID = 'capuccino-1000w';

/**
 * Sequências extraídas do vídeo do hero (ver docs/storyboard.md):
 * d = desktop 1440 px, 64 frames; m = celular 720 px, 48 frames.
 * O canvas mistura dois frames vizinhos, então poucos frames bastam para um time-lapse suave.
 */
export const FRAME_SETS = { d: 64, m: 48 } as const;
export type FrameSet = keyof typeof FRAME_SETS;
export const frameUrl = (set: FrameSet, i: number) =>
  `media/hero/seq/${set}_${String(i + 1).padStart(4, '0')}.webp`;
