import { Product, ProductColor } from '../models/product';

const NEON: ProductColor[] = [
  { name: 'Neon Esmeralda', hex: '#19e6a8', filter: 'none' },
  { name: 'Neon Ártico', hex: '#19b8ff', filter: 'hue-rotate(-38deg) saturate(1.1)' },
  { name: 'Neon Violeta', hex: '#a066ff', filter: 'hue-rotate(80deg) saturate(1.15)' },
];
const SUNSET: ProductColor[] = [
  { name: 'Neon Esmeralda', hex: '#19e6a8', filter: 'none' },
  { name: 'Neon Ártico', hex: '#19b8ff', filter: 'hue-rotate(-38deg) saturate(1.1)' },
  { name: 'Neon Magenta', hex: '#ff3d9a', filter: 'hue-rotate(140deg) saturate(1.2)' },
];

const IMG_A = 'media/start.jpg';
const IMG_B = 'media/end.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'volt-one', name: 'Volt One', tagline: 'A elétrica urbana definitiva.', category: 'urbana',
    price: 12990, oldPrice: 14490, badge: 'Mais vendida', rating: 4.9, reviews: 482,
    images: [IMG_A, IMG_B], focus: '50% 60%',
    description: 'Cesto frontal, banco com encosto e farol em anel de LED. A Volt One foi desenhada para o dia a dia da cidade: silenciosa, ágil e com custo de uso até 90% menor que uma moto a combustão.',
    colors: NEON, specs: { range: 90, topSpeed: 55, power: 1500, battery: 'Lítio 60V 30Ah', charge: '5 h', weight: 78, load: 160 },
  },
  {
    id: 'volt-s', name: 'Volt S', tagline: 'Esportiva. Silenciosa. Elétrica.', category: 'performance',
    price: 18990, badge: 'Novo', rating: 4.8, reviews: 213,
    images: [IMG_B, IMG_A], focus: '58% 62%',
    description: 'Motor de alto torque com aceleração instantânea e rodas com anéis de LED. Para quem quer chegar rápido sem fazer barulho.',
    colors: SUNSET, specs: { range: 110, topSpeed: 80, power: 3000, battery: 'Lítio 72V 40Ah', charge: '6 h', weight: 92, load: 170 },
  },
  {
    id: 'volt-cargo', name: 'Volt Cargo', tagline: 'Feita para trabalhar.', category: 'cargo',
    price: 15490, rating: 4.7, reviews: 168,
    images: [IMG_A, IMG_B], focus: '35% 55%',
    description: 'Cesto reforçado, suspensão traseira de longo curso e bateria de alta capacidade. Ideal para entregas e para quem precisa levar mais.',
    colors: NEON, specs: { range: 120, topSpeed: 50, power: 2000, battery: 'Lítio 60V 50Ah', charge: '7 h', weight: 96, load: 220 },
  },
  {
    id: 'volt-pro', name: 'Volt Pro', tagline: 'Autonomia sem ansiedade.', category: 'performance',
    price: 21990, oldPrice: 23990, badge: 'Premium', rating: 5.0, reviews: 97,
    images: [IMG_B, IMG_A], focus: '65% 55%',
    description: 'Dupla bateria removível, painel digital com app e frenagem regenerativa. A topo de linha para quem não abre mão de nada.',
    colors: SUNSET, specs: { range: 160, topSpeed: 90, power: 4000, battery: 'Lítio 72V 60Ah (x2)', charge: '4 h', weight: 104, load: 180 },
  },
  {
    id: 'volt-lite', name: 'Volt Lite', tagline: 'Seu primeiro passo elétrico.', category: 'urbana',
    price: 8990, rating: 4.6, reviews: 351,
    images: [IMG_A, IMG_B], focus: '48% 70%',
    description: 'Leve, acessível e prática: ideal para trajetos curtos e para estacionar em qualquer vaga. Verifique a regulamentação local para a categoria de potência.',
    colors: NEON, specs: { range: 60, topSpeed: 32, power: 800, battery: 'Lítio 48V 20Ah', charge: '4 h', weight: 64, load: 140 },
  },
  {
    id: 'volt-max', name: 'Volt Max', tagline: 'Para ir além da cidade.', category: 'cargo',
    price: 19490, rating: 4.8, reviews: 74,
    images: [IMG_B, IMG_A], focus: '45% 58%',
    description: 'Chassi reforçado, pneus largos e dois cestos. Estrada, entrega ou lazer: a Max encara tudo com estabilidade.',
    colors: NEON, specs: { range: 140, topSpeed: 70, power: 3500, battery: 'Lítio 72V 55Ah', charge: '6 h', weight: 110, load: 250 },
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  urbana: 'Urbana', cargo: 'Cargo', performance: 'Performance',
};
