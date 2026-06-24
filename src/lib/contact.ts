// Single source of truth for the project's WhatsApp contact link.
// Digits only, full international format, no "+" or spaces (wa.me requirement).
// TODO: replace with the project's real number.
export const WHATSAPP_NUMBER = "5491100000000";

/** Build a wa.me link with an optional pre-filled message. */
export function whatsappHref(
  message = "Hello, I'd like more information about the ZEDAS Project.",
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
