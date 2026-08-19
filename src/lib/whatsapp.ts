import { InventoryItem, Seller } from '../types';

/**
 * Normalizes phone numbers for WhatsApp deep links (wa.me)
 * Handles South African local prefixes (e.g., 082 123 4567 -> 27821234567)
 */
export function formatWhatsappPhoneNumber(phone: string): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');

  // If local South African format starting with 0
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '27' + digits.slice(1);
  }

  return digits;
}

/**
 * Generates a pre-filled WhatsApp deep link URL with item metadata and inquiry template
 */
export function generateWhatsappInquiryUrl(item: InventoryItem, seller?: Seller): string {
  const phone = seller?.whatsapp || item.sellerWhatsapp || seller?.phone || item.sellerPhone || '27820000000';
  const cleanPhone = formatWhatsappPhoneNumber(phone);

  const formattedPrice = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0
  }).format(item.priceZar);

  const contactName = seller?.contactName || 'Sales Desk';
  const companyName = seller?.companyName || item.sellerName;
  const conditionLabel = item.condition.replace(/_/g, ' ').toUpperCase();
  const partNumberLine = item.partNumber ? `\n• *Part/OEM No:* ${item.partNumber}` : '';
  const vehicleLine = `${item.make} ${item.model}${item.year ? ` (${item.year})` : ''}`;

  const message =
`*PART INQUIRY | Part-Smart ZA*

Hello ${contactName} (${companyName}),

I found your listing on the *Part-Smart.ZA* marketplace and would like to inquire about:

📦 *Part:* ${item.title}
💰 *Price:* ${formattedPrice}
🚜 *Vehicle/Machinery:* ${vehicleLine}
🏷️ *Condition:* ${conditionLabel}${partNumberLine}
📍 *Location:* ${item.city}, ${item.province}

Please confirm:
1. Is this item currently in stock and available?
2. What are the collection or courier dispatch options to my area?

Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
