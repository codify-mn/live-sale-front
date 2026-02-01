import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export interface LiveSale {
  id: number
  title: string
  description: string
  page_id: number
  page: FacebookPage
  shop_id: number
  shop: Shop
  ref_id: string
  stream_url: string
  platform: Platform
  views: number
  likes: number
  status: string
  created_at: string
  updated_at: string
  comments: LiveSaleComment[]
  products: LiveSaleProduct[]
}

export interface LiveSaleProduct {
  id: number
  live_sale_id: number
  product_id: number
  keyword: string
  product: Product
}
