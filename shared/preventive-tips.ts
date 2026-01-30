import type { PreventiveTip, DoshaType, WellnessScoreRange } from "./schema";

// Comprehensive preventive tip database organized by dosha and wellness score
export const preventiveTips: PreventiveTip[] = [
  // VATA - Low Wellness Score (needs more support)
  {
    id: "vata-low-lifestyle-1",
    category: "lifestyle",
    dosha: "vata",
    scoreRange: "low",
    title: "Create a Calming Morning Routine",
    description: "Start your day with 10 minutes of quiet time before checking your phone. Light a candle or diffuse grounding essential oils like sandalwood or vetiver.",
    benefit: "Reduces anxiety and creates emotional stability throughout the day",
    riskPrevention: "Prevents nervous system exhaustion and chronic anxiety",
    icon: "sunrise",
  },
  {
    id: "vata-low-food-1",
    category: "food",
    dosha: "vata",
    scoreRange: "low",
    title: "Nourishing Warm Breakfast",
    description: "Have a warm, grounding breakfast like oatmeal with ghee, cinnamon, and dates. Avoid cold cereals or skipping breakfast entirely.",
    benefit: "Stabilizes digestion and provides sustained energy",
    riskPrevention: "Prevents digestive irregularities and energy crashes",
    icon: "utensils",
  },
  {
    id: "vata-low-hydration-1",
    category: "hydration",
    dosha: "vata",
    scoreRange: "low",
    title: "Warm Water with Ginger",
    description: "Drink a cup of warm water with fresh ginger slices first thing in the morning. Sip warm water throughout the day instead of cold drinks.",
    benefit: "Improves digestion and circulation while keeping you hydrated",
    riskPrevention: "Prevents dryness, constipation, and poor circulation",
    icon: "droplets",
  },
  {
    id: "vata-low-sleep-1",
    category: "sleep",
    dosha: "vata",
    scoreRange: "low",
    title: "Warm Oil Foot Massage",
    description: "Before bed, massage warm sesame oil onto the soles of your feet. This ancient practice grounds Vata energy and promotes deep sleep.",
    benefit: "Calms the nervous system and improves sleep quality",
    riskPrevention: "Prevents insomnia and nervous system depletion",
    icon: "moon",
  },
  {
    id: "vata-low-activity-1",
    category: "activity",
    dosha: "vata",
    scoreRange: "low",
    title: "Gentle Grounding Walk",
    description: "Take a slow 15-minute walk in nature, preferably barefoot on grass if possible. Focus on feeling connected to the earth.",
    benefit: "Grounds scattered energy and reduces mental restlessness",
    riskPrevention: "Prevents joint stiffness and mental agitation",
    icon: "footprints",
  },
  {
    id: "vata-low-mental-1",
    category: "mental_wellness",
    dosha: "vata",
    scoreRange: "low",
    title: "5-Minute Breathing Practice",
    description: "Practice slow, deep belly breathing for 5 minutes. Inhale for 4 counts, hold for 4, exhale for 6. This calms Vata's tendency toward anxiety.",
    benefit: "Reduces anxiety and brings mental clarity",
    riskPrevention: "Prevents chronic stress and mental exhaustion",
    icon: "brain",
  },

  // VATA - Medium Wellness Score
  {
    id: "vata-medium-lifestyle-1",
    category: "lifestyle",
    dosha: "vata",
    scoreRange: "medium",
    title: "Consistent Daily Rhythm",
    description: "Eat your meals at the same time each day. Regularity is medicine for Vata—aim for breakfast at 8am, lunch at noon, dinner by 6pm.",
    benefit: "Creates stability and supports natural body rhythms",
    riskPrevention: "Prevents digestive issues and energy fluctuations",
    icon: "clock",
  },
  {
    id: "vata-medium-food-1",
    category: "food",
    dosha: "vata",
    scoreRange: "medium",
    title: "Include Healthy Fats",
    description: "Add a tablespoon of ghee to your lunch. Healthy fats nourish Vata's dry nature and support brain function and joint health.",
    benefit: "Lubricates joints and enhances mental clarity",
    riskPrevention: "Prevents dry skin, joint problems, and cognitive decline",
    icon: "utensils",
  },
  {
    id: "vata-medium-hydration-1",
    category: "hydration",
    dosha: "vata",
    scoreRange: "medium",
    title: "Herbal Tea Ritual",
    description: "Enjoy a cup of warm chamomile or licorice tea in the afternoon. This soothes Vata while keeping you hydrated.",
    benefit: "Calms the nervous system and maintains hydration",
    riskPrevention: "Prevents afternoon anxiety and dehydration",
    icon: "cup-soda",
  },
  {
    id: "vata-medium-sleep-1",
    category: "sleep",
    dosha: "vata",
    scoreRange: "medium",
    title: "Digital Sunset",
    description: "Turn off all screens 1 hour before bed. The blue light and mental stimulation aggravate Vata. Instead, read or practice gentle stretching.",
    benefit: "Prepares the mind for restful sleep",
    riskPrevention: "Prevents sleep disturbances and mental overstimulation",
    icon: "moon-star",
  },
  {
    id: "vata-medium-activity-1",
    category: "activity",
    dosha: "vata",
    scoreRange: "medium",
    title: "Gentle Yoga Stretches",
    description: "Practice 10 minutes of gentle yoga focusing on hip openers and forward folds. These poses ground Vata energy.",
    benefit: "Releases tension and promotes flexibility",
    riskPrevention: "Prevents muscle stiffness and joint problems",
    icon: "dumbbell",
  },
  {
    id: "vata-medium-mental-1",
    category: "mental_wellness",
    dosha: "vata",
    scoreRange: "medium",
    title: "Gratitude Journaling",
    description: "Write down 3 things you're grateful for before bed. This practice grounds scattered Vata thoughts and promotes positive thinking.",
    benefit: "Cultivates contentment and mental peace",
    riskPrevention: "Prevents overthinking and anxiety spirals",
    icon: "heart",
  },

  // VATA - High Wellness Score
  {
    id: "vata-high-lifestyle-1",
    category: "lifestyle",
    dosha: "vata",
    scoreRange: "high",
    title: "Creative Expression Time",
    description: "Dedicate 20 minutes today to creative expression—painting, writing, music, or crafts. Channel your natural Vata creativity positively.",
    benefit: "Fulfills creative needs and brings joy",
    riskPrevention: "Prevents creative stagnation and restlessness",
    icon: "palette",
  },
  {
    id: "vata-high-food-1",
    category: "food",
    dosha: "vata",
    scoreRange: "high",
    title: "Colorful Root Vegetables",
    description: "Include grounding root vegetables like sweet potatoes, carrots, or beets in today's meal. They're perfect for maintaining Vata balance.",
    benefit: "Provides grounding nutrition and sustained energy",
    riskPrevention: "Maintains digestive health and prevents imbalance",
    icon: "carrot",
  },
  {
    id: "vata-high-mental-1",
    category: "mental_wellness",
    dosha: "vata",
    scoreRange: "high",
    title: "Mindful Nature Connection",
    description: "Spend 15 minutes mindfully observing nature—watch the clouds, listen to birds, or feel the breeze. This grounds your elevated awareness.",
    benefit: "Deepens present-moment awareness and peace",
    riskPrevention: "Maintains mental clarity and emotional balance",
    icon: "leaf",
  },

  // PITTA - Low Wellness Score
  {
    id: "pitta-low-lifestyle-1",
    category: "lifestyle",
    dosha: "pitta",
    scoreRange: "low",
    title: "Cool Down Periods",
    description: "Take 3 short breaks today to step away from intense work. Walk outside, look at nature, or simply close your eyes for 2 minutes.",
    benefit: "Prevents overheating and burnout",
    riskPrevention: "Prevents inflammatory conditions and chronic stress",
    icon: "pause",
  },
  {
    id: "pitta-low-food-1",
    category: "food",
    dosha: "pitta",
    scoreRange: "low",
    title: "Cooling Cucumber Snack",
    description: "Have fresh cucumber slices with mint and a squeeze of lime as a mid-morning snack. This cooling combination soothes excess Pitta.",
    benefit: "Cools the body and reduces inflammation",
    riskPrevention: "Prevents acid reflux and skin inflammation",
    icon: "salad",
  },
  {
    id: "pitta-low-hydration-1",
    category: "hydration",
    dosha: "pitta",
    scoreRange: "low",
    title: "Cooling Coconut Water",
    description: "Replace one of your regular drinks with pure coconut water today. It's naturally cooling and helps balance Pitta's heat.",
    benefit: "Cools internal heat and provides natural electrolytes",
    riskPrevention: "Prevents dehydration and excess body heat",
    icon: "glass-water",
  },
  {
    id: "pitta-low-sleep-1",
    category: "sleep",
    dosha: "pitta",
    scoreRange: "low",
    title: "Cool Sleeping Environment",
    description: "Keep your bedroom cool tonight (68-72°F). Use light cotton sheets and consider sleeping on your right side to cool the body.",
    benefit: "Promotes deeper, more restorative sleep",
    riskPrevention: "Prevents restless sleep and night sweats",
    icon: "snowflake",
  },
  {
    id: "pitta-low-activity-1",
    category: "activity",
    dosha: "pitta",
    scoreRange: "low",
    title: "Swimming or Water Activity",
    description: "If possible, swim or take a cool shower today. Water activities are excellent for balancing Pitta's fire element.",
    benefit: "Cools the body and relaxes tense muscles",
    riskPrevention: "Prevents muscle inflammation and overheating",
    icon: "waves",
  },
  {
    id: "pitta-low-mental-1",
    category: "mental_wellness",
    dosha: "pitta",
    scoreRange: "low",
    title: "Practice Letting Go",
    description: "When you feel frustration rising today, take 3 deep breaths and consciously choose to let it go. Repeat: 'I release this with ease.'",
    benefit: "Reduces anger and promotes emotional balance",
    riskPrevention: "Prevents stress-related health issues and relationship conflicts",
    icon: "heart-handshake",
  },

  // PITTA - Medium Wellness Score
  {
    id: "pitta-medium-lifestyle-1",
    category: "lifestyle",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Avoid Midday Sun",
    description: "Stay in shade or indoors during peak sun hours (11am-3pm). Use this time for focused indoor work instead of outdoor activities.",
    benefit: "Prevents overheating and maintains energy",
    riskPrevention: "Prevents heat-related issues and skin problems",
    icon: "umbrella",
  },
  {
    id: "pitta-medium-food-1",
    category: "food",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Sweet Fruit After Lunch",
    description: "Enjoy sweet, cooling fruits like grapes, melons, or pears after lunch. They satisfy Pitta's need for sweetness naturally.",
    benefit: "Cools digestion and satisfies sweet cravings healthily",
    riskPrevention: "Prevents sugar imbalances and digestive heat",
    icon: "apple",
  },
  {
    id: "pitta-medium-hydration-1",
    category: "hydration",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Mint-Infused Water",
    description: "Add fresh mint leaves to your water bottle today. Mint is naturally cooling and helps pacify Pitta.",
    benefit: "Keeps you refreshed and cools internal heat",
    riskPrevention: "Prevents digestive inflammation and bad breath",
    icon: "droplets",
  },
  {
    id: "pitta-medium-sleep-1",
    category: "sleep",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Moonlight Relaxation",
    description: "Spend 10 minutes in moonlight or soft evening light before bed. The moon's cooling energy naturally balances Pitta.",
    benefit: "Calms the fiery Pitta mind for better sleep",
    riskPrevention: "Prevents restless sleep and vivid dreams",
    icon: "moon",
  },
  {
    id: "pitta-medium-activity-1",
    category: "activity",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Non-Competitive Exercise",
    description: "Choose a non-competitive form of exercise today—yoga, hiking, or swimming. Avoid the urge to push too hard or compete.",
    benefit: "Builds strength without increasing heat",
    riskPrevention: "Prevents exercise-induced inflammation and burnout",
    icon: "bike",
  },
  {
    id: "pitta-medium-mental-1",
    category: "mental_wellness",
    dosha: "pitta",
    scoreRange: "medium",
    title: "Compassion Practice",
    description: "Before reacting to something that annoys you today, pause and consider the other person's perspective with compassion.",
    benefit: "Develops patience and reduces irritability",
    riskPrevention: "Prevents anger-related stress and conflicts",
    icon: "heart",
  },

  // PITTA - High Wellness Score
  {
    id: "pitta-high-lifestyle-1",
    category: "lifestyle",
    dosha: "pitta",
    scoreRange: "high",
    title: "Scheduled Fun Time",
    description: "Block 30 minutes for pure fun today—not productive, not goal-oriented, just enjoyable. Pitta needs permission to relax.",
    benefit: "Prevents overwork and maintains life balance",
    riskPrevention: "Prevents burnout and perfectionism",
    icon: "smile",
  },
  {
    id: "pitta-high-food-1",
    category: "food",
    dosha: "pitta",
    scoreRange: "high",
    title: "Bitter Greens Boost",
    description: "Add bitter greens like arugula, kale, or dandelion to your meal today. Bitter taste is Pitta's best friend for maintaining balance.",
    benefit: "Supports liver function and cools the blood",
    riskPrevention: "Maintains digestive health and prevents excess heat",
    icon: "leaf",
  },
  {
    id: "pitta-high-mental-1",
    category: "mental_wellness",
    dosha: "pitta",
    scoreRange: "high",
    title: "Celebrate Others' Success",
    description: "Genuinely celebrate someone else's achievement today. This practice opens the heart and reduces competitive tendencies.",
    benefit: "Cultivates generosity and emotional openness",
    riskPrevention: "Prevents jealousy and competitive stress",
    icon: "sparkles",
  },

  // KAPHA - Low Wellness Score
  {
    id: "kapha-low-lifestyle-1",
    category: "lifestyle",
    dosha: "kapha",
    scoreRange: "low",
    title: "Early Morning Wake-Up",
    description: "Set your alarm 30 minutes earlier tomorrow. Waking before 6am, during Vata time, helps counteract Kapha's heaviness.",
    benefit: "Increases energy and mental clarity throughout the day",
    riskPrevention: "Prevents lethargy and metabolic slowdown",
    icon: "alarm-clock",
  },
  {
    id: "kapha-low-food-1",
    category: "food",
    dosha: "kapha",
    scoreRange: "low",
    title: "Spiced Warm Breakfast",
    description: "Start with a light, warm breakfast with metabolism-boosting spices like ginger, black pepper, or cinnamon. Avoid heavy, cold foods.",
    benefit: "Stimulates digestion and increases energy",
    riskPrevention: "Prevents weight gain and sluggish metabolism",
    icon: "flame",
  },
  {
    id: "kapha-low-hydration-1",
    category: "hydration",
    dosha: "kapha",
    scoreRange: "low",
    title: "Hot Ginger Lemon Water",
    description: "Drink hot water with fresh ginger and lemon first thing in the morning. This kickstarts metabolism and clears congestion.",
    benefit: "Stimulates digestion and clears toxins",
    riskPrevention: "Prevents mucus buildup and sluggish digestion",
    icon: "cup-soda",
  },
  {
    id: "kapha-low-sleep-1",
    category: "sleep",
    dosha: "kapha",
    scoreRange: "low",
    title: "No Daytime Napping",
    description: "Avoid napping during the day, even if you feel sleepy. Instead, take a brisk 10-minute walk to refresh your energy.",
    benefit: "Maintains natural energy rhythms",
    riskPrevention: "Prevents excessive sleep and energy stagnation",
    icon: "sun",
  },
  {
    id: "kapha-low-activity-1",
    category: "activity",
    dosha: "kapha",
    scoreRange: "low",
    title: "Energizing Morning Exercise",
    description: "Do 20 minutes of vigorous exercise first thing in the morning—jumping jacks, brisk walking, or dancing. Move until you sweat!",
    benefit: "Boosts metabolism and lifts mood",
    riskPrevention: "Prevents weight gain and depression",
    icon: "zap",
  },
  {
    id: "kapha-low-mental-1",
    category: "mental_wellness",
    dosha: "kapha",
    scoreRange: "low",
    title: "Try Something New",
    description: "Do one thing differently today—take a new route, try a new food, or talk to someone new. Novelty stimulates Kapha's stagnant energy.",
    benefit: "Increases mental stimulation and openness",
    riskPrevention: "Prevents mental stagnation and resistance to change",
    icon: "sparkles",
  },

  // KAPHA - Medium Wellness Score
  {
    id: "kapha-medium-lifestyle-1",
    category: "lifestyle",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Declutter One Area",
    description: "Spend 15 minutes decluttering one drawer, shelf, or corner. External order helps clear internal Kapha stagnation.",
    benefit: "Creates mental clarity and energy flow",
    riskPrevention: "Prevents accumulation and attachment",
    icon: "sparkles",
  },
  {
    id: "kapha-medium-food-1",
    category: "food",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Light Evening Meal",
    description: "Make dinner your lightest meal today—a warm soup or steamed vegetables. Avoid heavy foods after 6pm.",
    benefit: "Supports digestion and prevents weight gain",
    riskPrevention: "Prevents overnight heaviness and morning sluggishness",
    icon: "salad",
  },
  {
    id: "kapha-medium-hydration-1",
    category: "hydration",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Warm Herbal Teas",
    description: "Choose warming teas like ginger, tulsi, or cinnamon. Avoid cold drinks and dairy-based beverages today.",
    benefit: "Maintains warmth and supports metabolism",
    riskPrevention: "Prevents mucus buildup and sluggish circulation",
    icon: "coffee",
  },
  {
    id: "kapha-medium-sleep-1",
    category: "sleep",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Lighter Bedding",
    description: "Use lighter blankets tonight. Kapha benefits from not being too cozy, which can increase heaviness.",
    benefit: "Promotes lighter, more refreshing sleep",
    riskPrevention: "Prevents oversleeping and morning grogginess",
    icon: "bed",
  },
  {
    id: "kapha-medium-activity-1",
    category: "activity",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Dance Break",
    description: "Put on your favorite upbeat music and dance for 10 minutes. Don't worry about how you look—just move and have fun!",
    benefit: "Lifts mood and moves stagnant energy",
    riskPrevention: "Prevents emotional stagnation and low mood",
    icon: "music",
  },
  {
    id: "kapha-medium-mental-1",
    category: "mental_wellness",
    dosha: "kapha",
    scoreRange: "medium",
    title: "Set One Exciting Goal",
    description: "Write down one exciting goal for this week. Something that makes you feel motivated and slightly challenged.",
    benefit: "Creates forward momentum and purpose",
    riskPrevention: "Prevents complacency and lack of motivation",
    icon: "target",
  },

  // KAPHA - High Wellness Score
  {
    id: "kapha-high-lifestyle-1",
    category: "lifestyle",
    dosha: "kapha",
    scoreRange: "high",
    title: "Share Your Gifts",
    description: "Share your natural Kapha gifts today—offer support to someone, cook a meal for others, or simply be present for a friend.",
    benefit: "Utilizes natural nurturing abilities positively",
    riskPrevention: "Prevents energy stagnation through giving",
    icon: "gift",
  },
  {
    id: "kapha-high-food-1",
    category: "food",
    dosha: "kapha",
    scoreRange: "high",
    title: "Colorful Vegetable Plate",
    description: "Make today's main meal a celebration of colorful vegetables—the more variety, the better. Light, varied eating maintains Kapha balance.",
    benefit: "Provides diverse nutrients while keeping you light",
    riskPrevention: "Maintains healthy weight and energy levels",
    icon: "utensils",
  },
  {
    id: "kapha-high-mental-1",
    category: "mental_wellness",
    dosha: "kapha",
    scoreRange: "high",
    title: "Express Your Feelings",
    description: "Practice expressing your emotions today, even the uncomfortable ones. Kapha tends to hold things in—healthy expression prevents stagnation.",
    benefit: "Promotes emotional flow and authentic connection",
    riskPrevention: "Prevents emotional suppression and heaviness",
    icon: "message-circle",
  },
];

// Greeting messages based on time and dosha
export const greetings = {
  morning: {
    vata: "Good morning! Let's create a grounding start to your day.",
    pitta: "Good morning! A calm, cool start awaits you.",
    kapha: "Rise and shine! Energy and vitality are calling.",
  },
  afternoon: {
    vata: "Good afternoon! Time to stay nourished and centered.",
    pitta: "Good afternoon! Keep cool and balanced.",
    kapha: "Good afternoon! Stay active and engaged.",
  },
  evening: {
    vata: "Good evening! Wind down gently for restful sleep.",
    pitta: "Good evening! Let go of the day's intensity.",
    kapha: "Good evening! Keep it light before rest.",
  },
};

// Focus areas based on dosha and wellness score
export const focusAreas = {
  vata: {
    low: "Grounding & Stability",
    medium: "Consistency & Calm",
    high: "Creative Balance",
  },
  pitta: {
    low: "Cooling & Soothing",
    medium: "Balance & Moderation",
    high: "Joyful Achievement",
  },
  kapha: {
    low: "Activation & Energy",
    medium: "Movement & Lightness",
    high: "Inspired Action",
  },
};

// Get wellness score range
export function getScoreRange(score: number): WellnessScoreRange {
  if (score < 50) return "low";
  if (score < 75) return "medium";
  return "high";
}

// Get tips for a specific dosha and score
export function getTipsForProfile(
  dosha: DoshaType, 
  wellnessScore: number,
  count: number = 3
): PreventiveTip[] {
  const scoreRange = getScoreRange(wellnessScore);
  
  // Get tips matching dosha and score range
  const matchingTips = preventiveTips.filter(
    tip => tip.dosha === dosha && tip.scoreRange === scoreRange
  );
  
  // Ensure variety in categories
  const categories = new Set<string>();
  const selectedTips: PreventiveTip[] = [];
  
  // Shuffle the tips for daily variety
  const shuffled = [...matchingTips].sort(() => Math.random() - 0.5);
  
  for (const tip of shuffled) {
    if (selectedTips.length >= count) break;
    if (!categories.has(tip.category)) {
      selectedTips.push(tip);
      categories.add(tip.category);
    }
  }
  
  // If we don't have enough varied tips, add more from the same categories
  if (selectedTips.length < count) {
    for (const tip of shuffled) {
      if (selectedTips.length >= count) break;
      if (!selectedTips.includes(tip)) {
        selectedTips.push(tip);
      }
    }
  }
  
  return selectedTips.slice(0, count);
}

// Get greeting based on time of day
export function getGreeting(dosha: DoshaType): string {
  const hour = new Date().getHours();
  let timeOfDay: "morning" | "afternoon" | "evening";
  
  if (hour < 12) timeOfDay = "morning";
  else if (hour < 17) timeOfDay = "afternoon";
  else timeOfDay = "evening";
  
  return greetings[timeOfDay][dosha];
}

// Get focus area based on dosha and score
export function getFocusArea(dosha: DoshaType, score: number): string {
  const range = getScoreRange(score);
  return focusAreas[dosha][range];
}
