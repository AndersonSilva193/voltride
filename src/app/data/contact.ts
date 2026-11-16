/** Existing WhatsApp destination restored for the production-style preview. */
export const STORE_NAME = 'Volt Ride';
export const STORE_WHATSAPP = '5541984018011';

export function contactLink(message = `Olá, ${STORE_NAME}! Gostaria de mais informações.`) {
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const RESEARCH_PRICE = 'Valor de referência de pesquisa de mercado; não é oferta.';
