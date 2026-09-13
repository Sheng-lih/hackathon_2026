# ✈️ Roamio
**An AI travel companion that plans around the people, not just the destination—and keeps adapting after the plan is made.**

Built by Team **404founders** for the *Lifestyle Track: Planning an Escape*.

---

## 🚨 The Problem
Planning a trip today requires juggling five different apps: flights, hotels, booking platforms, maps, and generic AI chatbots. Standard platforms assume every traveler is the same person experiencing a perfect day. When a sudden downpour hits, or a group member with physical limitations experiences fatigue, static itineraries completely fall apart, leaving travelers scrambling to manually rebuild their day.

## 💡 The Solution
Roamio closes the gap between planning and reality. It replaces walls of plain AI text with **structured, dynamic itinerary cards**. By factoring in travel pace, dietary needs, budget, and physical limitations *before* the trip, Roamio generates a highly personalized journey. If reality doesn't cooperate, Roamio's closed-loop AI adapts the plan using live data and applies the changes directly to your itinerary with a single tap.

---

## ✨ Key Features
*   **Deep Personalization Survey:** Captures granular group dynamics, including physical limitations, dietary needs, budget, and preferred pace.
*   **Structured AI Generation:** Transforms Gemini API responses into actionable day-by-day cards featuring estimated costs and physical-difficulty warnings.
*   **Granular Customization:** Don't like a specific activity? Regenerate a single itinerary card without scrapping the entire day's plan.
*   **Closed-Loop Live Re-planning:** Chat directly with the AI mid-trip (e.g., "It's raining"). Roamio pulls live weather/places data, suggests contextual alternatives (like nearby indoor activities), and seamlessly swaps them into the active route.
*   **All-in-One Aggregation (Future Scope):** Merges the strengths of disparate booking sites by integrating promotions and direct bookings straight into the planned timeline.

---

## 🛠️ Tech Stack
*   **Frontend:** Next.js, React, Tailwind CSS
*   **AI Engine:** Google Gemini (Structured JSON Data)
*   **Data Integration:** Live Weather & Places Data

---

## 🚀 Running Locally

1. **Clone the repository:**
```bash 
git clone https://github.com/Sheng-Bi/hackathon_2026.git
cd hackathon_2026
```

2. **Install Dependencies**
```bash
npm install
```
3. **Configure Environment Variables**
-Create a .env.local file in the root directory: 
```bash 
touch .env.local
```
-Add your Gemini API key to .env.local
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

Finally, navigate to https://localhost:3000 in your browser of choice to view and test Roamio 
