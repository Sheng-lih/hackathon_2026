import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { Activity, DayPlan, Itinerary, TripPreferences } from "@/types";

const itineraryJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["tripName", "totalEstimatedCost", "dailyPlans"],
  properties: {
    tripName: { type: "string" },
    totalEstimatedCost: { type: "number" },
    dailyPlans: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dayNumber", "activities"],
        properties: {
          dayNumber: { type: "integer" },
          date: { type: "string" },
          activities: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "timeSlot",
                "title",
                "description",
                "cost",
                "location",
                "type",
                "fatigueScore",
              ],
              properties: {
                id: { type: "string" },
                timeSlot: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                cost: { type: "number" },
                location: { type: "string" },
                type: { type: "string", enum: ["indoor", "outdoor", "food"] },
                fatigueScore: { type: "integer", minimum: 1, maximum: 5 },
              },
            },
          },
        },
      },
    },
  },
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  let body: { preferences?: TripPreferences; groupSize?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const preferences = body.preferences;
  if (!preferences?.destination) {
    return NextResponse.json(
      { error: "Trip preferences with a destination are required." },
      { status: 400 },
    );
  }

  const groupSize = body.groupSize ?? (preferences.travelerType === "solo" ? 1 : 2);
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert travel planner. Create a realistic, day-by-day itinerary.

Trip preferences (JSON):
${JSON.stringify(preferences, null, 2)}

Group size: ${groupSize}

Rules:
- Return only JSON that matches the Itinerary object (tripName, totalEstimatedCost, dailyPlans).
- dailyPlans length must equal durationDays (${preferences.durationDays}).
- Each day needs 3–5 activities with unique ids, timeSlot like "10:00 AM", cost in USD, location, type of indoor | outdoor | food, and fatigueScore 1–5.
- Honor totalBudget (${preferences.totalBudget} USD), pace (${preferences.pace}), travelerType (${preferences.travelerType}), and dietaryRestrictions.
- totalEstimatedCost must equal the sum of all activity costs and stay within budget when possible.
- Mix indoor/outdoor/food based on destination and pace. Packed means more activities and higher fatigue; relaxed means fewer, lighter days.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: itineraryJsonSchema,
      },
    });

    const itinerary = parseItinerary(response.text);
    if (!itinerary) {
      return NextResponse.json(
        { error: "Gemini returned an itinerary that could not be parsed." },
        { status: 502 },
      );
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate itinerary.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function parseItinerary(raw: string | undefined): Itinerary | null {
  if (!raw) return null;

  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/u, "");
  try {
    return asItinerary(JSON.parse(trimmed));
  } catch {
    return null;
  }
}

function asItinerary(value: unknown): Itinerary | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Itinerary>;
  if (typeof candidate.tripName !== "string") return null;
  if (typeof candidate.totalEstimatedCost !== "number") return null;
  if (!Array.isArray(candidate.dailyPlans)) return null;

  const dailyPlans: DayPlan[] = [];
  for (const day of candidate.dailyPlans) {
    if (!day || typeof day !== "object" || !Array.isArray(day.activities)) {
      return null;
    }
    const activities: Activity[] = [];
    for (const activity of day.activities) {
      if (!isActivity(activity)) return null;
      activities.push(activity);
    }
    dailyPlans.push({
      dayNumber: Number(day.dayNumber),
      date: typeof day.date === "string" ? day.date : undefined,
      activities,
    });
  }

  return {
    tripName: candidate.tripName,
    totalEstimatedCost: candidate.totalEstimatedCost,
    dailyPlans,
  };
}

function isActivity(value: unknown): value is Activity {
  if (!value || typeof value !== "object") return false;
  const activity = value as Activity;
  return (
    typeof activity.id === "string" &&
    typeof activity.timeSlot === "string" &&
    typeof activity.title === "string" &&
    typeof activity.description === "string" &&
    typeof activity.cost === "number" &&
    typeof activity.location === "string" &&
    (activity.type === "indoor" ||
      activity.type === "outdoor" ||
      activity.type === "food") &&
    typeof activity.fatigueScore === "number"
  );
}
