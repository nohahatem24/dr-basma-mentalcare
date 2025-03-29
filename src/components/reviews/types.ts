
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  isAnonymous: boolean;
  isRecommended: boolean;
  reply?: string;
}
