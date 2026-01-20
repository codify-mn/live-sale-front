export interface Product {
  id: number
  shop_id: number
  name: string
  description: string
  status: 'draft' | 'active' | 'out_of_stock' | 'archived'
  base_price: number
  sale_price: number | null
  images: string[]
  category: string
  tags: string[]
  track_inventory: boolean
  has_variants: boolean
  search_keywords: string
  variants: ProductVariant[]
  inventory: Inventory | null
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  shop_id: number
  sku: string             // Required - used for live selling SKU matching
  barcode: string | null
  name: string
  options: Record<string, string>
  price: number | null    // Base price override for this variant
  sale_price: number | null // Discounted price for this variant
  images: string[]        // Variant-specific images
  stock_quantity: number
  low_stock_alert: number
  is_active: boolean
}

export interface Inventory {
  id: number
  product_id: number
  shop_id: number
  sku: string
  barcode: string
  stock_quantity: number
  low_stock_alert: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
}

export interface ProductFilter {
  keyword?: string
  category?: string
  status?: string
  page?: number
  size?: number
}

export interface CreateProductInput {
  name: string
  description?: string
  base_price: number
  sale_price?: number | null
  category?: string
  images?: string[]
  tags?: string[]
  track_inventory?: boolean
  has_variants?: boolean
  status?: string
}

export interface CreateVariantInput {
  name: string
  sku: string             // Required for live selling
  barcode?: string | null
  options?: Record<string, string>
  price?: number | null
  sale_price?: number | null
  images?: string[]
  stock_quantity: number
  low_stock_alert?: number
}

export interface UpdateVariantInput {
  name?: string
  sku?: string
  barcode?: string | null
  price?: number | null
  sale_price?: number | null
  images?: string[]
  stock_quantity?: number
  low_stock_alert?: number
}

export function useProducts() {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const fetchProducts = async (filter: ProductFilter = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams()
    if (filter.keyword) params.set('keyword', filter.keyword)
    if (filter.category) params.set('category', filter.category)
    if (filter.status) params.set('status', filter.status)
    if (filter.page) params.set('page', filter.page.toString())
    if (filter.size) params.set('size', filter.size.toString())

    const query = params.toString()
    const url = `${apiUrl}/api/products${query ? `?${query}` : ''}`

    return await $fetch<ProductsResponse>(url, {
      credentials: 'include'
    })
  }

  const fetchProduct = async (id: number): Promise<Product> => {
    return await $fetch<Product>(`${apiUrl}/api/products/${id}`, {
      credentials: 'include'
    })
  }

  const createProduct = async (data: CreateProductInput): Promise<Product> => {
    return await $fetch<Product>(`${apiUrl}/api/products`, {
      method: 'POST',
      credentials: 'include',
      body: data
    })
  }

  const updateProduct = async (id: number, data: Partial<CreateProductInput>): Promise<Product> => {
    return await $fetch<Product>(`${apiUrl}/api/products/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }

  const deleteProduct = async (id: number): Promise<void> => {
    await $fetch(`${apiUrl}/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  const fetchCategories = async (): Promise<string[]> => {
    return await $fetch<string[]>(`${apiUrl}/api/products/categories`, {
      credentials: 'include'
    })
  }

  const createVariant = async (productId: number, data: CreateVariantInput): Promise<ProductVariant> => {
    return await $fetch<ProductVariant>(`${apiUrl}/api/products/${productId}/variants`, {
      method: 'POST',
      credentials: 'include',
      body: data
    })
  }

  const updateVariant = async (variantId: number, data: UpdateVariantInput): Promise<ProductVariant> => {
    return await $fetch<ProductVariant>(`${apiUrl}/api/variants/${variantId}`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }

  const deleteVariant = async (variantId: number): Promise<void> => {
    await $fetch(`${apiUrl}/api/variants/${variantId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  const updateVariantStock = async (variantId: number, adjustment: number): Promise<ProductVariant> => {
    return await $fetch<ProductVariant>(`${apiUrl}/api/variants/${variantId}/stock`, {
      method: 'PATCH',
      credentials: 'include',
      body: { adjustment }
    })
  }

  const updateInventory = async (productId: number, data: Partial<Inventory>): Promise<Inventory> => {
    return await $fetch<Inventory>(`${apiUrl}/api/products/${productId}/inventory`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    createVariant,
    updateVariant,
    deleteVariant,
    updateVariantStock,
    updateInventory
  }
}
