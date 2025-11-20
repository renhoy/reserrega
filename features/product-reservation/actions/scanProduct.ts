'use server'

/**
 * =====================================================
 * SCAN PRODUCT SERVER ACTION
 * =====================================================
 * Server action for scanning products and creating them
 * =====================================================
 */

import { requireRole } from '@/shared/auth/server'
import { createServerActionClient as createClient } from '@/lib/supabase/helpers'
import { validateQRCode } from '../lib/qr-utils'
import { normalizeBarcode, validateProductData, calculatePaymentSplit } from '../lib/product-utils'
import type {
  ScanQRRequest,
  ScanQRResponse,
  ScanProductRequest,
  ScanProductResponse,
  CreateProductData,
} from '../types/reservation.types'

/**
 * Scan and validate QR code
 *
 * @param request - QR data to validate
 * @returns Validation result with user info
 */
export async function scanQRAction(request: ScanQRRequest): Promise<ScanQRResponse> {
  // Require comercial role
  await requireRole('comercial')

  // Validate QR
  const validation = validateQRCode(request.qrData)

  if (!validation.valid) {
    return {
      valid: false,
      reason: validation.reason,
    }
  }

  return {
    valid: true,
    userId: validation.userId!,
    username: validation.username,
  }
}

/**
 * Scan product barcode and create/find product
 *
 * @param request - Barcode and user/store info
 * @returns Product ID and details
 */
export async function scanProductAction(request: ScanProductRequest): Promise<ScanProductResponse> {
  // Require comercial role
  const comercial = await requireRole('comercial')

  // Validate barcode
  const barcode = normalizeBarcode(request.barcode)

  if (!barcode) {
    throw new Error('Código de barras inválido')
  }

  const supabase = await createClient()

  // Check if product already exists with this barcode at this store
  const { data: existingProduct } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .eq('store_id', request.storeId)
    .single()

  if (existingProduct) {
    return {
      productId: existingProduct.id,
      product: {
        id: existingProduct.id,
        storeId: existingProduct.store_id,
        barcode: existingProduct.barcode,
        name: existingProduct.name,
        description: existingProduct.description,
        brand: existingProduct.brand,
        size: existingProduct.size,
        color: existingProduct.color,
        price: parseFloat(existingProduct.price),
        imageUrl: existingProduct.image_url,
        category: existingProduct.category,
        createdAt: existingProduct.created_at,
        updatedAt: existingProduct.updated_at,
      },
      isNewProduct: false,
    }
  }

  // Product doesn't exist, we need to create it
  // This will be handled by the client with a form
  // Return a special response indicating product needs to be created
  throw new Error('PRODUCT_NOT_FOUND')
}

/**
 * Create new product
 *
 * @param productData - Product information
 * @returns Created product
 */
export async function createProductAction(productData: CreateProductData): Promise<ScanProductResponse> {
  // Require comercial role
  await requireRole('comercial')

  // Validate product data
  const validation = validateProductData({
    barcode: productData.barcode,
    name: productData.name,
    size: productData.size,
    color: productData.color,
    price: productData.price,
  })

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '))
  }

  const supabase = await createClient()

  // Insert product
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      store_id: productData.storeId,
      barcode: productData.barcode,
      name: productData.name,
      description: productData.description || null,
      brand: productData.brand || null,
      size: productData.size,
      color: productData.color,
      price: productData.price,
      image_url: productData.imageUrl || null,
      category: productData.category || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[createProductAction] Error creating product:', error)
    throw new Error('Error al crear el producto')
  }

  return {
    productId: product.id,
    product: {
      id: product.id,
      storeId: product.store_id,
      barcode: product.barcode,
      name: product.name,
      description: product.description,
      brand: product.brand,
      size: product.size,
      color: product.color,
      price: parseFloat(product.price),
      imageUrl: product.image_url,
      category: product.category,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    },
    isNewProduct: true,
  }
}

/**
 * Link product to user (create temporary link for reservation)
 *
 * @param userId - User ID
 * @param productId - Product ID
 * @returns Success status
 */
export async function linkProductToUserAction(
  userId: string,
  productId: string
): Promise<{ success: boolean; linkId: string }> {
  // Require comercial role
  await requireRole('comercial')

  // Store temporary link in localStorage or session
  // This will be used when the user completes the reservation form
  const linkId = `${userId}-${productId}-${Date.now()}`

  return {
    success: true,
    linkId,
  }
}
