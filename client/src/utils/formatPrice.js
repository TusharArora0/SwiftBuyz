/**
 * Formats a number as a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'INR')
 * @param {string} locale - The locale to use for formatting (default: 'en-IN')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'INR', locale = 'en-IN') => {
  if (price === undefined || price === null) {
    return '₹0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `₹${price.toFixed(2)}`;
  }
}; 