export type SellerType = 'owner' | 'broker';

export interface Plot {
  id?: number;
  name: string;
  location: string;
  size: string;
  price: string;
  description: string;
  neighborhood_score: number;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  seller_type: SellerType;
  agency_name: string | null;
  latitude: number | null;
  longitude: number | null;
  media_urls: string[];
  aerial_view_url: string | null;
  is_verified: boolean;
  created_at?: string;
}

export interface SellFormState {
  sellerType: SellerType;
  agencyName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  parcelName: string;
  location: string;
  size: string;
  price: string;
  description: string;
  neighborhoodScore: number;
  latitude: number | null;
  longitude: number | null;
  mediaFiles: File[];
  aerialViewUrl: string;
}
