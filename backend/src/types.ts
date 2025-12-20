export interface Place {
  name: string;
  description: string;
  day: number;
}

export interface Itinerary {
  id: string;
  title: string;
  shortDescription: string;
  supportedStartingCities: string[];
  recommendedMinDays: number;
  recommendedMaxDays: number;
  approximateCostMin: number;
  approximateCostMax: number;
  interests: string[];
  distanceKmFromCity: Record<string, number>;
  timeHoursFromCity: Record<string, number>;
  places: Place[];
}

export interface QueryInput {
  city?: string;
  days?: number;
  budgetAmount?: number;
  interests?: string[];
}
