import { HalalStatus, Restaurant } from "@/data/menuData";

// Keywords that strongly indicate a fully halal restaurant
const FULLY_HALAL_KEYWORDS = [
  "fully halal",
  "100% halal",
  "strictly halal",
  "halal certified",
  "halal restaurant",
  "muslim owned",
  "all halal",
  "completely halal",
  "halal meat only",
  "zabiha",
  "zabihah",
  "no alcohol",
  "alcohol free",
  "pork free",
];

// Keywords that indicate a restaurant with halal options
const HALAL_OPTIONS_KEYWORDS = [
  "halal options",
  "halal menu",
  "halal available",
  "halal chicken",
  "halal beef",
  "halal lamb",
  "some halal",
  "halal meat available",
];

// Keywords that suggest only halal ingredients might be available
const HALAL_INGREDIENTS_KEYWORDS = [
  "vegetarian",
  "vegan", 
  "kosher",
  "no pork",
  "can accommodate",
  "can request",
];

/**
 * Check if text contains any keywords from the provided list
 */
const containsKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

/**
 * Calculate a confidence score based on the number of matches
 */
const calculateConfidence = (
  text: string, 
  fullyHalalMatches: number,
  halalOptionsMatches: number,
  halalIngredientsMatches: number
): number => {
  // Simple scoring model - can be enhanced
  if (fullyHalalMatches > 0) {
    return Math.min(0.5 + (fullyHalalMatches * 0.1), 1);
  } else if (halalOptionsMatches > 0) {
    return Math.min(0.3 + (halalOptionsMatches * 0.05), 0.8);
  } else if (halalIngredientsMatches > 0) {
    return Math.min(0.1 + (halalIngredientsMatches * 0.03), 0.5);
  }
  return 0.1; // Default confidence
};

/**
 * Classify a restaurant's halal status based on its data
 */
export function classifyHalalStatus(restaurant: Restaurant): { status: HalalStatus; confidence: number } {
  let fullyHalalMatches = 0;
  let halalOptionsMatches = 0;
  let halalIngredientsMatches = 0;
  let textToAnalyze = "";

  // Combine all text fields for analysis
  textToAnalyze += restaurant.name + " ";
  textToAnalyze += restaurant.description + " ";
  
  // Check restaurant types
  if (restaurant.cuisineType?.includes("halal")) {
    fullyHalalMatches++;
  }
  
  // Check reviews
  if (restaurant.reviews && restaurant.reviews.length > 0) {
    restaurant.reviews.forEach(review => {
      const reviewText = review.text.toLowerCase();
      
      if (containsKeywords(reviewText, FULLY_HALAL_KEYWORDS)) {
        fullyHalalMatches++;
      }
      if (containsKeywords(reviewText, HALAL_OPTIONS_KEYWORDS)) {
        halalOptionsMatches++;
      }
      if (containsKeywords(reviewText, HALAL_INGREDIENTS_KEYWORDS)) {
        halalIngredientsMatches++;
      }
      
      textToAnalyze += review.text + " ";
    });
  }

  // Check main text for keywords
  if (containsKeywords(textToAnalyze, FULLY_HALAL_KEYWORDS)) {
    fullyHalalMatches += 2;
  }
  if (containsKeywords(textToAnalyze, HALAL_OPTIONS_KEYWORDS)) {
    halalOptionsMatches += 2;
  }
  if (containsKeywords(textToAnalyze, HALAL_INGREDIENTS_KEYWORDS)) {
    halalIngredientsMatches += 2;
  }

  // Special case for restaurant name containing "halal"
  if (restaurant.name.toLowerCase().includes("halal")) {
    fullyHalalMatches += 3;
  }

  // Determine status based on matches
  let status: HalalStatus = "unknown";
  
  if (fullyHalalMatches > 0) {
    status = "fully_halal";
  } else if (halalOptionsMatches > 0) {
    status = "halal_options";
  } else if (halalIngredientsMatches > 0) {
    status = "halal_ingredients";
  }

  // Calculate confidence score
  const confidence = calculateConfidence(
    textToAnalyze,
    fullyHalalMatches,
    halalOptionsMatches,
    halalIngredientsMatches
  );

  return { status, confidence };
}

/**
 * Get a human-readable label for the halal status
 */
export function getHalalStatusLabel(status: HalalStatus): string {
  switch (status) {
    case "fully_halal":
      return "Fully Halal";
    case "halal_options":
      return "Halal Options Available";
    case "halal_ingredients":
      return "Halal Ingredients Available";
    case "unknown":
    default:
      return "Halal Status Unknown";
  }
}

/**
 * Get appropriate styling for halal status badges
 */
export function getHalalStatusStyles(status: HalalStatus): { bg: string; text: string; border?: string } {
  switch (status) {
    case "fully_halal":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "halal_options":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "halal_ingredients":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "unknown":
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
} 