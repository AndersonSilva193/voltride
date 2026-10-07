import { Product, ProductColor } from '../models/product';

const PRETO: ProductColor[] = [{ name: 'Preto', hex: '#1b1f24', filter: 'none' }];
const CREME: ProductColor[] = [{ name: 'Creme', hex: '#e8d8b8', filter: 'none' }];

/** As fotos têm o texto à esquerda; o foco mantém a moto no enquadramento 4:3. */
const FOCUS = '78% 60%';

export const PRODUCTS: Product[] = [
  {
    id: 'dropp-joy-city', name: 'Dropp Joy City', tagline: 'Clássica, prática e urbana.', category: 'urbana',
    price: 3509,
    images: ['media/dropp.jpeg'], focus: FOCUS,
    description: 'Farol redondo em anel de LED, cesto frontal e banco com encosto para garupa. Motor de 500 W para o dia a dia na cidade, com autonomia de até 50 km.',
    colors: PRETO, specs: { range: 50, power: 500 },
  },
  {
    id: 'mova-way-4', name: 'Mova Way 4.0', tagline: 'Design moderno para o seu trajeto.', category: 'urbana',
    price: 3450,
    images: ['media/mova_way.jpeg'], focus: FOCUS,
    description: 'Farol retangular de LED, cesto frontal e banco com encosto. Motor de 500 W e autonomia de até 50 km para ir e voltar sem preocupação.',
    colors: PRETO, specs: { range: 50, power: 500 },
  },
  {
    id: 'xplore-urban', name: 'Xplore Urban', tagline: 'Estilo esportivo na cidade.', category: 'urbana',
    price: 3329,
    images: ['media/xplore_urban.jpeg'], focus: FOCUS,
    description: 'Farol de LED, detalhes em vermelho, cesto frontal e banco com encosto. Motor de 500 W e autonomia de até 50 km.',
    colors: PRETO, specs: { range: 50, power: 500 },
  },
  {
    id: 'yoo-y200', name: 'YOO Y200', tagline: 'Leve e econômica.', category: 'urbana',
    price: 3015,
    images: ['media/yoo_y200.jpeg'], focus: FOCUS,
    description: 'Farol redondo em anel de LED, cesto frontal e banco com encosto. Motor de 350 a 500 W e autonomia de até 50 km.',
    colors: PRETO, specs: { range: 50, power: 500 },
  },
  {
    id: 'wehawk-mini-scooter', name: 'Wehawk Mini Scooter', tagline: 'Seu primeiro passo elétrico.', category: 'urbana',
    price: 1692, badge: 'Melhor preço',
    images: ['media/wehawk.jpeg'], focus: FOCUS,
    description: 'Compacta e acessível, com farol redondo de LED, cesto frontal e banco com encosto. Motor de 500 W e autonomia de até 45 km.',
    colors: PRETO, specs: { range: 45, power: 500 },
  },
  {
    id: 'lito-ft03-z', name: 'Lito FT03-Z', tagline: 'Mais potência para ir além.', category: 'performance',
    price: 6300, badge: 'Premium',
    images: ['media/lito_ft03-z.jpeg'], focus: FOCUS,
    description: 'Motor de 1.000 W, farol de LED, cesto frontal e banco com encosto. Mais força nas subidas e autonomia de até 60 km.',
    colors: PRETO, specs: { range: 60, power: 1000 },
  },
  {
    id: 'capuccino-1000w', name: 'Capuccino 1000W', tagline: 'Moto scooter com charme retrô.', category: 'performance',
    price: 8900, badge: 'Premium',
    images: ['media/Capuccino.jpeg'], focus: FOCUS,
    description: 'Moto scooter bicicleta elétrica com visual retrô, acabamento creme, banco caramelo com encosto e farol redondo de LED. Motor de 1.000 W e autonomia de até 60 km.',
    colors: CREME, specs: { range: 60, power: 1000 },
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  urbana: 'Urbana', performance: 'Performance',
};
