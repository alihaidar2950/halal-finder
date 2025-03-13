import { HalalStatus, Restaurant } from "@/data/menuData";

// List of common chain restaurants that need specific verification for halal status
// These should never be automatically classified as fully halal without explicit verification
const CHAIN_RESTAURANTS = [
  "kfc",
  "mcdonald",
  "mcdonalds",
  "burger king",
  "wendy",
  "subway",
  "popeyes",
  "taco bell",
  "pizza hut",
  "domino",
  "mary brown",
  "papa john",
  "a&w",
  "dairy queen",
  "five guys",
  "starbucks",
  "tim hortons",
  "pizza pizza",
  "little caesars",
  "harveys",
  "boston pizza",
  "montana",
  "swiss chalet",
  "the keg",
  "jack astor",
  "cactus club",
  "mr. sub",
  "quiznos"
];

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
  "halal only",
  "certified halal",
  "halal certification",
  "islamic dietary",
  "حلال", // Arabic for "halal"
  "حلال 100%", // Arabic for "100% halal"
  "ذبيحة", // Arabic for "zabiha"
  "halal meat",
  "halal butcher",
  "halal shop",
  "halal store"
];

// Keywords that indicate a restaurant with halal options
const HALAL_OPTIONS_KEYWORDS = [
  "halal options",
  "halal menu",
  "halal available",
  "halal chicken",
  "halal beef",
  "halal lamb",
  "halal meat available",
  "some halal",
  "halal upon request",
  "halal dishes",
  "halal selections"
];

// Keywords that suggest only halal ingredients might be available
const HALAL_INGREDIENTS_KEYWORDS = [
  "vegetarian",
  "vegan", 
  "kosher",
  "no pork",
  "can accommodate",
  "can request",
  "plant-based",
  "vegetable-based"
];

// Keywords that indicate non-halal status
const NEGATIVE_KEYWORDS = [
  "not halal",
  "no halal",
  "non halal",
  "non-halal",
  "cannot guarantee",
  "not certified",
  "serves alcohol",
  "serves pork",
  "no halal options",
  "not suitable for",
  "unable to accommodate"
];

// Keywords that strongly suggest official halal certification
const CERTIFICATION_KEYWORDS = [
  "halal certified by",
  "certified by",
  "certification number",
  "halal canada",
  "certified halal",
  "officially certified",
  "halal authority",
  "halal council",
  "islamic food council"
];

// Names of foods that are traditionally halal when authentic
const TRADITIONAL_HALAL_FOODS = [
  "shawarma",
  "kebab", 
  "kabob",
  "kofte",
  "kofta",
  "falafel",
  "hummus",
  "biryani",
  "tikka",
  "tandoori",
  "naan",
  "tabouleh",
  "shish",
  "doner",
  "tahini",
  "baklava",
  "pide",
  "lahmacun",
  "gozleme",
  "borek",
  "mandi",
  "mansaf",
  "maqluba",
  "fattoush",
  "tabbouleh",
  "dolma",
  "kashk",
  "baba ghanoush",
  "muhammara"
];

// Halal-dominant cuisine types (where the cuisine is culturally almost always halal)
const HALAL_DOMINANT_CUISINES = [
  "lebanese",
  "syrian",
  "jordanian",
  "palestinian",
  "turkish",
  "egyptian",
  "moroccan",
  "pakistani",
  "bangladeshi",
  "saudi",
  "emirati",
  "qatari",
  "kuwaiti",
  "omani",
  "bahraini",
  "yemeni",
  "iraqi",
  "persian", 
  "iranian", 
  "afghan",
  "uzbek",
  "tajik",
  "turkmen",
  "kazakh"
];

// Patterns for names that suggest Middle Eastern or South Asian origin
const CULTURAL_NAME_PATTERNS = [
  "mohammad", "muhammad", "ahmed", "ahmed", "ali", "hassan", "hussein", "abdullah",
  "khan", "singh", "patel", "shah", "rahman", "karim", "rahim", "mustafa", "mahmoud",
  "syed", "sheikh", "al-", "el-", "bin ", "ibn ", "abu "
];

/**
 * Check if a restaurant is a major chain
 */
const isChainRestaurant = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return CHAIN_RESTAURANTS.some(chain => lowerName.includes(chain));
};

/**
 * Check if a restaurant name contains traditional halal food indicators
 */
const containsTraditionalHalalFood = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return TRADITIONAL_HALAL_FOODS.some(food => lowerName.includes(food));
};

/**
 * Check if a restaurant has a cuisine that is culturally dominated by halal food
 */
const hasHalalDominantCuisine = (cuisine: string): boolean => {
  const lowerCuisine = cuisine.toLowerCase();
  return HALAL_DOMINANT_CUISINES.some(type => lowerCuisine.includes(type));
};

/**
 * Estimate the likelihood of cultural background of reviewers suggesting halal authenticity
 * by analyzing reviewer names and review content
 */
const analyzeReviewerCulturalContext = (reviews: Array<{author: string; text: string}> = []): number => {
  if (!reviews || reviews.length === 0) return 0;
  
  let culturalReviewerCount = 0;
  let halalMentionCount = 0;
  
  reviews.forEach(review => {
    // Check if reviewer name suggests Middle Eastern or South Asian background
    const lowerAuthor = review.author.toLowerCase();
    if (CULTURAL_NAME_PATTERNS.some(pattern => lowerAuthor.includes(pattern))) {
      culturalReviewerCount++;
    }
    
    // Check for halal mentions in review
    const lowerText = review.text.toLowerCase();
    if (FULLY_HALAL_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
      halalMentionCount++;
    }
  });
  
  // Calculate the cultural context score (0-1)
  const culturalReviewerRatio = culturalReviewerCount / reviews.length;
  const halalMentionRatio = halalMentionCount / reviews.length;
  
  // Combine both indicators with different weights
  return (culturalReviewerRatio * 0.6) + (halalMentionRatio * 0.4);
};

/**
 * Check if text contains any keywords from the provided list,
 * but also checks for negation contexts
 */
const containsKeywords = (text: string, keywords: string[], checkNegation = true): boolean => {
  const lowerText = text.toLowerCase();
  
  // First check for negative indicators
  if (checkNegation && NEGATIVE_KEYWORDS.some(negWord => lowerText.includes(negWord.toLowerCase()))) {
    return false;
  }
  
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

/**
 * Count how many of the provided keywords appear in the text
 */
const countKeywordMatches = (text: string, keywords: string[]): number => {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
};

/**
 * Determine if a restaurant has indicators of official certification
 */
const hasVerificationIndicators = (restaurant: Restaurant): boolean => {
  const textToAnalyze = `${restaurant.name} ${restaurant.description}`;
  
  // Check for certification keywords
  return CERTIFICATION_KEYWORDS.some(keyword => 
    textToAnalyze.toLowerCase().includes(keyword.toLowerCase())
  );
};

/**
 * Calculate a confidence score based on the number of matches and specific contexts
 */
const calculateConfidence = (
  restaurant: Restaurant,
  fullyHalalMatches: number,
  halalOptionsMatches: number,
  halalIngredientsMatches: number,
  hasNegativeIndicators: boolean,
  isChain: boolean,
  culturalContextScore: number
): number => {
  // If there are negative indicators, lower confidence significantly
  if (hasNegativeIndicators) {
    return Math.max(0.05, Math.min(0.2, (fullyHalalMatches * 0.05)));
  }
  
  // Special case: Traditional halal food in name (like Shawarma Palace)
  const hasTraditionalFood = containsTraditionalHalalFood(restaurant.name);
  
  // If it's a chain restaurant, cap the confidence unless there are strong indicators
  const hasStrongEvidence = fullyHalalMatches > 3 && hasVerificationIndicators(restaurant);
  
  if (isChain && !hasStrongEvidence) {
    // Even for chains, if they have traditional halal foods in name, give higher confidence
    if (hasTraditionalFood) {
      return Math.min(0.7, 0.5 + (fullyHalalMatches * 0.05));
    }
    // Otherwise cap at medium confidence for chains without strong evidence
    return Math.min(0.5, fullyHalalMatches * 0.1);
  }
  
  // Special case: name explicitly states halal
  const nameExplicitlyHalal = restaurant.name.toLowerCase().includes("halal");
  
  // Check if cuisine is from a culture where halal is dominant
  const isHalalDominantCuisine = hasHalalDominantCuisine(restaurant.cuisineType);
  
  // Special case: cuisine types that are traditionally halal
  const traditionallyHalalCuisine = ["arabic", "middle eastern", "lebanese", "turkish", "pakistani", "afghan"]
    .some(cuisine => restaurant.cuisineType.toLowerCase().includes(cuisine));
  
  // Special case: cuisine types that often have halal options
  const oftenHasMixedHalal = ["indian", "malaysian", "indonesian", "mediterranean"]
    .some(cuisine => restaurant.cuisineType.toLowerCase().includes(cuisine));
    
  // Base confidence calculations based on keyword matches
  let confidence = 0;
  
  // Start with special cases that strongly indicate halal
  if (hasTraditionalFood && isHalalDominantCuisine) {
    // Traditional halal food AND halal-dominant cuisine is a strong indicator
    confidence = 0.8;
  } else if (hasTraditionalFood) {
    // Traditional halal food in name is a strong indicator
    confidence = 0.7;
  } else if (isHalalDominantCuisine) {
    // Halal-dominant cuisine is a good indicator
    confidence = 0.65;
  } else if (fullyHalalMatches > 0) {
    // Start with a base confidence for fully halal
    confidence = 0.4 + (fullyHalalMatches * 0.1);
    
    // Boost confidence for explicitly halal names
    if (nameExplicitlyHalal) {
      confidence += 0.2;
    }
    
    // Boost for traditionally halal cuisines
    if (traditionallyHalalCuisine) {
      confidence += 0.1;
    }
  } else if (halalOptionsMatches > 0) {
    // Base confidence for halal options
    confidence = 0.3 + (halalOptionsMatches * 0.05);
    
    // Boost for cuisines that often have halal options
    if (oftenHasMixedHalal) {
      confidence += 0.1;
    }
  } else if (halalIngredientsMatches > 0) {
    // Lower base confidence for halal ingredients only
    confidence = 0.1 + (halalIngredientsMatches * 0.03);
  } else {
    // Default low confidence
    confidence = traditionallyHalalCuisine ? 0.2 : 0.1;
  }
  
  // Add cultural context boost from reviewers
  if (culturalContextScore > 0) {
    confidence += culturalContextScore * 0.3; // Up to 0.3 boost from cultural context
  }
  
  // Ensure confidence stays within valid range
  return Math.min(0.99, Math.max(0.01, confidence));
};

/**
 * Classify a restaurant's halal status based on its data
 */
export function classifyHalalStatus(restaurant: Restaurant): { 
  status: HalalStatus; 
  confidence: number;
  verified: boolean;
  isChain: boolean;
} {
  let fullyHalalMatches = 0;
  let halalOptionsMatches = 0;
  let halalIngredientsMatches = 0;
  let textToAnalyze = "";
  let hasNegativeIndicators = false;
  
  // Check if this is a chain restaurant
  const isChain = isChainRestaurant(restaurant.name);

  // Combine all text fields for analysis
  textToAnalyze += restaurant.name + " ";
  textToAnalyze += restaurant.description + " ";
  
  // Check for negative indicators in the main text
  if (NEGATIVE_KEYWORDS.some(negWord => textToAnalyze.toLowerCase().includes(negWord.toLowerCase()))) {
    hasNegativeIndicators = true;
  }
  
  // Check if restaurant serves traditional halal food (like Shawarma)
  const hasTraditionalFood = containsTraditionalHalalFood(restaurant.name);
  
  // Check restaurant types
  if (restaurant.cuisineType?.toLowerCase().includes("halal")) {
    fullyHalalMatches += 2;
  }
  
  // If cuisine is from a halal-dominant culture, add matches
  if (hasHalalDominantCuisine(restaurant.cuisineType)) {
    fullyHalalMatches += 2;
  }
  
  // Analyze reviewer cultural context
  const culturalContextScore = analyzeReviewerCulturalContext(restaurant.reviews);
  
  // Check reviews
  if (restaurant.reviews && restaurant.reviews.length > 0) {
    restaurant.reviews.forEach(review => {
      const reviewText = review.text.toLowerCase();
      
      // Check for negative indicators in reviews
      if (NEGATIVE_KEYWORDS.some(negWord => reviewText.includes(negWord.toLowerCase()))) {
        hasNegativeIndicators = true;
      }
      
      // Count keyword matches in reviews (with negation check)
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

  // Count main text keyword matches
  fullyHalalMatches += countKeywordMatches(textToAnalyze, FULLY_HALAL_KEYWORDS);
  halalOptionsMatches += countKeywordMatches(textToAnalyze, HALAL_OPTIONS_KEYWORDS);
  halalIngredientsMatches += countKeywordMatches(textToAnalyze, HALAL_INGREDIENTS_KEYWORDS);

  // Special case for restaurant name containing "halal"
  if (restaurant.name.toLowerCase().includes("halal")) {
    fullyHalalMatches += 3;
  }
  
  // Special case for shawarma, kebab, etc. restaurants - they're almost always halal
  if (hasTraditionalFood) {
    fullyHalalMatches += 2;
  }

  // Check for verification indicators
  const verified = hasVerificationIndicators(restaurant);

  // Determine status based on matches, negation context, and chain status
  let status: HalalStatus = "unknown";
  
  if (hasNegativeIndicators) {
    // If we have negative indicators but also strong fully halal signals,
    // it might still have halal options
    if (fullyHalalMatches > 3) {
      status = "halal_options";
    } else {
      status = "unknown";
    }
  } else if (isChain) {
    // Special handling for chain restaurants
    if (verified && fullyHalalMatches > 3) {
      status = "fully_halal"; // Only if strong evidence AND verification
    } else if (fullyHalalMatches > 1) {
      status = "halal_options"; // Downgrade chains to "options" by default
    } else if (halalOptionsMatches > 0) {
      status = "halal_options";
    } else if (halalIngredientsMatches > 0) {
      status = "halal_ingredients";
    }
  } else if (hasTraditionalFood && hasHalalDominantCuisine(restaurant.cuisineType)) {
    // If it's a traditional halal food (shawarma, etc.) AND from a halal-dominant culture, 
    // it's almost certainly fully halal
    status = "fully_halal";
  } else if (hasTraditionalFood) {
    // Traditional halal foods like shawarma are typically fully halal
    status = "fully_halal";
  } else if (hasHalalDominantCuisine(restaurant.cuisineType) && fullyHalalMatches > 0) {
    // If from a halal-dominant culture and has at least one halal match
    status = "fully_halal";
  } else if (fullyHalalMatches > 1) {
    status = "fully_halal";
  } else if (fullyHalalMatches > 0 || halalOptionsMatches > 0) {
    status = "halal_options";
  } else if (halalIngredientsMatches > 0) {
    status = "halal_ingredients";
  }

  // Calculate confidence score with improved algorithm
  const confidence = calculateConfidence(
    restaurant,
    fullyHalalMatches,
    halalOptionsMatches,
    halalIngredientsMatches,
    hasNegativeIndicators,
    isChain,
    culturalContextScore
  );

  return { 
    status, 
    confidence,
    verified,
    isChain
  };
}

/**
 * Get a human-readable label for the halal status
 */
export function getHalalStatusLabel(status: HalalStatus, isChain = false, verified = false): string {
  let label = "";
  
  switch (status) {
    case "fully_halal":
      label = "Fully Halal";
      break;
    case "halal_options":
      label = "Halal Options Available";
      break;
    case "halal_ingredients":
      label = "Halal Ingredients Available";
      break;
    case "unknown":
    default:
      label = "Halal Status Unknown";
  }
  
  // Add verification status for chains
  if (isChain) {
    if (verified) {
      label += " ✓";
    } else if (status === "fully_halal") {
      label = "May Have " + label;
    }
  }
  
  return label;
}

/**
 * Get appropriate styling for halal status badges
 */
export function getHalalStatusStyles(status: HalalStatus, isChain = false, verified = false): { bg: string; text: string; border: string } {
  let styles: { bg: string; text: string; border: string } = {
    bg: '',
    text: '',
    border: ''
  };
  
  switch (status) {
    case "fully_halal":
      styles = { bg: "bg-green-100", text: "text-green-800", border: "" };
      break;
    case "halal_options":
      styles = { bg: "bg-yellow-100", text: "text-yellow-800", border: "" };
      break;
    case "halal_ingredients":
      styles = { bg: "bg-blue-100", text: "text-blue-800", border: "" };
      break;
    case "unknown":
    default:
      styles = { bg: "bg-gray-100", text: "text-gray-800", border: "" };
  }
  
  // Add verification styles
  if (isChain && !verified && status === "fully_halal") {
    // Unverified chains claiming to be fully halal get a warning style
    styles = { bg: "bg-amber-100", text: "text-amber-800", border: "border border-amber-300" };
  } else if (verified) {
    styles.border = "border border-green-300";
  }
  
  return styles;
} 