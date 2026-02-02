/**
 * SKU (Stock Keeping Unit) generation and validation for live selling
 *
 * For live selling on Facebook, customers comment with SKU codes like:
 * "Авах SHIRT-001" - the parser extracts SKU: [A-Z0-9\-_]{3,50}
 *
 * SKU requirements:
 * - 3-50 characters
 * - Only uppercase letters, numbers, hyphens, underscores
 * - Must be unique per shop
 */

export function useSKU() {
    /**
     * Generate a SKU from product name and optional variant name
     * @param productName - Base product name
     * @param variantName - Optional variant specifics (e.g., "Улаан / XL")
     * @returns Generated SKU in format: PRODUCTNAME-VARIANT or PRODUCTNAME-XXXX
     */
    const generateSKU = (productName: string, variantName?: string): string => {
        // Clean and convert product name to uppercase alphanumeric
        const base = productName
            .toUpperCase()
            .replace(/[^A-Z0-9]/gi, '')
            .slice(0, 15)

        if (variantName) {
            // Clean variant name
            const variant = variantName
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 8)
            return `${base}-${variant}`
        }

        // Generate random suffix for products without variants
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `${base}-${random}`
    }

    /**
     * Validate SKU format for live selling compatibility
     * @param sku - SKU to validate
     * @returns true if SKU matches pattern [A-Z0-9\-_]{3,50}
     */
    const validateSKU = (sku: string): boolean => {
        if (!sku) return false
        return /^[A-Z0-9\-_]{3,50}$/.test(sku.toUpperCase())
    }

    /**
     * Format SKU to uppercase (normalize user input)
     * @param sku - Raw SKU input
     * @returns Uppercase normalized SKU
     */
    const formatSKU = (sku: string): string => {
        return sku.toUpperCase().replace(/[^A-Z0-9\-_]/g, '')
    }

    /**
     * Get validation error message for invalid SKU
     * @param sku - SKU to check
     * @returns Error message or null if valid
     */
    const getSKUError = (sku: string): string | null => {
        if (!sku) return 'SKU оруулна уу'
        if (sku.length < 3) return 'SKU хамгийн багадаа 3 тэмдэгт байх ёстой'
        if (sku.length > 50) return 'SKU хамгийн ихдээ 50 тэмдэгт байх ёстой'
        if (!/^[A-Z0-9\-_]+$/i.test(sku)) return 'SKU зөвхөн A-Z, 0-9, -, _ тэмдэгт агуулах ёстой'
        return null
    }

    return {
        generateSKU,
        validateSKU,
        formatSKU,
        getSKUError
    }
}
