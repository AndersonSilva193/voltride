/** Larguras geradas para as fotos de catálogo (a origem tem 1024 px; não ampliamos além disso). */
export const CATALOG_WIDTHS = [480, 768, 1024] as const;

export function imageSources(src: string): string {
  const base = src.replace(/-\d+\.webp$/, '');
  return CATALOG_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}
