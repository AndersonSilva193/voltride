/** Responsive sources generated from the existing authorized photographs. */
export function imageSources(src: string): string {
  const base = src.replace('-1280.webp', '');
  return [400, 800, 1280].map((width) => base + '-' + width + '.webp ' + width + 'w').join(', ');
}
