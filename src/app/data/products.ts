import { Product, ProductColor } from '../models/product';

const PRETO: ProductColor[] = [{ name: 'Preto', hex: '#1b1f24', filter: 'none' }];
const CREME: ProductColor[] = [{ name: 'Creme', hex: '#e8d8b8', filter: 'none' }];

/** As fotos têm o texto à esquerda; o foco mantém a moto no enquadramento 4:3. */
const FOCUS = '50% 50%';

export const PRODUCTS: Product[] = [
  {
    id: 'dropp-joy-city',
    name: 'Dropp Joy City',
    tagline: 'Urbana com farol redondo.',
    category: 'urbana',
    price: 3509,
    images: ['media/dropp-1280.webp'],
    focus: FOCUS,
    description:
      'Farol redondo em anel, cesta frontal e banco preto com encosto compõem sua silhueta urbana.',
    colors: PRETO,
    specs: { range: 50, power: 500 },
  },
  {
    id: 'mova-way-4',
    name: 'Mova Way 4.0',
    tagline: 'Linhas angulosas para a cidade.',
    category: 'urbana',
    price: 3450,
    images: ['media/mova_way-1280.webp'],
    focus: FOCUS,
    description:
      'O farol retangular acompanha as linhas angulosas, a cesta frontal e o banco com encosto.',
    colors: PRETO,
    specs: { range: 50, power: 500 },
  },
  {
    id: 'xplore-urban',
    name: 'Xplore Urban',
    tagline: 'Urbana com detalhes vermelhos.',
    category: 'urbana',
    price: 3329,
    images: ['media/xplore_urban-1280.webp'],
    focus: FOCUS,
    description:
      'Detalhes vermelhos destacam a carroceria preta, com farol retangular e cesta frontal.',
    colors: PRETO,
    specs: { range: 50, power: 500 },
  },
  {
    id: 'yoo-y200',
    name: 'YOO Y200',
    tagline: 'Farol redondo e linhas urbanas.',
    category: 'urbana',
    price: 3015,
    images: ['media/yoo_y200-1280.webp'],
    focus: FOCUS,
    description:
      'Farol redondo, cesta frontal e detalhes vermelhos marcam o desenho urbano em preto.',
    colors: PRETO,
    specs: { range: 50, power: 500 },
  },
  {
    id: 'wehawk-mini-scooter',
    name: 'Wehawk Mini Scooter',
    tagline: 'Silhueta compacta para a cidade.',
    category: 'urbana',
    price: 1692,
    images: ['media/wehawk-1280.webp'],
    focus: FOCUS,
    description: 'A silhueta compacta reúne farol redondo, cesta frontal e banco com encosto.',
    colors: PRETO,
    specs: { range: 45, power: 500 },
  },
  {
    id: 'lito-ft03-z',
    name: 'Lito FT03-Z',
    tagline: 'Performance em linhas angulosas.',
    category: 'performance',
    price: 6300,
    images: ['media/lito_ft03-z-1280.webp'],
    focus: FOCUS,
    description:
      'Farol retangular, linhas angulosas e detalhes vermelhos definem o visual da FT03-Z.',
    colors: PRETO,
    specs: { range: 60, power: 1000 },
  },
  {
    id: 'capuccino-1000w',
    name: 'Capuccino 1000W',
    tagline: 'Formas retrô em creme.',
    category: 'performance',
    price: 8900,
    images: ['media/Capuccino-1280.webp'],
    focus: FOCUS,
    description:
      'A carroceria creme de formas arredondadas encontra o banco caramelo e o farol redondo.',
    colors: CREME,
    specs: { range: 60, power: 1000 },
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  urbana: 'Urbana',
  performance: 'Performance',
};
