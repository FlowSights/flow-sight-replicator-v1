export interface GeneratedAd {
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  imageUrls?: string[];
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  type: 'Offer' | 'Emotional' | 'Urgency';
  score: number;
  platformUrl: string;
  businessName?: string;
  websiteUrl?: string;
  reasoning?: string;
}
