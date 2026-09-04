import type { Activity, Itinerary } from "@/types";

export const defaultItinerary: Itinerary = {
  tripName: "Kyoto Slow Spring",
  totalEstimatedCost: 412,
  dailyPlans: [
    {
      dayNumber: 1,
      date: "Apr 12",
      activities: [
        {
          id: "d1-1",
          timeSlot: "8:30 AM",
          title: "Nishiki Market breakfast",
          description: "Street snacks and tea tasting along the covered arcade.",
          cost: 18,
          location: "Nishiki Market",
          type: "food",
          fatigueScore: 2,
        },
        {
          id: "d1-2",
          timeSlot: "10:30 AM",
          title: "Fushimi Inari hike",
          description: "Walk the vermilion torii gates toward the upper shrine.",
          cost: 0,
          location: "Fushimi Inari Taisha",
          type: "outdoor",
          fatigueScore: 4,
        },
        {
          id: "d1-3",
          timeSlot: "2:00 PM",
          title: "Gion walking circuit",
          description: "Hanamikoji street, Yasaka Shrine, and canal-side photos.",
          cost: 8,
          location: "Gion",
          type: "outdoor",
          fatigueScore: 3,
        },
        {
          id: "d1-4",
          timeSlot: "6:30 PM",
          title: "Kaiseki dinner",
          description: "Seasonal multi-course meal in a machiya dining room.",
          cost: 85,
          location: "Pontocho",
          type: "food",
          fatigueScore: 1,
        },
      ],
    },
    {
      dayNumber: 2,
      date: "Apr 13",
      activities: [
        {
          id: "d2-1",
          timeSlot: "9:00 AM",
          title: "Arashiyama bamboo grove",
          description: "Early walk through the grove before tour groups arrive.",
          cost: 0,
          location: "Arashiyama",
          type: "outdoor",
          fatigueScore: 3,
        },
        {
          id: "d2-2",
          timeSlot: "11:30 AM",
          title: "Tenryu-ji temple & garden",
          description: "UNESCO temple with a landscaped pond garden.",
          cost: 12,
          location: "Arashiyama",
          type: "outdoor",
          fatigueScore: 2,
        },
        {
          id: "d2-3",
          timeSlot: "3:00 PM",
          title: "Kimono Forest & tram ride",
          description: "Short scenic ride plus the illuminated kimono pillars.",
          cost: 6,
          location: "Randen Station",
          type: "outdoor",
          fatigueScore: 2,
        },
        {
          id: "d2-4",
          timeSlot: "7:00 PM",
          title: "Tofu kaiseki",
          description: "Temple-style tofu courses with mountain vegetables.",
          cost: 42,
          location: "Sagano",
          type: "food",
          fatigueScore: 1,
        },
      ],
    },
    {
      dayNumber: 3,
      date: "Apr 14",
      activities: [
        {
          id: "d3-1",
          timeSlot: "9:30 AM",
          title: "Kiyomizu-dera",
          description: "Wooden terrace views over the city and hillside streets.",
          cost: 8,
          location: "Higashiyama",
          type: "outdoor",
          fatigueScore: 4,
        },
        {
          id: "d3-2",
          timeSlot: "1:00 PM",
          title: "Matcha workshop",
          description: "Whisk and taste ceremonial-grade matcha with wagashi.",
          cost: 28,
          location: "Sannenzaka",
          type: "indoor",
          fatigueScore: 1,
        },
        {
          id: "d3-3",
          timeSlot: "4:00 PM",
          title: "Philosopher’s Path",
          description: "Canal walk lined with cherry trees and small shrines.",
          cost: 0,
          location: "Sakyo",
          type: "outdoor",
          fatigueScore: 3,
        },
        {
          id: "d3-4",
          timeSlot: "7:30 PM",
          title: "Ramen counter",
          description: "Late-night tonkotsu and gyoza in a 10-seat shop.",
          cost: 16,
          location: "Kawaramachi",
          type: "food",
          fatigueScore: 1,
        },
      ],
    },
    {
      dayNumber: 4,
      date: "Apr 15",
      activities: [
        {
          id: "d4-1",
          timeSlot: "10:00 AM",
          title: "Kyoto Railway Museum",
          description: "Historic trains, simulators, and a covered observation deck.",
          cost: 15,
          location: "Umekoji",
          type: "indoor",
          fatigueScore: 2,
        },
        {
          id: "d4-2",
          timeSlot: "1:30 PM",
          title: "Nishiki cooking class",
          description: "Make dashi, pickles, and a home-style donburi.",
          cost: 65,
          location: "Central Kyoto",
          type: "indoor",
          fatigueScore: 2,
        },
        {
          id: "d4-3",
          timeSlot: "5:00 PM",
          title: "Kamo River picnic",
          description: "Golden-hour sit on the river steps with snacks.",
          cost: 12,
          location: "Kamo River",
          type: "outdoor",
          fatigueScore: 1,
        },
      ],
    },
  ],
};

const rainSwaps: Record<string, Partial<Activity>> = {
  "d1-2": {
    title: "Fushimi sake tasting hall",
    description: "Covered kura visits and flights instead of the hillside hike.",
    location: "Fushimi",
    type: "indoor",
    fatigueScore: 1,
    cost: 22,
  },
  "d1-3": {
    title: "Gion folk craft museum",
    description: "Textiles, fans, and a tea room while the streets stay wet.",
    location: "Gion",
    type: "indoor",
    fatigueScore: 1,
    cost: 10,
  },
  "d2-1": {
    title: "Arashiyama monkey park café",
    description: "Indoor seating with grove views; skip the exposed trail.",
    location: "Arashiyama",
    type: "indoor",
    fatigueScore: 1,
    cost: 8,
  },
  "d2-2": {
    title: "Tenryu-ji cloud-dragon hall",
    description: "Stay under the temple roof and view the garden from corridors.",
    location: "Arashiyama",
    type: "indoor",
    fatigueScore: 1,
  },
  "d2-3": {
    title: "Kyoto Randen tram museum",
    description: "Small indoor exhibit plus a short covered platform wait.",
    location: "Randen Station",
    type: "indoor",
    fatigueScore: 1,
    cost: 4,
  },
  "d3-1": {
    title: "Kiyomizu treasure hall",
    description: "Indoor relics and covered cloisters; skip the open terrace.",
    location: "Higashiyama",
    type: "indoor",
    fatigueScore: 2,
  },
  "d3-3": {
    title: "Eikan-do indoor galleries",
    description: "Painted screens and a quiet hall instead of the canal path.",
    location: "Sakyo",
    type: "indoor",
    fatigueScore: 1,
    cost: 10,
  },
  "d4-3": {
    title: "Nishiki covered arcade snacks",
    description: "Move the picnic indoors under the market roof.",
    location: "Nishiki Market",
    type: "food",
    fatigueScore: 1,
  },
};

function cloneItinerary(source: Itinerary): Itinerary {
  return {
    ...source,
    dailyPlans: source.dailyPlans.map((day) => ({
      ...day,
      activities: day.activities.map((activity) => ({ ...activity })),
    })),
  };
}

function withTotal(itinerary: Itinerary): Itinerary {
  const totalEstimatedCost = itinerary.dailyPlans.reduce(
    (sum, day) =>
      sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0),
    0,
  );
  return { ...itinerary, totalEstimatedCost };
}

export function buildItinerary(destination: string, durationDays: number): Itinerary {
  const source = cloneItinerary(defaultItinerary);
  const days = Math.min(Math.max(durationDays, 1), source.dailyPlans.length);
  return withTotal({
    ...source,
    tripName: `${destination} itinerary`,
    dailyPlans: source.dailyPlans.filter((day) => day.dayNumber <= days),
  });
}

export function applyRainReplan(itinerary: Itinerary): Itinerary {
  const next = cloneItinerary(itinerary);
  next.dailyPlans = next.dailyPlans.map((day) => ({
    ...day,
    activities: day.activities.map((activity) => {
      const swap = rainSwaps[activity.id];
      if (!swap && activity.type !== "outdoor") return activity;
      return { ...activity, ...swap, type: swap?.type ?? "indoor" };
    }),
  }));
  return withTotal(next);
}

export function applyFatigueReplan(itinerary: Itinerary): Itinerary {
  const next = cloneItinerary(itinerary);
  next.dailyPlans = next.dailyPlans.map((day) => ({
    ...day,
    activities: day.activities
      .filter((activity) => activity.fatigueScore < 4)
      .map((activity) =>
        activity.fatigueScore >= 3
          ? {
              ...activity,
              title: `Easy ${activity.title.toLowerCase()}`,
              description: `${activity.description} Shortened to keep energy in reserve.`,
              fatigueScore: Math.max(1, activity.fatigueScore - 2),
            }
          : activity,
      ),
  }));
  return withTotal(next);
}
