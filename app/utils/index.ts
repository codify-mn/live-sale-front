export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

/**
 * Calculate discount percentage from base price and sale price
 * @param basePrice - Original price
 * @param salePrice - Discounted price
 * @returns Discount percentage (0-100) or 0 if invalid
 */
export function calculateDiscountPercent(basePrice: number, salePrice: number): number {
  if (!basePrice || !salePrice || salePrice >= basePrice || basePrice <= 0) return 0
  return Math.round((1 - salePrice / basePrice) * 100)
}

/**
 * Calculate sale price from base price and discount percentage
 * @param basePrice - Original price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Calculated sale price or 0 if invalid
 */
export function calculateSalePrice(basePrice: number, discountPercent: number): number {
  if (!basePrice || !discountPercent || basePrice <= 0 || discountPercent <= 0 || discountPercent >= 100) return 0
  return Math.round(basePrice * (1 - discountPercent / 100))
}

/**
 * Format price for display (Mongolian Tugrik)
 * @param price - Price value
 * @returns Formatted string like "45,000"
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return ''
  return new Intl.NumberFormat('mn-MN').format(price)
}
