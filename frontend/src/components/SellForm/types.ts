export type SellerType = 'owner' | 'broker';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'inactive';
export type PropertyCategory = 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'other';

export interface Plot {
  id?: string;
  name: string;
  title?: string;
  location: string;
  location_name?: string;
  size: string;
  price: number;
  description: string;
  neighborhood_score: number;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  seller_id?: string | null;
  seller_type: SellerType;
  agency_name: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinates?: { x: number; y: number } | null;
  media_urls: string[];
  image_urls?: string[];
  video_url?: string | null;
  aerial_view_url: string | null;
  is_verified: boolean;
  is_featured: boolean;
  status: PropertyStatus;
  category: PropertyCategory;
  tag?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SellFormState {
  // Seller Information
  sellerType: SellerType;
  agencyName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  
  // Property Information
  parcelName: string;
  title: string;
  location: string;
  size: string;
  price: string;
  description: string;
  neighborhoodScore: number;
  category: PropertyCategory;
  tag: string;
  status: PropertyStatus;
  isFeatured: boolean;
  
  // Location
  latitude: number | null;
  longitude: number | null;
  
  // Media
  mediaFiles: File[];
  videoFile: File | null;
  videoUrl: string;
  aerialViewUrl: string;
}
