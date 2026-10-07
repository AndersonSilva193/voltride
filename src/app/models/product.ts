export type Category = 'urbana' | 'performance';

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
  rating?: number;
  reviews?: number;
  images: string[];
  focus: string;
  description: string;
  colors: ProductColor[];
  specs: {
    range: number;
    power: number;
    /** Campos abaixo só aparecem quando informados. */
    topSpeed?: number;
    battery?: string;
    charge?: string;
    weight?: number;
    load?: number;
  };
}
