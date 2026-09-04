export interface TripPreferences {
  destination: string;
  durationDays: number;
  totalBudget: number;
  travelerType: 'solo' | 'group';
  pace: 'relaxed' | 'moderate' | 'packed';
  dietaryRestrictions: string[];
}

export interface Activity {
  id: string;
  timeSlot: string; // e.g., "10:00 AM"
  title: string;
  description: string;
  cost: number;
  location: string;
  type: 'indoor' | 'outdoor' | 'food';
  fatigueScore: number; // 1 to 5
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  activities: Activity[];
}

export interface Itinerary {
  tripName: string;
  totalEstimatedCost: number;
  dailyPlans: DayPlan[];
}