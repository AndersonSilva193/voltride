export const STORE_NAME = 'Moto Peças';

/** Número do WhatsApp da loja (DDI + DDD + número, só dígitos). */
export const STORE_WHATSAPP = '5541984018011';

export function contactLink(message = `Olá, ${STORE_NAME}! Gostaria de mais informações.`) {
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
