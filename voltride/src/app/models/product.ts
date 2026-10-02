export type Category = 'urbana' | 'cargo' | 'performance';

export interface ProductColor {
  name: string;
  hex: string;
  /** Filtro CSS aplicado na foto para simular a cor do neon. */
  filter: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  oldPrice?: number;
  badge?: string;
  rating: number;
  reviews: number;
  images: string[];
  focus: string;
  description: string;
  colors: ProductColor[];
  specs: {
    range: number;
    topSpeed: number;
    power: number;
    battery: string;
    charge: string;
    weight: number;
    load: number;
  };
}
