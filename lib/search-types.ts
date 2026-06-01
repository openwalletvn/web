export interface SearchCard {
  id: string
  name: string
  bank_id: string
  bank_name: string
  card_type: string[]
  card_network: string
  image_url: string
  is_vertical: boolean
  url: string
}

export interface SearchBank {
  id: string
  name: string
  full_name: string
  logo_url: string
  url: string
}

export interface SearchPost {
  slug: string
  title: string
  description: string
  category: string
  url: string
}

export interface SearchIndex {
  cards: SearchCard[]
  banks: SearchBank[]
  posts: SearchPost[]
}
