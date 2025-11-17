/**
 * =====================================================
 * COMMON TYPES
 * =====================================================
 * Shared TypeScript types and interfaces
 * =====================================================
 */

// ==================== UTILITY TYPES ====================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Extract array element type
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * Make all properties nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ==================== API TYPES ====================

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * API Error
 */
export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

// ==================== FORM TYPES ====================

/**
 * Form field error
 */
export interface FieldError {
  field: string
  message: string
}

/**
 * Form state
 */
export interface FormState<T> {
  values: T
  errors: Record<keyof T, string | undefined>
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
}

/**
 * Select option
 */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  icon?: React.ReactNode
}

// ==================== UI TYPES ====================

/**
 * Size variants
 */
export type Size = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Variant types
 */
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

/**
 * Status types
 */
export type Status = 'pending' | 'active' | 'inactive' | 'completed' | 'cancelled'

/**
 * Alert types
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error'

/**
 * Modal sizes
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

// ==================== DATA TYPES ====================

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort config
 */
export interface SortConfig<T = string> {
  field: T
  direction: SortDirection
}

/**
 * Filter config
 */
export interface FilterConfig {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}

/**
 * Search params
 */
export interface SearchParams {
  query?: string
  page?: number
  pageSize?: number
  sort?: SortConfig
  filters?: FilterConfig[]
}

// ==================== FILE TYPES ====================

/**
 * File upload
 */
export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

/**
 * Uploaded file
 */
export interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
  uploadedAt: string
}

// ==================== TABLE TYPES ====================

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

/**
 * Table action
 */
export interface TableAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  disabled?: (row: T) => boolean
  variant?: Variant
}

// ==================== ADDRESS TYPES ====================

/**
 * Address
 */
export interface Address {
  street: string
  number?: string
  floor?: string
  door?: string
  postalCode: string
  city: string
  province: string
  country: string
}

// ==================== CONTACT TYPES ====================

/**
 * Contact info
 */
export interface ContactInfo {
  email?: string
  phone?: string
  mobile?: string
  website?: string
}

// ==================== METADATA TYPES ====================

/**
 * Entity with timestamps
 */
export interface Timestamps {
  createdAt: string
  updatedAt: string
}

/**
 * Entity with soft delete
 */
export interface SoftDelete {
  deletedAt: string | null
}

/**
 * Full metadata
 */
export interface EntityMetadata extends Timestamps, SoftDelete {
  createdBy?: string
  updatedBy?: string
  deletedBy?: string
}

// ==================== NOTIFICATION TYPES ====================

/**
 * Notification
 */
export interface Notification {
  id: string
  type: AlertType
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  actionLabel?: string
}

// ==================== STATS TYPES ====================

/**
 * Stat card data
 */
export interface StatCard {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

// ==================== CHART TYPES ====================

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string
  value: number
}

// ==================== ENUMS ====================

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Delivery status
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

/**
 * Visibility
 */
export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only',
}
